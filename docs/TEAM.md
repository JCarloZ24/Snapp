# Team, task boundaries, branches and review norms

This is a **coordination convention, not strict permissions or a CODEOWNERS enforcement rule**. Anyone may help any area; communicate before major cross-boundary changes.

| Member / GitHub | Main concern | Normal files | First deliverable |
|---|---|---|---|
| Designer — [Stobeeney](https://github.com/Stobeeney) | UX, page layouts, product visual system | `docs/DESIGN.md`, `docs/UI.md`, `apps/web/src/components/`, styles | Low-fidelity screens and reviewed token proposal; visual brand on hold |
| Developer — [JCarloZ24](https://github.com/JCarloZ24) | Frontend behavior, routes, page data integration | `apps/web/src/pages/`, `apps/web/src/App.tsx` | Owner cutoff-hours review, employee-private statements/discrepancies, versioned client evaluation and payment status views |
| Developer — [aidantiu](https://github.com/aidantiu) | Server API, reviewed-hours/run models, integration references and reconciliation | `apps/server/`, `packages/shared/`, `docs/API.md` | Auth/RBAC, validated Proyekto references, immutable run approval and durable per-item records; Velo collections separate |
| Fullstack / Founder — [JoshuaHM-p4](https://github.com/JoshuaHM-p4) | Approved-item Testnet execution, release and integration support | `packages/agent/`, `docs/INTEGRATIONS.md`, root docs/CI and deployment | App-side recipient/run constraints, real Noir authorize/claim proof, bank-facility feasibility and final integration |

These are target deliverables, not claims of working cutoff, bank or Proyekto integration. The owner retains manual hours review and final payment approval; the agent executes only exact approved items. Proyekto remains the work/invoicing system. Company bank feasibility and hackathon Testnet execution are separate paths.

## Rules of collaboration
1. **One main concern each**, but not exclusive rights. Start with small PRs and use a shared issue ID.
2. Prefer feature branches: `design/cutoff-review`, `feat/employee-statements`, `feat/pay-run-approval`, `feat/api-webhooks`, `feat/noir-approved-items`, `fix/...`.
3. Shared files (`package.json`, `packages/shared`, `README.md`, `docs/ARCHITECTURE.md`) should have a quick heads-up in team chat before a breaking edit.
4. For API additions, change `packages/shared` and `docs/API.md` first; use compatible fields if other PRs depend on the old shape.
5. Use PRs for review; one reviewer from a **different primary concern** when practical. Founder may merge; no mandatory protected branch or hard CODEOWNERS policy.
6. Never commit credentials, personal or client payroll data; use demo wallets and fictional names.
7. Designer's work on brand identity is on hold; grayscale layout can progress without selecting brand colors.
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
