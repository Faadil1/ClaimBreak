# Validation matrix — accurately bounded

| Behavior | Observation | Evidence status |
|---|---|---|
| A plus entanglement certification | BasicSimulator Stage 3 and Stage 4 positive run, 128 shots/setting | PROVEN for sampled runs |
| B plus false certification rejected | BasicSimulator Stage 3 and Stage 4 receipts | PROVEN for sampled runs |
| B plus F(Phi+) >= .90 refuted | BasicSimulator Stage 3; Stage 4.1 accepted after recovery | PROVEN for sampled runs |
| C minus disproves separability | BasicSimulator Stage 3, ZZ=1, XX=-1 | PROVEN for sampled runs |
| A Z-only abstention | BasicSimulator Stage 3, 64 shots | PROVEN for sampled run |
| Unsupported decision -> retry -> accepted | Stage 4.1 BasicSimulator, 3 verdict attempts, one job | PROVEN for sampled run |
| B plus IonQ remote simulator | Stage 4.1 ionq_simulator, 128 shots, F_upper=.829214, one job | PROVEN for sampled run |
| 15 verifier regression cases | GitHub Actions workflow and Node tests | PROVEN when latest CI green |
| Multi-run statistical reliability | Not established by the above point tests | ACTIVE |
| Physical IonQ QPU execution of Stage 4.1 | Not claimed | UNKNOWN / NOT TESTED |
| Public Qollab judge access / GitHub Pages | Must be tested independently | BLOCKED |
| Official hackathon submission | Separate action required | BLOCKED |

Evidence integrity note: observed sample files are *user-supplied exports*, not IonQ cryptographic signatures. Reviewer PASS indicates internal numerical consistency, not external attestation.
