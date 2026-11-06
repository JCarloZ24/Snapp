import {Asset, Keypair, Networks, TransactionBuilder} from '@stellar/stellar-sdk';
import {NoirAgentClient, type NoirSigner, type NoirOperation} from '@noirx402/agent-sdk';

export const CONTRACTS = Object.freeze({
  deviceRegistry:'CAC4KOLHDLDYDWBOKXNKRN5KVHO56PLOIFXDLTBUWGVN6GVDEB7FQHU5',
  agentRegistry:'CCMZDSPTLX7IIJWCYEUM5DJUHOSOYSTHGK777S2TXZWEMC5ZZGPJ3EBV',
  paymentEscrow:'CC7EAW5FNJEDBS7THM5IT6XIOHO4AOYMLXT3KSZ3HWUIKEACTW7E5BFS',
});
export const ASSET = Asset.native().contractId(Networks.TESTNET);
export class NoirFailure extends Error {
  constructor(public readonly code:string, public readonly hash?:string) { super(code); }
}
export function requireCondition(value:unknown, code:string):asserts value {
  if (!value) throw new NoirFailure(code);
}
export function createClient():NoirAgentClient { return new NoirAgentClient({network:'testnet'}); }
export function validateConfig(client:NoirAgentClient):void {
  requireCondition(client.config.networkPassphrase === Networks.TESTNET, 'WRONG_NETWORK');
  requireCondition(client.config.rpcUrl === 'https://soroban-testnet.stellar.org', 'WRONG_RPC');
  for (const key of Object.keys(CONTRACTS) as (keyof typeof CONTRACTS)[]) {
    requireCondition(client.contracts[key] === CONTRACTS[key], `CONTRACT_MISMATCH_${key}`);
  }
}
export async function verifyNetwork(client:NoirAgentClient):Promise<void> {
  validateConfig(client);
  requireCondition((await client.server.getNetwork()).passphrase === Networks.TESTNET, 'WRONG_RPC_NETWORK');
}
export async function prepareSigned(client:NoirAgentClient, signer:NoirSigner, source:string, op:NoirOperation, beforeSign?:()=>Promise<void>) {
  requireCondition(signer.publicKey === source, 'WRONG_SIGNER');
  const unsigned = await client.prepare(source, op);
  const before = TransactionBuilder.fromXDR(unsigned, Networks.TESTNET);
  requireCondition('source' in before && before.source === source, 'WRONG_TRANSACTION_SOURCE');
  await beforeSign?.();
  const result = await signer.signTransaction(unsigned, {networkPassphrase:Networks.TESTNET});
  const signed = typeof result === 'string' ? result : result.signedTxXdr;
  const after = TransactionBuilder.fromXDR(signed, Networks.TESTNET);
  requireCondition(before.hash().equals(after.hash()), 'SIGNER_CHANGED_BODY');
  const key=Keypair.fromPublicKey(source);
  requireCondition(after.signatures.some(s=>s.hint().equals(key.signatureHint())&&key.verify(after.hash(),s.signature())), 'MISSING_ROLE_SIGNATURE');
  return {signed, hash:after.hash().toString('hex')};
}
