# Product Depth & Live Reality

ClaimBreak is an evidence workflow, not a screenshot of a Bell circuit.

## User loop — investigator
1. A claimant submits an **exact assertion** (entangled, Phi+ fidelity >=90%, separable).
2. Investigator selects dossier, settings and shots before backend acquisition.
3. Qollab constructs only the selected source's circuit and dispatches a quantum job.
4. Counts determine ZZ/XX, witness confidence bound, and eligible decisions.
5. Investigator certifies, specifically refutes, or abstains.
6. Unsupported judgments remain in append-only decision history and can be corrected without spending new shots.
7. Once supported, source preparation is revealed and one full audit record can be exported.

## Operator loop — reviewer
1. Import one or many exported receipts without Qollab login.
2. Independently recompute raw-count-derived correlations, bounds and decision support.
3. Find malformed counts, incorrect arithmetic, contradicting event records, or copied inconsistent fields.
4. Compare different backends **without pooling their error probabilities**.
5. Export a reviewer report separately from original receipts.

## Why this exceeds the first vertical slice
The core needs a real backend response: the UI cannot choose a supported verdict independently of measured evidence. Rejected decisions have consequences, revision is possible, and the independent review surface supports an additional stakeholder.

## Gaps not concealed
No multi-session state server; Qollab sessions reset on full Run. No external claim submission; A/B/C are educational controlled sources. No verified hardware attestation, identity service, audit-signature chain, independent user adoption, or comprehensive repeated-run reliability. Additional real value should be tested against time and submission risk, not indiscriminately added.

Receipts are outputs of product use; replay and synthetic fixtures are secondary inspection aids.
