# Snapp design specification — approved frontend foundation

**Status: approved frontend foundation.** Visual system approved 2026-11-06 ([DECISIONS](DECISIONS.md#visual-system-approved-2026-11-06)). Updated 2026-11-06.

The development library at `/dev/library` is the approved basis for all frontend UI/UX work. On 2026-11-06 the founder/company approval (G-00) was granted for the palette, typography, logo usage, motion and sound direction in both themes. The same decision confirmed the 750 ms hold and kept the brand-guide animations that are not built yet. This replaces the 2026-11-05 deferral.

Approval opens production adoption; it does not complete it. Production routes still use the neutral scaffold until each screen is migrated and passes the per-screen acceptance checklist in [§14](#14-approval-and-acceptance). Reusable infrastructure gaps (G-01 to G-06) should land first ([§12](#12-frontend-adoption-guidance)). Approving the visual system does not make any fictional workflow, approval, report or payment specimen a working feature.

**Product name:** Snapp · **Subtitle:** Agentic Work Verification & Payment Orchestration · **Tagline:** Pay fast, in a snap. · **Positioning:** From verified deliverables to streamlined payouts. One platform for teams, clients, and business owners.

## Contents
1. [How to read this document](#1-how-to-read-this-document)
2. [Product roles, workflows and navigation](#2-product-roles-workflows-and-navigation)
3. [Foundations](#3-foundations)
4. [Components and states](#4-components-and-states)
5. [Validation](#5-validation)
6. [Reporting](#6-reporting)
7. [Motion](#7-motion)
8. [Logo and sound](#8-logo-and-sound)
9. [Accessibility](#9-accessibility)
10. [Performance](#10-performance)
11. [Component-to-source map](#11-component-to-source-map)
12. [Frontend adoption guidance](#12-frontend-adoption-guidance)
13. [Implementation status and gaps](#13-implementation-status-and-gaps)
14. [Approval and acceptance](#14-approval-and-acceptance)
15. [Recorded discrepancies](#15-recorded-discrepancies)
16. [Verification record](#16-verification-record)

---

## 1. How to read this document

### Vocabulary
| Term | Meaning |
|---|---|
| **Specimen** | Implemented in source and visible in `/dev/library`. It uses fictional local data and makes no API calls. |
| **Reusable** | Exported from `apps/web/src/components/` or `apps/web/src/lib/`, and usable outside the library without copying code. |
| **Library-only** | Implemented inside `apps/web/src/dev/`. This code is development-only and excluded from production JavaScript, so it must be extracted before reuse. |
| **Planned** | Required by this spec, the [PRD](../PRD.md) or the [brand guide](../SNAPP_BRAND.md), but absent from source. |
| **Production** | Used by a route in the shipped app (`apps/web/src/App.tsx`). **No library component is in production today**, apart from the favicon. |

**Must** is a requirement for adoption. **Should** is the default unless there is a recorded reason not to.

### Source precedence
When documents disagree, resolve them in this order:
1. Explicit owner decisions in [DECISIONS.md](DECISIONS.md).
2. Current source code.
3. This document.
4. [SNAPP_BRAND.md](../SNAPP_BRAND.md) v0.2.
5. Older audit notes.

Material conflicts are listed in [§15](#15-recorded-discrepancies).

### Preview
```bash
npm run dev -w @agentpay/web
# http://localhost:5173/dev/library               Ink (dark) theme
# http://localhost:5173/dev/library?theme=light   Paper (light) theme
# http://localhost:5173/dev/hold                  Hold-duration and sound tuning lab
```
No backend or credentials are needed. `/dev/*` routes exist only when `import.meta.env.DEV` is true. The design library chunk is absent from `vite build` output (verified 2026-11-06). Static files in `apps/web/public/` (audio, brand SVG) do ship with every build; see [§10](#10-performance).

### Related documents
- [DESIGN_LIBRARY.md](DESIGN_LIBRARY.md): library scope and run notes.
- [DESIGN_LIBRARY_AUDIT.md](DESIGN_LIBRARY_AUDIT.md): Impeccable audit history and intentional detector exceptions.
- [UI.md](UI.md): target component contracts.
- [PAGES.md](PAGES.md): routes.
- [SNAPP_BRAND.md](../SNAPP_BRAND.md): brand rationale and draft tokens.
- [docs/qa/](qa/): raw detector snapshots.

---

## 2. Product roles, workflows and navigation

Snapp is a Proyekto-connected, owner-approved cutoff pay-run and pay-transparency layer. The design must not reproduce Proyekto project management or invoicing. See [PRD §3–4](../PRD.md).

### Roles and what the UI may show them
| Role | Primary job in the UI | Must never see or do |
|---|---|---|
| Owner / consultant | Review hours per employee and project for a 1–15 or 16–end-of-month cutoff. Resolve discrepancies. Approve one exact, immutable run version. | Release money with no explicit approval of exact recipients, amounts, asset and total |
| Operations / preparer | Prepare cutoff records and evidence | Approve or release funds unless separately authorized |
| Developer / employee | Check their own hours, rates, adjustments, total and payment result. Raise discrepancies. | See colleagues' pay or company margins |
| Client | Comment on, request revisions to, or accept a specific deliverable version | See employee compensation |
| Payment agent | Check approved items and execute eligible Testnet items. Every action is logged and readable by the owner. | Set wages, approve hours, or substitute recipients or amounts |

Authentication and RBAC are **not implemented**. Role scoping is a design requirement, not a current property of the app.

### Workflow spine: 01/ Prepare · 02/ Review · 03/ Snap · 04/ Settle
| Stage | Actor and color | Must show | Must not imply |
|---|---|---|---|
| 01/ Prepare | Agent (Ultraviolet) | Cutoff period, source references with provenance, flagged gaps | Imported data that was not actually imported. There is no live Proyekto sync. |
| 02/ Review | Owner | Submitted vs reviewed hours, terms version, corrections with reasons, versioned client feedback | That client acceptance or invoice payment gates hours-based pay |
| 03/ Snap | Owner (Volt) | Run version, recipient count, asset, exact total. Hold-to-approve or a keyboard confirmation dialog. | Payment. Approval is not settlement. |
| 04/ Settle | Per recipient | Separate submission, authorization, claim and reconciliation states. Unknown outcomes stay unknown. | A run that is all green while any recipient is unresolved |

Use a slip divider between 02/ Review and 03/ Snap. Approval locks a version, and any material change creates a new version that needs a new approval. In the library, the stage bar and the exact-run approval are specimens; the slip divider is a graphic specimen only.

### Information hierarchy, per view
1. **Scope:** period (`Nov 1–15, 2026`, Asia/Manila), role and version.
2. **Decision-critical figures:** exact amounts in Geist Mono with their currency or asset code (`PHP 11,400.00`, `1.0000000 XLM · Testnet`).
3. **Status:** icon plus label plus color, never color alone.
4. **Evidence:** source, version, who, when.
5. **Actions:** at most one Volt primary action per view. Destructive actions confirm.

### Navigation principles
- The target routes are in [PAGES.md](PAGES.md). All are pending, and every one requires authentication and role scoping.
- Keep preparation, approval, execution and reconciliation as visibly separate places or states. Never collapse Noir authorization into a merchant claim, or a Velo redirect into confirmed collection.
- Show Velo client collection in a separate lane. It is never payroll funding.
- Brand §11 requires an amber **TESTNET** chip in the app header on every screen. It is planned; the current scaffold shows the text "Preview environment — no real funds".
- In-page section navigation uses native smooth scrolling for pointer input and instant scrolling for keyboard input or reduced motion. Never intercept the wheel ([§7](#7-motion)).
- Responsive targets are 360, 768 and 1280 px. Primary data cards must not scroll horizontally. Wide tables and charts scroll inside their own labeled region.

### Functional wireframes: target frames, all pending
Carried forward from the previous version of this document. These are layout requirements, not implemented pages.

| Target frame | Reading order and required controls | Library coverage |
|---|---|---|
| Cutoff preparation | Period → employee/project hours → Proyekto references → actual outputs and client feedback → discrepancies | Report filters/table (fictional) |
| Owner hours review | Applicable hourly/employment or fixed-fee terms → submitted hours → owner's manual judgment/corrections → employee calculation. Never substitute an agent rating. | "Owner review" tab (static table) |
| Employee statement | Own period/hours/rates → itemized adjustments and total → discrepancy channel → own payment result. Never colleagues' pay. | "Employee statement" tab (static) |
| Client evaluation | Deliverable version/source → comments → revision requests → acceptance identity/time/version. No fabricated scores. | "Client evaluation" tab with a validated feedback field |
| Final run approval | Exact immutable recipient + amount snapshot → owner release action → approval identity/time. Any change needs fresh approval. | Exact-run approval specimen (hold + dialog) |
| Recipient reconciliation | Run totals → each recipient's submission/result/evidence → partial/unknown explanation → reconcile before retry | "Recipient results" tab (static) |
| Company bank path | Approved snapshot → supported corporate-bank file export → bank's approval → per-recipient reconciliation. No bank integration exists. | None |
| Testnet execution | Owner device/policy setup and pre-funded escrow → approved exact item → agent check/authorize → separate merchant claim with genuine transaction evidence | None. The CLI is the only surface today. |

Milestones group evidence; they are not the default payroll unit. Never draw client acceptance or invoice collection as a universal gate on hours-based pay. Never imply bank UI or OTP automation, a single-OTP batch, or production settlement. Pending controls (merchant allowlists, cumulative cutoff caps, approved snapshots, at-most-once records) must not look like working ones.

---

## 3. Foundations

The single source for these tokens is [`libraryTokens.ts`](../apps/web/src/dev/libraryTokens.ts). It produces both the runtime CSS variables (`themeVariables`) and the downloadable `snapp-draft-tokens.css` (`tokenCSS`). It currently lives in `src/dev/`, so production cannot import it; see gap G-01.

### Palette
| Family | Tokens |
|---|---|
| Ink (neutrals) | `ink-950 #0A0A0F` · `ink-900 #12121A` · `ink-800 #1A1A25` · `ink-700 #2A2A38` · `ink-600 #3A3A4C` · `ink-500 #5C5C70` · `ink-400 #8A8A9E` · `ink-300 #B4B4C4` · `ink-200 #D9D9E3` · `ink-100 #EDEDF2` · `paper-50 #F6F6F2` · `white #FFFFFF` |
| Volt (human authority; the "lime") | `volt-300 #E6FF8A` · `volt-400 #D4FF3F` · `volt-500 #B8E600` · `volt-700 #5E7500` |
| Ultraviolet (agent) | `uv-300 #B7A8FF` · `uv-400 #8F7BFF` · `uv-500 #6E56FF` · `uv-600 #5A3FF0` · `uv-700 #4328C7` |
| Semantic | `teal-400 #1FC7A2` / `teal-700 #0A7A63` · `amber-400 #FFB020` / `amber-700 #9A5B00` · `red-400 #FF5468` / `red-700 #C21F3A` |

### Semantic aliases (Ink / Paper)
Components must use these aliases, not palette tokens, so that both themes work.

| Alias | Ink | Paper | Meaning and rule |
|---|---|---|---|
| `--bg` / `--surface` / `--raised` | ink-950 / ink-900 / ink-800 | paper-50 / white / ink-100 | Canvas, cards, raised surfaces |
| `--border` | ink-700 | ink-200 | Decorative hairlines only |
| `--control-border` | ink-400 | ink-500 | Interactive boundaries, which need contrast |
| `--text` / `--muted` | paper-50 / ink-400 | ink-950 / ink-500 | Primary and secondary text |
| `--human` | volt-400 | volt-400 | Owner action. Always Ink text on Volt. **Never Volt text on Paper (~1.1:1).** |
| `--agent` / `--agent-text` | uv-500 / uv-400 | uv-600 / uv-600 | Agent presence and agent text |
| `--settled` | teal-400 | teal-700 | **Confirmed claim or reconciliation only.** Never validity, success toasts or report data. |
| `--attention` | amber-400 | amber-700 | Needs review, pending, unknown outcome |
| `--stop` | red-400 | red-700 | Failed, rejected, held, invalid |
| `--focus` | volt-400 | uv-600 | Keyboard focus ring |
| `--logo-release` / `--ripple` | volt-400 / volt-400 | ink-950 / ink-950 | Logo release arc and echo. Paper uses Ink for contrast. |
| `--report-series` | uv-300 | uv-700 | Report quantities (violet) |
| `--report-positive` | volt-300 | volt-700 | Explicitly **passed data checks** only |
| `--report-negative` | red-400 | red-700 | **Failed data checks** that require correction |
| `--field-progress` | ink-400 | ink-500 | Text-length meter. Neutral, not success. |
| `--selection` / `--selection-text` | ink-200 / ink-950 | ink-950 / paper-50 | Selected text and dates |

**Two-hands rule** (owner decision, brand §5): Volt means a human moved it, and Ultraviolet means the agent did. Neither means success. Only teal means money arrived. When the agent acts on an owner's approval, show both an Ultraviolet agent icon and a Volt "Approved by owner" chip. Keep roughly 60% Ink, 30% neutral surfaces, 7% Volt and 3% Ultraviolet.

**Report colors** (owner decision, 2026-11-06):
- Violet is for quantities.
- Volt/lime is for explicitly passed checks.
- Red is for failed checks that need correction.
- Amber is for pending or review states.
- Higher hours, headcount or proposed amounts are neutral quantities, never automatically "positive".
- Teal never appears in reports of proposed values.

### Typography
Fonts: Sora (display), Geist (text/UI) and Geist Mono (numbers/code), bundled via Fontsource under the SIL OFL with no runtime CDN. They are imported only by `DesignLibrary.tsx` today (gap G-02).

| Token | Size / line (px) | Face, weight, tracking | Use |
|---|---|---|---|
| display-xl / display-l | 72/72 · 56/60 | Sora 700, −0.035em / −0.03em | Marketing only |
| h1 / h2 | 40/44 · 30/36 | Sora 600, −0.025em / −0.02em | Page and section titles |
| h3 / h4 | 22/28 · 18/24 | Geist 600 | Card titles, subsections |
| body-l / body / body-s | 18/28 · 16/24 · 14/20 | Geist 400 | Intro, default, tables and helper text |
| label | 12/16 | Geist 600, uppercase, +0.08em | Eyebrows, column headers, chips, stage index |
| mono | 14/20 | Geist Mono 400 | Hashes, IDs, table amounts |
| amount-xl | 48/52 | Geist Mono 500 | Run total on the approval screen |

Rules:
- The minimum text size is 12 px.
- Editable fields use 16 px on mobile to avoid iOS zoom.
- Money always uses Geist Mono with `tabular-nums`, right-aligned in tables, with the currency or asset code every time.
- PHP has two decimals. XLM has seven decimals and a `· Testnet` label.
- Never abbreviate or round a payable amount.
- Middle-truncate hashes and addresses, with copy and the full value available (planned, G-14).
- Body and hint copy uses `text-wrap: pretty`, and headings use `balance`.

### Spacing, layout and shape
| Property | Value |
|---|---|
| Base unit and scale | 4 px: 4, 8, 12, 16, 24, 32, 48, 64, 96 (`--space-*`) |
| Grid | 12 columns, 24 px gutters, 1280 px max. 4 columns and 16 px gutters on mobile. |
| Radius | 4 small · 8 controls/buttons · 12 cards · 20 sheets/dialogs · 22% app icon · pill for chips |
| Borders | 1 px hairline. Use `--control-border` for anything interactive. |
| Elevation | Ink uses lighter surfaces and no shadows. Paper uses one soft shadow per level. |
| Focus | 2 px ring, 2 px offset, `--focus` |
| Density | Table rows are 44 px by default and 36 px compact |
| Touch targets | At least 44 × 44 px (implemented in `controls.css`) |
| Themes | Ink is the signature theme (owner command view, approval moment). Paper suits dense review tables, employee statements, and anything printed or exported. |

**Proposed spatial extensions** (not brand values): `--spatial-perspective: 900px`, depth 0–64 px (default 40), tilt −24° to 0° (default −16°), 375 ms ease-snap transitions, matte surfaces, no lighting. These support the CSS 3D studies only.

### Responsive behavior
- Controls stack and editable text rises to 16 px below 760 px (`controls.css`).
- The library's viewport selector (Fluid, 360, 768, 1280) only constrains specimen width. It does not emulate a device.
- Report tables and Cartesian charts scroll inside a labeled `role="region"`. The pie chart stacks above its legend.
- `forced-colors: active` maps control chrome to system colors (`Canvas`, `CanvasText`) in `controls.css`, `loading.css` and the report CSS.

---

## 4. Components and states

All visible control surfaces are Snapp-authored. Where used, unstyled **React Aria Components** supply behavior only: focus, keyboard handling, selection and calendar logic (owner decision). React Aria's hidden native `<select>` is intentional for form and autofill semantics.

All overlays (menus, calendars) are portalled. Wrap any tree that uses them in `SnappControlProvider` with `theme`, `reduced` and `variables`, so that portals inherit theme tokens and the `en-PH` locale.

| Component | Status | States implemented | Behavior contract |
|---|---|---|---|
| **Buttons**: primary (Volt), secondary, destructive, disabled, text button | Library-only CSS (`.lib-button`, `.lib-text-button`); no exported component | default, hover (125 ms), press (scale 0.97), focus-visible, disabled (readable muted text and dashed border, no motion), `aria-pressed` toggle | One Volt primary action per view. Destructive actions are a red outline that fills only inside confirmation. **Missing:** an agent (Ultraviolet outline) variant, a busy/loading state, and an icon-only variant. |
| **Snap (hold-to-approve)** | Library-only inline code in `DesignLibrary.tsx` plus the `/dev/hold` lab | idle, holding (750 ms), approved/locked, reset | Primary pointer only, with pointer capture. Cancels on pointer up, leave, cancel or lost capture, button blur, window blur, hidden document, search change and unmount. Keyboard Enter/Space (`click` with `detail === 0`) opens the confirmation dialog instead. Locks with "Approved · v3 · locked". |
| **Text field / textarea** (`SnappTextField`) | Reusable | empty, progress, valid ("Minimum met"), near (≥90% of max), at max ("Limit reached", still valid), invalid, disabled; Required/Optional label | One perimeter for focus and error (owner decision). Length meter sits beside the count, not as a second border. Validates on blur, on submit, or immediately when over max. Never truncates. See [§5](#5-validation). |
| **Select** (`SnappSelect`) | Reusable | placeholder, selected (check icon), disabled options, invalid with `FieldError`, disabled, required, description | Keyboard open, typeahead, Escape closes and returns focus (tested). Placeholder text is fixed ("Choose an option"). Single select only. |
| **Date picker** (`SnappDatePicker`) | Reusable | empty segments, filled, out-of-range days disabled, invalid, disabled | Segmented input and calendar popover (arrows, Page Up/Down, Enter). `minValue`/`maxValue` enforced. The hint shows ISO bounds and "Asia/Manila" as text; no timezone conversion is performed. |
| **Date-range picker** (`SnappDateRangePicker`) | Reusable | as date picker, plus start/end segments and range highlight | Range is staged; the consumer applies it explicitly (the report uses **Apply**). Incomplete ranges are detected by the consumer. |
| **Switch** (`SnappSwitch`) | Reusable | on, off, disabled, focus | Label text only. **Missing:** description and error props. |
| **Slider** (`SnappSlider`) | Reusable | value, disabled, focus | Visible output with suffix. **Missing:** description, error, step and format options. |
| **Tabs** (`SnappTabs`) | Reusable logic, **library-only styles** | selected, roving focus | Arrow keys, Home and End (tested). One shared `tabpanel` is labeled by the active tab. Styling is in `DesignLibrary.css` (`.lib-tabs`), not `controls.css` (G-05). |
| **Toasts** (`useSnappToasts` + `SnappToastRegion`) | Reusable | info, warning, error | At most three visible. Info auto-dismisses after 6 s and pauses on hover, focus or hidden tab (tested). Warnings and errors persist until dismissed. Error uses `role="alert"`, the others `role="status"`. Identical messages are deduplicated. Dismiss returns focus to the element that was active when the toast was raised. Toasts never use teal. |
| **Dialog** | Library-only native `<dialog>` | open, cancel (Escape), confirm | Exact-snapshot confirmation repeats version, recipients, per-item amounts and total. Native dialog handles focus trap and focus return. **No reusable component.** |
| **Loading** (`SnappLoading`) | Reusable | pending (6 s loop), reduced-motion static mark | `role="status"` and `aria-live="polite"` with a text label. Mount only while real work is pending, and unmount on resolve or failure. No percentage and no minimum wait. |
| **Empty** | Specimen (feedback states, reports) | "No reviewed hours in this cutoff", "No records match these filters" | Always state why and offer a recovery action ("Show all review states"). |
| **Error** | Specimen | load failure with Retry, form error summary | Plain cause plus safe next action. Entries are preserved. Never substitute artificial success. |
| **Stale / partial / needs reconciliation** | Specimen | "Inputs changed. A new version needs owner approval.", "1 confirmed · 1 unresolved", amber hatch with a last-checked timestamp | Unknown outcomes are static and hatched, never spinners. Reconcile before retry. |
| **Status chips** (`Badge`) | Library-only | Draft, Prepared by agent, Approved by owner, Awaiting claim, Claim confirmed, Needs check, Failed | Icon plus label every time. The split-flap status flip (brand §8) is planned. |
| **Tooltips** | Library-only (reports) | hover, focus, Escape dismiss | Custom themed `role="tooltip"` linked by `aria-describedby`. Never the only place a value appears. |

**Disabled-state rule:** disabled controls keep readable text and hints. Show the state with a dashed border and muted color instead of compounding opacity.

---

## 5. Validation

### Client validation (implemented in [`validation.ts`](../apps/web/src/components/ui/validation.ts))
| Concern | Behavior |
|---|---|
| Required | `validateText` returns `Enter <label>.` for empty input. Whitespace, format characters (`\p{Cf}`), control characters and lone combining marks count as **empty**. |
| Length | **Grapheme-aware.** `textLength` uses `Intl.Segmenter` (grapheme granularity) on NFC-normalized, edge-trimmed text. Combining marks, ZWJ emoji and multilingual text count as the user perceives them, and joiners are preserved (tested). |
| Messages | Short input gets "Add N more characters (minimum M)". Long input gets "Remove N characters (maximum M)". Exact boundaries are valid. |
| Over-limit input | **Preserved.** No `maxLength` and no truncation. Paste beyond the limit stays visible and the field shows a correction (tested). |
| Composition (IME) | While `compositionstart` → `compositionend` is active, the invalid state is suppressed so in-progress characters are not flagged. **Not covered by a test** (G-18). |
| When errors appear | On blur, on submit, or immediately once over the maximum. Never on first keystroke. They clear on correction (tested). |
| Dates | `validateDate` requires strict `YYYY-MM-DD`, a real calendar date (leap day accepted, malformed rejected) and inclusive min/max. The specimen window is 2026-11-01 to 2026-12-15, which is a specimen bound, **not payroll policy**. |
| Date ranges | The report requires a complete range (no placeholder segments), start ≤ end and both ends inside November 2026, applied only on **Apply**. An invalid range shows an inline error and keeps the last valid applied report (tested). |
| Enumerations | Cutoff must be one of the listed options. Unknown values are rejected. |
| Inline errors | `FieldError` is linked to the field and `aria-invalid` is set. Messages say what to do. |
| Error summary | `role="alert"` reports a count ("3 fields need attention"). **Not yet a linked list of errors** (G-17). |
| Focus recovery | On invalid submit, focus moves to the first invalid control: select trigger, date spinbutton, input or textarea (tested). |
| Success | "Valid example. Ready for an authenticated server check." Neutral check styling, never teal. |

### Required server validation (planned, absent)
Client checks are convenience only. Every future endpoint must independently:
- Authenticate the caller and authorize by role. Employees see only their own records.
- Re-run every rule above server-side with the same grapheme semantics, or document an intentional difference.
- Validate business rules: cutoff boundaries in Asia/Manila (including February and month-end), rate and agreement versions, and that hours belong to the period.
- Bind approvals to an immutable run version and reject stale versions. A material change invalidates approval.
- Make submissions idempotent and record who changed what and when.
- Return field-addressable errors that the client maps onto `FieldError` and the focus-recovery path.

Owner: API contracts belong to Stobeeney, wiring is coordinated with JC ([TEAM](TEAM.md)). No such endpoint exists today.

---

## 6. Reporting

Source: [`ReportExamples.tsx`](../apps/web/src/dev/ReportExamples.tsx) and [`ReportChartGallery.tsx`](../apps/web/src/dev/ReportChartGallery.tsx). Data is **six fictional records on three record dates (Nov 3, 7, 12, 2026)**. It is not a reporting endpoint, approved wages or payment records.

**One filtered dataset** (owner decision). Scorecards, sparklines, bars, combo, pie, outcome summary, table, pagination and CSV export all derive from the same `filtered` rows (tested). Filters must never apply to some views and not others.

| Element | Contract |
|---|---|
| Filters | Applied date range, review state, project, employee search (native `type="search"`), "Nov 16–30" preset, reset. Each filter change resets to page 1. |
| Scorecards | Filtered totals with dated compact sparklines. Values swap directly; **money never counts up** (owner decision). |
| Compact sparklines | Per-point focusable marks with `aria-label` (date and value) and a group label that states "Scale starts at zero". |
| Large sparkline | Full-width observed-point trend in a horizontally scrollable region, with a text summary label. |
| Bars | Record-date hours and project totals on a zero baseline. Scale interpolates on change. Visible data labels. |
| Combo | Submitted vs passed-check hours on one shared zero-based hour axis (bars plus line). |
| Pie | Count-based check outcomes with a legend showing count and percentage. Zero records shows an empty state; one category draws a full circle (tested). |
| Outcome summary | Passed (lime), Needs correction (red), Pending (amber), each with an icon and an explanatory tooltip saying it does not approve hours or payment. |
| Table | Sort by name, hours or amount with `aria-sort`. The whole filtered set is sorted **before** pagination (tested). Page size is 3 in the specimen. `role="status"` reads "1–3 of N employees". |
| Empty state | "No records match these filters" with a recovery button. |
| CSV export | Exports the filtered, sorted set (all pages) as `snapp-fictional-cutoff.csv` with record date, hours, proposed PHP (from integer centavos), review state and data check. **Unescaped:** no quoting and no formula-injection guard (G-15). |
| Tooltips | Custom, on hover **and** focus, dismissed with Escape, on scorecards, sparkline points, bars, project totals and combo. The value is also visible or in an `aria-label`. |
| Accessible descriptions | `figure`/`figcaption`, chart `aria-label` summaries listing values, labeled scroll regions, and a visible legend (`aria-label="Report color legend"`). |
| Update motion | See [§7](#7-motion). |

Production reports need server-side aggregation, pagination and export for real volumes, plus role-scoped data. Employee reports must exclude colleagues.

---

## 7. Motion

**Principles** (brand §8): prepare, then release. Fast attack, quick decay. Exits are faster than entrances. **Money never morphs.** Never fake progress. Save the celebration for the snap.

| Token | Value | Use |
|---|---|---|
| `--dur-tick` | 60 ms | Press feedback, colour change, the logo's hold |
| `--dur-snap` | 125 ms | Buttons, chips, hover, release arc |
| `--dur-beat` | 250 ms | Panel entrance, prep arc draw, report update |
| `--dur-settle` | 375 ms | Echo decay, bar scale, spatial depth |
| `--dur-pulse` | 500 ms | Full logo sting |
| `--dur-hold` | 750 ms | Hold-to-approve. **Confirmed by owner 2026-11-06**; closes brand §14 open decision 1. |
| `--ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, release |
| `--ease-press` | `cubic-bezier(0.5, 0, 0.75, 0)` | Anticipation, exits |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | General UI, prep draws |

**Spring presets are kept (owner decision 2026-11-06) but not yet implemented.** "Crisp" (stiffness 700, damping 40, mass 0.6) is for layout and reorder with almost no overshoot. "Snap" (900, 30, 0.5) is for the release only, with one small overshoot. Today they appear only as text in the library: no spring physics code or animation library exists, and all specimens use CSS easing. Do not cite springs as implemented until G-12 lands. An implementation can be precomputed CSS `linear()` easing or a small spring utility. It must not drive per-frame React state, and it falls back to the reduced-motion behavior below.

| Pattern | Implementation | Interruption | Reduced motion |
|---|---|---|---|
| Hover/press | 125 ms hover, scale 0.97 on press | CSS transitions | Disabled |
| Validation nudge | Brief lateral nudge, **opt-in replay only**, never per keystroke. The error text stays readable. | Remount restarts it | No nudge |
| Scroll entrance | One-time `IntersectionObserver` reveal (threshold 0.7) inside a scroll preview. Figures and controls never animate on scroll. | Fires once | Shown immediately |
| Section navigation | Native `scrollIntoView` smooth for pointer, `instant` for keyboard. **No wheel interception, no per-frame React updates.** | Browser-native | Instant |
| Report data update | Web Animations API: opacity 0.65→1 and translateY 4 px→0 over 250 ms, ease-snap, only when the displayed data key changes (filters, sort, page), including keyboard-triggered changes. Bars and combo interpolate scale. | Prior animations are cancelled before starting (interruptible) | Skipped (system preference or library toggle) |
| Logo sting | See [§8](#8-logo-and-sound) | Remount restarts it | Static logo |
| Loading loop | See [§8](#8-logo-and-sound) | Unmount stops it | Static Slip S |
| CSS 3D studies | Three **CSS 3D transform** studies over HTML planes: evidence depth, prepare & release, spatial stages. **Not WebGL**, with no lighting or 3D assets. User-triggered only. | n/a | Flattened, depth and tilt disabled |

The system `prefers-reduced-motion` setting always wins over the library's local toggle. **No frame rate has been measured**, and no FPS or smoothness claim may be made.

The following brand motion is **kept** by the owner decision of 2026-11-06 and is planned but not implemented (G-12):
- Split-flap status flip (125 ms, old label out and new label in)
- Snap-to-order row settle (30 ms stagger, "crisp" spring) with flagged rows moving to the top under an amber marker
- Agent tempo-tick pulse (Ultraviolet, on the beat)
- Per-recipient resonance tick when an individual row confirms
- 60 ms amount crossfade, the only allowed money transition

All follow brand §8, have reduced-motion variants (instant swap or an opacity change of 120 ms or less, with the status still announced in text), and never count up or tween money.

---

## 8. Logo and sound

### Static artwork
- Reference sheet: [`docs/brand/snapp_logo_final_slip_s_v1.svg`](brand/snapp_logo_final_slip_s_v1.svg). It is copied unchanged to `apps/web/public/brand/`.
- [`SnappLogo`](../apps/web/src/components/SnappLogo.tsx) draws the wordmark, mark and small mark (7-unit gap under 24 px) with flat caps, `role="img"` and `aria-label="Snapp"`.
- `release` sets the release-arc color: `var(--logo-release)` themed, `currentColor` for one-color use.
- The logo is artwork. Never type "snapp" in a font as a stand-in.
- Paper wordmarks are one-color Ink. The green lower arc on the reference sheet's Paper construction diagram is not a usage rule.

### One-shot sting
- Timing: 0–250 ms the top arc draws (ease-standard); 250–310 ms a one-tick hold; 310–435 ms the release arc slips in from 6 units behind (ease-snap).
- The library adds two one-shot echo rings using `--ripple` (Volt on Ink, Ink 950 on Paper).
- It plays once per explicit replay. Replay remounts only the logo subtree, so focus stays on the button (tested).
- **Gap:** `SnappLogo`'s `sting` prop adds `.snapp-sting`, but no stylesheet defines it. The working sting CSS is `.lib-sting` in the dev-only `DesignLibrary.css` (G-04).

### Loading loop (owner decision, explicit exception)
- [`SnappLoading`](../apps/web/src/components/ui/SnappLoading.tsx) loops the **original two arcs** over a six-second sequence: Slip S → linked infinity-like arcs → open orbit → Slip S.
- This is a **loading-only exception** to the draft brand's "never loop the logo" rule. The static artwork and one-shot sting are unchanged.
- Reduced motion shows the static mark.
- The loop is silent and has no percentage.

### Sound
| Aspect | Contract (source: [`soundTokens.ts`](../apps/web/src/lib/soundTokens.ts), [`recordedSnap.ts`](../apps/web/src/lib/recordedSnap.ts), [`snapSound.ts`](../apps/web/src/lib/snapSound.ts), [`SoundExamples.tsx`](../apps/web/src/dev/SoundExamples.tsx)) |
|---|---|
| Default snap | Locally bundled real finger-snap recording by **Vinrax, CC0 1.0** ([provenance](../apps/web/public/audio/LICENSE.md), SHA-256 of the unmodified original recorded). Trimmed to **98.8 ms** (4357 frames at 44.1 kHz) with a short linear fade. **No added bass, reverb, compression or pitch shift.** |
| Synthesis | A labeled **fallback** when the recording fails to load, plus an explicit comparison button. Preparation (suction swell) and cancellation previews remain synthetic. |
| Timing | The recording is fetched and decoded **before** the visual starts. The snap is scheduled with Web Audio at the logo's **310 ms** release (0 ms under reduced motion). |
| Opt-in | **Sound starts off.** Default preview gain is 35%, with a user volume slider. |
| Cancellation | A **Stop** button. Every new preview, mute, volume change, hidden tab and unmount aborts the in-flight load, clears timers and closes the AudioContext. An interrupted resume or load cannot emit a late snap (tested). Releasing a hold early fades the suction with no snap. |
| Silence | Loading loops and report updates are always silent. Sound never carries information alone. |
| Unsupported audio | Status text explains, and the visual still runs (tested). |
| Download | Sound tokens and asset metadata are available as JSON from the library. |

The sound state hook (`useLibrarySound`) is library-only, and the preference is not persisted. The `/dev/hold` lab still uses the synthetic `playSnap`, not the recording (§15).

---

## 9. Accessibility

Target: **WCAG 2.2 AA**. Implemented items are source-verified and, where noted, tested in jsdom. **jsdom tests are not screen-reader, touch or visual evidence.**

| Requirement | State |
|---|---|
| Contrast: all text pairs AA. Volt never as text or logo on light. | Palette ratios computed in the library. Rendered scans reported **no contrast findings**. Real component backgrounds still need a manual check. |
| Visible focus: 2 px ring, 2 px offset, Volt on Ink, uv-600 on Paper | Implemented |
| Targets at least 44 × 44 px | Implemented in controls. Physical touch not verified. |
| Status by icon plus label, not color alone | Implemented for chips, outcomes, toasts and fields |
| Keyboard: select, calendar, tabs, dialog, hold alternative | Select, calendar and tabs are tested. Dialog and hold keyboard paths are implemented but untested. |
| Live regions: `polite` for status, `assertive` for failures and unknown outcomes | Toast errors use `role="alert"`. Loading, pagination and feedback use `role="status"`. **Unknown-outcome states do not announce assertively** (G-16). |
| Amounts read in full ("12,450 Philippine pesos") | **Absent.** Amounts are read as visible text (G-16). |
| Charts have text equivalents | `aria-label` summaries, focusable points, figure captions and the data table |
| Reduced motion respected everywhere | Implemented: system preference plus library toggle |
| Forced colors | System colors mapped for controls, loading and charts |
| Logo `role="img"`; decorative arcs `aria-hidden` | Implemented |
| Sound optional, never the only signal | Implemented |

Outstanding: screen-reader passes (NVDA/JAWS on Windows, VoiceOver on macOS/iOS, TalkBack), 200% zoom and reflow, and physical touch for the hold and sliders. Details are in [§13 E](#e-outstanding-review).

---

## 10. Performance

| Requirement | State |
|---|---|
| Development library excluded from production JS | Verified 2026-11-06. No library code appears in `dist/assets`. |
| Fonts self-hosted, no runtime CDN | Fontsource, library-only today |
| Motion uses transform and opacity, without per-frame React state | Source-verified. Report updates use WAAPI, and the loading loop and sting use CSS keyframes. |
| No chart or animation dependency | Charts are hand-written SVG. React Aria is the only UI behavior dependency. |
| Audio loaded on demand | The recording is fetched only when a sound preview plays |
| Static assets | `public/audio/` (trimmed and **original** WAV) and `public/brand/` ship in every production build because Vite copies `public/` wholesale. Move or omit the original WAV before production adoption (G-09). |
| Frame time and FPS | **Not measured.** No claim. |
| Bundle budget | **Not defined** (G-21) |

---

## 11. Component-to-source map

Paths are relative to `apps/web/src/`.

| Capability | Source | Tests | Reusable? |
|---|---|---|---|
| Tokens (palette, aliases, type, motion, spacing, CSS export) | `dev/libraryTokens.ts` | indirect | **No**, located in `dev/` |
| Control styles | `components/ui/controls.css` | indirect | Yes, depends on alias variables |
| Select, date, date range, text field, switch, slider, tabs, toasts, provider | `components/ui/SnappControls.tsx` | `components/ui/SnappControls.test.tsx` | Yes (tabs styling excepted) |
| Validation rules | `components/ui/validation.ts` | `components/ui/validation.test.ts` | Yes. Specimen rule sets (`reasonRules`, `reviewDateBounds`, `cutoffOptions`) are fixtures. |
| Loading | `components/ui/SnappLoading.tsx`, `loading.css` | `dev/LibraryExtensions.test.tsx` | Yes |
| Logo | `components/SnappLogo.tsx` | `dev/DesignLibrary.test.tsx` | Yes (sting CSS missing) |
| Sound tokens, recording, synthesis | `lib/soundTokens.ts`, `lib/recordedSnap.ts`, `lib/snapSound.ts` | `dev/SoundExamples.test.tsx` | Yes |
| Sound preference and playback hook | `dev/SoundExamples.tsx` (`useLibrarySound`) | same | No |
| Buttons, badges, panels, dialog, hold, feedback states, workflow compositions, 3D studies, contrast | `dev/DesignLibrary.tsx`, `DesignLibrary.css` | `dev/DesignLibrary.test.tsx` | No |
| Validation form and client feedback examples | `dev/ValidationExamples.tsx` | `components/ui/SnappControls.test.tsx` | No (pattern reference) |
| Loading and interaction examples (nudge, scroll, press) | `dev/LibraryExtensions.tsx`, `.css` | `dev/LibraryExtensions.test.tsx` | No |
| Reports: scorecards, sparklines, bars, table, filters, CSV | `dev/ReportExamples.tsx` | `dev/LibraryExtensions.test.tsx` | No |
| Chart gallery: large sparkline, combo, pie (`pieSlice`) | `dev/ReportChartGallery.tsx` | `dev/LibraryExtensions.test.tsx` | No |
| Hold and sound tuning lab | `dev/HoldPlayground.tsx` | — | No |
| Route gating | `App.tsx` (`import.meta.env.DEV`) | — | — |

---

## 12. Frontend adoption guidance

The visual system is approved (G-00, 2026-11-06), so production adoption may begin. Promote the reusable infrastructure first (G-01 to G-06), then migrate screens one at a time. Each migrated screen must pass the per-screen checklist in [§14](#14-approval-and-acceptance). Coordinate shared-file changes (`index.css`, Tailwind config, `App.tsx` shell) with the team per [TEAM](TEAM.md).

1. **Promote tokens first.** Move `libraryTokens.ts` out of `src/dev/` (for example to `src/design/tokens.ts`). Generate one global stylesheet that defines the aliases on `[data-snapp-theme]`. Stop relying on the inline `style` variables applied by `DesignLibrary`. Then replace the neutral Inter scaffold in production `index.css` and map the tokens into the Tailwind v3 theme. Approval allows this; coordinate the edit because these are shared files.
2. **Consume aliases, never hex values.** Components read `--surface`, `--control-border`, `--focus` and so on. Theme switching is attribute-based (`data-snapp-theme="dark"|"light"`).
3. **Wrap the app in `SnappControlProvider`** so portalled menus and calendars inherit the theme, reduced-motion state and `en-PH` locale.
4. **Extract library-only primitives before use:** Button (with variants and a busy state), StatusChip, Dialog/ConfirmDialog, HoldToApprove, Tooltip, DataTable with sort and pagination, AmountDisplay, and the chart primitives. Keep their tests, and move `.lib-tabs` styling into `controls.css`.
5. **Use the validation module, then map server errors.** Client rules are a mirror of the server, never a replacement. Submit handlers keep the focus-first-invalid pattern from `ValidationExamples.tsx`.
6. **Keep the one-dataset rule** for every report. Fetch once per filter state server-side, then derive every view from that result.
7. **Reuse sound only through an opt-in setting** that defaults to off and persists per user. Keep it silent for loading and data.
8. **Honor product truth in copy and states.** Label previews and fixtures. Never show teal or "paid" without confirmed evidence, and never mark paid from a redirect. Keep Velo and Noir separate. Show Testnet labels on every on-chain amount.
9. **Testing.** Every promoted component keeps its Vitest and Testing Library tests. Add a browser-level suite (for example Playwright) for focus, touch, overlays and visual regression before production use (G-20).
10. **Ownership.** JC owns UI/UX and frontend components. Stobeeney owns API contracts and wiring. Aidantiu owns deployment. The founder approves design PRs ([TEAM](TEAM.md)).

---

## 13. Implementation status and gaps

Inventory from **source inspection on 2026-11-06**. Status values:
- **implemented specimen**: works in the library
- **partial**: some states or parts missing
- **planned**: specified but absent
- **absent**: no spec and no source, but implied by the PRD or architecture
- **unverified**: exists, but not checked in a real browser, device or assistive technology

Priority levels:
- **P0**: blocks any production adoption.
- **P1**: needed for the first adopted screen.
- **P2**: needed before release.
- **P3**: polish or defect.

### Summary table
| ID | Capability | Evidence / source | Status | What remains | Priority · acceptance criteria |
|---|---|---|---|---|---|
| G-00 | Company / founder brand approval | [DECISIONS](DECISIONS.md#visual-system-approved-2026-11-06) "Visual system approved" | **done 2026-11-06** | Nothing for the gate itself; asset exports remain under G-10 | ~~P0~~ · Approval recorded in DECISIONS |
| G-01 | Production token stylesheet | `dev/libraryTokens.ts`; `index.css` is a neutral scaffold; Tailwind theme empty | partial | Move tokens out of `dev/`; global alias stylesheet; Tailwind mapping | **P1** · Production code imports tokens without importing `dev/`; both themes render from attributes |
| G-02 | Fonts in production | Fontsource imported only in `DesignLibrary.tsx` | partial | Global import with subsetting | P1 · Production pages render Sora/Geist/Geist Mono with no CDN request |
| G-03 | Reusable Button / StatusChip / Dialog / Tooltip / HoldToApprove | `DesignLibrary.tsx` inline (`.lib-button`, `Badge`, `<dialog>`, hold handlers) | partial | Extract components with props, variants and tests | **P1** · Exported from `components/ui/`; hold keyboard dialog path tested; dialog focus return tested |
| G-04 | Logo sting CSS for `SnappLogo sting` | `.snapp-sting` referenced in `SnappLogo.tsx`; only `.lib-sting` exists in `DesignLibrary.css` | partial | Ship the brand §8 sting CSS with the component | P1 · `<SnappLogo sting />` animates once outside the library; reduced motion is static |
| G-05 | Tabs styling coupled to the library | `SnappTabs` uses `.lib-tabs`, styled only in `DesignLibrary.css` | partial | Move styles to `controls.css`; support one panel per tab | P2 · Tabs render correctly outside `/dev/library` |
| G-06 | Sound hook and persisted preference | `useLibrarySound` in `dev/SoundExamples.tsx`; state not persisted | partial | Promote the hook; per-user setting, default off | P2 · Setting persists; off by default; Stop and cleanup tests pass |
| G-07 | Production adoption of any library component | `App.tsx` routes use none (only `favicon.svg`) | absent | Migrate screens now that G-00 is approved, after G-01 to G-06 | **P1** · Each migrated screen passes §14 acceptance |
| G-08 | Target product surfaces (cutoff preparation, hours review, employee statement, client evaluation, run approval, recipient results, bank export, audit, settings) | [PAGES](PAGES.md), [UI](UI.md); library has fictional compositions for 6 of 9 (no bank export, audit or settings) | planned | Real pages with data, auth and states | P1 (per PRD P0 stories) · Each page shows loading, empty, error, stale and partial states and role scoping |
| G-09 | Original WAV shipped to production | `public/audio/finger-snap-original.wav` is copied into `dist/` | partial | Keep provenance in the repo, exclude the original from builds | P2 · Production `dist/` contains only assets used at runtime |
| G-10 | Brand asset exports | Brand §14: wordmark variants, PNG favicons, app icons, OG image | planned | Export assets with provenance | P2 · Files in `public/brand/` match the brand §14 list |
| G-11 | Testnet header chip, proof links, middle-truncated hashes with copy | Brand §11; no source | planned | Components with real-evidence-only rules | P1 for the Testnet surface · No placeholder hash in a proof slot; copy works; Testnet visible on every screen |
| G-12 | Brand signature motion beyond the sting (status flip, snap-to-order, agent tempo ticks, resonance tick, amount crossfade); spring presets | Brand §8; springs only as text in `DesignLibrary.tsx`; owner decided 2026-11-06 to **keep** all of them | planned | Implement each, first as library specimens and then as reusable utilities | P2 · Each matches the brand §8 timing, has a reduced-motion variant, never tweens money and has a test |
| G-13 | Agent presence lane and agent button variant | Brand §11; Autopilot verdicts (EXECUTE/DEFER/ESCALATE) exist only in the CLI ([ARCHITECTURE](ARCHITECTURE.md)) | planned | Design only once an authenticated surface exists; no web execution route exists | P2 · Agent steps attributable, timestamped and Ultraviolet; owner approval chip separate |
| G-14 | Money and hash display components | Amounts are inline text with the `lib-money` class | partial | `AmountDisplay` (currency/asset code, tabular, full spoken form) and `Hash` | P1 · Screen readers read the full amount; Testnet asset label always present |
| G-15 | CSV export hardening | `ReportExamples.tsx` `download()` joins raw values | partial | RFC 4180 quoting, formula-injection guard (`= + - @`), server-side export for real data | **P1** before real data · Names containing commas or leading `=` export safely (tests) |
| G-16 | Assertive announcements for failure and unknown outcomes; full spoken amounts | Feedback states use `role="status"` only | partial | Live-region policy per brand §13 | P1 · Unknown or failed transitions announce assertively; amounts are read in full |
| G-17 | Error summary linking | `ValidationExamples.tsx` shows a count only | partial | List of links to each invalid field | P2 · Each summary item moves focus to its field |
| G-18 | Composition (IME) handling test | `SnappTextField` suppresses invalid state while composing; no test | unverified | Test, plus a real IME check (Japanese, Chinese, Korean, Filipino keyboards) | P2 · No premature error during composition; correct count after commit |
| G-19 | Missing control types | No checkbox, radio, multi-select, combobox, number or money input, file upload, skeleton | absent | Build as target pages require them, with the same contract | P2 · Same state matrix and tests as §4 |
| G-20 | Browser-level test suite and visual regression | Vitest and jsdom only | absent | Playwright (or similar) for overlays, focus, touch emulation and screenshots in both themes | P1 · CI runs the browser suite on 360, 768 and 1280 px |
| G-21 | Performance budget and frame-time measurement | None | absent | Define a JS/CSS budget and measure loading, report and sting frame times on a mid-range phone | P2 · Budget enforced in CI; trace recorded |
| G-22 | Text-encoding defects | `DesignLibrary.tsx:1276` tilt slider suffix is a literal `"?"` (likely meant `°`); `App.tsx:17` fallback reads "Loading design library?" | partial | Correct the characters | P3 · Slider reads "−16°"; fallback text is correct |
| G-23 | Dependency advisories | `npm audit --omit=dev` (2026-11-06): react-router-dom/react-router **moderate** (web); axios **high** via `@stellar/stellar-sdk` (agent) | partial | Upgrade react-router within this repo's process; Stellar SDK changes are a founder-owned payment decision | P2 (web) · Web audit clean or exceptions recorded |
| G-24 | Paper print and export styling for statements | Brand §5 says Paper is for print; no print CSS | planned | Print stylesheet for employee statements | P3 · Statement prints legibly in Paper without interactive chrome |

### A. Present in the library, not integrated into production
Production uses none of these. The only exception is `public/favicon.svg`, which `index.html` links.

- Tokens and themes: G-01
- Fonts: G-02
- `SnappControls` (all controls, toasts, provider)
- `SnappLoading`
- `SnappLogo`
- Sound modules: G-06
- Report tables and charts
- Validation module
- Hold-to-approve and confirmation dialog: G-03

The production sidebar still renders "Snapp" as text with neutral Inter styling. Now that the visual system is approved, it should be replaced by `SnappLogo` and the tokens during migration (G-07).

### B. Documented or planned, absent from the library
- Target pages and their real states: G-08
- Testnet header chip, proof links and hash truncation: G-11
- Brand signature motion and springs: G-12
- Agent lane and agent button: G-13
- Money and hash components: G-14
- Additional control types: G-19
- Print styling: G-24
- Brand asset exports: G-10
- Company bank-export UI (pending provider verification)

The library's employee statement, client evaluation and recipient results compositions are static fictional views. They do not implement discrepancy submission, revision or acceptance history, or reconciliation.

### C. Incomplete component states, interactions or accessibility
- Buttons lack busy, agent and icon-only variants (G-03).
- Switch and slider lack description and error props.
- Select has a fixed placeholder and no multi-select or search.
- Tabs use a shared panel and library-coupled styles (G-05).
- The error summary is not linked to fields (G-17).
- There is no assertive live-region policy and no spoken-amount form (G-16).
- Composition handling is untested (G-18).
- Dialog focus return and the hold keyboard path are untested.
- Date hints show ISO bounds and treat "Asia/Manila" as text only, with no timezone logic.
- CSV is unescaped (G-15).
- Encoding defects remain (G-22).

### D. Validation, data loading and backend integration still required
- **No frontend data layer for library components.** There is no fetch, caching, stale detection or error mapping, and no optimistic or rollback rules. Every library interaction is a local simulation, and every "validated", "approved", "locked" and "sent" message is fictional.
- **Server validation** for all rules in [§5](#5-validation), with field-addressable errors.
- **Authentication and RBAC.** Employee-only and client-only scoping is a precondition for statement, client and report pages.
- **Immutable run versions and approval endpoints.** The approval specimen's "v3 · locked" has no backend, and no HTTP payout or approval route exists. The former route returns 404 by design.
- **Reporting endpoints:** server-side aggregation, pagination and export.
- **Proyekto references:** integration method unverified ([INTEGRATIONS](INTEGRATIONS.md)).
- **Evidence-backed payment states.** Teal and "Claim confirmed" may appear only from reconciled Noir evidence. Velo states come only from verified, deduplicated and retrieved events. Bank states need a verified bank facility, which is out of Testnet scope.

### E. Outstanding review
| Review | Status |
|---|---|
| Native-browser visual QA, Ink and Paper, 360/768/1280 px, 200% zoom | **Unverified.** Browser automation was unavailable for the library sessions. Impeccable rendered scans exist only at 1280 × 800 and 360 × 800. |
| Physical-device and touch (hold interruption, sliders, calendar) | **Unverified.** jsdom pointer events are not touch evidence. |
| Keyboard-only walkthrough of all categories | Partially tested in jsdom; **unverified** in a browser |
| Screen readers (NVDA, JAWS, VoiceOver, TalkBack), including toast announcement timing and chart reading order | **Unverified** |
| Frame-time and FPS measurement (loading loop, report updates, 3D studies) | **Unmeasured.** No FPS claim. |
| Audio listening review, device latency and the 310 ms sync by ear | **Unverified.** The browser preview is the listening surface. |
| Clipboard, CSS, JSON and CSV downloads in real browsers | **Unverified** |
| Motion and 3D review with the design owner and founder | **Pending** |
| Impeccable scans | Snapshots in [docs/qa/](qa/) contain warnings and advisories, including intentional brand exceptions documented in the [audit](DESIGN_LIBRARY_AUDIT.md). **There is no "perfect quality" or clean-scan certification.** |

---

## 14. Approval and acceptance

### Approval gate
- [x] Founder/company approves palette, typography, logo usage, motion and sound direction in both themes. Approved 2026-11-06 and recorded in [DECISIONS](DECISIONS.md#visual-system-approved-2026-11-06).
- [x] Owner confirms the 750 ms hold duration. Confirmed 2026-11-06.
- [x] Owner decides whether to keep or drop the unbuilt brand animations. Kept 2026-11-06 (G-12).
- [ ] P1 infrastructure gaps (G-01 to G-04) resolved before the first production screen migrates.

### Design acceptance checklist (per adopted screen; carried forward and extended)
- [x] Brand reference approved (G-00)
- [ ] Brand asset exports produced (G-10)
- [x] Typography and tokens documented (this document, §3)
- [ ] Mobile 360 px layout verified in a real browser, plus 768 and 1280 px
- [ ] Contrast at least WCAG AA for text and controls on actual component backgrounds
- [ ] Full keyboard navigation, visible focus and descriptive labels, verified in a browser
- [ ] Loading, empty, error, stale, partial and success states, all with honest copy
- [ ] Screen-reader pass on the screen's critical path
- [ ] Reduced-motion and forced-colors pass
- [ ] Client validation mirrors a server contract that exists and is tested
- [ ] No teal, "paid" or proof link without real evidence. Testnet labeled.
- [ ] Founder screenshot approval

---

## 15. Recorded discrepancies

| Topic | Conflict | Resolution |
|---|---|---|
| Logo looping | Brand §4 and §8 say "don't animate the logo continuously". The loader loops. | Owner decision 2026-11-06: **loading-only exception**. The sting still plays once. |
| Snap sound | Brand §8 describes synthesized sound with a ~1 s reverb tail and "no sample to record". | Owner decision 2026-11-06: the **recorded Vinrax CC0 snap** is the default, dry. Synthesis is a fallback. Brand text is superseded on this point. |
| `/dev/hold` lab sound | The lab still calls synthetic `playSnap`. | Leave it as a tuning tool. Do not treat it as the reference snap. |
| Spring presets | Brand §8 lists springs. DESIGN_LIBRARY says "documented spring presets". | Kept by owner decision 2026-11-06. Still unimplemented (§7, G-12). |
| Report positive color | Brand: "neither Volt nor Ultraviolet means success". The library uses Volt for passed checks. | Owner decision 2026-11-06: `report-positive` (Volt) applies **only** to explicitly passed data checks, never payment or trend success. |
| Root typecheck and build | DESIGN_LIBRARY, the audit and CHECKLIST say these are blocked by a Buffer/string mismatch in `apps/server/src/payments.ts`. | **Resolved upstream** by the Velo reconciliation commit (`verifyVeloWebhook(rawBody: Buffer, …)`). Root typecheck and build pass as of 2026-11-06. No payment code was changed by this task. |
| Root `npm test` | CHECKLIST says the root test command passes. | On Windows, 20 of 32 `packages/agent` tests fail with `PRIVATE_JOURNAL_DIRECTORY_REQUIRED` (POSIX `0700` check in `noir-store.ts`). This is unrelated to the design library and not fixed here. The web suite passes. |
| Dependency audit | DESIGN_LIBRARY: "two moderate audit findings". | Now 4 production findings: 3 moderate, 1 high (§13 G-23). |
| Host Node version | Host Node v24.10.0 is below the supported `>=24.22.1` (still true). | Use a supported Node for authoritative validation. |
| Design status | The previous version of this document said "intentionally on hold" with no direction. | **Approved 2026-11-06.** The library is the approved foundation. Production screens migrate one at a time under §14. |

---

## 16. Verification record

2026-11-06, Windows, Node v24.10.0 (unsupported minor; see §15):

| Command | Result |
|---|---|
| `npm test -w @agentpay/web` | **47 passed** (5 files) |
| `npm run typecheck` (root) | Pass |
| `npm run build` (root) | Pass. The library chunk is absent from `apps/web/dist/assets`. |
| `npm test` (root) | Fails in `packages/agent` on Windows (20 of 32, journal directory permission check). Pre-existing and outside this task. |
| `npm audit --omit=dev` | 3 moderate, 1 high (G-23) |

This document was produced from source inspection. The Impeccable skill was not available in this session, so no new detector scan was run; the existing snapshots in [docs/qa/](qa/) remain the latest. No browser, device, screen-reader, audio or frame-time review was performed.
