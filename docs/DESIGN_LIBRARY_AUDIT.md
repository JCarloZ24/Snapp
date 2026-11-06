# Snapp library: Impeccable audit and refinement

Date: November 6, 2026 (Asia/Manila). Target: `/dev/library`, on `feat/design-library`.

## Scope and method

Installed the official `pbakaus/impeccable` Codex skill (skill metadata v4.8.0) into the user's global Codex skills directory using the skill-installer. Read its context, audit, harden, polish and craft-floor guidance. This was a refinement of the supplied Snapp brand, not a redesign. No hooks, project-wide ignore rules, deployments, payment services or production UI were enabled.

Reviewed all eleven library categories. Ran the mechanical detector once against the changed component/style sources and the rendered Ink and Paper URLs at its default 1280 × 800 viewport. The scanner produced findings for both URLs even though the interactive browser tools were unavailable. The command returned exit 1 with findings; this is not a clean detector exit. The sanitized snapshot is [design-library-impeccable.json](qa/design-library-impeccable.json).

The raw scan contains **19 warnings and 13 advisories**, before the last targeted fixes described below. Do not present that snapshot as a passing certification. The numerical rating below is an engineering judgment using Impeccable's rubric, not a score produced by the detector.

## Implementation integrity verdict

The library expresses the supplied Snapp system: the actual Slip S artwork, explicit owner/agent authority, exact amounts, and reconciliation states. Generic warnings must not replace this product meaning. Functional shortcomings in the first version required correction before reuse.

| Dimension | Initial source review / 4 | After refinement / 4 | Evidence and remaining limit |
| --- | ---: | ---: | --- |
| Accessibility | 2 | 3 | Keyboard dropdown/calendar/tabs and inline errors tested in jsdom; real screen-reader and touch checks remain |
| Performance | 3 | 3 | Local fonts; dev library tree-shaken from production; purposeful transform/opacity motion; no runtime profile |
| Theming | 2 | 3 | One runtime/export alias source, themed portals and Paper ripple token; detector evidence for both themes, final visual review remains |
| Responsive behavior | 2 | 2 | Responsive source rules and 44 px targets; no verified mobile render/touch/zoom matrix |
| Implementation integrity | 2 | 3 | Shared custom controls, real validation and local-only workflow truth; intentional detector exceptions documented |
| **Total (provisional)** | **11/20** | **14/20** | **Good; complete the outstanding visual/assistive-technology checks before release** |

## Prioritized findings and changes

| Priority | Finding | Change | Verification |
| --- | --- | --- | --- |
| P1 | Text fields could imply valid input without checking requirements | Pure validators for required/min/max grapheme counts, whitespace/format-only content, allowed cutoff values, strict dates and inclusive bounds; submit validation and input preservation | Boundary, Unicode, leap-day, malformed-date, unknown-option and form tests |
| P1 | Invalid submission did not guide users to the first incorrect field | Inline linked errors, error summary, focus on first invalid control; no browser validation bubble | Invalid-submit DOM test and focus assertion |
| P1 | Tabs lacked roving keyboard navigation | Shared tabs with arrow/Home/End behavior and linked panels | Keyboard DOM test |
| P1 | Approval hold could continue after interruption | Cancel on pointer release/leave/cancel/lost capture, window blur, hidden document, search changes and unmount | Pointer-cancel and window-blur regression tests; physical touch remains unverified |
| P2 | Visible browser-native selects and range/checkbox controls conflicted with custom-control request | Snapp-styled React Aria select, calendar/date segments, switch and slider; theme variables carried into portal overlays | Dropdown keyboard/Escape, calendar bounds, selection, focus return and Paper portal tests |
| P2 | Permanent notification had no dismissal or lifecycle | Custom toast queue, three visible items, six-second info timeout, hover/focus/hidden-tab pause; warnings/errors persist until dismissed | Pause/resume and persistent error tests |
| P2 | Paper logo ripple used Volt against a light surface | `--ripple` maps to Volt on Ink and Ink 950 on Paper; two one-shot echoes | Theme token/replay focus test; static source verification. Animated visual confirmation still required |
| P2 | Runtime aliases and downloaded token aliases could diverge | Runtime and CSS export now use the same semantic/control maps | Shared source; includes ripple, control border, text progress and selection |
| P2 | Labels under the brand's 12 px floor | Raised specimen labels; 16 px editable fields on mobile | Source inspection; rendered scan did not flag tiny text |
| P2 | Disabled dropdown had compounded opacity and poor readability | Preserve readable text and hints, use dashed border/muted text to show disabled state | Source correction following rendered contrast findings |
| P2 | Extra card frames and preview containers added visual noise | Flattened feedback and preview surround; retained the actual component specimen boundary | Source correction following nested-card findings |
| P3 | One-word line endings and caption over textured background | `text-wrap: pretty` for body/hint copy; solid caption backing | Source correction following scanner advisories; not visually certified |
| P3 | Replaying the logo replaced the focused replay button | Remount only the animated logo subtree | DOM focus regression test |

