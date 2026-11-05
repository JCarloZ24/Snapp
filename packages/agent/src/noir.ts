import {Asset,Networks} from '@stellar/stellar-sdk';
import {NoirAgentClient,keypairSigner,toStroops} from '@noirx402/agent-sdk';
/** Actual Noir authorization, Testnet only. Preconditions and idempotency belong to the server.
 * Live contract IDs are SDK-managed. See docs/INTEGRATIONS.md; never deploy substitute contracts.
 */
export async function authorizeMilestonePayment(input:{deviceHash:string;agentPublicKey:string;agentSecret:string;merchant:string;amountXlm:string}) {
 const noir = new NoirAgentClient();
 const asset = Asset.native().contractId(Networks.TESTNET);
 // Device hash encoding and SDK API must be verified after installing the pinned SDK version.
 const deviceHash = input.deviceHash as Parameters<typeof noir.checkPayment>[0]['deviceHash'];
 const check = await noir.checkPayment({deviceHash,agent:input.agentPublicKey,asset,amount:toStroops(input.amountXlm)});
 if(!check.ok)throw new Error('Noir policy rejected payment: '+check.reason);
 const {hash} = await noir.authorizePayment({agent:keypairSigner(input.agentSecret),deviceHash,merchant:input.merchant,asset,amount:toStroops(input.amountXlm)});
 return {hash};
}
