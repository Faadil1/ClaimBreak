# ClaimBreak — Quantum Evidence Court

## What it is
ClaimBreak is an interactive quantum evidence investigation. An investigator selects a sealed-source claim, measurement protocol and shot count *before* running a Qiskit circuit. They analyze experimentally simulated measurement outcomes, then submit a verdict: certify an entanglement witness, refute a specific claim, or report insufficient evidence.

## Why this matters
Perfect Z-basis agreement does not prove entanglement: an entangled Bell pair and a separable classically correlated mixture can give the same Z results. ClaimBreak forces the investigator to ask which complementary measurements would actually justify a claim. A calibrated, predeclared witness guards against the false-certification risk of using a raw point estimate against a mathematical threshold.

## How to try it (judge quickstart)
1. Open published project and choose **Built-in Simulator**.
2. Press **Run**. ClaimBreak opens in setup mode.
3. Choose **Source A**, **Two bases — ZZ + XX**, **128 shots per setting**; select **Collect quantum evidence**.
4. After results return, select **Certify entanglement**; inspect the witness bound and the exported evidence record.
5. Restart the project and explore **Source B** (challenge claimed F(Phi+) >=0.90) or **Source C** (challenge a separability claim using ZZ - XX).

## Scientific scope
- A separable two-qubit state obeys ZZ + XX <= 1, and ZZ - XX <= 1, under trusted axes and measurements.
- A one-sided Hoeffding margin is used for a **single prespecified test**, with alpha = 0.01. It does not cover arbitrary repeated searching, altered witness selection after seeing results, correlated device errors, or device-independent claims.
- Results come from the runtime-provided Qiskit backend selected by the user. **An ideal or noise-model simulator run is not QPU hardware evidence**. The exported device class remains unverified unless established independently from the Qollab QPU selector/job console.
- Additional numerical probabilities in the *post-verdict reliability lens* are **analytical reference calculations** for an ideal separable mixture, not extra runs.

## Technical overview
- Qollab JS/Qiskit project, browser-based, using the runtime-injected backend.
- User selects one protocol before measurement; one quantum circuit/job per Run (compatible with IonQ's per-run job limit).
- Bell / Phi-minus circuits and GHZ-ancilla purification for the separable mixture.
- Count marginalization, parity correlations, witness estimates, conservative confidence bounds, traceable accept/refuse/inconclusive decisions, JSON export by manual copy.
- No externally hosted server, API credentials, or storage dependency.

## Reliability and limitations
- Built-in simulator tests are reproducible in principle; actual results vary with finite shots.
- An internal receipt-integrity check validates bitstring lengths, sample counts and bound consistency, **not** hardware calibration.
- No persistent storage between Qollab Run sessions. Save evidence via manual-copy JSON.
- Example sources are synthetic, named case models rather than real untrusted vendors.
- The current product supports a focused set of two-qubit cases; it does not certify arbitrary unknown states.

## Attribution and license
This effort is supported by Qollab & IonQ.

License: MIT — include a `LICENSE` file / publish under MIT on Qollab.

## AI / code provenance
[Before submission: disclose assisted portions, any copied starter/template code, and the original contribution created during the hackathon window. Verify against official terms.]

## Evidence of testing
[Fill only after rechecking the published Stage 4 version and free IonQ remote simulator. Cite actual runtime/job results and timestamps; don't recycle Stage 3 receipts as Stage 4 tests.]