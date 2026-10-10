# Scientific method and limitations

The protocols measure two-qubit correlations in independently prepared registers, each with N samples. A dual-basis experiment uses **one circuit, N circuit shots, and N marginal observations for each base**; it is not two backend jobs.

## Preparation
- A: Bell Phi+ = (|00>+|11>)/sqrt(2), with ideal ZZ=+1 and XX=+1.
- B: the separable reduced state rho = 0.5|00><00| + 0.5|11><11|. A GHZ purification is built and the environment is **not postselected**. Ideal ZZ=+1 and XX=0.
- C: Bell Phi- = (|00>-|11>)/sqrt(2), with ideal ZZ=+1 and XX=-1.

**ZZ alone cannot distinguish A from B.** For any separable two-qubit state, ZZ+XX <=1 and ZZ-XX <=1, using the Bloch-sphere bound for product states and convexity for separable mixtures. A witness violation supports entanglement; failure to violate does **not** demonstrate separability.

## One-sided finite-shot bound
Assuming representative independent +/-1 parity observations for Z and X, predeclared analysis, trusted measurement axes and no arbitrary postselection, a conservative Hoeffding inequality is

P(S_observed-S_true >= t) <= exp(-N t^2/4).

Set alpha=0.01 and margin=2 sqrt(ln(1/alpha)/N). With S=ZZ+XX or ZZ-XX, certify only when S_observed-margin >1. The same formula also supplies a one-sided upper bound for S when needed, with the corresponding tail.

## Exact claim-specific refutation
The Phi+ projector is (I+XX-YY+ZZ)/4. Because -<YY> <=1, fidelity to Phi+ obeys F <=(2+ZZ+XX)/4. For predeclared **plus** measurements, ClaimBreak computes F_upper=min(1,(2+S_observed+margin)/4). The stated source B claim F>=0.90 is contradicted when F_upper<0.90. This neither certifies separability nor establishes deliberate fraud.

## Scope
The 1% bound is for a **single predeclared test**, not a familywise claim after adaptive search across many runs. Ideal simulator tests don't establish device-independent measurements, physical-QPU noise resilience, or provenance authentication. Drift, crosstalk, SPAM errors, correlation across shots, and selectively reported outcomes can invalidate stronger conclusions. Theoretical false-positive probabilities in the app are analytical comparisons, not new backend evidence.
