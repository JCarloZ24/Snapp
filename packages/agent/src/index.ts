import type { AgentDecision,Milestone } from '@agentpay/shared';
export function evaluateMilestone(m:Milestone):AgentDecision {
 const base={milestoneId:m.id,merchantAddress:m.merchantAddress,amountXlm:m.testnetAmountXlm};
 if(m.status==='paid'||m.paymentHash)return {...base,action:'hold',reason:'Already paid or payment submitted'};
 if(m.status==='disputed')return {...base,action:'human_review',reason:'Active dispute requires human resolution'};
 if(m.status!=='approved')return {...base,action:'hold',reason:'Milestone not yet approved'};
 if(!m.merchantAddress)return {...base,action:'human_review',reason:'No verified merchant address'};
 if(!m.acceptanceCriteria.length||!m.evidence.length||!m.evidence.every(e=>e.passed))return {...base,action:'human_review',reason:'Insufficient or failed acceptance evidence'};
 if(!/^\d+(\.\d{1,7})?$/.test(m.testnetAmountXlm)||Number(m.testnetAmountXlm)<=0)return {...base,action:'human_review',reason:'Invalid Testnet XLM amount'};
 return {...base,action:'pay',reason:'Approved with passing evidence and a verified recipient'};
}
