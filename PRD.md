# Cordera — Product Requirements Document (PRD)

**Agentic Work Verification & Payment Orchestration**

**Product:** Cordera by Prodigitality · **Stage:** Product direction with an existing hackathon starter · **Date:** 2026-11-05 · **Payment implementation boundary:** Stellar Testnet only.

## 1. Executive summary
Cordera is a **Proyekto-connected, owner-approved cutoff pay-run and payment-transparency layer** for a small digital services company. It connects reviewed hours, agreed compensation, actual deliverables, client feedback, employee-visible calculations, and payment records. It does not replace Proyekto's project management or invoicing.

The owner retains manual review of hours and final release authority. Software prepares the cutoff, explains each employee's calculation, and executes only the exact recipients and amounts the owner approved. The primary operational problem is repetitive employee-by-employee bank transfers—not a lack of invoice generation or an autonomous judge of work quality.

For the company, the recommended disbursement path is a supported corporate-bank bulk-upload facility, subject to bank verification; no bank integration exists in this starter. For the hackathon, Noir demonstrates constrained delegated payments on Stellar Testnet. Velo is a separate client-collection integration, not a PHP payroll rail or an automatic source of Noir escrow funds.

## 2. Observed company workflow and problems
The company already uses **Proyekto** for shared project progress, documents, roadmaps, Gantt charts and invoicing across clients, the consultant/owner and developers/commissioners.

Current pay workflow:
1. Set the cutoff: **1–15 or 16–end-of-month**.
2. The owner reviews hours per employee and project.
3. The owner opens the bank, copies each employee's account details and calculated pay, sends the transfer, and completes the bank's authorization steps.
4. Repeat for every employee.

Problems to solve:
- **Primary:** repetitive disbursement and recipient/amount re-entry concentrate execution work on the owner.
- **Employee visibility:** no clear way to reconcile money received against approved hours, applicable rates and adjustments.
- **Owner visibility:** hours and task labels do not consolidate actual outputs, client comments, revision requests or acceptance.

Constraint: **do not automate away the owner's review of hours**. Client evaluation supports that review; it does not replace it.

## 3. Primary users and permissions (target, not yet implemented)
| Role | Responsibility | Target access |
| --- | --- | --- |
| Owner / consultant | Review hours and work context, resolve discrepancies, approve exact pay runs and control funding | Own company compensation, run approval, payment results and audit |
| Operations / preparer | Prepare cutoff records and supporting evidence without unapproved fund release | Authorized preparation scope; no implicit signing authority |
| Developer / employee | Check agreed terms, submitted/approved hours, calculation and receipt; raise discrepancies | Own compensation and assigned work only; not company margins or coworkers' pay |
| Client | Evaluate the submitted version of a deliverable, comment, request revisions or accept | Own project deliverables and client-facing records; no employee payroll |
| Payment agent | Check approved items and execute eligible Testnet payments under limits | Server-held delegated key; cannot approve hours, set wages or change approved recipients/amounts |

The current starter uses **fictional demo data and no user authentication** on read-only screens. Never load actual customer or payroll data into it. The Proyekto connection and role-specific workflows are not implemented.

## 4. Product boundaries
### Proyekto remains the work and client-collaboration system
Reuse project, task, document, invoice and identity references rather than creating a competing project workspace. The connection method and permissions must be verified against Proyekto before implementation; this repository does not establish an available API or live sync.

Milestones can group completed tasks, deliverables and evaluations into an evidence bundle. **A milestone is not the default unit of semi-monthly employee pay.** Hours may span multiple tasks, projects and milestones within a cutoff.

### Client evaluation is context, not an automatic wage gate
Record evidence and client feedback against a specific deliverable version, with evaluator identity and time. Revised work requires evaluation of its own version; old acceptance must not silently carry forward.

For hours-based employees, client silence, requested revisions or an unpaid client invoice must not automatically withhold compensation owed under the actual agreement and applicable law. Fixed-fee milestone contracting can have different explicit release conditions; do not silently impose those conditions on employment. Numerical quality ratings and autonomous subjective acceptance are not required.

### Payment preparation is separate from payment execution
An employee statement explains the amount; it is not proof of transfer. Owner approval binds an exact run version, recipient set, amounts and currency/asset. A change to those values invalidates approval and requires reapproval. Bank execution, Testnet authorization, recipient claim and client collection have distinct statuses.

## 5. User stories and acceptance criteria
All unchecked items below are target behavior, not current implementation claims.

