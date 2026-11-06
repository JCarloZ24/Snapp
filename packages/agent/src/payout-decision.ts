import type {NoirAgentClient, NoirSigner} from '@noirx402/agent-sdk';
import type {Milestone} from '@agentpay/shared';
import {StrKey} from '@stellar/stellar-sdk';
import {evaluateMilestone} from './index.js';
import {NoirFailure} from './noir.js';
import {type Approval, amount} from './noir-experiment.js';
import {Journal, type Decision} from './noir-store.js';
import {checkExperiment, executeOperation, type LiveConsent} from './noir-operations.js';
import {RISK_THRESHOLDS, RiskUnavailable, inputHash, parseEvidence, type RiskAssessment, type RiskEvidence, type RiskModel} from './payout-risk.js';

/** Operator-supplied payout record: the milestone being paid, when it may be paid, and the review text for Jev. */
export interface PayoutRecord {milestone:Milestone; payoutDate:string; review:RiskEvidence}
export interface Verdict {decision:Decision; stage:string; reason:string; details?:unknown}
export interface AutopilotEnv {disabled:boolean; now?:Date}

const STATUSES=['planned','submitted','approved','disputed','paid'];
const EVIDENCE_TYPES=['pr','deployment','test','manual'];
const isString=(v:unknown):v is string=>typeof v==='string';
export function parsePayoutRecord(input:unknown):PayoutRecord {
  const fail=()=>new NoirFailure('INVALID_PAYOUT_RECORD');
  if(input===null||typeof input!=='object'||Array.isArray(input))throw fail();
  const r=input as Record<string,unknown>;
  if(Object.keys(r).length!==3||!isString(r.payoutDate)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(r.payoutDate)||!Number.isFinite(Date.parse(r.payoutDate)))throw fail();
  const m=r.milestone as Record<string,unknown>|null;
  if(m===null||typeof m!=='object'||Array.isArray(m))throw fail();
  const fields=['id','title','assignee','merchantAddress','dueDate','status','acceptanceCriteria','evidence','testnetAmountXlm'];
  if(!fields.every(k=>k in m)||Object.keys(m).some(k=>!fields.includes(k)&&k!=='paymentHash'))throw fail();
  if(!isString(m.id)||!isString(m.title)||!isString(m.assignee)||!isString(m.dueDate)||!isString(m.status)||!STATUSES.includes(m.status)||!isString(m.testnetAmountXlm))throw fail();
  if(m.merchantAddress!==null&&!(isString(m.merchantAddress)&&StrKey.isValidEd25519PublicKey(m.merchantAddress)))throw fail();
  if('paymentHash' in m&&m.paymentHash!==undefined&&!isString(m.paymentHash))throw fail();
  if(!Array.isArray(m.acceptanceCriteria)||!m.acceptanceCriteria.every(isString))throw fail();
  if(!Array.isArray(m.evidence)||!m.evidence.every(e=>e!==null&&typeof e==='object'&&isString(e.type)&&EVIDENCE_TYPES.includes(e.type)&&isString(e.url)&&typeof e.passed==='boolean'))throw fail();
  let review:RiskEvidence;
  try{review=parseEvidence(r.review);}catch{throw fail();}
  return {milestone:m as unknown as Milestone,payoutDate:r.payoutDate,review};
}

/** Payment Eligibility Engine: deterministic, offline. Order matters; first match wins. */
export function decideEligibility(a:Approval,record:PayoutRecord,env:AutopilotEnv):Verdict|null {
  const now=env.now??new Date();
  if(Date.parse(a.manifest.expiresAt)<=now.getTime())return {decision:'ESCALATE',stage:'approval',reason:'EXPIRED_APPROVAL'};
  const m=record.milestone;
  let itemStroops:bigint|null=null;
  try{itemStroops=amount(m.testnetAmountXlm);}catch{ /* reported by the eligibility engine below */ }
  if(m.merchantAddress!==a.manifest.merchant||itemStroops!==a.amounts.amount)return {decision:'ESCALATE',stage:'binding',reason:'RECIPIENT_OR_AMOUNT_DIFFERS_FROM_APPROVAL'};
  const eligibility=evaluateMilestone(m);
  if(eligibility.action==='human_review')return {decision:'ESCALATE',stage:'eligibility',reason:eligibility.reason};
  if(eligibility.action==='hold')return {decision:'DEFER',stage:'eligibility',reason:eligibility.reason};
  if(Date.parse(record.payoutDate)>now.getTime())return {decision:'DEFER',stage:'schedule',reason:'PAYOUT_DATE_NOT_REACHED',details:{payoutDate:record.payoutDate}};
  if(env.disabled)return {decision:'DEFER',stage:'switch',reason:'AUTOPILOT_DISABLED'};
  return null;
}

