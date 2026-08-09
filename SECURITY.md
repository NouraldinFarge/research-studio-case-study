# Security policy

## Scope

This repository distributes documentation, original diagrams, and a fabricated JSON fixture. It does not distribute Research Studio source, application binaries, the private catalog, browser sessions, credentials, or complete local diagnostics.

Security review therefore covers two related boundaries:

- accidental disclosure or misleading claims in this public case study; and
- privately reported concerns about the documented Research Studio design.

## Report privately

Use [GitHub private vulnerability reporting](https://github.com/NouraldinFarge/research-studio-case-study/security/advisories/new). Private vulnerability reporting is enabled for this repository.

Include only the minimum sanitized facts needed to explain the concern. Do not attach private source, binaries, catalogs, record content, credentials, browser-session artifacts, conversations, screenshots, HAR files, full diagnostics, or machine-identifying filesystem paths. If sensitive evidence is essential, first describe what exists and wait for a safe transfer method.

Do not open a public issue, discussion, or pull request for a security or privacy concern.

## Documented safeguards

The private alpha treats model output, database inputs, browser content, navigation targets, diagnostics, and exports as untrusted. Its documented controls include app-owned read-only snapshots, explicit working copies, schema and domain-quality validation, manual authentication, response correlation, human review, URL/DNS policy, redaction, a production named pipe, native-runtime smoke tests, and transactional portable rollback.

The public documentation workflow separately rejects common application, database, archive, credential, and browser-capture artifacts; scans for private paths and credential material; checks relative links and image accessibility; validates JSON; and constrains SVG content.

These controls reduce risk but do not guarantee model accuracy, eliminate supply-chain risk, or replace a private review of a specific report.