### US-01 — Prepare a cutoff from Proyekto context (P0)
**As** the owner or preparer, **I want** one employee-by-project view for a pay period.
- [ ] Support 1–15 and 16–end-of-month periods with explicit timezone and inclusion rules, including February and month-end boundaries.
- [ ] Link source time records, projects, tasks, deliverable versions and client evaluations with provenance; do not invent imported records.
- [ ] Distinguish submitted hours, owner-approved hours, non-payable entries with reasons, and unresolved questions.
- [ ] Flag missing context for review without silently changing compensation.

### US-02 — Retain owner review and compensation terms (P0)
**As** the owner, **I want** to review hours manually with useful output evidence.
- [ ] Show agreed rate/compensation basis and effective version before calculating pay.
- [ ] Only an authenticated authorized reviewer can approve hours; preserve who approved what and when.
- [ ] Preserve original submissions and reasoned adjustments; do not rewrite signed terms or approval history.
- [ ] Distinguish hourly employment, fixed compensation and explicitly agreed fixed-fee milestone arrangements.

### US-03 — Record versioned client evaluation (P0)
**As** a client, **I want** to comment on, request revisions to, or accept a specific deliverable.
- [ ] Retain deliverable reference/version, evidence, comments, revision history, evaluation state, evaluator and timestamp.
- [ ] Show the actual output, not just a completed-task label or an unchecked `passed=true`.
- [ ] Verify evidence sources where possible and distinguish independently verified evidence from human statements.
- [ ] Keep client evaluation separate from owner hours approval and pay-run release.

### US-04 — Explain employee pay and discrepancies (P0)
**As** an employee, **I want** to check how my cutoff pay was calculated and reconcile the receipt.
- [ ] Show cutoff, submitted/approved hours per project, applicable rate versions, itemized adjustments with reasons, and expected amount.
- [ ] Use integer minor units or exact decimal arithmetic with explicit rounding; never floating-point currency math.
- [ ] Offer a discrepancy channel and preserve correction history. Material changes require recalculation and reapproval.
- [ ] Show only the employee's own statement, transfer state and reference; separate expected, submitted and confirmed amounts.

### US-05 — Approve and execute an exact pay run (P0)
**As** the owner, **I want** to authorize a fixed set of reviewed payments without re-entering each recipient and amount.
- [ ] Approval binds run version, reviewed inputs, verified recipient identifiers, exact amounts, currency/asset and total.
- [ ] Any material change invalidates approval; the agent cannot choose a different wage, substitute a recipient or expand the run.
- [ ] Persist unique payout-item identity and execution reservation transactionally before submitting; prevent duplicate or overlapping payment of the same obligation.
- [ ] Enforce recipient allowlist, per-item limits, approved-run total and remaining budget, policy expiry and available funds.
- [ ] Reconcile each item independently. A partial failure does not authorize replaying successful or uncertain items.
- [ ] Freeze disputed/changed items for human resolution without automatically blocking unrelated approved compensation.

### US-06 — Reduce bank-transfer repetition (company path, not implemented)
**As** the owner, **I want** a supported bulk-disbursement process for approved bank payments.
- [ ] Verify the company's chosen bank facility, supported recipients, upload format, enrollment, fees, schedules and approval requirements.
- [ ] Generate only the supported bank file from a frozen approved run; protect bank details and prevent duplicate export from becoming duplicate payout.
- [ ] Preserve bank-native authorization. Do not automate the bank UI or OTP entry, store online-banking credentials, or promise one OTP for a batch.
- [ ] Import or record bank results and references per employee, including rejected, pending and uncertain transfers.
- [ ] Use an API only after provider access and capabilities are verified. This path is outside the Testnet hackathon implementation.

### US-07 — Demonstrate delegated Testnet execution (P0, hackathon gate)
- [ ] Owner signs real Noir SDK `registerDevice`, `registerAgent` and `fundEscrow` calls using free Testnet assets.
- [ ] Owner approves exact Testnet recipient/amount items separately from any PHP accounting values; no implicit FX.
- [ ] Agent validates the approved item and app-side limits, then calls `checkPayment` before `authorizePayment`.
- [ ] Merchant signs `claim`; store and display authorization and claim transactions separately with genuine explorer links.
- [ ] Negative cases cover missing owner approval, changed run, wrong recipient/asset, expired policy, per-item/run limits, missing funds, duplicate and uncertain execution.
- [ ] Use durable transactional storage and authenticated approval before exposing payment execution beyond an isolated controlled experiment.

### US-08 — Keep optional client collections separate (hackathon integration)
- [ ] Velo Testnet checkout is linked to the relevant client invoice without recreating Proyekto invoicing.
- [ ] Verify raw-body signed webhooks, dedupe events and retrieve/reconcile the intent before confirming an invoice.
- [ ] A redirect is not receipt proof. A confirmed collection neither funds Noir escrow automatically nor determines employee wage eligibility.
- [ ] Do not claim PHP bank payout, Mainnet or external settlement capability from this integration.

