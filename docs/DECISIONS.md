# Current product and architecture decisions

## Product boundary: Proyekto-connected cutoff pay runs
Proyekto remains the project/task/document/client-collaboration and invoicing system. Cordera targets cutoff preparation, owner-reviewed hours, employee calculation visibility and approved-payment traceability. The primary pain is one-by-one bank disbursement, not missing invoice generation. Integration access is not yet verified; the source still implements the earlier milestone-oriented starter.

## Human authority and versioned work context
The owner retains manual hours review and final release authority for 1–15 and 16–end-of-month cutoffs. Client comments, revision requests and acceptance attach to specific deliverable versions and support review; no automatic work ratings are required. Client acceptance or invoice collection must not automatically gate hours-based employee compensation. Fixed-fee milestone terms are distinct from employment obligations.

## Exact approved-run execution
Target approval binds reviewed inputs, recipients, exact amounts, currency/asset and total to an immutable run version. Material changes require reapproval. The agent checks eligibility and executes approved items; it cannot set wages or select substitute payees. Transactional item identity, recipient allowlists, cumulative run reservations and individual reconciliation are required, not supplied by Noir policy or implemented by the current milestone endpoint.

## Separate company and hackathon payment paths
For the company, verify existing corporate-bank bulk-disbursement support and prefer its supported file upload before building a custom API. No bank integration, bank-credential handling or OTP automation is implemented or authorized here.

The hackathon remains Stellar Testnet only: owner registers device/policy and funds Noir escrow; agent checks/authorizes an approved demonstration item; merchant separately claims. Velo is an independent optional client-collection flow, not automatic escrow funding or PHP bank payroll. Its upstream SDK scope excludes Mainnet and external settlement. Testnet proof does not establish production wage settlement.

## Monorepo npm workspaces
A single public repository and one install support collaboration and submission. Two deployable apps and two shared packages separate UI, server orchestration, agent rules and shared contracts.

## Safe read-only starter mode
`DEMO_MODE=true` prevents live Velo checkout and Noir authorization. Fictional data only. A fixture preview is not owner approval or payment proof. Authenticated review, approved-run records and employee-scoped visibility remain pending.

## Transactional storage before exposed payment execution
The JSON fixture supports zero-credential demo startup, not concurrent payment safety. Durable transactions, unique obligation/item identities, serialized execution and recoverable per-recipient reconciliation are mandatory before payout-capable multiuser use. Unknown outcomes require reconciliation, not a fresh send with a new nonce.

## Brand identity remains deferred
The owner has not approved Prodigitality brand assets or visual tokens. Use neutral temporary UI until review.

## Unresolved SDK and contract baseline
Use the supplied Nov 5 handbook and official Noir reference as a baseline, but verify resolved SDK settings and the conflict with earlier form IDs before Testnet sends. The repo's Velo alpha declaration is not upgraded by current upstream stable documentation. See [INTEGRATIONS](INTEGRATIONS.md); no live SDK, bank or Proyekto validation is implied.
