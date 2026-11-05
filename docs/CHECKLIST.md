# Overall build and submission checklist

Legend: `[x]` starter exists; `[ ]` still needs a teammate to complete and validate. A checked item does **not** mean it was tested against live SDKs.

## A. Foundations — founder / all
- [x] Public-repo-ready monorepo skeleton, separate web/server/agent/shared
- [x] Root README with mandatory hackathon section order
- [x] PRD, setup, software, architecture, design placeholder, pages, UI, API and team guide
- [x] Sample React dashboard; Express health and project/preview endpoints
- [x] Noir decision module, sample test, starter SDK adapter
- [x] Velo server checkout and signature verification adapters
- [ ] Install from clean machine with supported Node and capture lockfile
- [ ] Green CI build/test after official SDK installation
- [ ] GitHub public repo created and pushed (owner + URL)

## B. Priority product workflow — pending, owner / domain / UX
All new cutoff, Proyekto, client-evaluation, statement, approval and bank capabilities below are unimplemented targets. Existing sample pages and adapters are not proof of this workflow.
- [ ] Prepare company cutoffs for days 1–15 and 16–end-of-month
- [ ] Link/import Proyekto references with provenance; verify integration rather than replacing its existing projects/tasks/docs/progress/roadmaps/Gantt/invoicing
- [ ] Consolidate employee/project hours, actual outputs and versioned client feedback for boss review
- [ ] Preserve boss's manual hours judgment and final release authority; agent must not determine wages
- [ ] Distinguish employment/hourly terms from fixed-fee milestone contracting; actual agreement/legal obligations govern, not universal client acceptance or invoice-payment gates
- [ ] Provide employee-specific hours/rates/adjustments/calculation statements and a discrepancy channel; enforce own-compensation-only access
- [ ] Owner approves immutable exact recipient + amount run snapshot; every change requires reapproval
- [ ] Execute only approved items with durable at-most-once payout records, not milestone-only deduplication
- [ ] Reconcile every recipient individually, including partial failures and unknown outcomes; investigate before retry, never blindly resubmit
- [ ] Record client deliverable version, comments, revision requests and acceptance identity/time/version; do not invent objective ratings

## C. UX and persistence — pending
- [ ] Wireframes/components/routes for the priority workflow; current scaffold previews remain explicitly labeled
- [ ] Founder approves Prodigitality brand tokens/design (currently on hold); retain neutral grayscale until approved
- [ ] Real transactional database/migrations and login/RBAC for owner, employee and client
- [ ] Versioned compensation terms, calculations, approval snapshots, discrepancies and audit records
- [ ] Connect UI to validated API with loading/empty/error states; no fabricated successful states
- [ ] Responsive/mobile/accessibility verification and genuine transaction evidence display

