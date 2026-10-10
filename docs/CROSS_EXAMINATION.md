# ClaimBreak Stage 4.2 — Quantum Cross-Examination

> **Not yet verified on Qollab:** the code and independent verification are a candidate until an actual Stage 4.2 Qiskit backend session is observed.

## The product experience — from evidence desk to a consequence-bearing scientific game

The player is a quantum examiner, not a spectator reading a precomputed proof. A claimant makes a specific assertion about a hidden laboratory source. The player must commit to a forecast of what the evidence can *legitimately* support and choose a basis protocol and shot count **before seeing experimental data**. Quantum results then make or break the player's own prediction. A reviewer can independently check that the forecast really preceded the measurement and that the outcome follows from the observed counts.

This is not a competitive multiplayer leaderboard, open-ended user-uploaded quantum source engine or fraud detector. Three controlled source preparations make the misconception experimentally testable. Novelty is in combining **scientific falsifiability, live experimental choice, costly basis/shot commitment, a recoverable yet immutable mistake, and independent verification of the player's own precommitment** in one game loop.

## Gameplay, observable state and consequences

| Action | Actual consequence | Evidence boundary |
|---|---|---|
| Choose A/B/C | Changes the source preparation (Bell +, separable purified source, Bell −) in the Qiskit circuit | The source is concealed by the UI, not secret to someone reading open-source code |
| Choose Z-only, ZZ+XX, ZZ−XX | Changes the measured observables / circuit and the permissible scientific conclusion | Z-only cannot resolve entanglement regardless of extra shots |
| Choose 64/128/256/512 shots | Changes the actual backend sample count and calibrated Hoeffding margin | No fictitious currencies or conversion to dollar cost |
| **Precommit a forecast** | Adds `CHALLENGE_FORECAST_LOCKED` before `EXPERIMENT_PREDECLARED` and live acquisition | Cannot be revised within a Run |
| Execute once | Submits exactly one selected Qiskit circuit via `backend.run`; no outcome is known beforehand | Qollab simulator is not a physical QPU claim |
| See the measurement | Forecast status recomputed from measured parity and statistical bounds | One-run predeclared alpha=0.01 assumptions |
| File verdict, possibly repair | Unsupported attempts recorded; the player may revise without an extra backend job | Accepted verdict final; original incorrect forecast still visible |
| Export and review | Independent verifier recomputes counts, bounds, outcome, lock order, and resource use | Cannot authenticate a well-forged JSON document or IonQ hardware origin |

## Three judge experiences

**Experience 1 — strongest first five seconds:**
- Case B: choose `ZZ + XX`, 128 shots, and forecast `CERTIFIED_ENTANGLEMENT` (the naive but wrong conclusion if ZZ looked perfect).
- Real simulator run; the forecast can be overturned by measured XX and bounds.
- The player tries to certify, is rejected, then correctly refutes the specific ≥0.90 fidelity promise if the actual upper bound warrants it.
- Export JSON; reviewer independently proves the original forecast was not retroactively edited.
- **Do not script the actual bound as guaranteed**; if the selected backend result does not refute the 90% assertion, abstain and explain.

**Experience 2 — protocol matters more than brute-force shots:**
- Case A or B, Z-only with higher N. Forecast `NOT_ESTABLISHED`. Even perfect ZZ correlation cannot certify entanglement or refute the 90% fidelity claim.
- The product gives a scientifically correct but nondecisive result; this is a genuine resource-strategy tradeoff, not an app error.

**Experience 3 — change the witness, change what you can prove:**
- Case C with ZZ−XX rather than ZZ+XX. Demonstrate that the choice of observable, not just the amount of data, controls whether Bell Φ− entanglement can be established.
- Use an actual measured session, or label an old captured result as replay. Do not claim two different cases were sampled in one Run.

## Distinctive thesis for judges

**“What if a quantum computer could challenge not only a scientific claim, but the scientist's own premature certainty?”** Most visualizations show you quantum results. ClaimBreak asks you to commit to a conclusion before measurement, then makes real quantum data decide whether you were right. Wrong scientific judgments have visible, recoverable consequences, and an independent operator can inspect the proof trail. The hardest concept — *why matching outcomes in one measurement basis do not prove entanglement* — becomes a decision you personally risk getting wrong.

## Four-trial campaign — player and independent-reviewer depth

The offline reviewer now organizes **four separate Stage 4.2 receipts** into a session-only learning journey. The `campaignProgress` function is evaluated from independently consistency-checked receipts; an old Stage 4.1 document, a failed audit or a repeated job identifier cannot advance a mission.

1. **The Bell Witness:** a correctly supported A / plus entanglement certification.
2. **The Correlation Trap:** a B / plus refutation of the ≥90% fidelity promise.
3. **The Hidden Phase:** a C / minus witness refutation of separability.
4. **The Right to Abstain:** a Z-only protocol accepted as nondecisive.

Completing these reflects coverage of four learning objectives, **not** statistically pooled evidence or authenticated proof that different simulator jobs actually ran. The reviewer remains offline and session-only, no backend requests or permanent leaderboard. Its claim boundary stays **SESSION_RECEIPT_CONSISTENCY_ONLY**, not verified adoption, QPU use, or campaign competition win.

## Competitive and execution boundaries

The October 2026 Qollab × IonQ track explicitly values creativity/novelty **alongside technical execution** and offers a `Quantum Unlocked` theme for interactive explanations. This interpretation is based on published organizer descriptions, not a verified score from current rival submissions. Previous Qollab projects include immersive creative works such as Quantum Garden; ClaimBreak should compete on an **evidence-driven, adversarial learning interaction** rather than pretending to be an equally expansive generative world. A winning rank cannot be promised or self-certified.

## Truth / Quality checkpoints

**Verified from code and synthetic tests when the PR CI is green:** pure forecast/decision rules, negative recovery logic, independence of reviewer recalculation, tamper rejection, syntax and buildability of shipped single-file runtime.

**Not yet verified:** Qollab Stage 4.2 click flow, availability/queue behavior on selected IonQ simulator, keyboard/small screen in Qollab embed, a fresh Stage 4.2 receipt, signed-out visitor availability, demo video and final team submission.

**No silent upgrade:** Stage 4.1 BasicSimulator/IonQ receipts remain **Stage 4.1**. The new mode must produce its own observed run before it can be described as live. If the new code introduces runtime problems near deadline, restore the existing observed Stage 4.1 product rather than submit a broken Stage 4.2. Product execution and valid submission precede extra polish.

## Real submission stop rule

Deadline listed as **October 11, 2026 19:00 ET**; verify organizer UI. Do not spend the remaining submission window on polish after a working published Qollab project and completed team submission become threatened. Run a minimal actual Stage 4.2 Case B flow, test reviewer import, confirm public access, record the demo and complete final team submission, preserving receipts. Do not invent success if any step is blocked.