## 6. Target lifecycles and audit
- **Deliverable version:** submitted → revision_requested | accepted; a revision creates a new version and retains earlier evaluations.
- **Hours review:** submitted → under_review → approved | correction_required; retain original and adjusted entries.
- **Pay run:** draft → under_review → approved → executing → reconciled | partially_reconciled. Changes supersede the approved version and require a fresh approval; approval alone is not payment.
- **Bank payout item:** ready → submitted → confirmed | failed | unknown. Reconcile unknown outcomes before any new send.
- **Noir payout item:** ready → authorization_submitted → authorized → claim_pending → claimed; unknown submission or claim outcomes require reconciliation.
- **Employee discrepancy:** open → under_review → resolved, with explanation and linked adjustment or retained calculation.
- **Client invoice:** issued → awaiting_payment → confirmed | canceled | expired | disputed, independent of pay-run state.

Retain source record versions, agreements, hours decisions, evaluations, calculations, approval snapshots, execution attempts, agent decisions and provider references. A fresh Noir nonce is not a business-level duplicate-payment safeguard.

## 7. Existing starter versus target
The existing milestone-oriented starter has not been migrated by this product specification:
- Sample project, invoice and developer views with fictional agreements/milestones.
- A deterministic dry-run engine that can return `hold`, `human_review` or `pay`; a preview is not a release approval or transfer.
- Velo checkout/signature-verification adapters and a protected legacy milestone-approval/Noir trigger.
- A Noir `checkPayment`/`authorizePayment` adapter; SDK compatibility and live proof remain unverified.

Missing: cutoff and reviewed-hours models, Proyekto connection, client-evaluation history, employee calculation/discrepancy views, immutable approved runs, run-budget enforcement, bank payout support, durable reconciliation, authentication/RBAC, complete owner setup and merchant claim flow. See [API](docs/API.md) for current routes. **Do not use the legacy milestone endpoint as if it implements the target pay-run contract.**

## 8. Priorities and definition of done
**P0 product demonstration:** cutoff preparation, linked work/client-feedback context, manual owner hours review, employee-visible breakdown, exact run approval, authenticated and durable execution safeguards, and per-recipient reconciliation.

**P0 hackathon evidence:** deployed web, public repository, real Noir owner setup → approved Testnet item → check/authorize → merchant claim, genuine Stellar Expert links, separate Velo checkout/signed-event evidence, and a 2-minute video. Do not stage invoice payment as automatic payroll funding or replace owner review with an agent.

**Company adoption path:** verify existing bank bulk-disbursement support first; pair a supported bank-file export with Proyekto-linked preparation and employee transparency. Production payroll compliance and bank execution are not claimed by the hackathon.

**Later:** broader provider integrations, reporting and notifications only after the core workflow is validated. No duplicate project-management, Gantt, CRM or invoicing rebuild.

Complete means the actual source implements the stated demonstration, required URLs and transaction proof exist, and the [checklist](docs/CHECKLIST.md) reflects exercised behavior. This document alone does not complete those features.

## 9. Alternatives, differentiation and unresolved prerequisites
- Bulk payroll is not new: [BPI BizLink](https://www.bpi.com.ph/institutional-banking/cashflow-management/bizlink) documents transaction-file upload and approval controls; [Sprout Payroll](https://sprout.ph/product/payroll-management/) documents timekeeping integration, employee payslips and bank-disbursement file generation. Company suitability and commercial terms are not verified.
- Differentiation to validate: **Proyekto work and versioned client feedback → owner-reviewed hours → employee-visible calculation → approved and reconciled payment**. It may fit best as a Proyekto module rather than a separate product.
- Verify Proyekto's integration access, compensation arrangements and the company's bank facility before fixing those contracts.
- [Velo's upstream SDK scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope) is Testnet only, without Mainnet or external settlement support. Noir is not a bank payout service.
- Noir enforces asset, per-payment cap and expiry, not recipient allowlists or cumulative cutoff budgets; those need app-side enforcement.
- Brand design remains **on hold** pending approved Prodigitality assets.
- Server-side agent signing uses the official Noir SDK; owner, agent and merchant use separate funded Testnet accounts. Never reuse production keys.
- Contract IDs differ between the earlier form and handbook/repository references. Verification remains unresolved; see [INTEGRATIONS](docs/INTEGRATIONS.md).

Out of scope for this hackathon: real money or customer/payroll data, PHP-to-XLM conversion, bank/GCash execution, Philippine payroll/tax compliance, legal escrow guarantees, autonomous subjective acceptance, automatic work ratings and production deployment claims.
