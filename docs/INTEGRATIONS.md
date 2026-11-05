# Integration boundaries — company workflow and Testnet demonstration

The target is a Proyekto-connected owner-approved cutoff pay-run and payment-transparency layer. The existing starter remains a milestone-based Testnet demo; **no live Proyekto integration, bank integration, approved-run snapshot or durable at-most-once item ledger is implemented or verified**. Neutral temporary branding and Stellar Testnet-only hackathon scope remain.

**Reference basis:** supplied *Velo x Noir Agentic Payment Hackathon — Builder Handbook* updated Nov 5, 2026, [Noir contract reference](https://github.com/noirx402/noir/blob/main/docs/contracts.md), and current [Velo release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope). Documentation and source review are not live SDK/provider validation.

## Proyekto and compensation boundaries — target only
Proyekto already supplies projects, tasks, docs, progress, roadmaps/Gantt and invoicing. Snapp should link/import those references with provenance rather than duplicate the system; no connector is delivered here. For cutoffs **1–15** and **16–end-of-month**, consolidate employee/project hours with actual outputs and versioned client feedback. The boss manually reviews hours and retains final release authority.

Milestones group deliverable evidence. Client evaluation records output version, comments, revision requests and acceptance identity/time/version, not invented objective ratings. Client acceptance or invoice collection does not automatically determine eligibility for hours-based employee pay: applicable agreements and legal obligations govern. Keep employment/hourly compensation distinct from fixed-fee milestone contracting.

Employees need their own calculation statement (reviewed hours, applicable rates, allocations, explained adjustments and total), a discrepancy channel and access to **their own compensation only**. These are pending features, not properties of the public fixture API.

## Company bank path — recommended, not implemented
The primary pain is repeated recipient/amount copying and separately authorizing each transfer. Recommend generating a file in the **chosen corporate bank's supported format**, after verifying account eligibility, schema, recipient validation, upload limits, approval controls and recipient-level result reporting with that bank. For example, [BPI BizLink](https://www.bpi.com.ph/institutional-banking/cashflow-management/bizlink) already advertises transaction-file upload and approval controls; [Sprout payroll](https://sprout.ph/product/payroll-management/) offers payslips/timekeeping/bank-file generation. Differentiate through Proyekto-linked review and traceability, not by claiming to invent payroll or bulk banking.

No bank file/export or API is implemented or live-tested here. A bank API is only a future option after provider capability is verified. Do not automate bank UI/OTP, bypass bank approval or promise one OTP; the bank's controls remain authoritative. A file upload/approval is not proof that every recipient succeeded.

## Required run/execution boundary — pending
- Boss approves an immutable cutoff run revision binding exact recipient, amount, currency/asset and item identity. Any changed item, recipient, amount, hours or adjustment requires reapproval; execute only that approved snapshot.
- Reserve each item transactionally with a unique execution identity before external submission, persist provider/chain identity and reconcile recipients individually. A run may be partially successful; failed, unknown, submitted and confirmed results must remain distinguishable. Unknown outcomes require reconciliation, never blind retry.
- Enforce verified recipients/allowlisting **and cumulative approved-run spending/reservations app-side**. Noir only caps per payment/asset/expiry; neither an allowlist nor a cumulative cutoff cap is in its policy. Contract nonce replay protection is not business-level item deduplication: a new authorization nonce could repeat the same intended payment.
- Employee statements, approval audit records and reconciliation must refer to the same immutable revision. Current JSON milestone storage and `PENDING_RECONCILIATION` marker do not implement these guarantees.

## Read these two repositories first
1. **Noir:** https://github.com/noirx402/noir — [SDK source](https://github.com/noirx402/noir/tree/main/sdk/agent-sdk), [SDK examples](https://github.com/noirx402/noir/tree/main/sdk/agent-sdk/examples), [contracts](https://github.com/noirx402/noir/blob/main/docs/contracts.md), [walkthrough](https://github.com/noirx402/noir/blob/main/docs/walkthrough.md), [deploy evidence](https://github.com/noirx402/noir/tree/main/deploy-evidence).
2. **Velo:** https://github.com/Velo-Ecosystem-Collection/Velo — [SDK README](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md), [Express example](https://github.com/Velo-Ecosystem-Collection/Velo/tree/main/examples/express), [docs](https://www.velo-build.dev/docs).

## Contract ID discrepancy — unresolved before any live Testnet authorization
The **earlier application form** in the conversation named a different set of contract IDs:
| Contract | Earlier form ID (unverified vs current repository) |
| --- | --- |
| device_registry | `CB4DPMGOA374JIB2ZVD4AHW5GJKQUYNOFGRYNOJ75EFH2KCJSMHOWIRA` |
| agent_registry | `CBTDMJVCFQDIVWZBKAKZ2FQ3UEJNAAUFYCTJ3E4ON2MYXPLPSIXQ25JZ` |
| payment_escrow | `CA5S4S7QGHJHJWVJBYL3CXZXZTNGKXMNZVDAEQNN7NUXFP4D7BYK7HIX` |

The **Nov 5 handbook + public Noir repository contracts.md** instead give the IDs below, associated with the Oct 24, 2026 security redeployment, and the handbook says Noir SDK `TESTNET` defaults use them. The upstream reference table itself retains an older deployment-date label; do not infer installed SDK configuration or resolution from a label:
| Contract | Handbook/repository current ID | Explorer |
| --- | --- | --- |
| device_registry | `CAC4KOLHDLDYDWBOKXNKRN5KVHO56PLOIFXDLTBUWGVN6GVDEB7FQHU5` | [view](https://stellar.expert/explorer/testnet/contract/CAC4KOLHDLDYDWBOKXNKRN5KVHO56PLOIFXDLTBUWGVN6GVDEB7FQHU5) |
| agent_registry | `CCMZDSPTLX7IIJWCYEUM5DJUHOSOYSTHGK777S2TXZWEMC5ZZGPJ3EBV` | [view](https://stellar.expert/explorer/testnet/contract/CCMZDSPTLX7IIJWCYEUM5DJUHOSOYSTHGK777S2TXZWEMC5ZZGPJ3EBV) |
| payment_escrow | `CC7EAW5FNJEDBS7THM5IT6XIOHO4AOYMLXT3KSZ3HWUIKEACTW7E5BFS` | [view](https://stellar.expert/explorer/testnet/contract/CC7EAW5FNJEDBS7THM5IT6XIOHO4AOYMLXT3KSZ3HWUIKEACTW7E5BFS) |

**Action:** Do **not** hardcode the form IDs. Use `new NoirAgentClient()` Testnet defaults, check SDK resolved version + its deployed contract settings, confirm with hackathon organizers if the form is newer than handbook, and capture a valid `stellar.expert` proof. Do not claim this discrepancy is resolved just because one doc says "latest".

## Noir SDK path — pre-funded Testnet escrow, not bank payroll
Use Noir SDK only; no substitute contracts or direct custom payment path. Existing adapter calls do not implement the approved-run boundary above.

Primary owner: JoshuaHM-p4 owns Noir SDK/configuration setup, integration development, owner setup and merchant claim tooling, negative/integration tests and controlled live Testnet proof, from the current adapter through the target approved-run workflow. Stobeeney owns API coordination and Aidantiu owns integration/deployment. These assignments do not change signing authority or implementation status; see [TEAM](TEAM.md).

- Owner setup: `registerDevice`, `registerAgent`, `fundEscrow` (owner signs); escrow is independently pre-funded, not funded by Velo checkout.
- Agent path: app must bind the exact approved recipient/amount/asset item and enforce run constraints, then `checkPayment` and `authorizePayment` (agent signs) via [packages/agent/src/noir.ts](../packages/agent/src/noir.ts).
- Merchant path: `claim` (merchant signs); persist authorization and claim evidence separately. Claim may aggregate pending merchant payments, so reconcile actual claim evidence to items rather than assume one claim equals one item. Authorization alone is not receipt, a PHP bank transfer or legal wage settlement.
- 1 XLM = 10,000,000 stroops; `toStroops` not floating point multiplication.

## Velo — separate optional client collection
The repository's server package **declares `@carts1024/velo-sdk: "alpha"`**; it is not silently upgraded by this document, and a resolved installed version is not established here. Current upstream README describes stable **`1.0.0` / `latest`**, but its [release scope](https://github.com/Velo-Ecosystem-Collection/Velo/blob/main/packages/velo-sdk/README.md#release-scope) explicitly remains **Stellar Testnet only, no Mainnet, no settlement and no external payment provider**. Stable package status does not make real fiat collection or bank payroll available.

Existing server adapter usage (not a live compatibility validation):
- `new Velo({apiKey, environment:'testnet'})` on server only.
- `velo.checkout.sessions.create({amount:'2.5',asset:'native',description,successUrl,cancelUrl})`.
- `velo.paymentIntents.retrieve(paymentIntentId)` for observed final state; durable server reconciliation is not implemented.
- `Velo.webhooks.verify({payload: rawBody, signature, secret})` before processing. Current handler logs verified receipt; event deduplication and invoice reconciliation remain pending.

This optional collection path is separate from employee payout and Noir escrow funding. PHP invoice amounts do not establish Testnet asset equivalence. Do not mark paid from a redirect or invent a Velo-to-bank/escrow funding bridge.

The Noir package declares `"latest"`; check resolved versions, SDK exports/types and deployed settings before any separately authorized Testnet exercise. The current adapter uses an SDK-inferred deviceHash cast that remains unvalidated by this documentation task.

## Required security checks — not completed validation
- [ ] Separate owner/agent/merchant accounts; fee funding and pre-funded escrow verified on Testnet.
- [ ] Immutable owner-approved run recipient/amount snapshot and reapproval on changes.
- [ ] Verified server-side recipient allowlist (`ALLOWED_MERCHANT_ADDRESSES`) plus cumulative run/item reservation constraints; Noir does not supply them.
- [ ] Transactional per-item deduplication, durable submission identity, partial/unknown reconciliation and no blind resend.
- [ ] Signed raw-body webhook verification, unique event identity and intent reconciliation for optional Velo collection.
- [ ] Explicit merchant `claim` and independently confirmed claim state; no deceptive `paid` UI after authorization.
- [ ] Employee-only compensation visibility, audit history and discrepancy handling.
- [ ] No Testnet/fiat parity assumptions, no PHP bank-delivery claim and no real-money execution.
