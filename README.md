# ClaimBreak — Quantum Evidence Court

**Don't trust the claim. Design the test.**

A Qollab / IonQ Global Quantum Hackathon project built around a real investigation workflow: choose the experimental basis **before** running a quantum circuit, test a supplier's scientific claim with calibrated statistics, accept or reject a verdict, and export a complete trace of the evidence. An offline **Evidence Reviewer** provides a second, independently recalculated examination path for judges.

> This effort is supported by Qollab & IonQ.

## Try the product

**Live Quantum Court (Qollab):** https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co — **public v1.2 Stage 4.4** publication and signed-out browser execution observed. A separate Qollab **IonQ Forte 1 simulator (29q)** run and reviewer PASS have also been screen-captured, without physical QPU or cryptographic attestation.

**Independent reviewer (public GitHub Pages):** https://faadil1.github.io/ClaimBreak/ — independently observed accessible in Microsoft Edge, including an imported author-exported Qollab Stage 4.3 custom-source receipt with internal audit PASS. For offline use download root `index.html` and open it in a desktop browser. No Qiskit or account is required for offline review.

**Why this matters:** A Bell-entangled pair and a separable classically correlated source can both produce `ZZ=1`. A pretty correlation chart can make a false claim look persuasive. ClaimBreak asks a better question: *what evidence supports this exact assertion, and what is missing?*

**Current Stage 4.4 public description and judge quick-start:** [Public submission copy](docs/PUBLIC_SUBMISSION_STAGE44.md). Official hackathon team submission is still not confirmed.

## Stage 4.4 — Visual Circuit Studio and the Invisible Phase (published public v1.2, simulator runs observed)

Stage 4.4 extends the open two-qubit laboratory with one-tap visual gate construction, H/Z/S/T/CX operations, phase-sensitive **ZZ±XY** protocols alongside ZZ±XX, and a geometric witness plot generated from actual backend counts. Choosing the correct observable now determines whether the same user-authored entangled state can be certified. The source compiler is still limited to 12 whitelisted operations, not arbitrary QASM.

**Observed two-run comparison:** source `H0 CX01 S0`, claimed separable, Qollab **BasicSimulator**, 128 shots **per setting**, separate jobs:

| Selected witness | Measured S | 99% one-sided lower S | Final justified verdict |
|---|---:|---:|---|
| ZZ + XY | 2.000 | 1.621 | `REFUTE_SPECIFIC_CLAIM` (entanglement established) |
| ZZ + XX | 1.172 | 0.793 | `NOT_ESTABLISHED` (cannot conclude separability) |

The author-exported [XY](evidence/observed/qollab-basic-simulator-phase-xy-stage44-2026-10-11.json) and [XX](evidence/observed/qollab-basic-simulator-phase-xx-stage44-2026-10-11.json) receipts were independently recalculated by the reviewer and pass internal-coherence tests. They are **not** cryptographically attested and do not support pooling two 1% per-run error rates into one overall guarantee. Stage 4.4 has additionally been observed through a Qollab-selected **IonQ Forte 1 simulator** job, with reported `ZZ=0.96875`, `XY=1`, `S=1.96875`, and `lower=1.589393`, plus a public reviewer showing internal PASS. [Screenshot-grounded IonQ case details](docs/STAGE44_IONQ_SIMULATOR_OBSERVATION_2026-10-11.md). The **complete original IonQ JSON is not yet committed**; do not substitute the summary for a full receipt. Stage 4.4 has not been observed on physical QPU or with independently recruited outside users.

See [Stage 4.4 public card and judge walkthrough](docs/PUBLIC_SUBMISSION_STAGE44.md).

## Stage 4.3 — Open Challenge Exchange (observed on Qollab BasicSimulator)

The [Open Challenge Exchange](docs/OPEN_CHALLENGE_EXPERIMENT.md) was the **historical Stage 4.3 precursor to the currently released Stage 4.4**, with one observed custom-source BasicSimulator run; it is distinct from the previously observed Stage 4.1 remote-IonQ simulator evidence. A creator authors a new two-qubit gate sequence from H/Z/CX and an exact entanglement/separability/fidelity claim; an examiner can import the portable JSON, design a basis/shot experiment, and send that actual circuit through Qollab. The reviewer independently recalculates the outcome and checks the declared source-lock history, without claiming source secrecy or backend authentication.

**Observed:** user-authored `H1 CX10 Z1` / separability claim, minus witness, 128 shots per basis, one reported BasicSimulator job and independently recalculated Stage 4.3 reviewer PASS. [See the user-exported receipt](evidence/observed/qollab-basic-simulator-custom-case-d-2026-10-11.json). **Not demonstrated for Stage 4.3:** independently authored second-person exchange, broader statistical reliability, physical QPU attestation, or Stage 4.3 on remote IonQ Simulator. **The separate Stage 4.4 public publication is confirmed**, but official hackathon team submission remains unconfirmed.

## Stage 4.2 candidate — Quantum Cross-Examination