## Intentional detector findings

- **Overused font (8 warnings):** Geist and Geist Mono are explicit choices in `SNAPP_BRAND.md`. Keep them; Sora remains the display face. A generic anti-pattern warning is not permission to change the brand.
- **Repeated “Required” (2 warnings):** each field labels its own requirement and retains required semantics. These are independent controls, not repeated marketing copy.
- **Nested cards (6 warnings across two themes):** removed redundant feedback/preview frames. The remaining generated control containers are actual inputs/selects within a component specimen, not decorative card nesting. Do not remove control boundaries to appease this heuristic.
- **Stripe advisory (2):** the 45-degree amber hatch belongs only to unconfirmed-outcome specimens, as specified by the brand. It is not general decoration.
- **Em-dash advisory (2):** the library displays CSS custom-property names (`--token`) and the tempo-line specimen. The detector counts these alongside prose. Do not alter valid CSS names or the approved specimen to lower the count.

No blanket rule suppressions were added. Findings remain available in the snapshot for reviewers.

## Custom component contract

All visible control surfaces are authored for Snapp. React Aria supplies unstyled focus, keyboard, calendar and selection behavior; it does not supply a visual theme. Its hidden native select is intentional for form/autofill semantics and is not the visible dropdown. Native HTML input/textarea/dialog semantics remain underneath the custom design.

Text progress measures user-perceived characters after trimming edge whitespace. The border fills toward the maximum, while the accompanying text/icon and border color identify minimum-met, near-limit (90%), and invalid states. Paste and input composition are preserved. Exceeding a limit produces a correction instead of silently deleting text. Valid fields and routine notifications use neutral/check styling, not settlement teal.

Example review dates are explicitly bounded to November 1–December 15, 2026; this is a specimen window, not a payroll policy. These client-side rules demonstrate behavior only. A future authenticated endpoint must independently validate its business rules, permissions and immutable run identity; this patch does not provide server-side payment validation.

## Required release follow-up

