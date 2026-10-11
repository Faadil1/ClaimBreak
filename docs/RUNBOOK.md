# ClaimBreak — Runbook

## Play the published product

Open [ClaimBreak on Qollab](https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co), public version **v1.2** (Stage 4.4). Select **Built-in Simulator (24q)** for the quickest experience, or **IonQ Forte 1 simulator (29q)** where available. Do not confuse the simulator with paid physical QPU hardware.

### Signature open challenge

1. Select **Open Challenge D** in the case selector.
2. Build the circuit `H0 CX01 S0` using the visual gate buttons or the optional text editor.
3. Set **Source is separable**, select **ZZ + XY**, and choose **128 shots per setting**.
4. Precommit **Evidence insufficient**, then click **Lock forecast & collect real quantum evidence**.
5. Wait for Qiskit to finish the single backend job. Read `ZZ`, `XY`, witness `S`, and its one-sided lower bound.
6. If `lower > 1`, choose **Refute submitted claim**. A wrong verdict is refused and preserved, but can be corrected using the **same counts**. Do not certify if the bound fails.
7. Click **Display evidence JSON**, **Select all JSON**, copy and save as a UTF-8 JSON file.

To demonstrate the effect of an incorrect measurement strategy, start an entirely separate Qollab Run using **the same source** but protocol **ZZ + XX**. Do not interpret missing certification as proven separability.

### Independent reviewer

Open https://faadil1.github.io/ClaimBreak/ (or the repository root `index.html` offline). Click **Paste JSON Instead**, paste the receipt, then **Verify pasted record**. It recomputes correlations, confidence bounds, supported outcomes and chronology. **PASS means internal consistency only**; external backend authenticity is not verified.

The reviewer also contains a historical four-mission guided campaign. A custom open-source case D receipt does **not** need to complete those four separate missions.

## Reproduce from the source repository

Qollab's JS/Qiskit editor uses `qollab/index.html`, `qollab/main.css` and `qollab/main.js`. Qollab injects its backend object. Simply running the JavaScript with local Node does not replace this backend.

With Node.js **20+**, no `npm install` dependency is required:

```bash
npm test
npm run check:qollab
npm run build:reviewer
```

The GitHub Actions CI runs syntax checks and the independent receipt regression suite. All observed samples under `evidence/observed/` are user-exported; synthetic test-only samples are under `evidence/fixtures/`.

## Failure/recovery

- If a backend request fails, preserve the error, recheck the selected simulator and restart Qollab Run; do **not** fabricate counts.
- A rejected scientific verdict can be corrected **without a second job** if an experiment already returned valid counts.
- If a JSON download is blocked inside Qollab, use **Display evidence JSON → Select all JSON → Ctrl+C**, then save in a text editor.
- If the reviewer marks a file FAIL, check missing fields, bitstring width, counts, claimed basis, event order and decision support. Never modify raw counts merely to obtain PASS.

The [scientific method](SCIENTIFIC_METHOD.md) and [provenance note](EVIDENCE_PROVENANCE.md) state the limits of these conclusions.
