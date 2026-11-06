import {Velo} from '@carts1024/velo-sdk';
export function veloClient(){if(!process.env.VELO_API_KEY)throw Error('VELO_API_KEY not configured');return new Velo({apiKey:process.env.VELO_API_KEY,environment:'testnet'});}
export async function createCheckout(input:{description:string;amountXlm:string;successUrl:string;cancelUrl:string}) {
 return veloClient().checkout.sessions.create({amount:input.amountXlm,asset:'native',description:input.description,successUrl:input.successUrl,cancelUrl:input.cancelUrl});
}
/** Velo's API is the source of truth for intent status; webhook bodies and redirects only prompt a lookup. */
export async function retrievePaymentIntent(id:string){return veloClient().paymentIntents.retrieve(id);}
/** `rawBody` must be the unparsed request body: the HMAC covers the exact bytes Velo sent. */
export async function verifyVeloWebhook(rawBody:Buffer,signature:string){if(!process.env.VELO_WEBHOOK_SECRET)throw Error('VELO_WEBHOOK_SECRET not configured');return Velo.webhooks.verify({payload:rawBody.toString('utf8'),signature,secret:process.env.VELO_WEBHOOK_SECRET});}
