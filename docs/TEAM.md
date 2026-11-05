# Team, task boundaries, branches and review norms

This is a **coordination convention, not strict permissions or a CODEOWNERS enforcement rule**. Anyone may help any area; communicate before major cross-boundary changes.

| Member / GitHub | Main concern | Normal files | First deliverable |
|---|---|---|---|
| UI/UX + Frontend — [JCarloZ24 (JC)](https://github.com/JCarloZ24) | UX, layouts, reusable components, frontend routes and page behavior | `docs/DESIGN.md`, `docs/UI.md`, `docs/PAGES.md`, `apps/web/` | Reviewed wireframes/token proposal, owner cutoff-hours review and employee/client views; visual brand remains on hold |
| API Integration — [Stobeeney](https://github.com/Stobeeney) | API contracts, shared models, server endpoints, frontend/API wiring and external API connections | `apps/server/`, `packages/shared/`, frontend API calls, `docs/API.md` | Validated Proyekto references, reviewed-hours/run contracts, auth/RBAC, immutable approval and durable per-item records; Velo collections separate |
| Integration + Deployment — [aidantiu](https://github.com/aidantiu) | End-to-end integration, environment/hosting configuration, CI, deployment and webhook connectivity | `.github/workflows/`, web/server hosting configuration, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `SETUP.md` | Reproducible web/server deployment, HTTPS webhook verification and end-to-end reconciliation evidence, coordinated with API and Noir owners |
| Fullstack / Founder — [JoshuaHM-p4](https://github.com/JoshuaHM-p4) | Approved-item Noir Testnet execution, payment safety and final product/security review | `packages/agent/`, payment integration review and root product docs | App-side recipient/run constraints, real Noir authorize/claim proof and bank-facility feasibility; support Aidantiu on release integration |

These are target deliverables, not claims of working cutoff, bank or Proyekto integration. The owner retains manual hours review and final payment approval; the agent executes only exact approved items. Proyekto remains the work/invoicing system. Company bank feasibility and hackathon Testnet execution are separate paths.

These assignments do not grant or change GitHub repository access, production credentials or payment-signing authority. API implementation and deployment work can share files; Stobeeney owns API contracts/wiring, while Aidantiu coordinates end-to-end integration and release.

## Rules of collaboration
1. **One main concern each**, but not exclusive rights. Start with small PRs and use a shared issue ID.
2. Prefer feature branches: `design/cutoff-review`, `feat/employee-statements`, `feat/pay-run-approval`, `feat/api-webhooks`, `feat/noir-approved-items`, `fix/...`.
3. Shared files (`package.json`, `packages/shared`, `README.md`, `docs/ARCHITECTURE.md`) should have a quick heads-up in team chat before a breaking edit.
4. For API additions, change `packages/shared` and `docs/API.md` first; use compatible fields if other PRs depend on the old shape.
5. Use PRs for review; one reviewer from a **different primary concern** when practical. Founder may merge; no mandatory protected branch or hard CODEOWNERS policy.
6. Never commit credentials, personal or client payroll data; use demo wallets and fictional names.
7. JC owns UI/UX and frontend; brand identity remains on hold until approved. Neutral grayscale layouts can progress without selecting final brand colors.
8. Merge early, rebase often, avoid week-long divergence. Keep a demo-ready main branch.

## Optional Git worktrees for parallel work
```bash
# From an already-cloned repo:
git worktree add ../agentpay-web -b feat/web-pages
git worktree add ../agentpay-server -b feat/server-api
git worktree add ../agentpay-agent -b feat/noir-agent
git worktree add ../agentpay-design -b design/screen-layout
```
Each worktree needs its own `npm install` and app env config. Avoid concurrent `npm install` writes to a shared `node_modules` directory. `git worktree list` to inspect; `git worktree remove ../agentpay-web` after merge.

## Small PR definition of done
Purpose + screenshots or terminal proof; tests/typecheck; no secrets; updated docs and env examples; note any touched cross-team files, endpoints and payment risks.
