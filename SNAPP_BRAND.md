# Snapp Brand Guidelines

**Pay fast, in a snap.**
Version 0.2 · November 6, 2026 · Logo direction C ("Slip S") selected
Team: Stobeeney (Designer), JCarloZ24 (Developer), aidantiu (Developer), JoshuaHM-p4 (Founder/Fullstack)

> **Status:** Draft for team use. Per the README, brand styling stays on hold for company adoption until Prodigitality approves it. Keep everything in tokens and the `SnappLogo` component, so a change costs minutes.

---

## 1. Brand core

### The idea: prepare, then release

A finger snap is not one instant. The finger presses against the thumb, slips off, and the sound rings out. Snapp's logo is that slip: the S is split into two arcs, and the gap between them is the snap.

| Phase | In a snap | In Snapp | In the logo |
|---|---|---|---|
| **Tension** | Finger presses on the thumb | The agent prepares the cutoff: hours, rates, deliverables and client evaluations, sorted and checked | Top arc (preparation) |
| **Snap** | The finger slips off | The owner approves one locked pay-run version | The gap |
| **Resonance** | The sound carries | Each recipient is executed and reconciled on its own, with proof | Bottom arc in Volt (release) |

### Two snaps

1. **The thinking snap (agent).** People snap to put their thoughts in order. Snapp's agent does that for the owner: it snaps the cutoff into order, flags problems and lines up the evidence.
2. **The release snap (owner).** Only a person releases money. The owner's snap approves the exact recipients, amounts and total.

The rhythm of the product is **tick, tick, SNAP.**

### Brand promise

**Snapp makes the release instant, not the checking.**
Speed comes from preparation, not from skipping steps. A clean snap is fast *and* exact.

### Positioning

For small service teams whose owners pay people one transfer at a time, Snapp is the agentic pay-run layer that turns verified work into an exact, owner-approved payout. It works alongside the tools a team already uses (such as Proyekto), and every payout traces back to the work behind it.

### Taglines

- Primary: **Pay fast, in a snap.**
- Supporting: **Prepare. Release. Snapp.**
- Supporting: **Verified work. Released in a snap.**
- Supporting: **Every peso, traced to the work.**
- UI moment only: **Snap. Settled.** Use it only after funds are actually claimed or settled.

---

## 2. Keywords and personality

| Keyword | What it means for design |
|---|---|
| **Crisp** | Flat stroke ends, hairline borders, short durations, no soft blobs |
| **Exact** | Tabular numbers, explicit currency, nothing rounded or estimated |
| **Tempo** | Everything moves on a beat; timelines read like a metronome |
| **Release** | One clear moment of human approval per run |
| **Traceable** | Every amount links back to hours, deliverables and evaluations |
| **Calm-fast** | Quick without being frantic |
| **Accountable agent** | The agent is visible, labeled and logged; it never acts as the boss |

- **We are:** precise, quick, confident, quietly playful, transparent.
- **We are not:** flashy, hype-driven, "crypto bro," robotic, vague, cute.
- **Think:** a conductor's downbeat, a camera shutter, a well-made mechanical key.
- **Not:** a slot machine, a lottery win, a sci-fi robot.

---

## 3. Mood board

### Reference sites (Awwwards picks)

| Site | What we take from it | What we don't |
|---|---|---|
| Spade (spade.com) | Single-glyph confidence and one big real number up front | Coin renders |
| Amp (amp.framer.media) | A short, decisive wordmark and generous photography | Promises such as "instant, anywhere" |
| Razorpay Sprint '26 | An editorial index system (01/, 01/A), big stacked display type and an "agentic era" energy | Dense launch-wall layouts |
| Velto (New Minds) | Honest money UX: the total, fee and amount received shown before confirming; tabular numbers; editable review | Its forest-and-volt palette. Snapp's Volt sits on Ink and Ultraviolet so the two brands stay distinct |

### Physical references

High-speed strobe photography, split-flap departure boards, metronomes, single-transient audio waveforms, camera shutters, International Typographic Style grids, mechanical keyboard switches.

**Mood words:** ink-dark, electric, hairline, freeze-frame, click, downbeat, clean decay.

