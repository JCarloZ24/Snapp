import {createHash} from 'node:crypto';
import {Keypair, Networks, StrKey} from '@stellar/stellar-sdk';
import {normalizeDeviceHash, toStroops, fromStroops} from '@noirx402/agent-sdk';
import {ASSET, CONTRACTS, requireCondition} from './noir.js';

export interface Manifest {
  id:string; purpose:'controlled-testnet-experiment'; owner:string; agent:string; merchant:string;
  deviceHash:string; amountXlm:string; maxPaymentXlm:string; totalBudgetXlm:string; fundingXlm:string; expiresAt:string;
}
export interface Approval {manifest:Manifest; bytes:string; digest:string; amounts:{amount:bigint;maxPayment:bigint;totalBudget:bigint;funding:bigint};}
const fields = ['id','purpose','owner','agent','merchant','deviceHash','amountXlm','maxPaymentXlm','totalBudgetXlm','fundingXlm','expiresAt'];
export function amount(value:unknown):bigint {
  requireCondition(typeof value === 'string' && /^(0|[1-9]\d*)(\.\d{1,7})?$/.test(value), 'INVALID_AMOUNT');
  const n = toStroops(value);
  requireCondition(n > 0n && n <= (1n << 127n)-1n, 'AMOUNT_OUT_OF_RANGE');
  return n;
}
export function approval(input:unknown):Approval {
  requireCondition(input !== null && typeof input === 'object' && !Array.isArray(input), 'INVALID_MANIFEST');
  const m = input as Record<string,unknown>;
  requireCondition(Object.keys(m).length === fields.length && fields.every(k => typeof m[k] === 'string'), 'MANIFEST_FIELDS');
  requireCondition(/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(m.id as string), 'INVALID_ID');
  requireCondition(m.purpose === 'controlled-testnet-experiment', 'INVALID_PURPOSE');
  const roles = [m.owner,m.agent,m.merchant] as string[];
  requireCondition(roles.every(k => StrKey.isValidEd25519PublicKey(k)) && new Set(roles).size === 3, 'INVALID_ROLES');
  requireCondition(/^[a-fA-F0-9]{64}$/.test(m.deviceHash as string), 'INVALID_DEVICE_HASH');
  const amounts = {amount:amount(m.amountXlm),maxPayment:amount(m.maxPaymentXlm),totalBudget:amount(m.totalBudgetXlm),funding:amount(m.fundingXlm)};
  requireCondition(amounts.amount <= amounts.maxPayment && amounts.maxPayment <= amounts.totalBudget && amounts.funding >= amounts.amount, 'INVALID_LIMITS');
  requireCondition(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(m.expiresAt as string), 'INVALID_EXPIRY');
  const expiry = new Date(m.expiresAt as string);
  requireCondition(Number.isFinite(expiry.getTime()) && expiry.toISOString().replace('.000Z','Z') === m.expiresAt, 'INVALID_EXPIRY');
  const manifest:Manifest = {id:m.id as string,purpose:'controlled-testnet-experiment',owner:roles[0],agent:roles[1],merchant:roles[2],deviceHash:normalizeDeviceHash(m.deviceHash as string),amountXlm:fromStroops(amounts.amount),maxPaymentXlm:fromStroops(amounts.maxPayment),totalBudgetXlm:fromStroops(amounts.totalBudget),fundingXlm:fromStroops(amounts.funding),expiresAt:m.expiresAt as string};
  const bytes = JSON.stringify({version:'snapp-noir-testnet-v1',manifest,asset:ASSET,networkPassphrase:Networks.TESTNET,contracts:CONTRACTS});
  return {manifest,bytes,digest:createHash('sha256').update(bytes).digest('hex'),amounts};
}
export function requireFresh(a:Approval):void { requireCondition(Date.parse(a.manifest.expiresAt)>Date.now(), 'EXPIRED_APPROVAL'); }
export function requireMerchant(a:Approval, allowlist:string|undefined):void {
  requireCondition((allowlist ?? '').split(',').map(s=>s.trim()).includes(a.manifest.merchant), 'MERCHANT_NOT_ALLOWED');
}
export function signApproval(a:Approval, secret:string):string {
  const kp = Keypair.fromSecret(secret);
  requireCondition(kp.publicKey() === a.manifest.owner, 'WRONG_SIGNER');
  return kp.sign(Buffer.from(a.bytes)).toString('base64');
}
export function verifyApproval(a:Approval, signature:string):void {
  requireCondition(Keypair.fromPublicKey(a.manifest.owner).verify(Buffer.from(a.bytes),Buffer.from(signature,'base64')), 'INVALID_APPROVAL_SIGNATURE');
}
export const json = (value:unknown):string => JSON.stringify(value,(_key,v)=>typeof v === 'bigint' ? v.toString() : v);
