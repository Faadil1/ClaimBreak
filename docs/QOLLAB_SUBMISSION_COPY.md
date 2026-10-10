# ClaimBreak — Qollab submission copy and judge entrypoint

> **Draft for the official Qollab project card; not proof of publication or submission.**
> Suggested theme: **Quantum Unlocked** (interactive explanation of what quantum evidence can and cannot prove). Use the official event UI to select the applicable category. This source may be reused in the project card, not substituted for its submission controls.

## Name

ClaimBreak — Quantum Evidence Court

## Tagline

Don't trust the claim. Design the test.

## Short description

An interactive quantum evidence court: choose a measurement protocol before execution, challenge an entanglement claim with real simulator counts and confidence bounds, reject unsupported verdicts, and independently audit the exported evidence.

## Full description (English — ready to paste)

**Perfect correlation is not proof of entanglement.** A Bell pair and a separable source can both show perfect agreement when measured only in the Z basis. ClaimBreak turns this scientific trap into an interactive investigation: you become the examiner and must choose the experimental protocol **before** collecting evidence.

Run Qiskit circuits in Qollab, using its supported simulator backends, to investigate three controlled quantum sources. Each case presents a precise claim. The app returns actual shot counts from the selected backend, computes ZZ and XX correlations and uncertainty bounds, and permits only decisions supported by the declared measurements. You can certify an entangled Bell source, refute a specific overstated fidelity assertion, or **abstain** when the selected protocol does not provide enough evidence.

The most revealing case is **B**, a separable imitation: it can mimic the Bell source in Z measurements, but the added X basis exposes the missing evidence. A claim of Bell-state fidelity of at least 90% can be refuted using the appropriate confidence upper bound. An unsupported certification is refused; the examiner can correct the decision **without rerunning the quantum job**.

The workflow continues beyond a chart: export the evidence JSON, then open the standalone **Evidence Reviewer**, which independently recalculates the statistics from bitstring counts, checks decision consistency, and flags arithmetic or event-history contradictions. Reviewers can inspect multiple receipts and compare different backends without improperly pooling their results.

This is a working **quantum-literacy and scientific-claim-evaluation tool**, not a fraud accusation engine. Its quantum backend matters to the decision: changing experimental data changes the permitted outcome. Controlled sources and simulator runs make the lesson reproducible; the rejected-decision history and independent review desk make the evidence accountable.

**What is verified:** sampled end-to-end Qiskit BasicSimulator runs across positive, negative and abstention cases, plus an author-exported **IonQ Simulator** Case B receipt with a confidence upper bound of approximately **0.829** for the tested `F(Phi+) >= 0.90` assertion. That is simulator evidence, **not** a physical IonQ QPU claim or independently signed backend attestation. Public Qollab access and final submission require separate verification.

**Open-source repository (MIT):** https://github.com/Faadil1/ClaimBreak

**Acknowledgment:** This effort is supported by Qollab & IonQ.

## Judge quick-start — real product first

1. Open the published Qollab project (after its public-access check); choose **Case B**, the **ZZ + XX** (`plus`) protocol, and **128 shots per setting**. Confirm the configuration is selected before acquisition.
2. Click **Collect quantum evidence** once. Inspect the actual backend counts, ZZ/XX measurements, and upper fidelity bound. The specific claim under test is `F(Phi+) >= 0.90`, not whether all possible sources are entangled.
3. Attempt unsupported entanglement certification to see **DECISION REJECTED**, then choose the supported, specific fidelity refutation and observe **DECISION ACCEPTED**, using the same evidence acquisition.
4. Display and copy the exported JSON. Open the independent reviewer via the repository's root `index.html` (or an independently verified public GitHub Pages reviewer URL, if enabled). Import the receipt, recalculate, inspect the verdict trail, and export the reviewer report.
5. Explore the countercases: **A** with ZZ + XX certifies Bell Phi+; **C** with ZZ - XX reveals Bell Phi−; **Z-only** appropriately abstains. These paths have author-reported sampled BasicSimulator evidence; do not imply all configurations or repeated hardware reliability are verified.

## 60-second voiceover / quick judge walkthrough

> Here is the mistake ClaimBreak was built to expose: two sources can produce the same perfect Z-basis correlation, while only one is entangled. First, I lock the experimental basis and shot count. Then Qiskit executes the selected circuit, and the measured bitstrings decide what I can legitimately conclude. In Case B, adding X-basis evidence makes an overstated Bell-fidelity claim refutable. If I try to certify entanglement anyway, the court refuses my verdict but lets me correct it without buying another experiment. Finally, I export the receipt and load it into a separate reviewer, which recomputes the correlations and tests the decision trail. This is not a simulated courtroom around a predetermined verdict: quantum measurement results determine what the product accepts, rejects, or leaves unknown.

## Non-negotiable publication / submission reality

- **Qollab:** verify the current published project page as a signed-out judge, including runnable Qiskit code and Run workflow. The existing author-editor link does not prove public access.
- **Source and license:** keep the linked GitHub repository public and MIT; copy the tested Stage 4.1 files from `qollab/` into the final Qollab editor panes when necessary.
- **Video:** record and share an actually accessible 2–3-minute video. The 60-second voiceover above is only a script segment, not a finished video.
- **Reviewer:** the root `index.html` already works locally for receipt review. Include a GitHub Pages link **only after** enabling Pages and verifying a public browser visit. Do not claim it is live by URL convention.
- **Completion:** publishing or autosaving a Qollab project does **not** prove the hackathon's **separate final team submission**. Complete that action in the organizer UI and preserve the confirmation receipt/screenshot.
- **Deadline:** the published event schedule lists **October 11, 2026 at 7:00 PM Eastern Time**. Verify in the actual logged-in Qollab event page and submit ahead of the cutoff. This text is not a submission receipt.

Grounded technical limitations: `README.md`, `docs/SCIENTIFIC_METHOD.md`, `docs/VALIDATION_MATRIX.md`, `docs/EVIDENCE_PROVENANCE.md`, `docs/PRODUCT_DEPTH.md`.
