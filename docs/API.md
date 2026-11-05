# API specification — current starter

Base local: `http://localhost:4000`. Routes tagged **implemented** are present in code; features listed as future should not be assumed functional.

| Method | Path | Behavior | Auth |
|---|---|---|---|
| GET | `/api/health` | `{ok,network,demoMode}` | No |
| GET | `/api/projects` | Fictional project samples; **public demo only** | No |
| GET | `/api/agent/preview/:projectId` | Pure deterministic hold/review/pay decision; **no payment** | No |
| POST | `/api/payments/checkout` | Creates Velo Testnet checkout when `DEMO_MODE=false`; `{projectId, amountXlm}` | `Bearer ADMIN_API_TOKEN` |
| POST | `/api/webhooks/velo` | Raw signed Velo webhook verifier; currently logs verified receipt but **does not reconcile or mark paid** | Velo signature |
| POST | `/api/milestones/:projectId/:milestoneId/approve` | Approves submitted milestone, runs agent decision and Noir check/authorize when configured | `Bearer ADMIN_API_TOKEN` |

## Current limitations (important)
- These route names and payloads remain the **implemented legacy milestone demonstration**, not the target cutoff/run API. A preview's `pay` decision is not boss approval of a payroll run and must not be treated as compensation advice.
- `POST /api/milestones/:projectId/:milestoneId/approve` is **not a safe owner-approved run endpoint**: it approves a submitted fixture milestone, rather than an immutable cutoff recipient/amount snapshot. An admin bearer token is not employee-scoped access or a durable owner approval record.
- Approval relies on **sample JSON persistence**, does not verify deliverable/GitHub evidence, lacks database transaction locking and merchant wallet onboarding, and is not ready for concurrent payout requests.
- The protected approval workflow reserves a `PENDING_RECONCILIATION` marker before sending; this is not transactional per-item deduplication or an implemented run ledger. Reconcile chain before retry; unknown does not mean failed.
- Merchant wallet still needs its `claim` signature; no claim API is included. Authorization is not a confirmed claim, bank transfer or PHP wage payment.
- Signed Velo webhook verification is implemented, but **deduplication, durable reconciliation and invoice-state updates are not implemented**.
- Client PHP invoice values are independent from selected XLM Testnet checkout amount. Velo collection does not fund Noir escrow or employee bank payouts.
- No Proyekto import/link, bank export/API, cutoff hours review, employee statements/discrepancy access, immutable run approval or recipient-level run reconciliation contract is implemented.

## Required future contracts — capabilities, not finalized routes
Design these separately from the existing routes; no new endpoint names or payloads are promised here:
- Organization/role-scoped source references or imports from Proyekto, with provenance and captured versions; retain Proyekto as the project/task/docs/progress/roadmap/Gantt/invoice system.
- Cutoffs for **1–15** and **16–end-of-month**, hours per employee/project, explicit boss hour review and auditable agreement/rate/adjustment inputs.
- Versioned deliverable evidence and client evaluations: comments, revision requests, acceptance identity/time/version. Milestones group evidence, not default payroll payment units; no invented objective ratings.
- Employee-specific statements explaining reviewed hours, rates, adjustments and totals, plus a discrepancy channel. Enforce employee access to their own compensation only.
- Owner approval/release of an immutable run revision binding each exact recipient, amount, currency/asset and item identity. Any change invalidates that approval and requires reapproval.
- Approved-item-only execution with transactional deduplication and cumulative run reservations, recipient verification/allowlisting, durable submission identity and per-item reconciliation (including partial failure and unknown outcomes). Never blindly retry an uncertain transfer.
- Bank-file export only for a chosen corporate bank's verified supported format and approval workflow; API capability must be verified before design commits. No bank UI/OTP automation or promise of one OTP.
- A separately scoped pre-funded Noir Testnet path: owner device/policy setup, agent check/authorize for the exact approved item, and independently observed merchant claim. Noir policy does not supply a recipient allowlist or cumulative cutoff cap; both remain application requirements.

Client acceptance or client invoice payment must not automatically gate hours-based employee pay. Compensation follows applicable agreements/legal obligations; fixed-fee milestone contracting is a distinct basis. See [software target](SOFTWARE.md) and [integration limits and sources](INTEGRATIONS.md). None of these pending contracts is supplied by reusing the legacy milestone approval route.

## Example local commands
```bash
curl -s http://localhost:4000/api/health
curl -s http://localhost:4000/api/projects
curl -s http://localhost:4000/api/agent/preview/web-001
```

### Optional Testnet checkout — operational example only, not payroll
After credential/network/SDK setup, the existing checkout contract accepts JSON `{ "projectId": "web-001", "amountXlm": "2.5" }` with `Authorization: Bearer ADMIN_API_TOKEN` at `POST /api/payments/checkout`. No payment-execution command is provided here.

Before treating any optional collection as confirmed, persist `paymentIntentId`, verify the raw signed webhook, retrieve final state and deduplicate durable events. Those reconciliation steps are requirements, not currently completed server behavior. Current upstream Velo remains [Testnet only without settlement or an external provider](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope).
