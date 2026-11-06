import {test, type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Account, Keypair, Networks, SorobanDataBuilder, xdr, type Transaction} from '@stellar/stellar-sdk';
import {keypairSigner, type NoirAgentPolicy, type PaymentCheck} from '@noirx402/agent-sdk';
import {ASSET, createClient} from './noir.js';
import {approval, signApproval} from './noir-experiment.js';
import {Journal} from './noir-store.js';
import {decideChain, decideEligibility, decideRisk, parsePayoutRecord, runAutopilot, type PayoutRecord} from './payout-decision.js';
import {RISK_THRESHOLDS, RiskUnavailable, type RiskAssessment, type RiskModel} from './payout-risk.js';

const owner=Keypair.fromRawEd25519Seed(Buffer.alloc(32,21)),agent=Keypair.fromRawEd25519Seed(Buffer.alloc(32,22)),merchant=Keypair.fromRawEd25519Seed(Buffer.alloc(32,23));
const manifest={id:'autopilot',purpose:'controlled-testnet-experiment',owner:owner.publicKey(),agent:agent.publicKey(),merchant:merchant.publicKey(),deviceHash:'cd'.repeat(32),amountXlm:'1.5',maxPaymentXlm:'2',totalBudgetXlm:'3',fundingXlm:'4',expiresAt:'2099-01-01T00:00:00Z'};
const a=approval(manifest);
const record:PayoutRecord={payoutDate:'2026-11-01T00:00:00Z',review:{clientFeedback:'Approved, thanks.',evidenceSummary:'PR merged.',revisionSummary:'None.'},
  milestone:{id:'m-01',title:'UI implementation',assignee:'Demo developer A',merchantAddress:merchant.publicKey(),dueDate:'2026-11-06',status:'approved',acceptanceCriteria:['Responsive layouts'],evidence:[{type:'pr',url:'https://example.org/pull/1',passed:true}],testnetAmountXlm:'1.5'}};
const env={disabled:false,now:new Date('2026-11-06T00:00:00Z')};
const assessment=(over:Partial<RiskAssessment>={}):RiskAssessment=>({route:'routine',probabilities:{routine:0.95,pending:0.03,escalate:0.02},concernProbability:0.02,model:'jev-1.14.0',...over});
const ok=(value:unknown={ok:true})=>({ok:true,value});
const checks=(over:Record<string,{ok:boolean;code?:string;value?:unknown}>={})=>({approval:ok(a.digest),expiry:ok(),allowlist:ok(),device:ok(),policy:ok(),token:ok(ASSET),escrowStroops:ok('40000000'),authorization:ok(),pendingMerchantStroops:ok('0'),...over});

