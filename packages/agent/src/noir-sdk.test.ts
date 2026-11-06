import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Account,Keypair,Networks,TransactionBuilder,type Transaction} from '@stellar/stellar-sdk';
import {keypairSigner} from '@noirx402/agent-sdk';
import {createClient,prepareSigned,validateConfig,verifyNetwork} from './noir.js';
const owner=Keypair.fromRawEd25519Seed(Buffer.alloc(32,11)),agent=Keypair.fromRawEd25519Seed(Buffer.alloc(32,12));
test('configuration rejects wrong network, RPC and contract; read-only RPC passphrase checked',async()=>{
  const c=createClient();validateConfig(c);
  for(const delta of [{networkPassphrase:Networks.PUBLIC},{rpcUrl:'https://example.com'},{contracts:{...c.contracts,deviceRegistry:'invalid'}}]){
    const bad=createClient();Object.assign(bad.config,delta);assert.throws(()=>validateConfig(bad));
  }
  c.server.getNetwork=async()=>({passphrase:Networks.PUBLIC,protocolVersion:'23'});
  await assert.rejects(verifyNetwork(c),/WRONG_RPC_NETWORK/);
});
test('official prepare builds contract XDR and signing preserves identity and required role',async()=>{
  const c=createClient();
  c.server.getAccount=async source=>new Account(source,'123');
  c.server.prepareTransaction=async tx=>tx as Transaction;
  const op={kind:'registerDevice' as const,deviceHash:'aa'.repeat(32),agent:agent.publicKey()};
  const signed=await prepareSigned(c,keypairSigner(owner.secret()),owner.publicKey(),op);
  const decoded=TransactionBuilder.fromXDR(signed.signed,Networks.TESTNET);
  assert.equal(decoded.hash().toString('hex'),signed.hash);
  assert.ok('operations' in decoded && decoded.operations[0].type==='invokeHostFunction');
  await assert.rejects(prepareSigned(c,keypairSigner(agent.secret()),owner.publicKey(),op),/WRONG_SIGNER/);
  const liar={publicKey:owner.publicKey(),signTransaction:keypairSigner(agent.secret()).signTransaction};
  await assert.rejects(prepareSigned(c,liar,owner.publicKey(),op),/MISSING_ROLE_SIGNATURE/);
  const changed={publicKey:owner.publicKey(),signTransaction:async()=>{
    const tx=new TransactionBuilder(new Account(owner.publicKey(),'555'),{fee:'100',networkPassphrase:Networks.TESTNET}).setTimeout(0).build();tx.sign(owner);return {signedTxXdr:tx.toXDR()};
  }};
  await assert.rejects(prepareSigned(c,changed,owner.publicKey(),op),/SIGNER_CHANGED_BODY/);
});
