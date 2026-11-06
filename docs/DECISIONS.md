# Current product and architecture decisions

## Product boundary: Proyekto-connected cutoff pay runs
Proyekto remains the project/task/document/client-collaboration and invoicing system. Snapp targets cutoff preparation, owner-reviewed hours, employee calculation visibility and approved-payment traceability. The primary pain is one-by-one bank disbursement, not missing invoice generation. Integration access is not yet verified; the source still implements the earlier milestone-oriented starter.

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
# Design library review surface — 2026-11-06

Implement the user-requested Snapp v0.2 brand exploration as an isolated development-only `/dev/library` route. Preserve neutral product styling pending company approval. Use CSS 3D for the three interactive spatial studies, with no WebGL dependency; keep money and approval controls in HTML. All workflow states are fictional local specimens. See [DESIGN_LIBRARY.md](DESIGN_LIBRARY.md) for verification and remaining review.

## Custom-control hardening — 2026-11-06

Use Snapp-authored visual controls over unstyled React Aria behavior primitives for accessible dropdowns, calendar/date input, switches and sliders. Share runtime/export theme maps, keep field validity neutral (teal is only settlement), preserve over-limit text and validate local submissions explicitly. Impeccable's audit/harden/polish guidance and source/rendered detector informed the refinement; preserve required Geist typography and unconfirmed hatching despite generic detector warnings. See [audit evidence and remaining release checks](DESIGN_LIBRARY_AUDIT.md). No server/payment safeguards are implied by client specimen validation.


### Loading logo motion exception (2026-11-06)

The owner explicitly requested repeating logo-derived figures for loading. The dev library loader may loop the original two arcs through infinity-like linked and open-orbit poses while pending, overriding the draft brand no-loop rule for this loading specimen only. The static logo artwork and one-shot motion sting remain unchanged. Reduced motion renders the original static Slip S; resolution/failure unmounts the loop immediately. CSS transforms only, six-second sequence, no extra motion dependency or per-frame React updates.


### Report outcome colors (2026-11-06)

Per owner direction, the draft library extends Volt into a report-positive alias for explicitly passed completeness checks, paired with Red for failed checks requiring correction and Amber for pending checks. Text/icons distinguish these from owner actions. Teal remains exclusive to confirmed settlement. Hours, headcount and proposed money are neutral quantities, not automatically positive when increasing. Fixture outcomes are illustrative; they neither approve hours nor authorize payment.


### Recorded logo snap and sound library (2026-11-06)

Owner feedback supersedes the draft synthesis-only direction for the library logo: use Vinrax's CC0 real finger snap, with local provenance and original asset, as the default. Keep the synthetic version explicitly identified as fallback/comparison. The recording is decoded before starting the logo and scheduled at its 310 ms release, without added synthesis/reverb. Audio remains opt-in, cancellable, and silent for loading loops and data updates. Sound values and asset metadata are exported from `apps/web/src/lib/soundTokens.ts` and downloadable from the library. No payment state is inferred from playing audio.
