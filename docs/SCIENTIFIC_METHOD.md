# Scientific method

ClaimBreak teaches **experimental design under uncertainty**, not device-independent quantum certification. Its interactive source builder compiles at most 12 instructions from H, Z, S, T and CNOT on two qubits. The curated cases cover Bell Φ+, Bell Φ− and a GHZ-purified separable imitation.

## The witness tests

For product states, the relevant local Pauli expectations satisfy a Bloch-sphere bound. For all separable two-qubit states (by convexity):

- `⟨ZZ⟩ + ⟨XX⟩ ≤ 1` and `⟨ZZ⟩ − ⟨XX⟩ ≤ 1`
- `⟨ZZ⟩ + ⟨XY⟩ ≤ 1` and `⟨ZZ⟩ − ⟨XY⟩ ≤ 1`

A witness value **above 1** supports entanglement under trusted measurement assumptions. Failure to exceed the threshold **does not prove separability**.

In an **XY measurement**, Qollab applies H to the first source qubit to read X and S† then H to the second source qubit to read Y, before Z-basis measurement. The register counts are converted to parity correlations.

## Finite-shot decision rule

Each experiment creates one circuit containing an independently prepared register for each chosen basis. With N backend shots, the Z register and the second setting each yield **N parity observations**. The protocol and shot budget are locked *before* the job.

For a predeclared two-setting witness `S = ZZ ± XX` or `S = ZZ ± XY`, and independent representative ±1 observations under trusted axes,

```text
Pr(S_observed - S_true >= t) <= exp(-N*t²/4)
alpha = 0.01
margin = 2 * sqrt(ln(1/alpha)/N)
lower_bound = S_observed - margin
certify only if lower_bound > 1
```

At N=128, margin ≈ 0.37935678. A 99% one-sided **per-test** confidence statement is conditional on these assumptions. It is **not** an error guarantee for arbitrarily selected or pooled runs, drift/crosstalk, unverified device calibration or post-hoc changing of the witness.

## Fidelity claims

For the Bell Φ+ projector,

```text
P(Phi+) = (I + XX - YY + ZZ)/4
F(Phi+) <= (2 + ZZ + XX)/4
```

For a **predeclared plus protocol**, an upper confidence bound is

```text
F_upper = min(1, (2 + S_observed + margin)/4)
```

If this upper bound falls below a supplier's declared minimum fidelity, that **specific threshold claim** may be refuted. This is not a proof of fraud, separability or source provenance. **XY witness results must never be passed off as XX fidelity measurements.**

## Signature phase example

The source `H0 CX01 S0` ideally creates `(|00⟩ + i|11⟩)/√2`. Its ideal `ZZ=1`, `XY=1` and `XX=0`. Therefore a correctly selected ZZ+XY witness can certify entanglement, while ZZ+XX may remain inconclusive despite being tested on **the same source**. The observed distinct BasicSimulator runs and the IonQ simulator report are linked from [README](../README.md).

## Evidence and provenance limits

Qollab returns shot counts from the user-selected backend. An ideal or noise-model simulator is not a physical IonQ QPU. The evidence reviewer recalculates the numbers in a user-controlled JSON receipt and checks its internal event/decision consistency. **Reviewer PASS is not an authenticated vendor signature**. The observed and synthetic receipts are labeled separately in [Evidence provenance](EVIDENCE_PROVENANCE.md).
