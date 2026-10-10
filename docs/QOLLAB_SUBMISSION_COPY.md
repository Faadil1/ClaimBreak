# ClaimBreak — Qollab submission copy and judge entrypoint

> **Draft for the official Qollab project card; not proof of publication or submission.**
> Suggested theme: **Quantum Unlocked** (interactive explanation of what quantum evidence can and cannot prove). Use the official event UI to select the applicable category. This source may be reused in the project card, not substituted for its submission controls.

## Name

ClaimBreak — Quantum Evidence Court

## Tagline

Don't trust the claim. Design the test.

## Short description

A quantum cross-examination game where your scientific prediction is locked *before* the simulator runs — and actual quantum measurements can prove you wrong. Choose the measurement basis and shots, correct unsupported verdicts, and let an independent reviewer audit the entire challenge.

## Full description (English — use after Stage 4.2 is live-tested in Qollab)

**What if the quantum computer could cross-examine the scientist — not just the claim?**

Two sources can agree perfectly in the Z basis, even when only one is entangled. Most quantum visualizations show you the answers. **ClaimBreak makes you risk being wrong before the answers exist.**

You enter the Evidence Court as the examiner. A claimant asserts that a hidden quantum source is entangled, separable, or at least 90% faithful to Bell Φ+. You must choose the actual experimental basis (Z-only, ZZ+XX or ZZ−XX), commit a genuine simulator shot budget, and **lock your predicted verdict before a single quantum job starts**.

Qiskit then builds and runs the selected circuit on the Qollab backend. Real bitstring counts — not a scripted verdict — produce the parity correlations, entanglement witness and one-sided confidence bounds. You may discover that your own forecast was unsupported. That mistake cannot be erased. You can challenge the evidence, submit a justified conclusion or abstain; unsupported verdicts are explicitly refused and a correction is possible **without buying another quantum experiment**.

Three controlled cases create three profoundly different lessons:
- **The entangled witness:** Bell Φ+ becomes certifiable when two appropriate observables are measured.
- **The perfect-correlation trap:** a separable GHZ-purified imitation can match the Bell source in ZZ, but measuring XX may refute an exaggerated Φ+ fidelity claim.
- **The wrong-witness trap:** Bell Φ− demands the ZZ−XX witness; choosing a different basis combination can miss a genuine quantum property.

Even 512 shots in the wrong measurement basis cannot buy the missing information. The player experiences the difference between **more data** and **the right quantum experiment**.

The second half of the product is an independent, offline **Evidence Reviewer**. Import your receipt, and it recalculates the witness and confidence bounds from measured bitstrings. For Stage 4.2 receipts, it also checks that your forecast preceded the backend results, that the verdict did not get rewritten after the fact, and that the reported quantum resources and corrected decision history are consistent. A fabricated but internally consistent receipt is not cryptographically authenticated.

**What makes the challenge unusual:** the quantum computer changes what the player is allowed to believe. The player must make an irreversible forecast, the data can overturn that forecast, and the resulting experience is independently reviewable. This is an interactive lesson in scientific falsifiability and experimental design — **not** a predetermined game result, a trivial quantum random-number generator, or a chart-only dashboard.

**Evidence boundaries:** Qiskit BasicSimulator end-to-end Stage 4.1 cases and an author-exported IonQ Simulator Stage 4.1 Case B result with confidence fidelity upper bound ≈0.829 are observed samples. Stage 4.2 has offline rule and tamper tests but **must be tested inside Qollab before live/production claims**. No physical IonQ QPU result, backend-authenticating signature, broad repeated-run reliability or external adoption is claimed.

**Open-source repository (MIT):** https://github.com/Faadil1/ClaimBreak

**Acknowledgment:** This effort is supported by Qollab & IonQ.

## Judge quick-start — actual quantum cross-examination (Stage 4.2 candidate)

1. Open a verified public Qollab project after the Stage 4.2 runtime test. Choose **Case B, ZZ+XX, 128 shots** and **predict CERTIFY ENTANGLEMENT**. This is your pre-run wager — deliberately test a plausible but unjustified assumption.
2. Click **Lock forecast & collect real quantum evidence** once. Read the measured ZZ and XX and the confidence upper bound for the exact ≥0.90 Bell-fidelity promise. If the returned counts support refutation, the original certification forecast should be **OVERTURNED**.
3. Attempt the unjustified certification and see **DECISION REJECTED**. Correct the verdict without another quantum job, or abstain if the actual measurement does not resolve the claim. The rejected forecast stays in history.
4. Export the JSON; open the independent reviewer. It recomputes the claim assessment and checks the **precommit event's timestamp, order, shots, forecast, recovery trail and same-job resource accounting**.
5. For a second learning journey, run Z-only against A/B and see that even perfect parity agreement does not prove entanglement. Or challenge Case C with the minus witness.

## 60-second voiceover / signature story

> Before this quantum computer runs, I must say what I think the experiment will prove. I choose a measurement basis, spend real simulator shots, and lock a verdict. Here is the trap: two different quantum sources can look identical in Z. I predict entanglement — but the second measurement basis can overturn me. ClaimBreak refuses my unsupported verdict, yet lets me correct my scientific conclusion without running another quantum circuit. The mistake is not erased. When I hand the receipt to an independent reviewer, it recomputes the quantum statistics and verifies that my forecast came **before** the measurement. This is how quantum computing becomes more than a visualization: it teaches the difference between confidence, evidence and what we are actually allowed to claim.

## Non-negotiable publication / submission reality

- **Qollab:** verify the current published project page as a signed-out judge, including runnable Qiskit code and Run workflow. The existing author-editor link does not prove public access.
- **Source and license:** keep the linked GitHub repository public and MIT; copy Stage 4.2 into the Qollab editor only when the release candidate passes a real Qiskit backend/browser test. Otherwise, submit the verified Stage 4.1 baseline rather than a broken upgrade.
- **Video:** record and share an actually accessible 2–3-minute video. The 60-second voiceover above is only a script segment, not a finished video.
- **Reviewer:** the root `index.html` already works locally for receipt review. Include a GitHub Pages link **only after** enabling Pages and verifying a public browser visit. Do not claim it is live by URL convention.
- **Completion:** publishing or autosaving a Qollab project does **not** prove the hackathon's **separate final team submission**. Complete that action in the organizer UI and preserve the confirmation receipt/screenshot.
- **Deadline:** the published event schedule lists **October 11, 2026 at 7:00 PM Eastern Time**. Verify in the actual logged-in Qollab event page and submit ahead of the cutoff. This text is not a submission receipt.

Grounded technical limitations: `README.md`, `docs/SCIENTIFIC_METHOD.md`, `docs/VALIDATION_MATRIX.md`, `docs/EVIDENCE_PROVENANCE.md`, `docs/PRODUCT_DEPTH.md`.
