# ClaimBreak — Qollab submission copy and judge entrypoint

> **Draft for the official Qollab project card; not proof of publication or submission.**
> Suggested theme: **Quantum Unlocked** (interactive explanation of what quantum evidence can and cannot prove). Use the official event UI to select the applicable category. This source may be reused in the project card, not substituted for its submission controls.

## Name

ClaimBreak — Quantum Evidence Court

## Tagline

Don't trust the claim. Design the test.

## Short description

A quantum cross-examination game where you create or receive two-qubit quantum source challenges, commit a prediction before running Qiskit, and let measured evidence overturn your certainty. Choose H/Z/CX gates or investigate guided sources, select bases and shots, repair unsupported verdicts, and independently audit the exported receipt.

## Full description (English — Stage 4.3 custom-source Case D BasicSimulator observed)

**What if the quantum computer could cross-examine the scientist — not just the claim?**

Two sources can agree perfectly in the Z basis, even when only one is entangled. Most quantum visualizations show you the answers. **ClaimBreak makes you risk being wrong before the answers exist.**

You enter the Evidence Court as the examiner. A claimant asserts that a hidden quantum source is entangled, separable, or at least 90% faithful to Bell Φ+. You must choose the actual experimental basis (Z-only, ZZ+XX or ZZ−XX), commit a genuine simulator shot budget, and **lock your predicted verdict before a single quantum job starts**.

Qiskit then builds and runs the selected circuit on the Qollab backend. Real bitstring counts — not a scripted verdict — produce the parity correlations, entanglement witness and one-sided confidence bounds. You may discover that your own forecast was unsupported. That mistake cannot be erased. You can challenge the evidence, submit a justified conclusion or abstain; unsupported verdicts are explicitly refused and a correction is possible **without buying another quantum experiment**.

Three controlled cases provide accessible entry points, while the Open Challenge Exchange lets a creator define a new two-qubit H/Z/CX gate sequence (up to 12 steps), attach an independently testable entanglement/separability/Φ+ fidelity claim and share its portable JSON for another examiner to test. This is manual JSON transfer, not cloud multiplayer or a signed challenge marketplace.

The three guided cases create three lessons:
- **The entangled witness:** Bell Φ+ becomes certifiable when two appropriate observables are measured.
- **The perfect-correlation trap:** a separable GHZ-purified imitation can match the Bell source in ZZ, but measuring XX may refute an exaggerated Φ+ fidelity claim.
- **The wrong-witness trap:** Bell Φ− demands the ZZ−XX witness; choosing a different basis combination can miss a genuine quantum property.

Even 512 shots in the wrong measurement basis cannot buy the missing information. The player experiences the difference between **more data** and **the right quantum experiment**.

The second half of the product is an independent, offline **Evidence Reviewer**. Import your receipt, and it recalculates the witness and confidence bounds from measured bitstrings. For Stage 4.3 receipts, it also checks that the custom blueprint and forecast were declared before reported backend results, that decisions are consistent with measured counts, and that declared resources and correction history match the receipt. A fabricated but internally consistent receipt is not cryptographically authenticated.

**What makes the challenge unusual:** the quantum computer changes what the player is allowed to believe. The player must make an irreversible forecast, the data can overturn that forecast, and the resulting experience is independently reviewable. This is an interactive lesson in scientific falsifiability and experimental design — **not** a predetermined game result, a trivial quantum random-number generator, or a chart-only dashboard.

**Evidence boundaries:** Stage 4.3 has one observed, author-exported BasicSimulator custom-source run (`H1 CX10 Z1`, case D, ZZ−XX, 128 shots per setting) and an independent browser review with internal PASS; [receipt in repository](../evidence/observed/qollab-basic-simulator-custom-case-d-2026-10-11.json). Earlier Stage 4.1 Qiskit and remote IonQ Simulator Case B results are separate version-specific observations (`F_upper≈0.829` for B). No Stage 4.3 remote IonQ or physical QPU result, cryptographic backend authentication, second-human adoption, or broad repeated-run reliability is claimed.

**Open-source repository (MIT):** https://github.com/Faadil1/ClaimBreak

**Acknowledgment:** This effort is supported by Qollab & IonQ.

## Judge quick-start — observed Stage 4.3 Open Challenge Exchange

1. Open the publicly published Qollab project once the author completes the publish step. Select **Case D / Open-source challenge**, gates `H1 CX10 Z1`, claim `SEPARABLE`, **ZZ−XX**, 128 shots per basis and predict `NOT_ESTABLISHED`. A separate creator may alternatively export the blueprint JSON for the examiner to import.
2. Click **Lock forecast & collect real quantum evidence** once on BasicSimulator. Evaluate the actually returned ZZ/XX and witness lower bound; the observed sample gave `ZZ=1`, `XX=-1`, `S_lower≈1.621`, but future samples must be judged independently.
3. File **Refute submitted claim** if the actual minus-witness bound exceeds 1; otherwise abstain. The initial incorrect forecast remains visible and a reviewer can audit that it preceded acquisition. A rejected *decision* can be retried using the same quantum job, but a rejected decision was not part of the first observed Case D receipt.
4. Export the JSON; open https://faadil1.github.io/ClaimBreak/ . The reviewer independently recalculates witness, source-lock and forecast order, shot counts and decision history. Internal PASS is not backend attestation.
5. For guided investigation, run A/B/C or Z-only; four guided Stage 4.2 campaign tiles are separate from custom-source Stage 4.3 receipts and need not advance for a custom challenge.

## 60-second voiceover / signature story

> Before this quantum computer runs, I must say what I think the experiment will prove. I choose a measurement basis, spend real simulator shots, and lock a verdict. Here is the trap: two different quantum sources can look identical in Z. I predict entanglement — but the second measurement basis can overturn me. ClaimBreak refuses my unsupported verdict, yet lets me correct my scientific conclusion without running another quantum circuit. The mistake is not erased. When I hand the receipt to an independent reviewer, it recomputes the quantum statistics and verifies that my forecast came **before** the measurement. This is how quantum computing becomes more than a visualization: it teaches the difference between confidence, evidence and what we are actually allowed to claim.

## Non-negotiable publication / submission reality

- **Qollab:** verify the current published project page as a signed-out judge, including runnable Qiskit code and Run workflow. The existing author-editor link does not prove public access.
- **Source and license:** keep the linked GitHub repository public and MIT; copy Stage 4.3 into the Qollab editor and verify the published project runs; one BasicSimulator custom-source session has already been observed. Otherwise, submit the verified Stage 4.1 baseline rather than a broken upgrade.
- **Video:** record and share an actually accessible 2–3-minute video. The 60-second voiceover above is only a script segment, not a finished video.
- **Reviewer:** the root `index.html` already works locally for receipt review. GitHub Pages https://faadil1.github.io/ClaimBreak/ was publicly viewed in Edge and the custom-source 4.3 receipt passed its independent audit.
- **Completion:** publishing or autosaving a Qollab project does **not** prove the hackathon's **separate final team submission**. Complete that action in the organizer UI and preserve the confirmation receipt/screenshot.
- **Deadline:** the published event schedule lists **October 11, 2026 at 7:00 PM Eastern Time**. Verify in the actual logged-in Qollab event page and submit ahead of the cutoff. This text is not a submission receipt.

Grounded technical limitations: `README.md`, `docs/SCIENTIFIC_METHOD.md`, `docs/VALIDATION_MATRIX.md`, `docs/EVIDENCE_PROVENANCE.md`, `docs/PRODUCT_DEPTH.md`.
