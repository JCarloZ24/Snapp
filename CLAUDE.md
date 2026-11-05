# CLAUDE.md — Claude Code project entrypoint

Use [AGENTS.md](AGENTS.md) as the **shared, model-neutral** instructions, not a separate source of product truth. This document is short to avoid drift between tools.

## On session start
1. Read `SETUP.md`, `PRD.md`, `AGENTS.md`, `docs/TEAM.md`, `docs/INTEGRATIONS.md`.
2. Identify your assigned issue, primary workstream and expected files. If absent, pick the highest-priority unchecked safe task in `docs/CHECKLIST.md`.
3. Before applying a payment-related patch, inspect the currently installed Noir/Velo SDK types and confirm official deployed Testnet contracts. Earlier form IDs **conflict** with the Nov 5 handbook.
4. Make focused changes, tests and doc updates; never edit business-critical wallet values without explicit owner instruction.

## Validation commands
```bash
npm run typecheck
npm test
npm run build
```
If package install is blocked or tests can't run, state the blocker; do not report green checks.

## End-of-task report format
Summarize `Files changed`, `Behavior changed`, `Tests run/results`, `Risks or unfinished work`, `Needed human approvals`. This is a style convention, not a permission boundary.