## D. Company bank path — recommended, entirely pending
- [ ] Select a corporate bank and verify its supported transaction-file format, recipient fields, limits and approval controls
- [ ] Export exact approved recipients/amounts in that supported format to reduce recipient-by-recipient copy/paste
- [ ] Preserve bank approval controls and reconcile individual recipient results; export/upload is not settlement
- [ ] Consider API integration only after verifying the provider's actual capability; no bank integration currently exists
- [ ] Do not automate bank UI/OTP or promise one OTP
- Existing solutions already address parts of this: [BPI BizLink transaction-file upload and approvals](https://www.bpi.com.ph/institutional-banking/cashflow-management/bizlink), [Sprout payslips/timekeeping/bank files](https://sprout.ph/product/payroll-management/). Differentiate through Proyekto-linked traceability and approved-run transparency, not invented payroll functionality.

## E. Hackathon Noir Testnet path — pending proof
- [ ] Confirm official Noir SDK Testnet contract IDs/network guidance; use Noir SDK only
- [ ] Install supported Node and verify exact SDK declarations/installed versions; do not silently describe a dependency upgrade
- [ ] Fund owner, agent and merchant Testnet accounts; pre-fund escrow separately from client collections
- [ ] Owner completes SDK device/agent registration and policy setup, then `fundEscrow`
- [ ] Verify recipient wallet ownership and implement app-side merchant allowlist and cumulative cutoff cap: Noir per-payment asset/amount/expiry caps do not provide these
- [ ] Persist owner-approved exact-item snapshots and serialized at-most-once execution records before enabling automated execution
- [ ] Agent checks approved exact recipient/asset/amount and policy eligibility, then SDK `checkPayment` → `authorizePayment`; no wage determination
- [ ] Merchant separately calls `claim`; retain actual authorization and claim transaction evidence
- [ ] Negative cases: changed/unapproved item, wrong merchant/asset, exceeded per-payment/run cap, expired policy, duplicate, missing evidence and unknown outcome
- [ ] Attach genuine Stellar Expert Testnet proof; do not claim Mainnet, bank payout or production settlement

## F. Velo client collections — separate hackathon path, optional to company payroll
- [ ] Verify exact declared/installed SDK version against [current upstream release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope): repository alpha declaration does not mean an upgrade occurred; upstream says Stellar Testnet only, no Mainnet, settlement or external provider
- [ ] Persist client collection intents and signed webhook idempotency; reconcile before marking an invoice paid
- [ ] Produce genuine Testnet collection evidence for the hackathon integration; never use a redirect as payment proof
- [ ] Keep Velo separate from payroll payout and escrow funding

Noir constraints reference: [official contracts documentation](https://github.com/noirx402/noir/blob/main/docs/contracts.md).

## G. Demo and deadline (Philippine time UTC+8)
- [ ] Team registration confirmed by organizers (handbook lists Nov 4 23:59 deadline; may already be past)
- [ ] Deployed web URL loads from a separate device (required)
- [ ] Deployed server HTTPS webhook receives verified event
- [ ] Public repo links source files + docs + exact SDK versions
- [ ] README sections completed with real URLs, screenshots, credits
- [ ] 2-minute video showing owner approval followed by automated eligible exact-item Testnet execution, not autonomous wage determination
- [ ] Submission write-up and Testnet transaction hash
- [ ] Official submission before **Sat Nov 7, 2026 12:00 PM PHT**
- [ ] Prepare 5-minute pitch + 3-minute Q&A (top 10 if selected)

## Demo script (target)
Target only: do not perform or narrate pending screens/actions as working. Until implemented, show the existing preview honestly and identify missing capabilities; capture positive proof only from exercised flows.

1. Explain the real cutoff (1–15 or 16–end-of-month), Proyekto reference context, employee/project hours, actual outputs and versioned client feedback. Proyekto import remains pending until verified.
2. Boss manually reviews hours under the applicable agreement. Show the employee's own hours/rates/adjustments statement and discrepancy channel; client acceptance or invoice payment is not a universal employee-pay gate.
3. Boss explicitly approves the immutable exact recipient + amount snapshot. Explain that changes require reapproval; if this pending control is not implemented, do not pretend the current preview supplies it.
4. For the hackathon only, show owner device/policy setup and independently pre-funded Noir Testnet escrow. Agent checks an approved exact item and app-side merchant/run limits, then SDK `checkPayment` and `authorizePayment`. It automates eligible execution, not wage judgment.
5. Merchant separately claims; show genuine authorization and claim transaction hashes and each recipient's reconciled result. Demonstrate partial failure/unknown handling without blind retry only when implemented.
6. Explain the distinct recommended company bank-file path: chosen supported format and bank approval controls, all pending with no bank integration. No OTP/UI automation or production payout claim.
7. Show the separate Velo Testnet client collection with genuine signed-event/reconciliation evidence once implemented and validated. It is optional to the company's pay-run workflow, but remains a separate hackathon integration goal—not payroll payout or an escrow-funding bridge.

## Reviewer evidence
Paste URLs only after real proof exists: live site `TBD`, repo `TBD`, demo `TBD`, Noir authorize tx `TBD`, Noir claim tx `TBD`, Velo intent `TBD`.
