import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {evaluateMilestone} from '@agentpay/agent';
import {createCheckout,verifyVeloWebhook} from './payments.js';
import {getProjects} from './store.js';
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
 try{const base=process.env.PUBLIC_WEB_URL??'http://localhost:5173';const checkout=await createCheckout({description:`Snapp Testnet project ${project.id}`,amountXlm,successUrl:base+'/checkout/success',cancelUrl:base+'/checkout/cancel'});return res.json(checkout);}catch(e){console.error(e);return res.status(502).json({error:'Velo checkout creation failed'});}
});
const port=Number(process.env.PORT??4000);app.listen(port,()=>console.log(`Snapp server: http://localhost:${port} (Testnet only)`));
