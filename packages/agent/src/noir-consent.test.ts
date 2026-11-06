import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,chmodSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Keypair} from '@stellar/stellar-sdk';
import {approval,amount,requireFresh,requireMerchant,signApproval} from './noir-experiment.js';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {Journal} from './noir-store.js';
const owner=Keypair.fromRawEd25519Seed(Buffer.alloc(32,1));
const agent=Keypair.fromRawEd25519Seed(Buffer.alloc(32,2));
const merchant=Keypair.fromRawEd25519Seed(Buffer.alloc(32,3));
const manifest={id:'boundary',purpose:'controlled-testnet-experiment',owner:owner.publicKey(),agent:agent.publicKey(),merchant:merchant.publicKey(),deviceHash:'aa'.repeat(32),amountXlm:'1',maxPaymentXlm:'2',totalBudgetXlm:'2',fundingXlm:'3',expiresAt:'2099-01-01T00:00:00Z'};
test('manifest rejects malformed fields, roles, hash and exact amount boundaries',()=>{
  for(const delta of [{extra:'x'},{deviceHash:'ab'},{owner:'invalid'},{agent:owner.publicKey()},{amountXlm:'1e2'},{amountXlm:'0'},{amountXlm:'-1'},{amountXlm:'1.00000000'},{amountXlm:' 1'},{amountXlm:'3'},{fundingXlm:'0.1'},{expiresAt:'2099-02-30T00:00:00Z'}]) assert.throws(()=>approval({...manifest,...delta}));
  assert.equal(amount('0.0000001'),1n);
  const max=(1n<<127n)-1n;
  assert.equal(amount(`${max/10000000n}.${(max%10000000n).toString().padStart(7,'0')}`),max);
  assert.throws(()=>amount(`${(max+1n)/10000000n}.${((max+1n)%10000000n).toString().padStart(7,'0')}`));
  assert.throws(()=>requireFresh(approval({...manifest,expiresAt:'2000-01-01T00:00:00Z'})));
  assert.throws(()=>requireMerchant(approval(manifest),''));
});
test('approval survives reopen, rejects changes/tampering, and reserves unknown spending',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'noir-consent-'));const path=join(dir,'journal.sqlite');
  chmodSync(dir,0o755);
  assert.throws(()=>new Journal(path),/PRIVATE_JOURNAL_DIRECTORY_REQUIRED/);
  chmodSync(dir,0o700);
  let j=new Journal(path);const a=approval(manifest);
  try {
    assert.equal(statSync(path).mode&0o777,0o600);
    assert.throws(()=>j.verify(a),/MISSING_APPROVAL/);
    j.saveApproval(a,signApproval(a,owner.secret()));j.close();j=new Journal(path);j.verify(a);
    for(const delta of [{amountXlm:'0.5'},{merchant:Keypair.fromRawEd25519Seed(Buffer.alloc(32,4)).publicKey()}]) assert.throws(()=>j.verify(approval({...manifest,...delta})),/APPROVAL_CHANGED/);
    assert.throws(()=>j.verify({...a,manifest:{...a.manifest,merchant:agent.publicKey()}}),/INVALID_ROLES|APPROVAL_CHANGED/);
    assert.throws(()=>j.verify({...a,amounts:{...a.amounts,amount:a.amounts.amount+1n}}),/APPROVAL_CHANGED/);
    assert.throws(()=>j.saveApproval(a,Buffer.alloc(64).toString('base64')));
    await j.transaction(async()=>{const nonce=j.reserveBudget(a);j.insert(a,'authorize',agent.publicKey(),{amount:'10000000'},nonce,'a'.repeat(64),{});});
    j.transition(j.existing(a.manifest.id,'authorize')!,'unknown',null,{});
    const b=approval({...manifest,id:'second',amountXlm:'2'});j.saveApproval(b,signApproval(b,owner.secret()));
    await assert.rejects(j.transaction(async()=>j.reserveBudget(b)),/CUMULATIVE_BUDGET_EXCEEDED/);
    assert.throws(()=>j.insert(a,'authorize',agent.publicKey(),{},1n,'b'.repeat(64),{}));
    assert.equal(j.operations(a.manifest.id).length,1);
    const stale=j.existing(a.manifest.id,'authorize')!;
    j.transition(stale,'succeeded',123,{events:[{id:'event-1',type:'payment.authorized'}],eventEvidence:'matched'});
    j.transition(stale,'succeeded',123,{events:[],eventEvidence:'incomplete'});
    assert.equal(JSON.parse(j.existing(a.manifest.id,'authorize')!.evidence_json).events[0].id,'event-1');
    j.db.prepare('UPDATE experiments SET signature=? WHERE id=?').run(Buffer.alloc(64).toString('base64'),a.manifest.id);
    assert.throws(()=>j.verify(a));
  } finally {j.close();rmSync(dir,{recursive:true,force:true});}
});
test('contending processes reserve the same item only once',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'noir-race-')),path=join(dir,'journal.sqlite'),a=approval(manifest);
  const j=new Journal(path);j.saveApproval(a,signApproval(a,owner.secret()));j.close();
  const script=`import {Journal} from ${JSON.stringify(new URL('./noir-store.ts',import.meta.url).href)};import {approval} from ${JSON.stringify(new URL('./noir-experiment.ts',import.meta.url).href)};const j=new Journal(process.argv[1]);const a=approval(JSON.parse(process.argv[2]));await j.transaction(async()=>{j.verify(a);if(!j.existing(a.manifest.id,'authorize')){const n=j.reserveBudget(a);j.insert(a,'authorize',a.manifest.agent,{},n,'c'.repeat(64),{});}});j.close();`;
  const run=async()=>{
    const child=spawn(process.execPath,['--import','tsx','--input-type=module','-e',script,path,JSON.stringify(manifest)],{stdio:'pipe'});
    let error='';child.stderr.on('data',chunk=>{error+=chunk;});
    const [code]=await once(child,'exit');assert.equal(code,0,error);
  };
  try{await Promise.all([run(),run()]);const reopened=new Journal(path);assert.equal(reopened.operations(a.manifest.id).length,1);reopened.close();}
  finally{rmSync(dir,{recursive:true,force:true});}
});
