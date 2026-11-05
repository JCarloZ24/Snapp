# SETUP.md — Snapp starter and coding-agent onboarding

**Start here.** This README companion helps four human contributors and coding agents share a safe, repeatable project setup.

## Product scope before setup
Snapp targets **Proyekto-connected cutoff pay runs**, not replacement project management or invoicing. The owner manually reviews hours for 1–15 and 16–end-of-month periods, then approves exact recipients and amounts. Employees should see their own hours/rate/adjustment breakdown and payment results; client evaluations provide versioned work context, not an automatic wage gate.

The current source is still a fictional milestone-oriented starter. This setup does not provision Proyekto sync, cutoff review, client evaluation, employee statements, immutable run approval or bank disbursement. See [PRD](PRD.md) for the target and [API](docs/API.md) for current behavior.

The company's recommended bank-file path requires a verified corporate-bank facility and separate implementation; do not connect actual payroll or bank credentials to this demo. Noir demonstrates delegated **Testnet** execution only. Velo is a separate optional client collection path, not a payroll provider, a PHP conversion service or automatic Noir escrow funding.

## Prerequisites
- Node.js **22.23.4+ within v22**, or supported 24/26 version per Noir handbook (`.nvmrc` = `22.23.4`). Do **not** use Node 22.16.0 or older for Noir SDK.
- npm (bundled), Git, Chrome + [Noir extension](https://chromewebstore.google.com/detail/noir/gikfhchijjljpbhokmdmaadgmpbchmjl) for live wallet setup.
- For Testnet: [Velo dashboard](https://www.velo-build.dev), three Testnet wallets (owner, agent, merchant), free [Friendbot](https://friendbot.stellar.org), no real funds.

## 1. Clone and install
```bash
git clone https://github.com/JoshuaHM-p4/Snapp.git
cd Snapp
nvm install && nvm use
node -v
npm install   # one root command for every workspace
```

If working from the distributed ZIP, extract and `cd agentpay-starter` instead of cloning. After first install **commit `package-lock.json`** to fix the exact SDK package versions.

## 2. Copy local environment
```bash
cp apps/server/.env.example apps/server/.env
```
Keep `DEMO_MODE=true`. The demo has no required external API keys. Never paste a secret into PRs, commits, client `.env`, issue threads or screenshots. `.env` is ignored.

## 3. Run locally (two independent apps)
```bash
npm run dev
# Web     http://localhost:5173
# Server  http://localhost:4000/api/health
```
You can run them independently in different terminals:
```bash
npm run dev -w @agentpay/server
npm run dev -w @agentpay/web
```
The Vite proxy forwards `/api` to port 4000 **only during local development**. For production, implement web-host rewrite or `VITE_API_BASE` client configuration + allowlisted CORS; do not ship a localhost proxy.

## 4. Smoke test
```bash
npm run smoke            # requires running server
npm run typecheck
npm test
npm run build
```
Navigate to the sample `Business website development` project, then click **Run agent decision preview**. You should see `hold` or `human_review` because the fixture lacks verified payment/approval prerequisites. This is intentional; no payment occurs. This preview does not demonstrate owner-reviewed cutoff hours or an approved pay run.

## 5. Testnet integration setup — founder, not for casual demo run
1. Read [INTEGRATIONS](docs/INTEGRATIONS.md) and compare **Noir's repository IDs** against the *different* earlier form IDs. Confirm with organizers if needed.
2. `npm install` at a supported Node version; check SDK TypeScript signatures and record resolved versions. Official guides: [Noir SDK](https://github.com/noirx402/noir/tree/main/sdk/agent-sdk) and [Velo SDK](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md).
3. For the separate Velo collection experiment, obtain `VELO_API_KEY` and `VELO_WEBHOOK_SECRET` and configure HTTPS webhook `/api/webhooks/velo`. Velo is not required to fund Noir escrow. Its [upstream release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope) is Testnet only with no Mainnet or external settlement support; the repo's alpha dependency is not upgraded by these docs.
4. Generate/fund **owner**, **agent** (gas), **merchant** Stellar Testnet accounts. No real assets.
5. Owner signs `registerDevice`, `registerAgent` and `fundEscrow` using Noir SDK + extension (card UID can be manually entered). Record device hash, agent public key and merchant address. **The starter does not automate owner setup or merchant `claim`; add/test these scripts before claiming completion.**
6. Set `NOIR_DEVICE_HASH`, `NOIR_AGENT_PUBLIC_KEY`, `NOIR_AGENT_SECRET` in server `.env`. Verify recipient merchant address with independent out-of-band agreement.
7. Add the verified merchant wallet to `ALLOWED_MERCHANT_ADDRESSES`. Only then set `DEMO_MODE=false` for a **controlled local Testnet experiment**. Do not expose the protected payment endpoints publicly without real authentication, durable DB and idempotency.
8. A current adapter experiment is **not** the target cutoff workflow: approved run snapshots, reviewed hours, aggregate run limits and per-item dedupe are missing. Keep it isolated. Implement those safeguards before claiming approved-run execution or exposing this route to users.
9. For a controlled SDK experiment, use a tiny explicit Testnet amount within policy. Agent uses `checkPayment` before `authorizePayment`; verify the hash on [Stellar Expert Testnet](https://stellar.expert/explorer/testnet). Merchant separately signs `claim`. Neither step is a bank credit or a PHP conversion.
10. Reconcile Velo collections, Noir authorization and Noir claim into separate records. Durable reconciliation is not automatic in this scaffold. Noir policy does not restrict recipients or cumulative cutoff spending; enforce both app-side in the target implementation.

## 6. Environment examples
| Variable | Where | Role |
| --- | --- | --- |
| `PORT`, `WEB_ORIGIN`, `PUBLIC_WEB_URL` | server | Dev server and redirect/CORS |
| `DEMO_MODE` | server | Safe demo guard; `true` by default |
| `ADMIN_API_TOKEN` | server | Temporary protected API token for controlled Testnet curl; **not production auth** |
| `VELO_API_KEY`, `VELO_WEBHOOK_SECRET` | server | Checkout + signed events |
| `NOIR_DEVICE_HASH`, `NOIR_AGENT_PUBLIC_KEY`, `NOIR_AGENT_SECRET` | server | Official delegated agent key + linked device |
| `ALLOWED_MERCHANT_ADDRESSES` | server | Comma-separated independently verified recipient addresses |

## 7. Four parallel workstreams (collaborative, not strict)
- **UI/UX + Frontend — [JCarloZ24 (JC)](https://github.com/JCarloZ24):** `docs/DESIGN.md`, `docs/UI.md`, reusable components and frontend routes; cutoff review, private employee statements/discrepancies, client evaluation and per-item status views. Brand approval remains on hold; keep sample routes honestly labeled until replaced.
- **API Integration — [Stobeeney](https://github.com/Stobeeney):** API contracts, shared types, server endpoints, frontend/API data wiring and Proyekto/Velo API integration; versioned reviews/calculations, auth/RBAC, immutable run approval and durable per-item records. Velo collections remain separate.
- **Integration + Deployment — [aidantiu](https://github.com/aidantiu):** end-to-end integration, environment/hosting configuration, CI, web/server deployment and HTTPS webhook verification; coordinate integration and reconciliation checks with Stobeeney and the founder.
- **Founder/fullstack — [JoshuaHM-p4](https://github.com/JoshuaHM-p4):** exact-approved-item Noir execution, app-side recipient/run limits, Testnet proof, bank-facility feasibility and final product/security review; support the integration and deployment owner.

Assign issues, feature branches and small PRs; **no hard file permissions**. These are primary responsibilities, not exclusive rights or changes to GitHub access. Anyone can pair across workstreams; the founder can support everywhere. See [TEAM](docs/TEAM.md).

## 8. Rules for any coding agent (Claude/Codex/etc.)
Read `AGENTS.md` and `CLAUDE.md` first, then PRD/ARCHITECTURE/INTEGRATIONS. Pick a single small task, mention which files/interfaces will change, edit only what is needed, run tests, leave a concise PR summary. Do not invent API responses, integration success, wallet balances, webhook events, screenshots, transaction hashes or unsupported contract IDs. Never make real transfers.

## 9. Known gaps and errors
- **Live Velo and Noir SDK types are not verified by clean install in this generated package.** Review versions, run typecheck, then adjust adapters against actual source.
- If `npm install` warns about engine, switch to handbook-supported Node version.
- If startup fails, confirm both dev servers and copy of server env.
- If Velo webhook verification fails, check raw body, secret and header; don't bypass validation.
- If Noir authorizations fail, check agent fee balance, device hash, policy cap/expiry, escrow balance and recipient.
- If a payout gets `PENDING_RECONCILIATION`, consult Testnet explorer/events **before** retry.
- The JSON store is not safe under concurrent writes; replace with SQL before real payout features.
- No Proyekto or bank integration is configured. Verify actual API permissions or supported bank-file formats before implementing; never automate bank UI/OTP entry or claim a one-OTP batch.
- Client comments, revision requests and acceptance must retain deliverable version, evaluator and time. They do not replace owner hours review or automatically gate wages.

## 10. Submission reminders
A publicly accessible deployed website, public GitHub monorepo, 2-min video, short explanation and Testnet tx proof are mandatory. Handbook deadline is **Nov 7 2026, 12:00 PM PHT**. See [CHECKLIST](docs/CHECKLIST.md).

> **Starter validation note (Nov 5, 2026):** structural and JSON checks passed with `npm run check:scaffold`. Full dependency installation, TypeScript build, live Noir/Velo integration, and deployment have **not** been verified in this environment. Run the required commands on a supported Node version and treat missing integration work as open tasks.
