# UI specification / component contracts

Draft visual specimens are available at `/dev/library` when running the web development server. See [Design library](DESIGN_LIBRARY.md) for scope, local interactions and verification limits. They do not change the pending status of the product workflows below.

Custom controls now live in `apps/web/src/components/ui/`: `SnappSelect`, `SnappDatePicker`, `SnappTextField`, `SnappSwitch`, `SnappSlider`, `SnappTabs`, and `SnappToastRegion`. Use their theme provider for portalled menus/calendars. The review/feedback examples validate before local simulated submission; future server endpoints must enforce their own authoritative contracts. See the [Impeccable audit](DESIGN_LIBRARY_AUDIT.md).

## Principles
A practical owner-approved cutoff preparation and payment-transparency UI, connected by references to Proyekto rather than replacing its PM/invoicing features. Preserve manual owner judgment of hours and final release authority. **Visual brand direction is deferred** — see DESIGN.md.

## Target component inventory — pending, not current implementation
Names and locations describe proposed contracts, not working components. All new cutoff, Proyekto import, client evaluation, employee statements, run approval and bank capabilities are pending.

| Component | Target area | Data from | Must handle |
|---|---|---|---|
| `AppShell`/`Nav` | layout | authenticated role | keyboard/mobile; employee sees own compensation only |
| `CutoffRunSummary` | cutoffs | days 1–15 / 16–month-end | preparation, owner review, approval, execution, reconciliation separately |
| `ProyektoReferenceList` | cutoffs/projects | proposed linked/imported references | provenance, unavailable/stale references; no claim of live sync |
| `HoursReview` | cutoffs | employee/project hours and terms | boss's manual judgment, corrections and recorded rationale |
| `OutputEvidenceBundle` | projects | versioned deliverables | actual outputs, source/version, client comments and revisions; milestones as evidence bundles |
| `ClientEvaluation` | client projects | versioned client feedback | acceptance identity/time/version; no invented objective rating |
| `EmployeePayStatement` | employee | approved hours/rates/adjustments | itemized calculation, applicable terms, discrepancy channel, own data only |
| `RunApproval` | cutoffs | immutable recipient + amount snapshot | owner final release, snapshot identity, reapproval after any change |
| `RecipientResults` | payments | execution/reconciliation records | each recipient's success, failure or unknown; partial runs, no blind retry |
| `BankFileExport` | bank | approved snapshot | chosen supported corporate-bank format; export is not settlement; pending |
| `AgentDecisionPanel` | Testnet agent | approved exact item + policy | check eligibility, merchant, asset, amount, expiry, app-side allowlist/run cap |
| `PaymentStatus` | payments | provider/chain evidence | separate submission, authorization, merchant claim and reconciled outcome |
| `ErrorBanner` | feedback | API error | safe action, unknown-outcome reconciliation before retry |

## UI conventions
- Money always carries **currency and asset** (`₱60,000 compensation`, `1.5 testnet XLM demo item`). Never imply parity.
- Client acceptance or invoice payment is not a universal gate for hours-based employee pay. Actual agreement/legal obligations govern; distinguish employment/hourly compensation from fixed-fee milestone contracting.
- Display original and amended statement/agreement versions. A discrepancy must not silently edit an approved snapshot; recipient/amount changes require owner reapproval.
- No agent signing keys in client state. Confirm destructive actions and require owner approval for release.
- Noir authorization and merchant claim are distinct. Unknown outcomes remain unknown until reconciled; a successful redirect is not payment confirmation.
- Company bank export is the recommended path, using the chosen bank's supported format and approval controls. No bank integration exists; APIs require verified capability. No bank UI/OTP automation or one-OTP promise.
- Velo collection is an optional separate client flow, not employee payout or escrow funding. Current upstream SDK scope is Stellar Testnet only, with no Mainnet, settlement or external provider; the repo's alpha declaration is not evidence of an upgrade.
- Responsive: 360 / 768 / 1280 px; no horizontal scrolling in primary data cards. Use `aria-live`, descriptive labels and visible focus.

## Empty/preview/error requirements
`Preview` displays sample/proposed decisions without transactions and must not masquerade as implemented pay-run approval. `Real testnet` requires actual transaction evidence; authorization alone does not prove a merchant claim. At-most-once approved-item execution records and immutable run snapshots are pending, not guarantees of the scaffold. If an API is unavailable, show an error with setup hint; never substitute artificial success.

## Handoff process
JC ([JCarloZ24](https://github.com/JCarloZ24)) owns UI/UX and frontend, including approved design tokens and reusable components; pages consume those components rather than duplicating raw styles. Stobeeney owns API contracts/integration and coordinates page data wiring with JC. Aidantiu owns end-to-end integration and deployment. Founder approves design PRs; visual branding remains on hold until approved. Split UI changes by page when useful to minimize merge conflicts.

## Integration scope references
- [Velo upstream release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope)
- [Noir contract constraints](https://github.com/noirx402/noir/blob/main/docs/contracts.md): per-payment asset/amount/expiry controls, not a merchant allowlist or cumulative cutoff cap; those require pending app-side enforcement.
