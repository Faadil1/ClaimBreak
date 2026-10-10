# ClaimBreak — Quantum Evidence Court

**Don't trust the claim. Design the test.**

A Qollab / IonQ Global Quantum Hackathon project built around a real investigation workflow: choose the experimental basis **before** running a quantum circuit, test a supplier's scientific claim with calibrated statistics, accept or reject a verdict, and export a complete trace of the evidence. An offline **Evidence Reviewer** provides a second, independently recalculated examination path for judges.

> This effort is supported by Qollab & IonQ.

## Try the product

**Live Quantum Court (Qollab):** https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co#code — author's project link; public publication remains to be confirmed.

**Independent offline reviewer:** download root `index.html` (identical to `reviewer/index.html`) and double-click it in a desktop browser. No login, Qiskit installation, credentials, Node or network required to *review exported receipts*. GitHub Pages can host the reviewer from the repository root after it is enabled; deployment is not yet claimed.

**Why this matters:** A Bell-entangled pair and a separable classically correlated source can both produce `ZZ=1`. A pretty correlation chart can make a false claim look persuasive. ClaimBreak asks a better question: *what evidence supports this exact assertion, and what is missing?*

**Judge-ready project description and quick-start:** [Qollab submission copy](docs/QOLLAB_SUBMISSION_COPY.md) — draft for the organizer form; not proof of publication or submission.

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
qollab/                Live JS/Qiskit project (Stage 4.1 validated baseline)
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

A user-provided [IonQ Simulator Stage 4.1 JSON receipt](evidence/observed/ionq-simulator-case-b-2026-10-10.json) is included; see [provenance classification](docs/EVIDENCE_PROVENANCE.md). The user has supplied successful **Qiskit BasicSimulator** receipts for Stage 4.1 recovery, and a successful **IonQ Simulator** Stage 4.1 receipt for Case B with `F_upper≈0.829`, `supported=true`. These are simulator results, not live physical IonQ QPU runs of Stage 4.1. See [validation matrix](docs/VALIDATION_MATRIX.md). No evidence of repeated independent hardware reliability, public access, or final event submission is yet claimed.

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