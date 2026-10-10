# GitHub deployment and Qollab publishing

## Repo
Repository: https://github.com/Faadil1/ClaimBreak (public). Live quantum source is qollab/main.js. Standalone reviewer is root index.html and reviewer/index.html.

## Optional GitHub Pages reviewer
Open the repository's **Settings -> Pages -> Build and deployment**, choose **Deploy from a branch**, choose **main / (root)** and Save. Wait for the deployment status and open the published URL shown by GitHub.

Expected conventional URL: https://faadil1.github.io/ClaimBreak/ — **not verified as live until GitHub reports deployment and a browser visit succeeds**. GitHub Pages runs the review desk only, without quantum jobs.

## Qollab live product
Qollab must use qollab/index.html, qollab/main.css, qollab/main.js in the JS/Qiskit editor. The runtime supplies a backend. This code is **not** a Node command-line app or a standalone quantum web service.

Use Qiskit BasicSimulator for low-cost validation. If testing remotely, select **IonQ Forte 1 Simulator**, not the IonQ Forte 1 physical QPU; confirm selection visually. One backend.run and one result fetch occur after the user's Collect quantum evidence click.

## Publishing is not submitting
Check the Qollab project is public to a visitor, include this repo and the public video in its project card, and separately submit from the team's final hackathon submission screen. Preserve screenshots/receipts of confirmation. Deadline should be reconfirmed from the official event UI.
