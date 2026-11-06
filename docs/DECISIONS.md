# Current product and architecture decisions

## Product boundary: Proyekto-connected cutoff pay runs
Proyekto remains the project/task/document/client-collaboration and invoicing system. Snapp targets cutoff preparation, owner-reviewed hours, employee calculation visibility and approved-payment traceability. The primary pain is one-by-one bank disbursement, not missing invoice generation. Integration access is not yet verified; source provides milestone-oriented fixture previews and independent Velo adapters, plus separate controlled local Noir tooling, not the target payroll workflow.

## Human authority and versioned work context
The owner retains manual hours review and final release authority for 1–15 and 16–end-of-month cutoffs. Client comments, revision requests and acceptance attach to specific deliverable versions and support review; no automatic work ratings are required. Client acceptance or invoice collection must not automatically gate hours-based employee compensation. Fixed-fee milestone terms are distinct from employment obligations.

## Exact approved-run execution
Target approval binds reviewed inputs, recipients, exact amounts, currency/asset and total to an immutable run version. Material changes require reapproval. The agent checks eligibility and executes approved items; it cannot set wages or select substitute payees. Payroll obligation/item identities, cumulative run reservations and individual reconciliation remain requirements. Local signed single-item consent, merchant allowlisting and cumulative-device journal reservations implement only the controlled experiment, not this target.

## Separate company and hackathon payment paths
For the company, verify existing corporate-bank bulk-disbursement support and prefer its supported file upload before building a custom API. No bank integration, bank-credential handling or OTP automation is implemented or authorized here.

The hackathon remains Stellar Testnet only: owner registers device/policy and funds Noir escrow; agent checks/authorizes an approved demonstration item; merchant separately claims. Velo is an independent optional client-collection flow, not automatic escrow funding or PHP bank payroll. Its upstream SDK scope excludes Mainnet and external settlement. Testnet proof does not establish production wage settlement.

## Monorepo npm workspaces
A single public repository and one install support collaboration and submission. Two deployable apps and two shared packages separate UI, server orchestration, agent rules and shared contracts.

## Safe read-only starter mode
`DEMO_MODE=true` prevents live server Velo checkout. HTTP previews never authorize Noir payments, regardless of demo mode; the former milestone approval route is removed (404), without a replacement. Separate local Noir chain writes require explicit CLI live gates and are not controlled by server `DEMO_MODE`. Fictional data only. A fixture preview is not owner approval or payment proof. Authenticated review, approved pay-run records and employee-scoped visibility remain pending.

## Transactional storage before exposed payment execution
The JSON fixture supports zero-credential demo startup, not concurrent payment safety. Durable transactions, unique obligation/item identities, serialized execution and recoverable per-recipient reconciliation are mandatory before payout-capable multiuser use. Unknown outcomes require reconciliation, not a fresh send with a new nonce.

## Brand identity remains deferred
The owner has not approved Prodigitality brand assets or visual tokens. Use neutral temporary UI until review.

## Unresolved contract baseline
Pinned/installed Noir SDK 0.3.0 agrees with source commit `704f701a017b0b13f79898d2597df8c11fd4fa94` and the repository contract table. A public RPC read confirmed the Testnet passphrase. These establish SDK/configuration agreement, **not resolution of the earlier form-ID discrepancy** or organizer/deployment attestation. Independently verify before setting `NOIR_TESTNET_CONTRACTS_CONFIRMED=true` or sending. Velo remains unchanged; current upstream stable documentation does not upgrade its alpha declaration. See [INTEGRATIONS](INTEGRATIONS.md); no live authorization/claim, bank or Proyekto validation is implied.

## Nov 6, 2026 — Controlled local Testnet execution, not a payroll API
Use `npm run noir -- <command>` for `plan`, `doctor`, `approve`, `setup --step device|policy|fund`, `check`, `authorize`, `claim`, `reconcile`, `evidence`. Remove the legacy HTTP milestone approval/Noir execution path entirely, preserving read-only fixtures, shared preview eligibility and separate Velo checkout/webhook behavior. No replacement payout route or compatibility shim.

Constrain the experiment to exact owner-signed single-item manifest/configuration consent, fixed native-XLM Testnet contracts, official Noir SDK operations and independent merchant allowlisting. Owner setup, agent authorization and aggregate merchant claim use separate privately inherited role secrets and explicit per-role consent; never server `.env`, browser, arguments, logs or chat. No automatic key generation/funding, custom contracts or Mainnet. Live writes require `--live`, exact digest confirmation, valid consent, independently justified contract attestation and three distinct manually funded Testnet wallets.

Use one canonical repository-root `.data/noir-testnet.sqlite` journal, independent of cwd. Under a SQLite lock, validate exact approval and cumulative-device budget, prepare/sign, then commit hash/operation/nonce before broadcast. Count prepared/unknown/succeeded authorization reservations. Once recorded, an operation is **irreversible locally**: no reset, retry or replacement nonce, including failed operations. Reconcile the existing identity after uncertainty; NOT_FOUND/timeouts do not release budget. `--db` deliberately selects a journal; copying/deleting journals removes local deduplication protection. This is not a global at-most-once guarantee.

Merchant `claim` collects all pending merchant/token funds with explicit positive pending-stroops confirmation; it is not an item receipt. Keep authorization and claim transaction/event evidence separate. Allow collection of already-authorized funds and read-only reconciliation after expiry.

Installed SDK/source checks, 20 focused Noir tests, real-SDK synthetic-transport hash persistence/timeout-restart smoke, actual CLI consent/evidence/gate checks and read-only `doctor` (`contractsAttested:false`) were exercised. **Live Testnet authorization/claim remains unverified**, and no hackathon proof gate is complete from these checks. Authenticated owner-reviewed hours/cutoff/payroll, RBAC, Proyekto, bank integration and safe revoke/defund/unlink automation remain outside this change.

Verification also exercised all 21 workspace tests, scaffold checks, agent typecheck, web production build and actual server/browser preview. Root typecheck/server build exposed the unchanged Velo webhook payload type mismatch (`apps/server/src/payments.ts:6`, `Buffer` versus expected `string`); preserve the agreed Noir-only dependency scope rather than silently changing Velo.

## Nov 6, 2026 — Snapp Autopilot: Jev as Payout Risk & Review Agent, rules as Payment Eligibility Engine
Requirement #1 of the handbook needs the agent, not a human click, to decide the payment. The owner keeps deciding recipient and amount (signed manifest); the agent decides whether and when that exact item executes. Deterministic code owns every financial condition (approval validity, binding, `evaluateMilestone`, payout date, chain readiness, allowlist, budget). Jev through the Vercel AI SDK `experimental_decide` (`ai@7.0.163`; direct `@ai-sdk/typesafe-ai@3.0.34` pinned to `jev-1.14.0`, not the moving `jev-latest` alias, or AI Gateway `typesafe-ai/jev` as fallback because TypeSafe sign-ups are waitlisted) is consulted last and only reads the deliverable title, acceptance criteria and review text; it answers structured questions and can only move a verdict to `DEFER` or `ESCALATE`. Thresholds sit on the probability of the acted-on option per TypeSafe guidance and are untuned starting points. Jev unavailable, unauthenticated or malformed → `DEFER`, never pay and never escalate on an outage. No LLM judges hours, wages or recipients. Verdicts are append-only in the journal. The runner lives in the CLI (`assess`, `autopilot --every`) because the HTTP payout path was deliberately removed; a server job or web queue would require authentication first. Emergency stop: `SNAPP_AUTOPILOT_DISABLED=true`.