ClaimBreak adds a **real pre-run decision challenge** to the quantum investigation: the examiner must publicly **commit a predicted admissible verdict** before using real simulator shots. The measured bitstrings can uphold or overturn that forecast. An incorrect forecast remains visible even after the examiner corrects the final verdict using the same quantum acquisition. This is a consequence-bearing **scientific learning interaction**, not a cosmetic score or a second quantum job.

The standalone Evidence Reviewer now independently checks forecast chronology, resource accounting and forecast support from bitstring counts. It also tracks a four-mission Quantum Trials learning campaign across separately checked Stage 4.2 receipts, without pooling statistics or authenticating their backend origin. Source and verifier unit tests exercise the feature with fixtures, including a prior author-exported IonQ simulator record; **Stage 4.2 itself has NOT yet been observed running inside Qollab's live editor**, and prior Stage 4.1 observations must not be relabeled as Stage 4.2. Import/paste the updated `qollab/main.js` into Qollab before any live claim or official submission.

See [Stage 4.2 experience and truth boundary](docs/CROSS_EXAMINATION.md).

## Two interconnected product workflows

| Live Court / Qollab runtime | Evidence Reviewer / standalone HTML |
|---|---|
| Case, measurement basis and shot count locked before the job | Import 1–25 independent JSON receipts |
| Circuit is constructed specifically for selected case and settings | Derive ZZ, XX, witness and statistical bounds from bitstrings |
| Real `backend.run` -> `job.result`, once per full Qollab Run | Check counts, declared settings, arithmetic and decision support |
| Certify, refute or abstain with confidence guardrails | Inspect rejected→accepted history and event order |
| Unsupported decisions are refused but recoverable in same run | Compare different backends side by side (no illegal run pooling) |
| Case identity revealed only after accepted decision | Generate a local reviewer audit JSON (manual copy) |

### Case design

- **A / Bell Phi+**: `ZZ=+1`, `XX=+1`, plus witness certifies entanglement.
- **B / Separable imitation**: GHZ purification with unmeasured-by-analysis environment; `ZZ=+1`, `XX≈0`; use upper confidence bound to refute falsely claimed `F(Phi+) >= .90` without calling it fraud.
- **C / Bell Phi-**: `ZZ=+1`, `XX=-1`; minus witness detects entanglement hidden from the plus witness.
- **Z-only baseline**: inconclusive even with perfect agreement. The app must abstain, not declare separability.

### Source structure

```text
qollab/                Live JS/Qiskit project (Stage 4.4 visual creator and phase protocols)
reviewer/index.html    Self-contained, offline reviewer — open locally
reviewer/verifier.mjs  Independent verifier, tested under Node
reviewer/app.js        Review desk interface
reviewer/style.css     Responsive design language
evidence/fixtures/     Explicitly synthetic examples for tests, NOT live data
tests/                 Negative, tamper and mathematical regression tests
docs/                  Scientific method, product depth, runbook, validation matrix, video, submission gates
.github/workflows/     GitHub CI for syntax + verifier regressions
LICENSE                MIT
```

## Verification, not overclaiming

A user-provided [IonQ Simulator Stage 4.1 JSON receipt](evidence/observed/ionq-simulator-case-b-2026-10-10.json) is included; see [provenance classification](docs/EVIDENCE_PROVENANCE.md). The user has supplied successful **Qiskit BasicSimulator** receipts for Stage 4.1 recovery, and a successful **IonQ Simulator** Stage 4.1 receipt for Case B with `F_upper≈0.829`, `supported=true`. These are simulator results, not live physical IonQ QPU runs of Stage 4.1. See [validation matrix](docs/VALIDATION_MATRIX.md). No repeated independent hardware reliability, unaffiliated user adoption, or final hackathon team submission is claimed. Stage 4.4 is published on the publicly accessible Qollab v1.2 card, and its source editor, simulator interaction, and verdict have been observed in a signed-out browser. The Stage 4.4 IonQ simulator record was separately pasted into the public GitHub Pages reviewer and displayed internal PASS.

The offline reviewer cannot certify that user-controlled JSON was genuinely produced by IonQ. It detects inconsistent *contents*, not a well-forged document. Its included case B example is **synthetic** and visibly labeled as such.

## Run and test

See [RUNBOOK](docs/RUNBOOK.md). For static code regressions (Node 20+):

```bash
npm test
npm run check:qollab
npm run build:reviewer
```

No npm dependencies are required. Qollab injects the actual `backend` object; the live circuit is **not** runnable by opening `qollab/index.html` on a laptop.

## Scientific method and limits

[Statistical derivation and assumptions](docs/SCIENTIFIC_METHOD.md) · [Product depth](docs/PRODUCT_DEPTH.md) · [Gateway registry](docs/GATE_REGISTRY.md) · [Demo script](docs/DEMO_3_MIN.md) · [Submission checklist](docs/SUBMISSION_CHECKLIST.md) · [GitHub setup](docs/GITHUB_SETUP.md)

Built during the October 2026 Qollab / IonQ hackathon. MIT licensed.