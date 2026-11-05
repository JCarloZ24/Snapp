# AGENTS.md — Shared rules for all AI coding agents

**Authoritative reading order:** `SETUP.md` → `PRD.md` → `docs/ARCHITECTURE.md` → `docs/INTEGRATIONS.md` → task-specific docs → source code. `CLAUDE.md` points here and adds Claude-specific habits.

## Product guardrails
- Build **Snapp for Prodigitality — Agentic Work Verification & Payment Orchestration** as a Proyekto-connected cutoff pay-run and employee pay-transparency layer. Reuse Proyekto project/invoice context; do not rebuild project management or invoicing. New workflows are targets, not features already implemented by the milestone starter.
- Product tagline: **Pay fast, in a snap.** Positioning: **From verified deliverables to streamlined payouts. One platform for teams, clients, and business owners.**
- The owner manually reviews hours per employee/project for 1–15 and 16–end-of-month cutoffs and approves exact recipients and amounts. The agent cannot set wages, approve hours or modify an approved run; material changes require reapproval.
- Client comments, revisions and acceptance belong to versioned deliverable evidence. Client acceptance or invoice collection must not automatically gate hours-based employee pay; actual compensation agreements and legal obligations govern.
- **Do not** invent brand styles. Prodigitality design remains on hold; use neutral UI until `docs/DESIGN.md` is approved.
- Every money-moving implementation is **Stellar Testnet only**. There are two independent flows (Velo client checkout, Noir delegated payout).
- Do not assume Velo receipt is escrow funding or Noir authorize is merchant claimed payout.
- No money transfer without a verified recipient, valid owner-approved payment item, applicable agreement conditions, payment limits and durable audit/idempotency records. Enforce recipient allowlists and cumulative run limits app-side; Noir's policy does not supply them.
- The company bank-file path is a recommendation pending provider verification, not an implemented integration or an exception to Testnet-only scope. Never automate bank UI/OTP, promise a one-OTP batch or claim Testnet authorization delivers PHP to banks.
- Never allow web client to hold Noir agent key, Velo API key, webhook secret, or server admin token.
- Do not bypass official Noir SDK with raw contract invocation or deploy replacement contracts.

## Code boundaries
- `apps/web`: pages/components and fetch; no privileged logic.
- `apps/server`: auth, REST, webhook, persistence, integration orchestration.
- `packages/agent`: deterministic decisions and Noir SDK.
- `packages/shared`: shared models / future validators.
- `docs`: feature, architecture, integration reference.

## Working with human team
Follow [docs/TEAM.md](docs/TEAM.md) for **soft ownership**. Avoid rewriting an unrelated person's files without coordination; no strict permissions. Small feature branches + PRs; update downstream types/docs when changing API.

## Required implementation routine
1. State assumption and branch scope in task/PR.
2. Find contract/route references; compare SDK source to docs before coding payments.
3. Prefer a small coherent patch; remove dead placeholders only when replacing them with working code.
4. Add negative tests for payment conditions.
5. Run `npm run typecheck`, `npm test`, `npm run build`, document results honestly.
6. Update `.env.example`, API docs, checklist and decision log when relevant.

## Definition of truth
Mark only features present in source as implemented. Explicitly distinguish `dry run`, `staging`, `verified Testnet`, and `production`. Never fabricate positive payment/webhook evidence. Stop and report any mismatch in contract IDs. All tasks should be reproducible from an empty clone.

## Forbidden shortcuts
No real money; no secrets in commits/logs; no client-triggered arbitrary wallet payouts; no unchecked merchant wallet input; no marking paid from redirect; no plain float conversion to stroops; no simple JSON files for concurrent payment safety; no pretending `DEMO_MODE=true` is a payment demonstration.
