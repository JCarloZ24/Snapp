# Application pages and routes

## Current scaffold routes
These are existing scaffold descriptions, not implemented cutoff or payroll capabilities.

| URL | Audience | Scaffold purpose | Current status |
|---|---|---|---|
| `/` | Admin demo | Topline contracts, developer allocation, project list | Implemented read-only |
| `/projects` | Admin demo | Project list and quick status | Implemented read-only |
| `/projects/:id` | Admin demo | Milestones, dates, acceptance evidence, agent preview | Implemented preview |
| `/invoices` | Admin demo | Invoice snapshots and values | Implemented sample list |
| `/developers` | Admin demo | Assigned deliverables and payment terms | Implemented sample list |
| `/agent` | Admin | Authorizations, caps, decisions, receipts | Placeholder |
| `/settings` | Admin | Account/network/Noir extension/Velo keys (status only) | Placeholder |
| `/checkout/success` | Client | Payment submitted acknowledgment, *not* paid confirmation | Placeholder |
| `/checkout/cancel` | Client | Canceled checkout | Placeholder |

## Target routes (all pending; require authentication and role scoping)
Snapp connects payment preparation and transparency to Proyekto; it does not replace Proyekto projects, tasks, docs, progress, roadmaps, Gantt or invoicing. Reference linking/import is proposed, not a verified live integration.

| URL | Target role | Required target behavior (not implemented) |
|---|---|---|
| `/admin/cutoffs` | Owner | Runs for days 1–15 and 16–end-of-month; employee/project hours, outputs and client feedback |
| `/admin/cutoffs/:id` | Owner | Manually review hours and applicable compensation terms; inspect discrepancies; approve exact immutable recipient + amount snapshot |
| `/admin/cutoffs/:id/results` | Owner | Per-recipient execution/reconciliation; partial failures and unknown results; no blind retry |
| `/employee/me/statements` | Employee | Own hours, rates, adjustments, calculation and payment results only; discrepancy channel |
| `/client/projects/:id` | Client | Versioned deliverables, comments, revision requests and acceptance identity/time/version; no employee compensation |
| `/admin/agreements/:id` | Owner | Versioned hourly/employment or fixed-fee contracting terms, separately identified |
| `/admin/bank-exports/:id` | Owner | Pending chosen supported corporate-bank file format, approved snapshot linkage and recipient reconciliation |
| `/admin/audit` | Owner | Approval history, exact-item execution records and reconciliation; separately labeled Noir Testnet and optional Velo collection records |
| `/settings` | Owner | Proposed Proyekto reference configuration and separately scoped bank/Noir settings; no existing integration implied |

## Navigation and authority
- The boss retains manual hours judgment and final release authority. An agent checks execution eligibility against an already approved item; it does not determine wages.
- Milestones bundle output evidence, not the default employee payroll unit. Client acceptance and client invoice payment do not universally gate hours-based pay; actual agreements and legal obligations govern.
- Every recipient/amount change invalidates the prior approval and requires reapproval. Execute only approved items; retain per-recipient at-most-once records and reconcile unknown outcomes before any retry. These controls remain pending.
- Keep preparation, owner approval, execution and reconciliation visibly distinct. Do not collapse bank submission or Noir authorization into receipt of funds.
- Show explicit currency/asset and Testnet labels. Noir merchant claim is separate from authorization. Velo is optional client collection, not payroll payout or an escrow-funding bridge.
- Recommended company path: export a chosen supported corporate-bank file, then use that bank's approval controls. Bank API integration is conditional on verified provider capability; no bank integration exists. Never automate bank UI/OTP or promise one OTP.
- Employee views expose only their own compensation; client views exclude employee compensation and company margin.

## Missing-page contract
All target routes and new cutoff, Proyekto, client-evaluation, pay-statement, approval and bank capabilities above are pending. Incomplete pages must say `Not implemented`, with no working-looking action or fabricated payout confirmation. Existing preview routes must remain labeled preview/sample rather than being relabeled as working pay-run screens.