- Inspect final Ink/Paper rendering at actual 360, 768 and 1280 px widths and 200% zoom.
- Inspect the ripple while playing in both themes and under reduced motion.
- Exercise dropdowns, date segments/calendar, sliders, toast focus and native dialog with a real keyboard and screen reader.
- Exercise hold interruptions and sliders with synthesized touch and a physical device. jsdom pointer events are not touch evidence.
- Verify clipboard/export downloads in the browser and review motion with the designer/founder.
- Use a supported Node version for complete-repository validation. (The server webhook type mismatch was resolved upstream; root typecheck/build pass as of 2026-11-06. See [DESIGN.md §15](DESIGN.md#15-recorded-discrepancies).)

Native browser discovery returned no browser, and the Windows helper returned a missing native-pipe error. Therefore no human-visible screenshot review, real-browser interaction matrix or accessibility conformance claim is recorded. This implementation is a tested component foundation for development, not a production or “perfect quality” certification.


## Follow-up: fields, loading, reporting and motion

Scope remains the draft development library on `feat/design-library`. No payroll or production-screen behavior changes.

| Before | After | Reason |
| --- | --- | --- |
| Focus ring plus length perimeter | One contiguous field perimeter; meter beside count | Keep focus and errors legible without double outlines |
| No dedicated branded loading specimen | Reusable logo loading view with explicit resolve, fail and retry | Show pending work without fabricated progress |
| No report component specimens | Two custom charts, sortable/filterable table, pagination and CSV | Exercise real report interactions using clearly fictional data |
| Motion tokens without interaction examples | Hover/press toggle, optional nudge, one-time scroll entrance | Make timing and reduced-motion behavior reviewable |
| Anchor jump | Native smooth pointer navigation; immediate keyboard navigation | Avoid JS wheel handling and per-frame rendering |

Updated by owner direction: loading now uses a six-second repeating sequence of the original two arcs, forming linked infinity-like loops and an open orbit before returning to Slip S. The separate activity line is removed. The one-shot sting elsewhere is unchanged. Scroll uses IntersectionObserver for a single note; data values and chart bars never animate. Reduced-motion preferences disable effects. Verdict: suitable for owner review as library specimens; no measured FPS or production-readiness certification.

Validation: 34 web tests and the existing agent test pass. Web typecheck/build pass. Root typecheck/build remain blocked by the existing `apps/server/src/payments.ts:6` Buffer/string mismatch. Interactive browser surfaces are unavailable, so real-device visual, keyboard and frame-time acceptance remain open.

Impeccable scanned source and both rendered themes at 360 x 800. The snapshot `qa/design-library-extensions.json` has 17 findings (launcher exit 1): five pinned-font warnings; four heading-wrap advisories subsequently addressed with balanced headings; two required-label warnings retained for per-field clarity; two token-name/em-dash advisories; two brand hatch advisories; two existing nested-control advisories. No contrast finding was reported. Snapshot precedes the final heading and readable-chart-width refinements; this is not a clean-scan claim.


## Follow-up: report data controls, motion and tooltips

Implemented three filtered scorecards, three dated sparklines, a custom segmented date-range input and range calendar, explicit Apply, a second-cutoff preset, project/state filters, employee search and reset. Inclusive date bounds, incomplete/reversed/out-of-month inputs and empty results are handled without replacing a valid applied report. Fixtures carry record dates; exports include them. This remains a local fictional report, not a backend reporting endpoint.

All report views derive from the same filtered rows. Bar/project transforms interpolate over the settle token; the report content uses one interruptible 250 ms opacity/4 px transition on actual displayed-data changes, including keyboard-triggered changes as requested by the owner. Monetary values do not count up. Reduced-motion settings bypass animation. Custom themed tooltips appear on hover or focus and dismiss with Escape; visible data labels remain available without hovering. No per-frame React state updates or new chart dependency.

Verification: 39 web tests pass, including inclusive date selection, incomplete-range rejection, shared totals, filter recovery, point tooltips and reduced-motion behavior. Web typecheck passes. Root typecheck/build retain the existing server Buffer/string blocker. Impeccable scanned both themes at 360 x 800 and returned nine existing warnings/advisories (font 1; per-field Required labels 2; token-name punctuation 2; brand hatching 2; nested control containers 2), with no contrast finding. Snapshot: `qa/design-library-reports.json`. Actual-browser tooltip placement, screen reader reading order and frame times still need manual review; scan/test success is not visual certification.


Outcome-color follow-up: owner requested positive/negative semantics. Added report-positive (Volt 300/700) and report-negative (Red 400/700) aliases, labeled completeness-check outcome totals and segmented summary, matching table outcomes, icons and explanatory tooltips. These are explicit fictional check results, never payment confirmations or inferred good/bad financial trends. Generic quantity charts remain violet. Forty web tests pass; web build/typecheck pass. Root build/typecheck still fail on the existing server Buffer/string mismatch. Mobile rendered scans in both themes report the same nine warnings/advisories and no contrast finding; manual visual QA remains open.


Expanded chart gallery follow-up: added a large observed-point sparkline, a submitted/passed-check-hours combo with a shared zero-based hour axis, and a count-based outcome pie. All derive from the filtered records and participate in the report update transition; combo bars also interpolate scale. Custom tooltips support hover/focus/Escape and the pie legend exposes counts/percentages. Narrow screens scroll the Cartesian plots at a readable label size; the pie stacks above its legend. Empty and single-category pies are explicitly handled. Forty-one web tests pass, with shared-filter totals, combo tooltips, 100% circle and empty-state coverage. Web typecheck/build pass; root commands retain the known server Buffer/string failure. Both mobile theme scans returned the same nine existing warnings/advisories and no contrast finding; real-device visual and frame-time review remains pending.


## Sound library and recorded logo snap

Added a Sound category with sound disabled initially, 35% preview gain, independent preparation/cancellation/snap previews, a logo preview, Stop, synthesis token reference, recorded-asset metadata and JSON download. The Motion replay uses the same sound preference. Previews close audio contexts on replay, mute, volume change, hide and unmount; interrupted resume/load operations cannot emit a late snap. Web Audio schedules the snap at the 310 ms logo release (immediate for reduced motion); decoding finishes before the visual starts.

The owner rejected the synthetic snap as unnatural. The default now uses Vinrax's CC0 recording from https://opengameart.org/content/snap-of-the-fingers-sounds. `public/audio/LICENSE.md` records provenance, original hash and reproducible trimming. The recording is dry, without added bass or reverb. The synthesis remains a labeled fallback if loading fails, plus an explicit comparison button; its low thud, warmth and wet level were reduced. Preparation and cancellation remain synthetic. Loading loops and report changes remain silent.

Validation: 47 web tests pass, including off-by-default behavior, 310 ms scheduling, reduced-motion timing, replay/mute cleanup, cancellation without a snap, cancelled resume, recording default, explicit fallback and unsupported-audio recovery. The WAV route returns HTTP 200 and its PCM duration/header were inspected. Root typecheck/build retain the known server Buffer/string failure. Audio timbre and physical device latency have not been judged by ear here; the browser preview is the listening review surface.
