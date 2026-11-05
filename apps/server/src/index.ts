import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {evaluateMilestone} from '@agentpay/agent';
import {authorizeMilestonePayment} from '@agentpay/agent/noir';
import {createCheckout,verifyVeloWebhook} from './payments.js';
import {getProjects,updateMilestone} from './store.js';
const app=express();
app.disable('x-powered-by');
app.use(cors({origin:process.env.WEB_ORIGIN??'http://localhost:5173'}));
// Raw webhook route MUST precede express.json(); never trust an unsigned webhook.
app.post('/api/webhooks/velo',express.raw({type:'application/json',limit:'128kb'}),async(req,res)=>{
 try{const signature=req.header('x-velo-signature');if(!signature||!Buffer.isBuffer(req.body))return res.status(400).json({error:'Invalid webhook payload'});const event=await verifyVeloWebhook(req.body,signature);
  // TODO: persist event ID + paymentIntentId, idempotently reconcile with Velo retrieve().
  // NEVER mark invoice paid from a redirect or from an unverified webhook.
  console.info('Verified Velo webhook received; reconciliation pending');void event;return res.status(200).json({received:true});
 }catch(e){console.error('Rejected Velo webhook',e);return res.status(400).json({error:'Invalid webhook signature or configuration'});}
});
app.use(express.json({limit:'64kb'}));
const auth=(req:express.Request,res:express.Response,next:express.NextFunction)=>{const expected=process.env.ADMIN_API_TOKEN;if(!expected||req.header('authorization')!==`Bearer ${expected}`)return res.status(401).json({error:'Unauthorized'});next();};
app.get('/api/health',(_req,res)=>res.json({ok:true,network:'testnet',demoMode:process.env.DEMO_MODE!=='false'}));
app.get('/api/projects',(_req,res)=>res.json({projects:getProjects()}));
app.get('/api/agent/preview/:projectId',(req,res)=>{const project=getProjects().find(p=>p.id===req.params.projectId);if(!project)return res.status(404).json({error:'Not found'});return res.json({mode:'dry-run',decisions:project.milestones.map(evaluateMilestone)});});
// Protected operational endpoints. No keys / payment actions in the browser.
app.post('/api/payments/checkout',auth,async(req,res)=>{if(process.env.DEMO_MODE!=='false')return res.status(409).json({error:'DEMO_MODE is enabled'});
 const {projectId,amountXlm}=req.body??{};const project=getProjects().find(p=>p.id===projectId);
 if(!project||typeof amountXlm!=='string'||!/^\d+(\.\d{1,7})?$/.test(amountXlm)||Number(amountXlm)<=0)return res.status(400).json({error:'Invalid project or XLM amount'});
 try{const base=process.env.PUBLIC_WEB_URL??'http://localhost:5173';const checkout=await createCheckout({description:`Cordera Testnet project ${project.id}`,amountXlm,successUrl:base+'/checkout/success',cancelUrl:base+'/checkout/cancel'});return res.json(checkout);}catch(e){console.error(e);return res.status(502).json({error:'Velo checkout creation failed'});}
});
// MVP trigger: authorized operator marks verified evidence approved; the agent decides whether to send a Noir payment.
// IMPORTANT: this JSON-store workflow is a hackathon scaffold and NOT transaction-safe or production-grade.
app.post('/api/milestones/:projectId/:milestoneId/approve',auth,async(req,res)=>{if(process.env.DEMO_MODE!=='false')return res.status(409).json({error:'DEMO_MODE is enabled'});
 const {projectId,milestoneId}=req.params;
 try{const p=getProjects().find(x=>x.id===projectId);const m=p?.milestones.find(x=>x.id===milestoneId);if(!m)return res.status(404).json({error:'Not found'});
  if(m.paymentHash||m.status==='paid')return res.status(409).json({error:'Payment was already submitted'});
  if(m.status!=='submitted'&&m.status!=='approved')return res.status(409).json({error:'Milestone not submitted'});
  // Manual acceptance by an authorized operator; verify evidence URL yourself before this call.
  const candidate={...m,status:'approved' as const};const decision=evaluateMilestone(candidate);
  if(decision.action!=='pay')return res.status(409).json({decision});
  const allowlist=(process.env.ALLOWED_MERCHANT_ADDRESSES??'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!decision.merchantAddress||!allowlist.includes(decision.merchantAddress))return res.status(403).json({error:'Recipient not on verified merchant allowlist'});
  const {NOIR_DEVICE_HASH,NOIR_AGENT_PUBLIC_KEY,NOIR_AGENT_SECRET}=process.env;
  if(!NOIR_DEVICE_HASH||!NOIR_AGENT_PUBLIC_KEY||!NOIR_AGENT_SECRET)return res.status(503).json({error:'Noir testnet not configured'});
  // Reserve state before external call. On uncertain result, reconcile on-chain before retry.
  updateMilestone(projectId,milestoneId,x=>{x.status='approved';x.paymentHash='PENDING_RECONCILIATION';});
  try{const out=await authorizeMilestonePayment({deviceHash:NOIR_DEVICE_HASH,agentPublicKey:NOIR_AGENT_PUBLIC_KEY,agentSecret:NOIR_AGENT_SECRET,merchant:decision.merchantAddress!,amountXlm:decision.amountXlm});updateMilestone(projectId,milestoneId,x=>{x.paymentHash=out.hash;});return res.json({decision,transactionHash:out.hash,settlement:'merchant_claim_required'});}
  catch(e){console.error('Noir submission uncertain, reconcile before retry',e);return res.status(502).json({error:'Authorization failed or uncertain; reconcile chain before retry. PENDING_RECONCILIATION is intentional.'});}
 }catch(e){console.error(e);return res.status(500).json({error:'Unable to process milestone'});}
});
const port=Number(process.env.PORT??4000);app.listen(port,()=>console.log(`Cordera server: http://localhost:${port} (Testnet only)`));
