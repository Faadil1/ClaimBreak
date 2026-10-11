# ClaimBreak — Quantum Evidence Court

**Don't trust the claim. Design the test.**

## Short description

ClaimBreak is a playable Quantum Evidence Court. Build two-qubit sources with H/Z/S/T/CNOT gates, commit a prediction before running Qiskit, and choose which observables to measure. The same quantum source can be certified by one witness while another leaves the claim unresolved. Export the evidence and audit every conclusion in an independent reviewer.

## Why it matters

**Perfect quantum correlation is not the same as proof.** A classically correlated separable source can look identical to an entangled state under the wrong measurement. Rather than telling the player the answer, ClaimBreak makes experimental design consequential: choose a protocol, lock a forecast, spend actual simulator shots, then defend or revise a verdict using measured results.

## The product

Players author a two-qubit source using an accessible visual circuit composer (H, Z, S, T and CX; up to 12 gates), propose an entanglement, separability or Bell fidelity claim, and optionally share a portable JSON blueprint. The investigator selects Z only, ZZ ± XX, or ZZ ± XY, picks a shot budget and commits a predicted result before the single Qiskit backend job. Counts returned by Qollab drive measured correlations, a conservative one-sided confidence bound, and admissible verdicts.

Unsupported decisions are rejected without inventing new evidence; the player can recover using the same quantum acquisition, while the original error stays in the session history. An independent, browser-based Evidence Reviewer recomputes outcomes, shot counts, confidence bounds, and decision chronology from the exported JSON.

## Signature discovery: The Invisible Phase

For `H0 CX01 S0` — ideally `(|00⟩ + i|11⟩)/√2` — the same claimed-separable source was investigated in **two independent** Qollab BasicSimulator jobs, each using 128 shots per measurement setting:

| Predeclared witness | Measured S | 99% one-sided lower bound | Supported outcome |
|---|---:|---:|---|
| **ZZ + XY** | **2.000** | **1.621** | Separability claim refuted |
| **ZZ + XX** | **1.172** | **0.793** | Insufficient evidence to certify |

The source was identical. **The choice of question changed what the evidence could establish.** Failure to certify never establishes separability.

We separately exercised Stage 4.4 on Qollab's **IonQ Forte 1 simulator (29q)** with `H0 CX01 S0` and `ZZ + XY`: reported S=1.96875, one-sided lower bound=1.58939, and an internal reviewer PASS. This was an **IonQ simulator**, not a physical QPU. [Observed evidence and limitations](STAGE44_IONQ_SIMULATOR_OBSERVATION_2026-10-11.md).

## Explore

**Video demo (2 min 50 s):** https://youtu.be/NPCGNXBqOQw

**Play:** https://qollab.xyz/u/Faadil/claimbreak-quantum-evidence-co

**Independent Evidence Reviewer:** https://faadil1.github.io/ClaimBreak/

**MIT-licensed source and tests:** https://github.com/Faadil1/ClaimBreak

**Judge quick start:** open the public Qollab v1.2 project, choose Open Challenge D, compose `H0 CX01 S0`, claim separability, select `ZZ + XY` with 128 shots, lock a forecast, run the free simulator, interpret the returned bound, file a supported verdict, then paste the exported JSON into the independent reviewer. Each experiment is a separate statistical test.

**Limits:** This is a focused two-qubit educational challenge engine, not general arbitrary QASM, quantum tomography, secure multiplayer, physical device certification, or cryptographic evidence signing. The per-run 1% statistical bound depends on prespecified tests and trusted independent measurements. The reviewer verifies internal record coherence, not backend authenticity. No external-user adoption or physical QPU execution is claimed.

**This effort is supported by Qollab & IonQ.**
