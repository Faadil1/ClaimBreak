# Evidence provenance

ClaimBreak deliberately separates what **the product observed**, what **the user exported**, and what **the reviewer can independently verify**.

| Evidence class | Definition | Does not establish |
|---|---|---|
| `USER_EXPORTED_OBSERVED` | Bitstring receipt copied from a Qollab experiment into `evidence/observed/` | Cryptographic authenticity or hardware calibration |
| `QOLLAB_SIMULATOR_SCREENSHOT_AND_REPORT` | Screenshot and account report of a selected Qollab simulator, including its visible job ID | That a physical QPU was used; an IonQ API signature |
| `SYNTHETIC_FIXTURE_NOT_LIVE` | Manufactured data in `evidence/fixtures/` for deterministic tests | Real Qiskit job execution or empirical reliability |
| `ANALYTICAL_REFERENCE` | A calculated ideal-model probability or confidence formula | Newly observed backend results |
| `INDEPENDENT_REVIEWER_PASS` | Independent arithmetic and consistency checks on the supplied JSON | Source provenance, external honesty, or device attestation |

## Observed project experiments

- [BasicSimulator phase-sensitive XY witness](../evidence/observed/qollab-basic-simulator-phase-xy-stage44-2026-10-11.json) — Stage 4.4 source `H0 CX01 S0`, 128 shots per setting, witness-certified refutation with correction history.
- [BasicSimulator mismatched XX witness](../evidence/observed/qollab-basic-simulator-phase-xx-stage44-2026-10-11.json) — same source, separate run, scientifically justified abstention.
- [IonQ Forte 1 simulator observation](STAGE44_IONQ_SIMULATOR_OBSERVATION_2026-10-11.md) — selected remote noise-model simulator and independent reviewer PASS shown via supplied screenshots; **full original Stage 4.4 IonQ JSON is not yet committed**.
- [Earlier Stage 4.3 custom source](../evidence/observed/qollab-basic-simulator-custom-case-d-2026-10-11.json) and [earlier Stage 4.1 IonQ simulator case B](../evidence/observed/ionq-simulator-case-b-2026-10-10.json) are historical version-specific observations, not new Stage 4.4 jobs.

The reviewer recalculates raw bitstrings, prespecified statistics and verdict logic, but user-controlled records can be internally consistent even if fabricated. Do not pool separate shots/runs into a single claimed familywise confidence guarantee. Do not claim physical quantum hardware or cryptographic attestation on the basis of these receipts alone.
