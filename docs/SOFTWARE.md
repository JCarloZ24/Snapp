# Software specification

## Scope and implementation boundary
Snapp's target is a Proyekto-connected, owner-approved cutoff pay-run and payment-transparency layer, not a replacement project-management or invoicing system. Proyekto references/import, cutoff review, employee statements, immutable approved pay runs and payroll-item reconciliation are **not implemented**. Current source retains fictional milestone previews and Velo adapters and adds separate controlled **local Noir Testnet tooling**; local single-item consent is not an authenticated payroll workflow. The former HTTP milestone approval route is removed (404), without a replacement.

Company cutoffs are **1–15** and **16–end-of-month**. The boss retains manual judgment over hours per employee/project and final release authority. Primary value is avoiding repeated recipient/amount copying and separately authorized bank transfers, while making compensation explainable and consolidating actual outputs/client feedback beyond task labels.

## Stack and why
| Layer | Choice | Responsibility |
| --- | --- | --- |
| Web | React 18 + TypeScript + Vite | Client/developer/admin UI, no signer secrets |
| UI | Tailwind CSS 3 + neutral temporary CSS | JC owns UI/UX/frontend and proposes brand tokens for approval; visual branding remains on hold |
| Server | Node.js 22.23.4+ + Express 4 + TypeScript/tsx | HTTP API, Velo webhook, authentication boundary |
| Business rules / local execution | `packages/agent` TypeScript | Unchanged deterministic preview eligibility plus local Noir consent/setup/authorize/claim/reconcile CLI |
| Shared models | `packages/shared` TypeScript | Types and response contracts, no credentials |
| Payments | `@noirx402/agent-sdk@0.3.0`, `@stellar/stellar-sdk@16.0.1`, `@carts1024/velo-sdk@alpha` | Fixed native-XLM Testnet Noir configuration; official SDK operations only; Velo unchanged |
| Persistence | Read-only JSON fixtures; repository-root `.data/noir-testnet.sqlite` local experiment journal | SQLite serializes exact consent/transaction reservations; no multiuser payroll database or cross-journal deduplication |
| Hosting | Static Vite host + persistent Node host | Required publicly reachable web and webhook server |
| Package management | npm workspaces | Single install, separate packages and ownership |

**Runtime:** Noir handbook requires Node `^22.23.4`, `^24.22.1` or `>=26.12.1`. Installation succeeded on Node 22.23.4 and generated a lockfile; installed Noir 0.3.0/Stellar 16.0.1 were checked against the pinned SDK source. Velo remains declared `"alpha"`, without an upgrade or live validation. Current [Velo upstream release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope) describes stable `1.0.0`, but still Stellar Testnet only, without Mainnet, settlement or an external payment provider.

## Nonfunctional requirements
- Testnet only. Fail closed if secrets, device hash, recipient verification, policy, or data are absent.
- All monetary blockchain inputs are **decimal strings** converted with Noir `toStroops`; no JS floats for on-chain amounts.
- No browser exposure of API keys, signing keys, webhook secrets or ADMIN_API_TOKEN.
- HTTPS required for live, signed webhook verification over raw unparsed request bodies, idempotency in storage.
- Before payout-capable multiuser use, implement a transactional payroll database, immutable approved-run revisions, unique obligation/item identities, atomic run reservations, durable events, authentication/RBAC and payroll reconciliation. The implemented local SQLite experiment journal is not that system.
- Bind approval to exact recipient, amount, asset/currency, cutoff and run revision; any change requires owner reapproval. Execute only approved items and enforce recipient allowlisting plus cumulative run limits app-side: Noir's per-payment cap/asset/expiry policy does not provide either constraint.
- Persist individual recipient results, including partial failure and unknown outcomes; reconcile before retry, never blindly resend. Separate Noir authorization from merchant claim confirmation.
- Employee access is restricted to their own compensation/statement/discrepancies; public fixture APIs are not an employee authorization model.
- Preserve human dispute resolution, neutral temporary branding and Testnet-only demonstrations. Testnet authorization does not deliver PHP to bank accounts.

## Environment and local execution ownership
`apps/server/.env` contains Velo/admin server configuration; `apps/web` receives only non-secret public configuration. Noir uses inherited private **role-specific local shells**, never auto-loads server `.env`, and reads only the owner/agent/merchant secret required by the command. No secrets in arguments, chat, browser, logs or commits. See [SETUP](../SETUP.md) and `packages/agent/.env.example`. Snapp retains the internal root package name `agentpay`, `@agentpay/*` workspace identifiers and existing directory paths; these are technical identifiers, not the product display name.

