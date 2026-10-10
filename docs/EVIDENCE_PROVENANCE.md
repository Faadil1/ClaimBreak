# Evidence provenance and truth boundary

ClaimBreak separates observations, claims and analytical references.

| Class | Meaning | What it does not prove |
|---|---|---|
| LIVE_QISKIT_BACKEND_RESULT | Counts returned by the selected Qollab backend in an actual product Run | That the JSON is cryptographically signed, that physical hardware was used, or that Qollab independently authenticated the device |
| USER_EXPORTED_OBSERVED | JSON copied by the author from a run and placed in this repository | Immutable provenance; the author could have edited the file |
| SYNTHETIC_FIXTURE_NOT_LIVE | Deliberately invented input for deterministic unit tests and visitor exploration | Hardware or remote-simulator observations |
| ANALYTICAL_IDEAL_SEPARABLE_MODEL_NOT_NEW_QUANTUM_EVIDENCE | A mathematically calculated probability, not a sampled job | Observed failure rates or reliability on IonQ hardware |
| UNVERIFIED_IN_APP | Backend device class not independently corroborated by the app | Hardware classification |

The observed IonQ example in evidence/observed was supplied in this conversation for Case B Stage 4.1, from backend named ionq_simulator; it does not demonstrate physical QPU use. The job identifier is copied metadata, **not** a verifiable vendor signature.

The offline reviewer independently recalculates bitstring correlations, statistics, verdict consistency and some event sequence checks. A logically consistent but fabricated JSON may pass: this is an internal-consistency verifier, **not a cryptographic attestor**.

Do not pool separately selected runs into one confidence claim. Results from different backends should be compared as separate investigations, with assumptions and selections recorded.
