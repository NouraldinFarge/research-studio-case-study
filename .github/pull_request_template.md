# Documentation pull request

## Reader-facing improvement

Describe the problem a visitor encounters and how this change makes the case study clearer, more accurate, or more accessible.

## Evidence

Identify the existing public evidence that supports every changed technical claim. Do not attach private logs or artifacts.

## Publication-boundary review

- [ ] No application or upstream source, binaries, archives, catalogs, real records, credentials, sessions, conversations, HAR files, private diagnostics, or local paths were added
- [ ] Every example is clearly fabricated and every visual is original or has reviewed redistribution rights
- [ ] Ownership, AI-assistance, application availability, and licensing boundaries remain explicit
- [ ] Current Electron behavior is not described as a completed Tauri/Rust migration

## Presentation and validation

- [ ] Relative links resolve and every image has meaningful alternative text
- [ ] SVGs contain accessible titles/descriptions and no scripts or remote resources
- [ ] `npm ci` completed from the lockfile
- [ ] `npm run verify` passed