### Avoid

Cash piles, gold or crypto coins, humanoid robots, glowing brains, matrix code, handshakes, bank logos, fake receipts or transfer screens.

---

## 4. Logo

### The system

| Asset | What it is | Use |
|---|---|---|
| **Wordmark** (primary) | `snapp` drawn in monoline geometry; the s is the Slip mark | Headers, marketing, documents, the demo video |
| **Slip mark** | The s on its own | App icon, favicon, avatar, loading, the snap button |
| **Slip mark (small)** | The same mark with the gap widened to 7 units | Anything under 24 px |

The wordmark is artwork, not typed text. Never set "snapp" in a font as a stand-in for the logo. Use the `SnappLogo` component or the exported SVGs.

Reference sheet: [Final logo, Slip S v1](docs/brand/snapp_logo_final_slip_s_v1.svg).

### Construction

| Element | Value (units) |
|---|---|
| x-height (stroke centerline) | 36 |
| Stroke | 7, flat (butt) caps everywhere |
| Round bowls (a, p) | Radius 18 |
| n arch | Radius 13 |
| s bowls | Two 270° arcs, radius 9, stacked |
| **Slip gap** | 4 between the arcs (7 in the small version) |
| Descender (p) | 14 below the baseline, plus stroke |
| Letter spacing | 8 between stroke edges |
| Overshoot | Round letters overshoot baseline and x-height by half a stroke (3.5) |

- **Top arc = preparation.** Paper on Ink, or Ink on light backgrounds.
- **Bottom arc = release.** Volt on Ink. On light or Volt backgrounds it matches the rest of the logo.

### Color versions

| Version | Background | Letters and top arc | Release arc |
|---|---|---|---|
| Primary | Ink 950 | Paper 50 | Volt 400 |
| On paper | Paper 50 or white | Ink 950 | Ink 950 |
| On volt | Volt 400 | Ink 950 | Ink 950 |
| One color | Any approved color | Single color | Same single color |
| On photo | Ink scrim at 60% or more | Paper 50 | Volt 400 |

### Sizes and clear space

- **Clear space:** one s-bowl height (about half the x-height) on every side.
- **Minimum size:** the wordmark is at least 72 px wide; the mark is at least 16 px tall. Use the small mark under 24 px.
- **App icon:** Paper and Volt mark on an Ink tile. The alternative is an Ink mark on a Volt tile.
- **Favicon:** the small mark on an Ink tile at 32 and 16 px, plus a 180 px Apple touch icon and 512 px PWA icons.

### Don'ts

- Don't close the gap or let the arcs touch.
- Don't round the stroke ends.
- Don't put Volt on the top arc or swap the arc colors.
- Don't use Ultraviolet anywhere in the logo, since it's reserved for the agent.
- Don't rotate, mirror, outline, stretch, or add gradients, glow or shadows.
- Don't animate the logo continuously. The sting plays once.
- Don't place it on a busy photo without a scrim.
- In running text the name is **Snapp**. Never write "SnApp," "SNAPP" in a sentence, or "Snap."

---

## 5. Color

### Palette

**Ink (neutrals, dark-first)**

| Token | Hex | Use |
|---|---|---|
| ink-950 | `#0A0A0F` | Dark background, primary text on light |
| ink-900 | `#12121A` | Dark surface |
| ink-800 | `#1A1A25` | Dark raised surface |
| ink-700 | `#2A2A38` | Dark borders |
| ink-600 | `#3A3A4C` | Strong borders, disabled fills |
| ink-500 | `#5C5C70` | Secondary text on light |
| ink-400 | `#8A8A9E` | Secondary text on dark |
| ink-300 | `#B4B4C4` | Placeholder on dark, construction guides |
| ink-200 | `#D9D9E3` | Light borders |
| ink-100 | `#EDEDF2` | Light raised surface |
| paper-50 | `#F6F6F2` | Light background (warm off-white) |
| white | `#FFFFFF` | Light surface, cards |

**Volt (the human hand: release and approval)**