Root entry point: `npm run noir -- <command>`, with `plan`, `doctor`, `approve`, `setup --step device|policy|fund`, `check`, `authorize`, `claim`, `reconcile`, `evidence`. Owner signs exact single-item manifest/configuration bytes; live commands require `--live`, exact digest confirmation, valid approval, verified merchant allowlisting, separate manually funded Testnet roles and independent contract attestation. SDK/repository agreement and read-only network checks do not resolve the earlier form-ID discrepancy.

Canonical SQLite journal: repository-root `.data/noir-testnet.sqlite` independent of cwd; `--db` explicitly selects a different journal. Persist transaction hash/operation/nonce under lock before broadcast and reserve prepared/unknown/succeeded authorizations against the cumulative-device budget. There is no retry/reset/replacement nonce for any recorded operation, including failed ones, and no deduplication guarantee after journal copies/deletion. Merchant `claim --pending-stroops` confirms the positive aggregate to collect all merchant/token pending funds, not one item receipt. Reconciliation/evidence distinguish recorded identity, confirmed transaction and matching events; already-authorized collection remains available after expiry.

**Exercised evidence:** 20 focused Noir tests, all 21 workspace tests, scaffold checks, agent typecheck, actual CLI/SDK persistence smoke, read-only Testnet configuration checks and real server/browser preview. Web build passed. Root typecheck/server build are blocked by the unchanged Velo webhook `Buffer`-versus-`string` mismatch at `apps/server/src/payments.ts:6`; no Velo upgrade/workaround was made. Live authorization/claim and deployment remain unverified; see [verification details](CHECKLIST.md#exercised-controlled-tooling-checks--not-live-gates).

## Target domain entities — pending design, not current shared types
| Entity | Required information / boundary |
|---|---|
| OrganizationUser | organization, role, owner authority, employee identity and compensation visibility |
| ProyektoReference | source project/task/document/roadmap identifiers or import references, provenance and captured version/time; no live integration assumed |
| CompensationAgreement | employee, project allocation, hourly/employment or fixed-fee contracting basis, effective rates/currency, applicable terms and obligations |
| Cutoff | organization, local period dates (1–15 or 16–month-end), preparation/review status |
| HourReview | employee/project/cutoff, submitted hours, boss-reviewed hours, reviewer/time, explanation and agreement reference |
| DeliverableEvidence | actual output/reference, version, author and captured time; milestones group this evidence, not default payroll payment units |
| ClientEvaluation | evidence version, comments, revision requests, acceptance identity/time/version; no invented objective rating |
| EmployeeStatement | employee/cutoff, reviewed hours × applicable rates, allocations, adjustments with reasons, total and discrepancy channel/history |
| PayRun | cutoff, immutable approved revision/hash, owner identity/time, currency/asset totals and release authority |
| PayRunItem | employee, statement revision, exact verified recipient and amount/currency or Testnet asset, approval binding and unique execution identity |
| ItemReconciliation | item/attempt identity, reserved/submitted/unknown/failed/confirmed observations, provider references, timestamps and evidence; aggregate run may be partial |
| NoirAuthorization / Claim | approved item reference, device/agent/merchant/asset/amount, authorization transaction and separately observed merchant claim |
| OptionalClientCollection | existing invoice reference, Velo intent, Testnet asset/decimal amount, verified events and reconciliation; separate from employee payout |
| EventInbox / AuditRecord | unique provider event identity, payload hash, processing status and immutable review/approval/execution history |

### Required target workflow
1. Link/import Proyekto references; prepare cutoff hours alongside versioned outputs and client feedback. Proyekto remains the system for projects, tasks, docs, progress, roadmaps/Gantt and invoicing.
2. Boss reviews hours per project/employee. Produce each employee's calculation statement and discrepancy channel before release.
3. Boss approves the exact immutable run recipient/amount snapshot; changed hours, adjustments, recipients or amounts create a revision requiring reapproval.
4. Execute only approved items through a verified supported bank-file workflow for company use, or a separately scoped pre-funded Noir Testnet demo. Bank/API connectivity is not implemented.
5. Reconcile every recipient individually; show partial results and hold unknown outcomes for investigation. Noir merchants claim separately after authorization.

Client acceptance and invoice collection are evidence/context, **not automatic gates for hours-based employee compensation**. The actual agreement and legal obligations govern pay. Fixed-fee milestone contracts require their own agreed terms; do not apply them implicitly to employment/hourly pay.

## Quality gates
`npm run typecheck`, `npm test`, `npm run build`, `npm run smoke` after dev start. CI performs typecheck/tests/build. Test money movement on real Testnet only after setup; no mocks presented as explorer proofs.
