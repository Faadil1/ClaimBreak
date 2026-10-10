# ClaimBreak runbook

## Requirements
- Qollab JS/Qiskit project and access to a supported backend.
- JavaScript-capable desktop browser for the reviewer; Edge or Chrome suggested.
- Node.js >=20 *only* for repo checks; no npm dependencies.

## Live Quantum Court (Qollab)
Paste qollab/index.html, qollab/main.css and qollab/main.js into their respective editor panes. Press Run Project on Qollab. The app initially waits for experiment configuration; choose A/B/C, z/plus/minus, shots per setting and press **Collect quantum evidence**. A dual-basis setting uses two source preparations **inside one circuit**, N shots per setting and one job. Read measured correlations, choose a verdict and export JSON by displaying and copying it into a UTF-8 .json file.

Known working local paths include: A plus certification; B plus fidelity refutation; C minus entanglement witness; A z-only abstention; B unsupported verdict -> retry -> accepted claim refutation. Stage 4.1 remote IonQ simulator was checked for B plus at 128 shots. Do not assume all combinations or QPU devices are proven.

## Offline reviewer
Double-click root index.html in Edge, select an exported JSON file, paste one, or choose **Load synthetic example** (explicitly not real evidence). Verify findings and export the independent reviewer report. It does **not** call a quantum backend.

## Reproducible checks
With Node >=20: npm run check, npm run build:reviewer. A CI workflow repeats syntax and receipt regression tests on push.

## Failure and recovery
If a Qollab experiment fails, retain the error and restart via Run Project on free BasicSimulator; never invent successful counts. An unsupported verdict may be corrected **within the same completed run**. If the JSON cannot download inside sandbox, use Display evidence JSON, Select all, Ctrl+C and save locally in Notepad as UTF-8.

## Provider truth
ionq_simulator is a simulator. Physical QPU jobs may have costs and queue delays. App-level deviceClass may remain UNVERIFIED_IN_APP.


## Candidate Stage 4.2 — user journey (not yet Qollab live-verified)

1. After updating **all three** Qollab editor panes, select A/B/C, Z-only/plus/minus and 64/128/256/512 shots per basis.
2. **Before** clicking the live acquisition button, choose your **pre-run forecast**: certify, specifically refute, or admit insufficient evidence. Acquisition stays disabled without it.
3. Click **Lock forecast & collect real quantum evidence**. The forecast lock and exact setup enter the local event log; **one and only one** Qiskit backend job is requested.
4. Compare measured ZZ/XX visual signals with the selected witness bound; observe whether your own forecast survived the actual run. An incorrect pre-run forecast cannot be changed after acquiring data.
5. File a verdict. Unsupported attempts are refused and recorded; choose a supported verdict using the SAME counts. The challenge outcome retains your original forecast and the resource cost.
6. **Display evidence JSON** and import it into the standalone review desk; the Stage 4.2 verifier cross-checks forecast time/order, shot/protocol match, actual supported outcome, recovery history, and one-job resource statement.

The code and synthetic/offline verification are a **CANDIDATE** until Qollab is updated and its real runner and visitor access tested. Z-only evidence cannot become conclusive merely by spending extra shots; do not describe selected source identity as fully unknown to a reader of the open-source code.
