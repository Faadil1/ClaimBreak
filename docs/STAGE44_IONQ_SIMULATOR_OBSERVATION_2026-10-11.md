# Stage 4.4 — Qollab IonQ Forte 1 Simulator observation (2026-10-11)

## Classification

**USER/WORK-REPORTED QOLLAB SIMULATOR RUN — SCREENSHOTS SEEN — INTERNAL REVIEWER PASS.** This is a report of one actual browser-driven Qollab experiment selected on `IonQ Forte 1 simulator (29q)`, not an execution independently authenticated against IonQ's job API. **No physical quantum hardware** was used or claimed.

The complete exported original JSON was **not** included in this repository update, so the numbers below are a faithful transcription of the reported record and screenshot-visible identifiers, **not** a replacement fabricated full JSON receipt. Save the untouched original export here in a future separate commit when available.

## Browser-selected execution

- Public project: https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co (published v1.2; Stage 4.4)
- Qollab backend selector: `IonQ Forte 1 simulator (29q)`, noise model
- Record backend label: `ionq_simulator`; simulator, not IonQ QPU
- Job ID shown in screenshot: `01a12bee-82f3-79ab-b1ec-93ac5c6638d3a0b3da92bf58509c`
- Timestamp shown by the on-screen receipt: `2026-10-11T17:07:05.277Z`
- Source gates: `H0 CX01 S0`
- Submitted claim: `SEPARABLE`
- Prespecified witness: `ZZ + XY` (`xyplus`)
- Shots: 128 **per measurement setting**
- Qubits: 4 (independently prepared setting registers)
- Reported single quantum job
- Raw counts, as reported:
  - `1100`: 32
  - `1110`: 1
  - `1111`: 26
  - `0000`: 33
  - `0010`: 1
  - `0011`: 35
- Sum: 128
- ZZ: 0.96875
- XY: 1.00000
- S: 1.96875
- Declared one-sided margin for alpha=0.01: 0.3793567823462866
- Lower confidence bound: 1.5893932176537133 (> 1)
- Reported accepted decision: `REFUTE_SPECIFIC_CLAIM` — separability is contradicted under stated measurement and confidence assumptions.

## Independent audit

The second supplied screenshot shows the receipt pasted into the public ClaimBreak Evidence Reviewer at https://faadil1.github.io/ClaimBreak/ . It displays **`PASS — 0 numerical/integrity error(s)`**. Work's summary reports the rechecked witness `S=1.969`, `lower=1.589`, and `1 receipt · 1 pass`.

The reviewer checks internal consistency of the submitted JSON and associated declaration/history fields. Because the record is user-controlled, PASS **does not** independently authenticate IonQ or prove the real backend ran. The Qollab screenshot supplies separate corroborating context: the selected `IonQ Forte 1 simulator (29q)`, the printed backend label and job ID, and the project receipt. There is no evidence of a physical QPU, quantum advantage, cryptographic attestation, or independent user adoption.

## Comparison to prior independent BasicSimulator observations

The same source `H0 CX01 S0` was earlier investigated on BasicSimulator in **two distinct jobs**, both preserved as complete exports:
- Phase-sensitive `ZZ + XY`: S=2.000, lower=1.621, separability refuted; [full user-exported evidence](../evidence/observed/qollab-basic-simulator-phase-xy-stage44-2026-10-11.json).
- Mismatched `ZZ + XX`: S=1.172, lower=0.793, non-certification and justified abstention; [full user-exported evidence](../evidence/observed/qollab-basic-simulator-phase-xx-stage44-2026-10-11.json).

All three are separate statistical trials. Neither test-set reuse nor cross-run 99% familywise confidence is claimed.

## Submission truth

The project card's public v1.2 access and browser run have been observed separately. Publication is **not** evidence that the Qollab × IonQ hackathon team captain completed final submission. The organizer's email requires an MIT-licensed Qollab project, usable free simulators including IonQ, a 2–3-minute demo watchable without signing in, and **a separate final action on the team page**, by 2026-10-11 19:00 ET.
