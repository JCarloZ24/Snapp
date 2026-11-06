# Team, task boundaries, branches and review norms

This is a **coordination convention, not strict permissions or a CODEOWNERS enforcement rule**. Anyone may help any area; communicate before major cross-boundary changes.

| Member / GitHub | Main concern | Normal files | First deliverable |
|---|---|---|---|
| UI/UX + Frontend — [JCarloZ24 (JC)](https://github.com/JCarloZ24) | UX, layouts, reusable components, frontend routes and page behavior | `docs/DESIGN.md`, `docs/UI.md`, `docs/PAGES.md`, `apps/web/` | Reviewed wireframes/token proposal, owner cutoff-hours review and employee/client views; visual brand remains on hold |
| API Integration — [Stobeeney](https://github.com/Stobeeney) | API contracts, shared models, server endpoints, frontend/API wiring and external API connections | `apps/server/`, `packages/shared/`, frontend API calls, `docs/API.md` | Validated Proyekto references, reviewed-hours/run contracts, auth/RBAC, immutable approval and durable per-item records; Velo collections separate |
| Integration + Deployment — [aidantiu](https://github.com/aidantiu) | End-to-end integration, environment/hosting configuration, CI, deployment and webhook connectivity | `.github/workflows/`, web/server hosting configuration, `docs/ARCHITECTURE.md`, `docs/INTEGRATIONS.md`, `SETUP.md` | Reproducible web/server deployment, HTTPS webhook verification and end-to-end reconciliation evidence, coordinated with API and Noir owners |
| Founder / Fullstack / Noir Integration — [JoshuaHM-p4](https://github.com/JoshuaHM-p4) | Noir SDK setup, development and testing, from controlled local single-item experiments toward the target approved-run Testnet workflow | `packages/agent/`, local setup/test tooling, `docs/INTEGRATIONS.md`, payment integration review and root product docs | Independently verified live setup/authorization/claim evidence; preserve local consent/journal safeguards while target payroll/RBAC remains pending; retain bank-facility feasibility and final product/security review |

These are target deliverables, not claims of working cutoff, bank or Proyekto integration. The owner retains manual hours review and final payment approval; the agent executes only exact approved items. Proyekto remains the work/invoicing system. Company bank feasibility and hackathon Testnet execution are separate paths.

These assignments do not grant or change GitHub repository access, production credentials or payment-signing authority. API implementation and deployment work can share files; Stobeeney owns API contracts/wiring, while Aidantiu coordinates end-to-end integration and release.

## Founder Noir scope — JoshuaHM-p4
- **SDK and environment setup:** maintain pinned Noir 0.3.0/Stellar 16.0.1 and fixed native-XLM Testnet configuration. SDK/pinned-source agreement and read-only Testnet checks were exercised, but do not resolve the documented earlier form-ID discrepancy. Independently verify organizer/deployment values before attesting and live authorization.
- **Owner and wallet setup:** maintain local `setup --step device|policy|fund` through the official SDK and obtain genuine live proof. Three distinct owner/agent/merchant Testnet wallets require manual fee funding and separate consent/signatures. Use private inherited role-specific secrets, never server `.env`, browser, arguments, logs, chat or commits.
- **Payment integration development:** maintain `npm run noir -- <command>` (`plan`, `doctor`, `approve`, `setup`, `check`, `authorize`, `claim`, `reconcile`, `evidence`), exact signed single-item consent, merchant allowlisting and SQLite cumulative-device reservations. No HTTP Noir execution route: former milestone approval returns 404, without replacement. Coordinate future authenticated payroll contracts with Stobeeney rather than re-exposing the removed route.
- **Claim and lifecycle handling:** maintain separately merchant-signed aggregate `claim`, explicit pending-stroops confirmation and distinct authorization/claim evidence. The local journal persists identity before broadcast and allows reconciliation, not retry/reset/replacement nonce, even after failure. Copies/deletion defeat local deduplication. Safe revoke/defund/unlink automation is still missing; ownership never authorizes signing for another party.
- **Testing:** 20 focused Noir tests, real-SDK synthetic transport hash-before-broadcast/timeout-restart smoke, actual CLI help/plan/consent/evidence/gate checks and read-only `doctor` (`contractsAttested:false`) were exercised. Maintain negative coverage and independently perform controlled live verification only after prerequisites; offline checks are not transaction proof.
- **Evidence and release handoff:** collect actual separate setup/authorization/claim hashes, ledgers and matching events after independent contract verification, verified merchant allowlisting and explicit role consent. Coordinate web/server deployment checks with Aidantiu; local tooling is not deployed payout orchestration. No Mainnet, PHP bank payout or production-payroll claim.

Implemented local owner setup, merchant claim and SQLite consent/journal tooling do **not** complete live Testnet proof or the target authenticated owner-reviewed hours/cutoff/payroll, RBAC, Proyekto or bank workflow. Fixture previews, shared eligibility and Velo remain separate; hackathon proof gates stay open.

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
