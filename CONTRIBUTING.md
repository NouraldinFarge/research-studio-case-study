# Contributing

This is a source-free engineering case study. Focused pull requests that improve accuracy, accessibility, evidence wording, diagrams, or documentation navigation are welcome. Application implementation contributions cannot be accepted here because the private source is not distributed.

## Good contributions

- Correct a supportable factual, spelling, link, or accessibility issue.
- Clarify an implemented boundary without overstating what was verified.
- Improve an original SVG while preserving its evidence meaning.
- Strengthen the publication audit without weakening the source-free boundary.
- Replace a fabricated example with a clearer fabricated example.

## Out of scope

Do not submit application or upstream source, binaries, archives, catalogs, catalog rows, real titles or descriptions, credentials, local paths, browser profiles, cookies, tokens, conversations, screenshots, HAR files, full diagnostics, or third-party material without reviewed redistribution rights.

## Before opening a pull request

1. Keep claims within the evidence documented in [`docs/verification-evidence.md`](docs/verification-evidence.md).
2. Label every fabricated example clearly.
3. Give every image meaningful alternative text.
4. Ensure SVGs include `<title>` and `<desc>` elements and contain no scripts or remote resources.
5. Run `npm ci` and `npm run verify`.
6. Review the staged diff for local paths, private data, session material, and unexpected binary files.

Use [private vulnerability reporting](https://github.com/NouraldinFarge/research-studio-case-study/security/advisories/new)—not an issue or pull request—for security or privacy concerns.
