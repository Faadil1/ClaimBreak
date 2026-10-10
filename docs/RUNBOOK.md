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
