# Security and privacy

This project runs quantum experiments through the Qollab-provided backend object; no API keys or credentials belong in this repository. The offline reviewer executes in the browser without network access requests and without persistent local/session storage. Exported receipts may contain backend job identifiers and timestamps; only publish them with awareness of their contents.

The JSON review is an **integrity consistency check**, not cryptographic signing or remote attestation. A forged but internally consistent record can pass; a PASS should never be used as proof of physical hardware use or scientific device certification. Report security issues by opening an issue on the repository once public; do not post passwords, tokens or private data in issue text.