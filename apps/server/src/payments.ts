import {Velo} from '@carts1024/velo-sdk';
export function veloClient(){if(!process.env.VELO_API_KEY)throw Error('VELO_API_KEY not configured');return new Velo({apiKey:process.env.VELO_API_KEY,environment:'testnet'});}
export async function createCheckout(input:{description:string;amountXlm:string;successUrl:string;cancelUrl:string}) {
 return veloClient().checkout.sessions.create({amount:input.amountXlm,asset:'native',description:input.description,successUrl:input.successUrl,cancelUrl:input.cancelUrl});
}
export async function verifyVeloWebhook(rawBody:Buffer,signature:string){if(!process.env.VELO_WEBHOOK_SECRET)throw Error('VELO_WEBHOOK_SECRET not configured');return Velo.webhooks.verify({payload:rawBody,signature,secret:process.env.VELO_WEBHOOK_SECRET});}
