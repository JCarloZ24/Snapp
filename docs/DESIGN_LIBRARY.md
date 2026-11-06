# Snapp design library

Draft review implementation based on `SNAPP_BRAND.md` v0.2 and the supplied Slip S v1 SVG. The visual system was approved on 2026-11-06 (see [DECISIONS](DECISIONS.md#visual-system-approved-2026-11-06)). The library is still not a working payroll workflow.

The actionable specification, component contracts and prioritized gap inventory now live in [DESIGN.md](DESIGN.md), which specifies this library as the approved frontend foundation. Where this file and DESIGN.md differ, DESIGN.md reflects the later source check (2026-11-06).

## Run

From a clean clone, use a Node version supported by `package.json`, run `npm ci`, then `npm run dev -w @agentpay/web`. Open `http://localhost:5173/dev/library` (or the port printed by Vite). No backend or credentials are required. The page is development-only and excluded from the production JavaScript bundle.

Branch scope: `feat/design-library`; frontend specimens, tokens, bundled fonts and documentation. Existing product styling and payment orchestration are unchanged.

## Included

- One page with an indexed navigation, category/token search, Ink/Paper switch and downloadable CSS tokens.
- Brand reference, full palette, semantic aliases, type scale, spacing, radius, elevation, grid and graphic elements.
- Component controls, labeled status examples, selectable empty/loading/error/stale/partial/reconciliation states.
- Fictional owner review, employee statement, client evaluation and recipient-result compositions. Viewport controls constrain the specimen width; on smaller windows they do not emulate a larger browser.
- Approval hold with early-release cancellation and native keyboard confirmation dialog. All actions are local simulations and make no API calls.
- One-shot SVG sting, motion timing/easing and documented spring presets; link to the existing hold/sound playground.
- Three CSS 3D studies: evidence depth, prepare/release and spatial stages. Depth/tilt controls and flat reduced-motion fallback. No WebGL, lighting engine or third-party 3D assets are needed for these HTML planes.
- System reduced-motion preference takes precedence over the local toggle. Accessible names, native dialog, visible focus and calculated contrast specimens.
- Custom Snapp dropdowns, date/calendar picker, switches, sliders and notifications; no visible OS select menu. Accessible behavior comes from unstyled React Aria primitives.
- Validated review form and idea-field specimen with grapheme-aware length progress, inline corrections and preserved over-limit input. Valid form state never uses settlement teal.
- Single field perimeter for focus/error; a quiet length meter beside the count replaces the second border. Exact maximum reads "Limit reached" and remains valid.
- Loading category: reusable `SnappLoading`, six-second repeating logo sequence (Slip S, infinity-like linked arcs, open orbit, Slip S), static reduced-motion mark, resolve/failure/retry controls.
- Reports category: three scorecards with dated sparklines, custom SVG record-date chart and project bars; fictional records, sorting, custom date-range calendar with Apply, project/review-state filters, employee search, reset, empty-state recovery, pagination and filtered CSV export. All views share the same filtered data. Table and chart scroll within their own region on narrow screens.
- Sound category: opt-in controls, volume, Stop, recorded snap, preparation/cancellation previews, synchronized logo replay, token reference and JSON download. The default snap is Vinrax's CC0 finger recording, trimmed to 98.8 ms with a short fade; provenance and the unmodified original ship in `apps/web/public/audio/`. No added bass or reverb is applied to the recording. Synthesis is an explicitly labeled fallback.
- Expanded chart gallery: full-width sparkline, same-axis bar/line combo (submitted versus passed-check hours), and outcome pie with counts/percentages. All share report filters, custom hover/focus tooltips and reduced-motion behavior. Zero-record pies show an empty state; a single category renders a full circle.
- Report colors: theme-aware `report-series` violet for data, amber for needs-review states, lime for passed data checks, red for failed data checks, and a visible legend. Outcome summaries and table labels derive from the same filtered fictional records. Payment settlement colors are not used for proposed report values.
- Report updates: bars interpolate their scale; the report content moves 4 px and fades into place over 250 ms when displayed data changes. Scorecard values update directly. Custom tooltips support hover, focus and Escape on scorecards, sparkline points, chart bars and project totals. Reduced-motion settings disable transitions.
- Motion category: hover/press toggle, explicit validation-nudge replay, one-time observed scroll entrance. Native smooth section navigation for pointer input, immediate keyboard/reduced-motion navigation; no wheel interception or per-frame React updates.
- Paper logo ripple now uses Ink contrast. Open `/dev/library?theme=light#motion` to review it.

## Files and tokens

`apps/web/src/dev/libraryTokens.ts` holds palette, aliases, typography and motion data plus the CSS export. `DesignLibrary.tsx` composes specimens; `DesignLibrary.css` scopes styling under `.snapp-library`. Font files are bundled through Fontsource, not fetched from a runtime font CDN. The reference SVG is copied unchanged into `apps/web/public/brand/` and is public static artwork.

The supplied reference sheet includes a green lower arc in its Paper construction diagram; actual Paper wordmarks follow the brand document's one-color Ink rule. Spatial values are explicitly proposed extensions, not approved brand tokens.

Reusable controls and validation functions live in `apps/web/src/components/ui/`. Their behavior tests use Vitest, Testing Library and jsdom. Run `npm test -w @agentpay/web`. Runtime and exported theme values share `libraryTokens.ts`, including the new ripple, selection, control-border and field-progress aliases.

See [Impeccable audit](DESIGN_LIBRARY_AUDIT.md) for the review, raw detector snapshot, fixed issues, intentional brand exceptions and remaining acceptance work.

## Verification — November 6, 2026

- Web TypeScript check: passed.
- Web production build: passed; development library code is excluded.
- Web behavioral suite: 47 tests covering validation, custom-control behavior and library integration. Root test command also runs the existing agent test; the server runner reports zero tests.
- Root `npm run typecheck` and `npm run build`: at the time, blocked by the `apps/server/src/payments.ts` Buffer-to-string mismatch. **Update 2026-11-06:** resolved upstream by the Velo reconciliation change; root typecheck and build now pass. See [DESIGN.md §15–16](DESIGN.md#15-recorded-discrepancies).
- Preview route and Vite-transformed library module: HTTP 200.
- Impeccable produced rendered scan results for Ink and Paper at 1280 × 800. Final visual/interaction QA is not completed; browser automation was unavailable. The scan had warnings/advisories, not a clean certification.
- Installed host Node v24.10.0 is below the repository's supported v24.22.1 minimum. npm also reported two moderate audit findings at the time; the 2026-11-06 re-check reports three moderate and one high production finding (see DESIGN.md gap G-23). Dependency remediation is outside this UI patch.

## Remaining manual acceptance

- [ ] Inspect Ink/Paper layouts at actual 360, 768 and 1280 px browser widths.
- [ ] Keyboard navigation, dialog focus return, hold cancellation and touch testing.
- [ ] Confirm search, clipboard, CSS download and native reduced-motion behavior in a browser.
- [ ] Review every motion/3D study with the design owner and founder.
- [x] Founder/company brand approval before adopting these styles in product screens (approved 2026-11-06).

Skills used: Sites (local repository workflow), skill-installer, Impeccable (audit/harden/polish), and computer-use (attempted browser inspection). Impeccable is installed globally for this user and available as a named skill on the next turn. No publication or Figma file was created.
