# ClaimBreak Open Challenge Exchange — Stage 4.3 observed custom-source capability

**Status: MERGED TO MAIN; ONE CUSTOM-SOURCE QOLLAB BASIC_SIMULATOR RUN OBSERVED; REVIEWER PASS; PUBLIC QOLLAB PROJECT AND OFFICIAL SUBMISSION NOT CONFIRMED.**
This is a material expansion of product capability, not simply a new proof artifact. [Observed author-exported receipt](../evidence/observed/qollab-basic-simulator-custom-case-d-2026-10-11.json): `H1 CX10 Z1`, separability claim, ZZ−XX, 128 shots per setting, `REFUTE_SPECIFIC_CLAIM` supported, `FORECAST_OVERTURNED`. It passed the independent verifier. The receipt remains user-controlled and does not authenticate the simulator cryptographically. Stage 4.1 IonQ simulator evidence is a separate earlier version.

## Why the old scope was shallow

A/B/C are controlled exercises. A precommitted prediction, four missions and a receipt reviewer added engagement and guardrails but did not allow users to ask a *new* scientific question. ClaimBreak could look deep on a checklist while never leaving the authored happy path. The product therefore did not yet match the ambition of an open investigation laboratory.

## The bet: creator → opponent examiner → quantum backend → independent reviewer

A **creator** defines a new source by compiling an explicit gate sequence on two qubits (H0/H1, Z0/Z1 and CX01/CX10, up to 12 steps) and asserts either entanglement, separability or a Bell Φ+ fidelity at or above 60–95%. The creator exports a portable challenge JSON, which can be passed to another person. The **examiner** imports the blueprint, independently selects Z-only/ZZ+XX/ZZ−XX and a shot budget, commits an expected result, and runs the *actual newly authored circuit* against the selected Qollab Qiskit backend. Measured bitstrings determine whether the claim can be refuted, an entanglement witness certified or the examiner must abstain. Verdicts can be corrected without an extra job and the reviewer recomputes all reported numbers and source-lock consistency.

### Consequence-bearing source choice

With `H0 CX01`, the source is Bell Φ+ and a plus witness can support entanglement; append `Z0` and the Bell phase changes, so the **minus** witness becomes decisive instead. Starting with `H0 CX01` plus a claim of separability creates a refutable assertion, whereas choosing Z-only cannot establish entanglement regardless of the number of shots. Altering a creator gate **changes the Qiskit circuit**; the player is no longer restricted to the fixed dossiers. These are physical state constructions, not invented UI points or fake resource penalties.

### Important boundaries

- **No general code execution or QASM:** only a small whitelisted gate compiler. This is an open-ended combinatorial source builder *within that grammar*, not support for arbitrary quantum hardware gates.
- **No secure hidden source:** creator/exported JSON fully reveals the gate sequence; anyone can inspect it. Do not claim a cryptographically blind adversarial duel or anonymous multi-user service.
- **No signed attestation:** a reviewer checks arithmetic, declared plan, event order and internal consistency. User-controlled files can still be fabricated. Vendor authenticity is unknown.
- **Limited live Stage 4.3 evidence:** one user-exported Qollab BasicSimulator custom-source Case D run is observed and independently audited. CI also includes synthetic fixtures; those fixtures are not extra quantum jobs. No physical QPU or Stage 4.3 remote IonQ simulator claim.
- **No persistence/adoption:** users exchange JSON manually; no account storage, multiplayer synchronization, marketplace, payment or network certification.
- **Scientific scope:** one predeclared witness/fidelity test per backend run under trusted axes and independent samples; no guarantee for adaptively searched claims across multiple jobs.

## One real product test — not an artificial demo

1. Creator enters `H0 CX01 Z0`, claims `SEPARABLE`, exports a challenge blueprint.
2. A separate examiner imports that JSON, chooses **minus** witness and 128 shots, and submits one actual Qollab simulator job. Check the **actual** returned `ZZ`, `XX`, statistical lower bound, source lock and accepted/rejected conclusion. Do not force a predetermined result.
3. The examiner exports the Stage 4.3 JSON. Independently import it into the updated standalone reviewer. Check the mathematics, claim support, event order, gate blueprint consistency and any rejected-then-corrected judgment.
4. Run a contrasting experiment with **plus** witness, showing how an apparently similar source may not be established by the wrong protocol. Separate experiments are separate evidence; never pool their per-run error guarantees as one claim.
5. **Current reality:** a first creator-operated Qollab custom-source session and reviewer check succeeded; a separate human creator/examiner handoff remains unobserved. Submit the version actually tested in the event UI before the deadline; do not claim external adoption.

## What would prove meaningful additional product depth?

An external person (not the builder) creates or imports a **previously unknown valid challenge**, chooses an experiment without following a fixed demo script, obtains a real backend result, reaches a legitimate supported/refused/unknown outcome, and can take the record to an independent reviewer. That is the first substantive user-value delta beyond Stage 4.2. A green CI or additional seeded screenshots alone would not prove it.

The Qollab × IonQ competition deadline is described as Oct 11 2026 19:00 ET. Publishing the Qollab project and submitting from the team page are separate user actions; neither is confirmed merely by merging this code.
