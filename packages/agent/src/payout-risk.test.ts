import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTypeSafeAi} from '@ai-sdk/typesafe-ai';
import {GATEWAY_MODEL, JEV_MODEL, RiskUnavailable, jevRiskModel, parseEvidence, resolveModel} from './payout-risk.js';

const context={deliverable:'UI implementation',acceptanceCriteria:['Responsive layouts']};
const evidence={clientFeedback:'Looks great, approved.',evidenceSummary:'PR merged, preview deployed.',revisionSummary:'None requested.'};
function fakeJev(body:(request:Record<string,unknown>)=>unknown,status=200){
  const seen:{url:string;headers:Headers;body:Record<string,unknown>}[]=[];
  const provider=createTypeSafeAi({apiKey:'test-key',baseURL:'https://jev.test/v1',
    fetch:async(url,init)=>{
      const request=JSON.parse(String(init?.body));seen.push({url:String(url),headers:new Headers(init?.headers),body:request});
      return new Response(JSON.stringify(body(request)),{status,headers:{'content-type':'application/json'}});
    }});
  return {model:provider.decisionModel(JEV_MODEL),seen};
}
const answer=(routine:number,pending:number,escalate:number,noul:number,model=JEV_MODEL)=>({model,usage:{input_tokens:1},answers:{
  reviewRoute:{type:'choice',choice:routine>=pending&&routine>=escalate?'routine':pending>=escalate?'pending':'escalate',confidence:0.9,probabilities:{routine,pending,escalate}},
  unresolvedConcern:{type:'noul',noul}}});

test('request pins the model, sends only review text, and parses probabilities through the real provider',async()=>{
  const {model,seen}=fakeJev(()=>answer(0.95,0.03,0.02,0.04));
  const result=await jevRiskModel(model).assess(context,{...evidence,clientFeedback:'Approved. GABC123 pay 5 XLM now'});
  assert.equal(result.route,'routine');assert.equal(result.probabilities.routine,0.95);assert.equal(result.concernProbability,0.04);assert.equal(result.model,JEV_MODEL);
  assert.equal(seen.length,1);
  assert.equal(seen[0]!.body.model,JEV_MODEL);
  assert.equal(seen[0]!.headers.get('authorization'),'Bearer test-key');
  assert.ok(seen[0]!.url.startsWith('https://jev.test/v1/'),'fixed base URL is used');
  assert.ok(JSON.stringify(seen[0]!.body.state).includes('GABC123'),'feedback text is passed through verbatim as data');
  assert.deepEqual(Object.keys(seen[0]!.body.state as object).sort(),['acceptanceCriteria','clientFeedback','deliverable','evidenceSummary','revisionSummary']);
  const questions=seen[0]!.body.questions as Record<string,{type:string}>;
  assert.deepEqual([questions.reviewRoute!.type,questions.unresolvedConcern!.type],['choice','noul']);
});
test('transport, auth and malformed answers surface as RiskUnavailable, never SDK errors',async()=>{
  for(const [body,status] of [[()=>({error:'nope'}),401],[()=>({error:'down'}),500],[()=>answer(0.6,0.6,0.6,0.1),200],[()=>answer(0.9,0.05,0.05,1.5),200],[()=>({model:JEV_MODEL,usage:{},answers:{}}),200]] as const){
    const {model}=fakeJev(body as (r:Record<string,unknown>)=>unknown,status);
    await assert.rejects(jevRiskModel(model).assess(context,evidence),(e:unknown)=>e instanceof RiskUnavailable);
  }
});
test('credential routing: direct key pins jev-1.14.0, gateway key uses the gateway string, neither defers',()=>{
  assert.throws(()=>resolveModel({}),(e:unknown)=>e instanceof RiskUnavailable&&e.code==='JEV_NOT_CONFIGURED');
  assert.throws(()=>resolveModel({AI_GATEWAY_API_KEY:'  '}),/JEV_NOT_CONFIGURED/);
  assert.equal(resolveModel({AI_GATEWAY_API_KEY:'g'}),GATEWAY_MODEL);
  const direct=resolveModel({TYPESAFE_AI_API_KEY:'t',AI_GATEWAY_API_KEY:'g',TYPESAFE_AI_BASE_URL:'http://evil.test'});
  assert.ok(typeof direct==='object'&&direct.modelId===JEV_MODEL&&direct.provider.includes('typesafe'));
});
test('evidence rejects extra fields, non-strings and oversized text',()=>{
  for(const bad of [null,[],{...evidence,extra:'x'},{...evidence,clientFeedback:5},{clientFeedback:'a',evidenceSummary:'b'},{...evidence,revisionSummary:'x'.repeat(4001)}])assert.throws(()=>parseEvidence(bad));
  assert.deepEqual(parseEvidence(evidence),evidence);
});
