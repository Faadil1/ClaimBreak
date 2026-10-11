# ClaimBreak Stage 4.4 — Public project copy

## Name
ClaimBreak — Quantum Evidence Court

## Tagline
Don't trust the claim. Design the test.

## Short description
Build a two-qubit quantum source with visual H/Z/S/T/CX gates. Choose which observables to measure and commit your prediction before Qiskit runs. One measurement protocol may reveal entanglement while another misses it. Challenge a scientific claim, correct an unsupported verdict, and independently audit the evidence.

## Public description
**What if the same quantum state could prove you wrong — simply because you chose the wrong measurement?**

ClaimBreak is an interactive quantum cross-examination studio. You can create your own two-qubit source, choose from H, Z, S, T and CNOT gates, assert a scientific claim, and share a portable challenge blueprint. The examiner chooses Z-only, ZZ±XX or ZZ±XY, sets a real shot budget, and locks a prediction **before** the Qiskit backend runs.

ClaimBreak executes the newly authored circuit in the Qollab environment. Returned measurement counts determine parity correlations, the predeclared entanglement witness and a one-sided statistical bound. The system may certify entanglement, justify a claim-specific refutation or conclude that the evidence is insufficient. Unsupported verdicts are refused; corrections remain visible in the decision history without another quantum job.

**Signature experiment — The Invisible Phase:** prepare `H0 CX01 S0`, which ideally generates the entangled state `(|00⟩ + i|11⟩)/√2`. The same source was tested on Qollab BasicSimulator with two independently selected protocols (128 shots per measurement basis):

| Protocol | Measured witness | Lower bound | Defensible conclusion |
| --- | ---: | ---: | --- |
| ZZ + XY | 2.000 | 1.621 | Intrication certified; separability claim refuted |
| ZZ + XX | 1.172 | 0.793 | Certification not established; must not infer separability |

This is not a scripted comparison: separate Qiskit jobs generated the counts, and the open-source Evidence Reviewer recomputed both receipts. The viewer can also inspect the experiment's position on the geometric witness plot. The key learning is that **more measurements in an inappropriate basis cannot replace choosing a useful observable**.\n\n**IonQ simulator validation (separate run):** Stage 4.4 was also run in the published Qollab project with the selected **IonQ Forte 1 simulator (29q)** using `H0 CX01 S0`, `ZZ + XY`, and 128 shots per setting. The supplied screenshot and execution report identify `ionq_simulator`, job `01a12bee-82f3-79ab-b1ec-93ac5c6638d3a0b3da92bf58509c`, observed `S=1.96875` and one-sided lower bound `1.58939`. The independent browser reviewer displayed `PASS` with zero internal integrity errors. This is **IonQ simulator evidence, not physical QPU evidence**, and the original complete JSON has not yet been committed. [Evidence and truth boundaries](STAGE44_IONQ_SIMULATOR_OBSERVATION_2026-10-11.md).

Review evidence at **https://faadil1.github.io/ClaimBreak/** and inspect the MIT-licensed source and tests at **https://github.com/Faadil1/ClaimBreak**.

**Scientific limits:** ClaimBreak currently works with a restricted two-qubit source grammar and manually shared JSON files. The confidence bound is per prespecified experiment under trusted measurement and independent-sampling assumptions. Non-certification does not prove separability. Reviewer PASS checks internal numeric consistency, **not** cryptographic backend authenticity. The Stage 4.4 experiments above were observed via user-exported Qollab BasicSimulator receipts, not physical IonQ QPU runs. No external-user adoption claim is made.

**This effort is supported by Qollab & IonQ.**

## Judge quick start
1. Open the published ClaimBreak project on Qollab and choose **Open-source challenge (D)**.
2. Build `H0 CX01 S0`, select the claim **Source is separable**, the **ZZ + XY** protocol and **128 shots per basis**.
3. Predict **Evidence insufficient**, lock the prediction, and run the experiment on **Built-in Simulator (24q)**. A result is not automatically scripted or guaranteed; inspect the actual witness lower bound.
4. If the lower bound exceeds 1, submit **Refute submitted claim**. Export the complete JSON record.
5. Import the JSON at the independent reviewer URL. For the contrasting lesson, make a **new**, separately interpreted experiment with the same source and **ZZ + XX**. Do not pool two runs into one 1% error guarantee.

## Operational submission checklist — DO NOT COPY INTO THE PUBLIC DESCRIPTION
- Confirm that Qollab's currently published version includes Stage 4.4, not just the edited draft.
- Confirm GitHub Pages visibly loads the latest reviewer and independently accepts both observed Stage 4.4 receipts.
- Record and upload an accessible 2–3-minute demonstration video.
- Submit the project via the Qollab hackathon team page; **Publish alone is not Submit**.
- The previously advertised event cutoff is **2026-10-11, 19:00 ET**. Verify it on the event's actual logged-in submission page.
