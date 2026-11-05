# Prodigitality visual design — intentionally on hold

**Status:** Deferred by project owner (2026-11-05). No brand color, typography, logo, illustration, animation, screenshots or visual language should be treated as approved.

**Product name:** Snapp  
**Subtitle:** Agentic Work Verification & Payment Orchestration

**Tagline:** Pay fast, in a snap.

**Positioning:** From verified deliverables to streamlined payouts. One platform for teams, clients, and business owners.

The product name, subtitle, tagline and positioning do not approve a logo, palette, typography or other visual identity.

## Design source of truth
- Official website reference: https://prodigitality.net/services
- Product design owner: https://github.com/Stobeeney
- Draft all visual decisions as a design proposal; review with founder before merging substantial changes.

## When styling is authorized
1. Extract brand colors (hex), typography and licensed assets from the official identity pack or verified website.
2. Define light/dark usage, accessibility, spacing, radius and shadows; capture token naming in `apps/web/src/index.css` or Tailwind theme.
3. Supply approved logo assets with provenance and correct usage.
4. Create responsive wireframes for the pending cutoff preparation/review, employee statement, exact-run approval, recipient reconciliation, client evaluation and separate Testnet/settings views described below.
5. Approval gate: founder confirms screenshots and mobile behavior.

## Temporary implementation
The scaffold uses **neutral grayscale UI only**, plainly labeled as a demo. Do not interpret this as final Prodigitality style. Prioritize functional layout, readable data, keyboard accessibility and loading/error states until a visual direction is approved.

## Functional wireframes — target only, all pending
These are layout requirements, not implemented pages or approved visual designs. Current dashboard/project previews remain scaffold previews. Snapp complements Proyekto's existing PM and invoicing; linking/importing references is not implemented or verified.

| Target frame | Reading order and required controls |
|---|---|
| Cutoff preparation | Period (1–15 or 16–end-of-month) → employee/project hours → Proyekto references → actual outputs and client feedback → discrepancies |
| Owner hours review | Applicable hourly/employment or fixed-fee terms → submitted hours → boss's manual judgment/corrections → employee calculation; do not substitute an agent rating |
| Employee statement | Own period/hours/rates → itemized adjustments and total → discrepancy channel → own recipient payment result; never expose colleagues' compensation |
| Client evaluation | Deliverable version/source → comments → revision requests → acceptance identity/time/version; no fabricated objective scores |
| Final run approval | Exact immutable recipient + amount snapshot → owner final release action → approval identity/time; any change requires a fresh approval |
| Recipient reconciliation | Run totals → each recipient's submission/result/evidence → partial failure/unknown explanation → reconcile before retry; no all-green run when one recipient is unresolved |
| Company bank path | Approved snapshot → chosen supported corporate-bank file export → bank's approval process → per-recipient reconciliation; all pending, no bank integration |
| Testnet execution | Owner device/policy setup and pre-funded escrow → approved exact item → agent eligibility check/authorization → separate merchant claim and genuine transaction evidence |

Milestones group evidence; they are not the default payroll payment unit. Client acceptance and invoice collection must not be drawn as universal gates to employee hours-based pay: actual agreement/legal obligations govern. Show optional Velo client collection in a separate lane, never as payroll payout or a funding bridge.

No bank UI/OTP automation, one-OTP promise or production settlement visual may be implied. Keep Noir and Velo demos visibly Stellar Testnet-only. Pending app-side merchant allowlists, cumulative cutoff caps, approved snapshots and at-most-once execution records must not appear as already functioning controls.

## Design acceptance checklist
- [ ] Brand reference/assets approved
- [ ] Typography and tokens documented
- [ ] Mobile 360px layout verified
- [ ] Contrast at least WCAG AA for primary text/controls
- [ ] Full keyboard navigation, visible focus state and descriptive labels
- [ ] Page empty/loading/error/success states
- [ ] Founder screenshot approval
