# ClaimBreak — Quantum Evidence Court

### Don't trust the claim. Design the test.

**One quantum source. Two experiments. Two different conclusions.**

[**Watch the 2:50 demo**](https://youtu.be/NPCGNXBqOQw) · [**Play ClaimBreak on Qollab**](https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co) · [**Open the independent Evidence Reviewer**](https://faadil1.github.io/ClaimBreak/) · [**Run the tests**](#run-locally) · [**Scientific details**](docs/SCIENTIFIC_METHOD.md)

**Qollab × IonQ Global Quantum Hackathon 2026** · **Quantum Unlocked** · **MIT licensed**

---

## The problem

Seeing a perfect correlation is not the same as proving entanglement. Two sources can agree in the Z basis even though one is entangled and the other is not. Collecting more measurements of the wrong observable does not repair a bad experiment.

Quantum education often reveals the answer first. **ClaimBreak makes the player design a test, risk a prediction, and defend a verdict with measurements they did not control.**

## The experience

**Build → Challenge → Commit → Measure → Decide → Audit**

1. **Create a source.** Build a two-qubit circuit visually with H, Z, S, T and CNOT gates (up to 12 instructions), or investigate one of the curated sources. Export or import a portable source blueprint.
2. **Challenge a claim.** Assert that the source is entangled, separable, or has a specified minimum Bell-state fidelity.
3. **Choose the experiment.** Select **Z only**, **ZZ ± XX**, or **ZZ ± XY**, plus a shot budget. Lock the predicted scientific outcome **before** measurement.
4. **Execute the real circuit.** ClaimBreak creates the selected Qiskit circuit and sends **one job** to the Qollab-selected simulator. The returned bitstring counts, not a scripted answer, determine the observations.
5. **Defend or revise your verdict.** Certify a witness, refute the *specific* submitted claim, or acknowledge insufficient evidence. Unsupported decisions are rejected; the player can correct the verdict **without a second job**. Both attempts remain in the session record.
6. **Audit independently.** Copy the evidence JSON to the standalone, offline-capable [Evidence Reviewer](https://faadil1.github.io/ClaimBreak/). It recalculates correlations, the statistical margin, declared protocol, event order, and decision consistency directly from the counts.

**Try it without a login:** the published Qollab **v1.2** project was observed running from a signed-out browser. The separate *Run on Qollab* button may request a Qollab account; the public project preview supports the observed visitor experience.

## The signature challenge: The Invisible Phase

Prepare the source **`H0 CX01 S0`**. Ideally this makes

\[
|\psi\rangle = \frac{|00\rangle+i|11\rangle}{\sqrt{2}}.
\]

A claimant says: **"This source is separable."** The investigator can select two valid but differently informative measurement protocols.

| Observed Qollab BasicSimulator run | ZZ + XY | ZZ + XX |
|---|---:|---:|
| ZZ correlation | +1.000 | +1.000 |
| Second correlation | XY = +1.000 | XX = +0.172 |
| Measured witness \(S\) | **2.000** | **1.172** |
| One-sided lower bound, \(\alpha=0.01\) | **1.621** | **0.793** |
| Defensible verdict | **Refute separability** | **Evidence insufficient** |

**The source did not change; the question did.** The first predeclared witness exceeds the separable-state threshold after accounting for finite shots. The other does not establish entanglement, **but does not prove separability either**.

Both were real, **separate** Qollab BasicSimulator jobs with 128 shots **per measurement basis**, and their exported receipts passed the independent mathematical verifier:

- [ZZ + XY — measured refutation, including rejected → accepted recovery](evidence/observed/qollab-basic-simulator-phase-xy-stage44-2026-10-11.json)
- [ZZ + XX — supported abstention, not a false claim of separability](evidence/observed/qollab-basic-simulator-phase-xx-stage44-2026-10-11.json)

### IonQ simulator compatibility

Stage 4.4 was also observed executing **`H0 CX01 S0` / ZZ + XY** in the published Qollab project with **IonQ Forte 1 simulator (29q)** selected. The reported independent job produced:

| Backend | Shots / basis | ZZ | XY | Witness \(S\) | Lower bound |
|---|---:|---:|---:|---:|---:|
| Qollab IonQ simulator, noise model | 128 | 0.96875 | 1.00000 | **1.96875** | **1.58939** |

The exported result was pasted into the public reviewer and displayed **PASS — 0 internal integrity errors**. The full IonQ JSON export is **not currently committed**; the [screenshot-grounded observation report](docs/STAGE44_IONQ_SIMULATOR_OBSERVATION_2026-10-11.md) records the selected backend, job ID, reported counts and the precise evidence boundary.

**This was a simulator, not an IonQ physical QPU.** Reviewer PASS means *internal mathematical consistency*, **not** cryptographic proof that a vendor ran the job. No quantum advantage, hardware reliability or external-user adoption is claimed.

## Judge quick start — 2 minutes

1. Open [ClaimBreak on Qollab](https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co) and select its public **v1.2** project. Choose **Qiskit Built-in Simulator (24q)** for the fastest guided run.
2. Open **Open Challenge D**. Use the visual composer to make `H0 CX01 S0`, select **Source is separable**, **ZZ + XY**, and **128 shots per basis**.
3. Forecast **Evidence insufficient** and select **Lock forecast & collect real quantum evidence**. Inspect the actual returned data; ideal values are an expectation, **not a guaranteed hard-coded outcome**.
4. If the one-sided witness lower bound is above 1, select **Refute submitted claim**. If it is not, choose a verdict supported by the evidence. Use **Display evidence JSON** → **Select all JSON**.
5. Open the [Evidence Reviewer](https://faadil1.github.io/ClaimBreak/), paste the exported JSON, and choose **Verify pasted record**. Inspect the verdict and its pass/warning distinction.

To experience the *wrong-question* effect, run **a separate investigation** with the same source but **ZZ + XX**. These runs are not pooled into one statistical test.

## Why it is different

| Typical circuit demo | ClaimBreak |
|---|---|
| Show a prepared state and its probabilities | Let a player author a new source and a falsifiable claim |
| Choose measurements without commitment | Lock prediction and experimental settings before the backend job |
| Show a correct/incorrect badge | Require an admissible scientific conclusion under a declared confidence bound |
| Restart after a wrong answer | Reject unsupported verdicts but preserve the correction history using the same data |
| Trust a screenshot of a result | Export raw counts and recalculate them in an independent browser reviewer |

This is an **educational quantum investigation tool**, not a fraud detector, general-purpose tomography suite or cryptographically secure challenge exchange.

## Architecture

```text
Player / creator (Qollab JS + Qiskit)
    │ circuit + exact claim + predeclared protocol + forecast
    ▼
Qollab-selected backend ── one circuit / one job
    │ actual bitstring counts
    ▼
Witness + one-sided bound + admissible verdict
    │ accepted/rejected decision history + JSON receipt
    ▼
Independent Evidence Reviewer (static HTML / browser, no backend access)
    └── recalculates counts, bounds, claims and event consistency
```

The source grammar is intentionally restricted. For two-basis experiments the circuit includes **two independently prepared source registers**, one for each measurement setting; **128 circuit shots yield 128 observations per setting**, *not* 256 backend jobs or 256 shots per setting.

## Run locally

The quantum product itself **requires the Qollab JS/Qiskit environment**: paste `qollab/index.html`, `qollab/main.css`, and `qollab/main.js` into their respective panes, select a supported simulator, and use **Run Project**. The backend object is provided by Qollab; a standalone Node process is not a replacement.

The review interface is a static app: visit [GitHub Pages](https://faadil1.github.io/ClaimBreak/) or open the root `index.html` locally. To run checks, use **Node.js 20+**, with no external npm dependencies:

```bash
npm test
npm run check:qollab
npm run build:reviewer
```

GitHub Actions repeats the syntax and verifier regression suite. [Reproduction and failure recovery](docs/RUNBOOK.md) · [Scientific method and statistical assumptions](docs/SCIENTIFIC_METHOD.md) · [Evidence provenance](docs/EVIDENCE_PROVENANCE.md).

## Development provenance and attribution

Built during the **October 9–11, 2026 hackathon window**, using Qollab's **JS/Qiskit starter project structure** (container element and injected backend) and the **Qiskit** framework. **AI-assisted development and documentation** were used; the team designed, integrated, iterated, and tested the ClaimBreak-specific interactive workflow, circuit composer, phase-sensitive protocols, confidence-bound decisions, recovery history, reviewer and regression tests. The standard Bell states, Pauli observables and Hoeffding inequality are established quantum/statistical methods, **not inventions claimed by this project**.

The original contribution is the **integrated learning experience**: *user-authored claim → precommitted experiment → measured evidence → supported/refused/revised decision → independent review*. The repository includes both observed simulator receipts and explicitly synthetic fixtures, with their roles separated.

## Scientific integrity

For a **single prespecified** two-basis witness, the application uses \(S=\langle ZZ\rangle \pm \langle XX\rangle\), or \(S=\langle ZZ\rangle \pm \langle XY\rangle\), and the separable-state bound \(S\le 1\). The conservative one-sided Hoeffding margin is \(2\sqrt{\ln(1/\alpha)/N}\), with \(\alpha=0.01\); certification requires \(S_{\mathrm{observed}}-\mathrm{margin}>1\). This depends on trusted measurement bases, independent measurements, and the declared analysis. It is **not** a guarantee over repeated adaptive runs. More details and a separate claim-specific Bell fidelity bound are in the [scientific note](docs/SCIENTIFIC_METHOD.md).

The offline reviewer's receipt is **not** a signature, a device certification or backend attestation. The repository distinguishes genuine *user-exported observed data*, *synthetic test fixtures*, and *analytical references*. Failures and inconclusive outcomes are scientific results, not defects to hide.

---

**Created for the Qollab × IonQ Global Quantum Hackathon, October 2026.** Open source under the [MIT License](LICENSE).

**This effort is supported by Qollab & IonQ.**