| Token | Hex | Use |
|---|---|---|
| volt-300 | `#E6FF8A` | Hover on dark |
| volt-400 | `#D4FF3F` | **Signature.** Release arc, primary action, approval, focus on dark |
| volt-500 | `#B8E600` | Pressed state |
| volt-700 | `#5E7500` | Volt-family text and marks on light backgrounds |

**Ultraviolet (the agent's hand)**

| Token | Hex | Use |
|---|---|---|
| uv-300 | `#B7A8FF` | Agent highlights on dark |
| uv-400 | `#8F7BFF` | Agent text and icons on dark |
| uv-500 | `#6E56FF` | **Signature.** Agent fills, agent presence |
| uv-600 | `#5A3FF0` | Agent text on light, focus ring on light |
| uv-700 | `#4328C7` | Pressed, deep agent accents |

**Semantic**

| Role | Dark-mode value | Light-mode text value | Meaning |
|---|---|---|---|
| Settled (teal) | `#1FC7A2` | `#0A7A63` | Funds claimed, reconciled |
| Attention (amber) | `#FFB020` | `#9A5B00` | Needs review, disputed, unconfirmed |
| Stop (red) | `#FF5468` | `#C21F3A` | Failed, rejected, held |

### The two-hands rule

> **Color shows whose hand moved it. Only teal means money arrived.**

- **Volt = human authority.** This covers release, owner approval, the primary call to action and the focus ring on dark backgrounds.
- **Ultraviolet = agent activity.** This covers agent suggestions, prepared drafts, agent actions (checkPayment, authorizePayment) and the agent log.
- Neither Volt nor Ultraviolet means success. Teal appears only when funds are actually claimed or reconciled.
- When the agent acts on an owner's approval, show both: an Ultraviolet agent icon and a Volt "Approved by owner" chip.

### Proportions

- About 60% Ink, 30% neutral surfaces, 7% Volt and 3% Ultraviolet.
- **One Volt primary action per view.** If everything is Volt, nothing is the release.

### Contrast (WCAG 2.2)

| Pair | Ratio | Allowed |
|---|---|---|
| ink-950 on volt-400 | ~17:1 | Any text |
| paper-50 on ink-950 | ~18:1 | Any text |
| ink-400 on ink-950 | ~5.8:1 | Body text |
| uv-400 on ink-950 | ~6.1:1 | Body text |
| uv-500 on ink-950 | ~4.2:1 | Large text, icons, borders only |
| white on uv-500 | ~4.7:1 | Body text |
| uv-600 on paper-50 | ~5.7:1 | Body text |
| teal-700 / amber-700 / red-700 on paper-50 | ~4.9–5.5:1 | Body text |
| **volt-400 on paper or white** | ~1.1:1 | **Never use for text, icons or the logo** |

### Themes

- **Ink (dark) is the signature theme.** Use it for marketing, the owner's command view, the approval moment and the logo's primary form.
- **Paper (light)** is fully supported for dense review tables, employee pay statements and anything printed or exported.

---

## 6. Typography

The logo is drawn, not typeset. The typefaces below are for everything else.

| Role | Typeface | Weights | Why |
|---|---|---|---|
| Display | **Sora** | 600, 700 | Geometric shapes that echo the logo's round bowls; modern and technical |
| Text and UI | **Geist** | 400, 500, 600 | Neutral and highly legible at small sizes, with tabular figures |
| Numbers and code | **Geist Mono** | 400, 500 | Money, hashes, addresses and IDs; columns align perfectly |

All three are open-source under the SIL OFL. Install them with `@fontsource-variable/sora`, `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`.

### Type scale (base 16 px)

| Token | Size / line height | Font and weight | Use |
|---|---|---|---|
| display-xl | 72 / 72 | Sora 700, -0.035em | Marketing hero only |
| display-l | 56 / 60 | Sora 700, -0.03em | Landing sections |
| h1 | 40 / 44 | Sora 600, -0.025em | Page titles |
| h2 | 30 / 36 | Sora 600, -0.02em | Section titles |
| h3 | 22 / 28 | Geist 600 | Card titles |
| h4 | 18 / 24 | Geist 600 | Subsections |
| body-l | 18 / 28 | Geist 400 | Intro copy |
| body | 16 / 24 | Geist 400 | Default |
| body-s | 14 / 20 | Geist 400 | Tables, helper text |
| label | 12 / 16 | Geist 600, uppercase, +0.08em | Eyebrows, column headers, chips, stage index |
| mono | 14 / 20 | Geist Mono 400 | Hashes, IDs, table amounts |
| amount-xl | 48 / 52 | Geist Mono 500 | Run total on the approval screen |

The minimum text size is 12 px.

### Money and numbers

- **All money uses Geist Mono with tabular figures** (`font-variant-numeric: tabular-nums`). Right-align amounts in tables.
- PHP always shows two decimals: `PHP 12,450.00`. Use ₱ only in large hero displays; tables use the code.
- On-chain amounts show the asset code and the Testnet label every time: `125.0000000 XLM · Testnet`.
- Never round, abbreviate ("12.4k") or estimate an amount that will be paid.
- Truncate hashes and addresses in the middle (`GABC…X7Q2`), with a copy button and the full value in a tooltip.
- Write cutoffs as `Nov 1–15, 2026` or `Nov 16–30, 2026`. Show times in Asia/Manila, and display the timezone when it matters.

---

## 7. Graphic elements

### The slip (core motif)

The gap in the logo becomes the brand's main graphic device.

- **Slip arcs (supergraphic):** a large, cropped arc taken from the s that bleeds off the edge of a hero or cover. Draw the top arc as an ink-700 stroke and the bottom arc in Volt, keeping the stroke-to-radius ratio of the logo (7:9). Use one per composition.
- **Slip divider:** a hairline broken by a small offset step. It marks the boundary between preparation and release, for example between the Review panel and the Approve panel.
- **Split states:** anything prepared but not yet released (a draft run, a queued item) can show a subtle split. Released items close the line.

### Transient line

A 1.5 px hairline that runs flat, spikes once sharply and decays quickly, like the waveform of one snap. Use it for loading (the spike travels along the line), run headers and empty states. Use one spike per line, never more.

### Echo rings

Concentric 1 px circles. Static, they work as background texture at 6–8% opacity. In motion, they burst once from the slip gap when a run is approved.

### Tempo ticks

Evenly spaced short ticks, like a ruler. Use them for cutoff timelines (1–15 and 16 to end of month), run progress and the agent's thinking indicator.

### Stage index (from Razorpay's 01/ system)

Label the pay-run journey with a mono index in the label style: **01/ Prepare · 02/ Review · 03/ Snap · 04/ Settle.** Use the same labels in the UI, the pitch deck and the demo video.

### Evidence stack

Two offset hairline card edges behind a pay item show that work evidence is bundled behind the number. Clicking it opens the trace.

### Hatching

A 45° amber hatch fills **Unconfirmed** items only, meaning "outcome unknown, do not retry." Don't use it decoratively.

### Shape and layout

| Property | Value |
|---|---|
| Base unit | 4 px |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Grid | 12 columns, 24 px gutters, 1280 px max width; 4 columns and 16 px gutters on mobile |
| Radius | 4 (small), 8 (buttons and inputs), 12 (cards), 20 (modals and sheets), 22% of size (app icons), full (chips and avatars) |
| Borders | 1 px hairlines; ink-700 on dark, ink-200 on light |
| Elevation | Dark: lighter surfaces, no shadows. Light: one soft shadow per level |
| Table rows | 44 px default, 36 px compact |
| Touch targets | 44 × 44 px minimum |

### Hero numbers (from Spade)

A landing page or dashboard may lead with one large figure in `amount-xl`, but only if it's real and measured: for example, time from approval to authorization in your Testnet demo. Never invent a stat.

### Iconography

Use Lucide (React) with a 1.5 px stroke, at 16, 20 and 24 px. The Slip mark is the only custom brand icon. Agent icons take Ultraviolet; everything else takes the current text color.

---

## 8. Motion

**Every animation follows the slip: prepare, hold, release, settle.**

### Principles

1. **Prepare, then release.** A short build (draw, press to 0.97) followed by a fast release. The release is always faster than the preparation.
2. **Fast attack, quick decay.** Things arrive sharply and settle softly. Exits are faster than entrances.
3. **Everything on the beat.** All durations come from one tempo.
4. **Money never morphs.** Real amounts never count up, tween or slide. They swap instantly or with a 60 ms crossfade. Count-up effects are allowed only on marketing pages with sample data.
5. **Never fake progress.** An uncertain transfer gets a static amber "Needs check" state with a timestamp, not an endless spinner.
6. **Save the celebration for the snap.** Only approval gets the full release.

### Tempo-based durations (120 BPM, one beat = 500 ms)

| Token | Duration | Musical value | Use |
|---|---|---|---|
| `--dur-tick` | 60 ms | 1/32 | Press feedback, color change, amount crossfade, the logo's hold |
| `--dur-snap` | 125 ms | 1/16 | Buttons, chips, status flips, the release arc slipping in |
| `--dur-beat` | 250 ms | 1/8 | Panels entering, list reorder, the prep arc drawing |
| `--dur-settle` | 375 ms | dotted 1/8 | Page transitions, echo rings |
| `--dur-pulse` | 500 ms | 1/4 | Agent thinking pulse; the full logo sting |
| `--dur-hold` | 750 ms | 1.5 beats | Press-and-hold to approve |

### Easing

| Token | Curve | Use |
|---|---|---|
| `--ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, the release |
| `--ease-press` | `cubic-bezier(0.5, 0, 0.75, 0)` | Anticipation, exits |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | General UI, prep draws |
| Spring "crisp" | stiffness 700, damping 40, mass 0.6 | Layout and reorder, with almost no overshoot |
| Spring "snap" | stiffness 900, damping 30, mass 0.5 | The release only, with one small overshoot |

### Signature moments

**1. Logo sting (one beat, 500 ms).** Play it on app launch, after approval, and on the demo video intro.
- 0–250 ms: the top arc draws from its terminal (`--ease-standard`). This is preparation.
- 250–310 ms: a one-tick hold. This is tension.
- 310–435 ms: the release arc slips in from 6 units behind, in Volt (`--ease-snap`). This is the snap.
- Optional: one echo ring bursts from the gap.
- It plays once. Never loop it on a page.

**2. The snap (owner approves a run)**
- The summary comes first: run version, recipient count, asset and exact total.
- The "Snap to approve" button contains the Slip mark. While the owner holds it for 750 ms, the mark's top arc draws as the progress indicator and the button presses to 0.97.
- When the hold completes, the release arc slips in Volt, two echo rings burst from the gap, and the run locks: "Approved · v3 · locked." Any change creates a new version that needs a new snap.
- Releasing early cancels the action, and the arc undraws.

**3. Snap-to-order (the agent prepares the cutoff)**
- Rows settle into sorted order with a 30 ms stagger (`--dur-beat`, "crisp" spring).
- While the agent works, an Ultraviolet indicator of three tempo ticks pulses on the beat. This is the thinking snap.
- Flagged rows move to the top with an amber marker.

**4. Status flip**
Chips change like a split-flap board. The old label slides up and out and the new one slides up and in, over 125 ms. Each change is discrete, with no morphing.

**5. Per-recipient resonance**
Each row confirms on its own, with a small slip-closing tick when it turns teal. Recipients never all turn green at once unless they really confirmed at once.

### Sting CSS (works with the `SnappLogo` component)

```css
.snapp-sting .prep {
  stroke-dasharray: 43;
  stroke-dashoffset: 43;
  animation: snapp-prep var(--dur-beat) var(--ease-standard) forwards;
}
.snapp-sting .release {
  opacity: 0;
  transform: translateX(-6px);
  animation: snapp-release var(--dur-snap) var(--ease-snap) 310ms forwards;
}
@keyframes snapp-prep { to { stroke-dashoffset: 0; } }
@keyframes snapp-release { to { opacity: 1; transform: translateX(0); } }

@media (prefers-reduced-motion: reduce) {
  .snapp-sting .prep,
  .snapp-sting .release {
    animation: none;
    stroke-dashoffset: 0;
    opacity: 1;
    transform: none;
  }
}
```

### Reduced motion

When `prefers-reduced-motion: reduce` is set, remove echo rings, travel and springs, and use opacity changes of 120 ms or less. The hold-to-approve control becomes a simple progress fill, and every status change is still announced in text.

### Sound and haptics

- **Approval sound:** an air-suction swell that rises for the length of the hold (preparation), then one crisp snap of about 60 ms when the hold completes (release), with a short reverb tail of about 1 s (resonance). Releasing early drains the suction in 60 ms with no snap. It's synthesized in code (`apps/web/src/lib/snapSound.ts`), so there's no sample to record or license. **It is off by default**, and the user can turn it on in Settings.
- **Haptics (mobile):** a light impact on the release only.
- Sound and haptics never carry information alone; the visual state always confirms.

---

## 9. Photography and imagery

### Three directions

1. **Frozen snap.** High-speed shots of hands at the instant the finger slips off the thumb, on a dark seamless background with a single hard key light. Pair them with a slip-arc supergraphic.
2. **Real work, real rooms.** Candid small-team digital work in Metro Manila: small studios, co-working spaces and home desks, in natural window light.
3. **Precision details.** Macro shots of metronomes, shutters, stopwatches and keyboard switches. Use them sparingly as section accents.

### Treatment

- **Marketing and heroes:** an Ink duotone (shadows ink-950, highlights volt-300) or true black and white with one Volt element.
- **People:** natural color, slightly cool shadows, neutral whites and true skin tones. Light grain is fine.
- Crop tight and leave negative space for type and slip arcs.

### Rules

- Get model releases for anyone pictured, including team members.
- Screens in photos show only Snapp mockups with sample data. Never show real pay, bank details or account numbers.
- **Never use fake receipts, fake bank confirmations or fake transaction screens.**

### Avoid

Cash and coins, crypto renders, robots, glowing AI brains, handshakes, generic stock and logos you don't have rights to.

---

## 10. Voice and tone

### Voice: crisp, exact, calm

- Use short sentences and put verbs first.
- Give the exact number, with no rounding.
- Say what happened, what's safe and what comes next.
- Speed in the experience, never in the truth.

### Tone by audience

| Audience | Tone | Example |
|---|---|---|
| Owner | Decisive, summary first | "12 recipients · PHP 184,320.00 · ready for your snap." |
| Employee | Transparent, respectful, explains each number | "80.0 approved hours × PHP 450.00 = PHP 36,000.00. See how this was calculated." |
| Agent | Plain, labeled, never in charge | "Agent: 3 time entries exceed the agreed rate. Flagged for your review." |
| Errors | Owns the problem, says what's safe | "We couldn't confirm this transfer. It won't be retried automatically. Check its status before acting." |

### Payment status vocabulary

| Stage | Status | Meaning | Color | Icon (Lucide) |
|---|---|---|---|---|
| 01/ Prepare | Draft | Prepared, not yet reviewed | Ink (neutral) | `circle-dashed` |
| 02/ Review | Needs review | Waiting on the owner | Amber | `eye` |
| 02/ Review | Disputed | Employee raised a discrepancy | Amber | `message-circle-warning` |
| 03/ Snap | Approved | In an owner-approved, locked run | Volt | `lock` |
| 03/ Snap | Authorized | Agent authorized the payment (Testnet) | Ultraviolet | `signature` |
| 04/ Settle | Claimed | Recipient signed the claim; funds received | Teal | `arrow-down-to-line` |
| 04/ Settle | Reconciled | Matched and closed | Teal (solid) | `check-check` |
| Any | Held | Paused by the owner or a rule | Red outline | `pause` |
| Any | Failed | Did not go through; not paid | Red | `x` |
| Any | Unconfirmed | Outcome unknown; do not retry | Amber hatch | `circle-help` |

### Words we use and words we avoid

| Use | Avoid | Why |
|---|---|---|
| Authorized | Paid (before it's claimed) | Authorization is not receipt |
| Approve, release, snap | Auto-pay, autopilot | The owner always releases |
| Agent suggests, agent prepared | AI decided, AI handles payroll | The agent never sets wages or recipients |
| Testnet | Live, real money (in the demo) | Honesty in the hackathon |
| Exact amounts | "About," "~," "12k" | Accuracy is the brand |
| Fast, in a snap | Instant or guaranteed (as a promise) | Banks and networks have their own steps |

---

## 11. UI components

### Buttons

| Variant | Style | Use |
|---|---|---|
| Primary (human) | Volt 400 fill, Ink 950 text, 8 px radius | The single most important owner action per view |
| Snap | Primary plus the Slip mark and hold-to-approve | Run approval only |
| Agent | Ultraviolet outline, uv-400 text (dark) or uv-600 (light) | "Ask agent," "Run checks" |
| Secondary | Transparent, 1 px border, text color | Everything else |
| Destructive | Red outline; fills red only inside a confirmation dialog | Hold, reject, cancel run |

Button states: hover lightens one step, press scales to 0.97 over `--dur-tick`, and disabled uses ink-600 at 50% opacity with no motion.

### Status chips

- Use a pill shape with 12 px uppercase labels and an icon. **Always include an icon and a label; color is never the only signal.**
- Changes use the split-flap flip (`--dur-snap`).

### Amount display

- Use Geist Mono with tabular figures, the currency or asset code in label style before the number, and right alignment.
- The approval screen total uses `amount-xl` with the recipient count and run version beside it.

### Stage header

Show the mono stage index with the current stage in Volt (human) or Ultraviolet (agent) and the others in ink-400. Put a slip divider between 02/ Review and 03/ Snap.

### Proof links

- Show "View on Stellar Expert · Testnet" with an external-link icon, a mono transaction hash and a copy button.
- Only real transaction links go in a proof slot; never use placeholders.

### Testnet badge

During the hackathon, an amber **TESTNET** chip stays visible in the app header on every screen.

### Agent presence

An Ultraviolet "agent lane" beside the run view lists each agent step as tempo ticks with timestamps (check payment ✓, then authorize payment ✓). Every agent action is logged, attributable and readable by the owner.

---

## 12. Design tokens (Tailwind v4)

Paste this into `apps/web/src/index.css`. If the repo uses Tailwind v3, move the palette into `theme.extend` in `tailwind.config` instead.

```css
@import "tailwindcss";
@import "@fontsource-variable/sora";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";

@theme {
  --color-ink-950: #0A0A0F;
  --color-ink-900: #12121A;
  --color-ink-800: #1A1A25;
  --color-ink-700: #2A2A38;
  --color-ink-600: #3A3A4C;
  --color-ink-500: #5C5C70;
  --color-ink-400: #8A8A9E;
  --color-ink-300: #B4B4C4;
  --color-ink-200: #D9D9E3;
  --color-ink-100: #EDEDF2;
  --color-paper-50: #F6F6F2;

  --color-volt-300: #E6FF8A;
  --color-volt-400: #D4FF3F;
  --color-volt-500: #B8E600;
  --color-volt-700: #5E7500;

  --color-uv-300: #B7A8FF;
  --color-uv-400: #8F7BFF;
  --color-uv-500: #6E56FF;
  --color-uv-600: #5A3FF0;
  --color-uv-700: #4328C7;

  --color-teal-400: #1FC7A2;
  --color-teal-700: #0A7A63;
  --color-amber-400: #FFB020;
  --color-amber-700: #9A5B00;
  --color-red-400: #FF5468;
  --color-red-700: #C21F3A;

  --font-display: "Sora Variable", "Sora", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Geist Variable", "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", "Geist Mono", ui-monospace, SFMono-Regular, monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;

  --ease-snap: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-press: cubic-bezier(0.5, 0, 0.75, 0);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}

:root {
  --dur-tick: 60ms;
  --dur-snap: 125ms;
  --dur-beat: 250ms;
  --dur-settle: 375ms;
  --dur-pulse: 500ms;
  --dur-hold: 750ms;

  --bg: var(--color-paper-50);
  --surface: #FFFFFF;
  --surface-raised: var(--color-ink-100);
  --border: var(--color-ink-200);
  --text: var(--color-ink-950);
  --text-muted: var(--color-ink-500);
  --human: var(--color-volt-400);
  --on-human: var(--color-ink-950);
  --agent: var(--color-uv-600);
  --agent-text: var(--color-uv-600);
  --settled: var(--color-teal-700);
  --attention: var(--color-amber-700);
  --stop: var(--color-red-700);
  --focus: var(--color-uv-600);
  --logo-release: var(--color-ink-950);
}

[data-theme="dark"] {
  --bg: var(--color-ink-950);
  --surface: var(--color-ink-900);
  --surface-raised: var(--color-ink-800);
  --border: var(--color-ink-700);
  --text: var(--color-paper-50);
  --text-muted: var(--color-ink-400);
  --human: var(--color-volt-400);
  --on-human: var(--color-ink-950);
  --agent: var(--color-uv-500);
  --agent-text: var(--color-uv-400);
  --settled: var(--color-teal-400);
  --attention: var(--color-amber-400);
  --stop: var(--color-red-400);
  --focus: var(--color-volt-400);
  --logo-release: var(--color-volt-400);
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-border: var(--border);
  --color-fg: var(--text);
  --color-muted: var(--text-muted);
  --color-human: var(--human);
  --color-on-human: var(--on-human);
  --color-agent: var(--agent);
  --color-agent-fg: var(--agent-text);
  --color-settled: var(--settled);
  --color-attention: var(--attention);
  --color-stop: var(--stop);
}

:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.amount {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

Use the logo with the theme-aware release color: `<SnappLogo release="var(--logo-release)" className="h-8 text-fg" />`.

Motion presets for React (`motion` library):

```ts
export const spring = {
  crisp: { type: "spring", stiffness: 700, damping: 40, mass: 0.6 },
  snap:  { type: "spring", stiffness: 900, damping: 30, mass: 0.5 },
} as const;

export const dur = { tick: 0.06, snap: 0.125, beat: 0.25, settle: 0.375, pulse: 0.5, hold: 0.75 } as const;
export const ease = { snap: [0.16, 1, 0.3, 1], press: [0.5, 0, 0.75, 0], standard: [0.2, 0, 0, 1] } as const;
```

---

## 13. Accessibility checklist

- [ ] All text pairs meet WCAG 2.2 AA; Volt is never used as text or logo color on light backgrounds.
- [ ] Every status shows an icon and a label, not only color.
- [ ] Focus rings are visible: Volt on dark, uv-600 on light, 2 px with a 2 px offset.
- [ ] Hold-to-approve has a keyboard and assistive-tech alternative: pressing Enter opens a confirmation dialog that repeats the run version, recipient count and exact total.
- [ ] Reduced-motion mode is tested on the logo sting and every signature moment.
- [ ] Status changes use `aria-live="polite"`; failures and unconfirmed states use `assertive`.
- [ ] Amounts are read in full by screen readers (for example, "12,450 Philippine pesos").
- [ ] The logo has `role="img"` and `aria-label="Snapp"`; decorative slip arcs are `aria-hidden`.
- [ ] Touch targets are at least 44 × 44 px.
- [ ] Sound and haptics are optional and never the only signal.

---

## 14. Asset checklist and open decisions

### Assets to export (into `apps/web/public/brand/`)

- [ ] `snapp-wordmark-on-ink.svg`, `-on-paper.svg`, `-on-volt.svg`, `-mono.svg`
- [ ] `snapp-mark.svg` and `snapp-mark-small.svg`
- [ ] `favicon.svg`, `favicon-32.png`, `favicon-16.png`, `apple-touch-icon.png` (180), `icon-512.png`
- [ ] `og-image.png` (1200 × 630): wordmark on Ink with a slip-arc supergraphic
- [ ] Logo sting as a short video for the demo intro

### Open decisions

1. **Hold duration:** tune the 750 ms hold in the dev-only playground at `/dev/hold` (run `npm run dev`). It has a 500–1000 ms slider and counts approvals, early releases and accidental triggers. Test it with mouse, touch and keyboard, then lock the value into `--dur-hold`.
2. **Snap sound:** tune the synthesized suction, snap and reverb by ear in the same playground. Fallback if it sounds too synthetic: record a real snap on a phone and trim it in Audacity.