test('payout record validation rejects shape, status, address and review problems',()=>{
  assert.deepEqual(parsePayoutRecord(JSON.parse(JSON.stringify(record))),record);
  const m=record.milestone;
  for(const bad of [null,{...record,extra:1},{...record,payoutDate:'2026-11-01'},{...record,milestone:{...m,status:'done'}},{...record,milestone:{...m,merchantAddress:'GNOPE'}},{...record,milestone:{...m,evidence:[{type:'pr',url:'x'}]}},{...record,milestone:{...m,bonus:1}},{...record,review:{clientFeedback:'x'}}])assert.throws(()=>parsePayoutRecord(bad),/INVALID_PAYOUT_RECORD/);
});
test('eligibility engine: precedence of escalate, defer and pass-through',()=>{
  const m=record.milestone;
  assert.equal(decideEligibility(a,record,env),null);
  assert.deepEqual(decideEligibility(a,record,{...env,now:new Date('2099-06-01T00:00:00Z')}),{decision:'ESCALATE',stage:'approval',reason:'EXPIRED_APPROVAL'});
  for(const change of [{merchantAddress:owner.publicKey()},{testnetAmountXlm:'1.6'},{testnetAmountXlm:'abc'}])assert.equal(decideEligibility(a,{...record,milestone:{...m,...change}},env)?.reason,'RECIPIENT_OR_AMOUNT_DIFFERS_FROM_APPROVAL');
  assert.equal(decideEligibility(a,{...record,milestone:{...m,status:'disputed'}},env)?.decision,'ESCALATE');
  assert.equal(decideEligibility(a,{...record,milestone:{...m,evidence:[{type:'pr',url:'u',passed:false}]}},env)?.decision,'ESCALATE');
  assert.deepEqual(decideEligibility(a,{...record,milestone:{...m,status:'submitted'}},env),{decision:'DEFER',stage:'eligibility',reason:'Milestone not yet approved'});
  assert.equal(decideEligibility(a,{...record,milestone:{...m,status:'paid'}},env)?.decision,'DEFER');
  assert.equal(decideEligibility(a,{...record,payoutDate:'2026-11-16T00:00:00Z'},env)?.reason,'PAYOUT_DATE_NOT_REACHED');
  assert.equal(decideEligibility(a,record,{...env,disabled:true})?.reason,'AUTOPILOT_DISABLED');
});
test('chain readiness: setup conflicts escalate, funds and policy refusals defer or escalate',()=>{
  assert.equal(decideChain(checks()),null);
  assert.equal(decideChain(checks({policy:{ok:false,code:'POLICY_CAP_MISMATCH'}}))?.decision,'ESCALATE');
  assert.equal(decideChain(checks({device:{ok:false,code:'READ_UNAVAILABLE'}}))?.decision,'ESCALATE');
  assert.deepEqual(decideChain(checks({authorization:ok({ok:false,reason:'insufficient_escrow'})})),{decision:'DEFER',stage:'chain',reason:'insufficient_escrow'});
  assert.equal(decideChain(checks({authorization:ok({ok:false,reason:'expired'})}))?.decision,'ESCALATE');
  assert.equal(decideChain(checks({authorization:{ok:false,code:'READ_UNAVAILABLE'}}))?.decision,'DEFER');
});
test('risk agent can only tighten: thresholds on acted-on probability, unavailable defers',()=>{
  assert.equal(decideRisk(assessment()).decision,'EXECUTE');
  assert.equal(decideRisk(assessment({probabilities:{routine:RISK_THRESHOLDS.routineMin-0.01,pending:0.1,escalate:0.01}})).decision,'ESCALATE');
  assert.equal(decideRisk(assessment({concernProbability:RISK_THRESHOLDS.concernMax+0.01})).decision,'ESCALATE');
  assert.equal(decideRisk(assessment({route:'pending',probabilities:{routine:0.2,pending:0.75,escalate:0.05}})).decision,'DEFER');
  assert.equal(decideRisk(assessment({route:'pending',probabilities:{routine:0.35,pending:0.4,escalate:0.25}})).decision,'ESCALATE');
  assert.equal(decideRisk(assessment({route:'escalate',probabilities:{routine:0.05,pending:0.05,escalate:0.9}})).decision,'ESCALATE');
  assert.deepEqual(decideRisk(new RiskUnavailable('JEV_NOT_CONFIGURED')),{decision:'DEFER',stage:'risk',reason:'RISK_JEV_NOT_CONFIGURED'});
});