/** Chain readiness from `checkExperiment`. Policy/device/token conflicts escalate; funds and policy refusals defer. */
export function decideChain(checks:Record<string,{ok:boolean;code?:string;value?:unknown}>):Verdict|null {
  for(const name of ['approval','allowlist','device','policy','token'])if(!checks[name]?.ok)return {decision:'ESCALATE',stage:'chain',reason:`${name.toUpperCase()}_${checks[name]?.code??'UNAVAILABLE'}`};
  const auth=checks.authorization;
  if(!auth?.ok)return {decision:'DEFER',stage:'chain',reason:`AUTHORIZATION_${auth?.code??'UNAVAILABLE'}`};
  const check=auth.value as {ok:boolean;reason?:string};
  if(!check.ok)return {decision:check.reason==='insufficient_escrow'?'DEFER':'ESCALATE',stage:'chain',reason:check.reason??'REFUSED'};
  return null;
}

/** Payout Risk & Review Agent result → verdict. Only ever tightens. */
export function decideRisk(result:RiskAssessment|RiskUnavailable):Verdict {
  if(result instanceof RiskUnavailable)return {decision:'DEFER',stage:'risk',reason:`RISK_${result.code}`};
  const details={model:result.model,route:result.route,probabilities:result.probabilities,concernProbability:result.concernProbability,thresholds:RISK_THRESHOLDS};
  if(result.route==='routine'&&result.probabilities.routine>=RISK_THRESHOLDS.routineMin&&result.concernProbability<=RISK_THRESHOLDS.concernMax)return {decision:'EXECUTE',stage:'risk',reason:'ROUTINE_REVIEW',details};
  if(result.route==='pending'&&result.probabilities.pending>=RISK_THRESHOLDS.pendingMin)return {decision:'DEFER',stage:'risk',reason:'REVISIONS_PENDING',details};
  return {decision:'ESCALATE',stage:'risk',reason:result.route==='escalate'?'REVIEW_FLAGGED':'LOW_CONFIDENCE_REVIEW',details};
}

export interface AutopilotDeps {client:NoirAgentClient; journal:Journal; risk:RiskModel; env:AutopilotEnv; allowlist:string|undefined}
/** One evaluation. `execute` undefined = assess only (no signer, no write to chain). */
export async function runAutopilot(deps:AutopilotDeps,a:Approval,record:PayoutRecord,execute?:{signer:NoirSigner;consent:LiveConsent}):Promise<unknown> {
  const {journal}=deps;
  const hash=inputHash(record.milestone,record.review);
  const existing=journal.existing(a.manifest.id,'authorize');
  if(existing)return {decision:'ALREADY_EXECUTED',hash:existing.tx_hash,state:existing.state,next:existing.state==='succeeded'?'claim':'reconcile'};
  const log=(v:Verdict)=>{journal.logDecision(a.manifest.id,{...v,inputHash:hash,details:v.details??{}});return {decision:v.decision,stage:v.stage,reason:v.reason,details:v.details,inputHash:hash};};
  try{journal.verify(a);}catch(e){return log({decision:'ESCALATE',stage:'approval',reason:e instanceof NoirFailure?e.code:'APPROVAL_INVALID'});}
  const offline=decideEligibility(a,record,deps.env);
  if(offline)return log(offline);
  const chain=await checkExperiment(deps.client,journal,a,deps.allowlist) as {checks:Record<string,{ok:boolean;code?:string;value?:unknown}>};
  const chainVerdict=decideChain(chain.checks);
  if(chainVerdict)return log(chainVerdict);
  let assessment:RiskAssessment|RiskUnavailable;
  try{assessment=await deps.risk.assess({deliverable:record.milestone.title,acceptanceCriteria:record.milestone.acceptanceCriteria},record.review);}
  catch(e){assessment=e instanceof RiskUnavailable?e:new RiskUnavailable('JEV_REQUEST_FAILED');}
  const verdict=decideRisk(assessment);
  const logged=log(verdict);
  if(verdict.decision!=='EXECUTE'||!execute)return {...logged,executed:false};
  const result=await executeOperation(deps.client,journal,a,'authorize',execute.signer,execute.consent);
  return {...logged,executed:true,result};
}
