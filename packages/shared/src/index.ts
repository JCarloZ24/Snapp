export type MilestoneStatus = 'planned' | 'submitted' | 'approved' | 'disputed' | 'paid';
export interface Milestone {id:string;title:string;assignee:string;merchantAddress:string|null;dueDate:string;status:MilestoneStatus;acceptanceCriteria:string[];evidence:{type:'pr'|'deployment'|'test'|'manual';url:string;passed:boolean}[];testnetAmountXlm:string;paymentHash?:string;}
export interface Project {id:string;title:string;clientName:string;status:'draft'|'active'|'complete';clientAmountPhp:number;developerBudgetPhp:number;milestones:Milestone[];}
export interface AgentDecision { milestoneId:string;action:'pay'|'hold'|'human_review';reason:string;merchantAddress:string|null;amountXlm:string;}
export interface InvoiceCheckoutRequest {projectId:string; amountXlm:string;}