function fixture(t:TestContext){
  const dir=mkdtempSync(join(tmpdir(),'autopilot-'));const journal=new Journal(join(dir,'journal.sqlite'));
  journal.saveApproval(a,signApproval(a,owner.secret()));
  t.after(()=>{journal.close();rmSync(dir,{recursive:true,force:true});});
  const client=createClient();const sent:Transaction[]=[];let riskCalls=0;
  const state={check:{ok:true} as PaymentCheck,balance:a.amounts.funding,result:assessment() as RiskAssessment|RiskUnavailable};
  Object.assign(client.server,{
    async getNetwork(){return {passphrase:Networks.TESTNET};},async getAccount(s:string){return new Account(s,'7');},
    async simulateTransaction(){return {_parsed:true,id:'s',latestLedger:5,events:[],minResourceFee:'1000',transactionData:new SorobanDataBuilder().setResources(100000,100,100).setResourceFee('1000'),result:{auth:[],retval:xdr.ScVal.scvVoid()}};},
    async sendTransaction(tx:Transaction){sent.push(tx);return {status:'PENDING',hash:tx.hash().toString('hex')};},
    async getTransaction(){return {status:'SUCCESS',ledger:5,createdAt:1,applicationOrder:1};},
  });
  Object.assign(client,{async getDeviceOwner(){return a.manifest.owner;},async getDeviceAgent(){return a.manifest.agent;},async getEscrowToken(){return ASSET;},
    async getPolicy():Promise<NoirAgentPolicy>{return {agent:a.manifest.agent,asset:ASSET,maxAmount:a.amounts.maxPayment,expiresAt:new Date(a.manifest.expiresAt)};},
    async getEscrowBalance(){return state.balance;},async checkPayment(){return state.check;},async getPendingBalance(){return 0n;}});
  const risk:RiskModel={async assess(){riskCalls++;if(state.result instanceof RiskUnavailable)throw state.result;return state.result;}};
  const deps={client,journal,risk,env:{disabled:false,now:new Date('2026-11-06T00:00:00Z')},allowlist:merchant.publicKey()};
  const execute={signer:keypairSigner(agent.secret()),consent:{live:true,confirm:a.digest,attested:true,allowlist:merchant.publicKey()}};
  return {deps,execute,journal,state,sent,risk:()=>riskCalls};
}
test('autopilot executes an eligible routine payout once, logs every verdict, and never re-executes',async t=>{
  const h=fixture(t);
  const first=await runAutopilot(h.deps,a,record,h.execute) as {decision:string;executed:boolean;result:{hash:string}};
  assert.equal(first.decision,'EXECUTE');assert.equal(first.executed,true);assert.equal(h.sent.length,1);
  assert.equal(h.journal.existing(a.manifest.id,'authorize')!.tx_hash,first.result.hash);
  const again=await runAutopilot(h.deps,a,record,h.execute) as {decision:string};
  assert.equal(again.decision,'ALREADY_EXECUTED');assert.equal(h.sent.length,1);assert.equal(h.risk(),1);
  const decisions=h.journal.decisions(a.manifest.id);
  assert.deepEqual(decisions.map(d=>[d.decision,d.stage]),[['EXECUTE','risk']]);
  assert.ok(JSON.parse(decisions[0]!.details_json).probabilities.routine>0);
  assert.throws(()=>h.journal.db.prepare('DELETE FROM decisions').run(),/append only/);
});
test('assess mode never signs; defer and escalate never reach Jev-after or the chain write',async t=>{
  const h=fixture(t);
  const assessed=await runAutopilot(h.deps,a,record) as {decision:string;executed:boolean};
  assert.deepEqual([assessed.decision,assessed.executed],['EXECUTE',false]);assert.equal(h.sent.length,0);
  h.state.check={ok:false,reason:'insufficient_escrow'};
  assert.equal((await runAutopilot(h.deps,a,record,h.execute) as {decision:string}).decision,'DEFER');assert.equal(h.risk(),1,'Jev is not asked when the chain is not ready');
  h.state.check={ok:true};h.state.result=new RiskUnavailable('JEV_REQUEST_FAILED');
  assert.equal((await runAutopilot(h.deps,a,record,h.execute) as {decision:string}).decision,'DEFER');
  h.state.result=assessment({route:'escalate',probabilities:{routine:0.1,pending:0.1,escalate:0.8}});
  assert.equal((await runAutopilot(h.deps,a,record,h.execute) as {decision:string}).decision,'ESCALATE');
  assert.equal((await runAutopilot({...h.deps,env:{...h.deps.env,disabled:true}},a,record,h.execute) as {decision:string;reason:string}).reason,'AUTOPILOT_DISABLED');
  assert.equal(h.sent.length,0);
  assert.deepEqual(h.journal.decisions(a.manifest.id).map(d=>d.decision),['EXECUTE','DEFER','DEFER','ESCALATE','DEFER']);
});
test('a tampered or missing approval escalates before any chain or Jev call',async t=>{
  const h=fixture(t);
  h.journal.db.prepare('UPDATE experiments SET signature=? WHERE id=?').run(Buffer.alloc(64).toString('base64'),a.manifest.id);
  const out=await runAutopilot(h.deps,a,record,h.execute) as {decision:string;stage:string};
  assert.deepEqual([out.decision,out.stage],['ESCALATE','approval']);assert.equal(h.risk(),0);assert.equal(h.sent.length,0);
});
