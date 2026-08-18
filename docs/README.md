# Case-study evidence guide

This directory is the supporting evidence layer for the Research Studio portfolio case study. It explains how the private implementation was evaluated without publishing its source, binaries, catalog, browser sessions, or private diagnostic logs.

## How to read the claims

| Label | Meaning |
| --- | --- |
| **Implemented** | The behavior exists in the reviewed private alpha. |
| **Verified** | A dated automated or inspected result supports the claim. |
| **Observed** | A failure or runtime behavior was reproduced directly. |
| **Deferred** | The idea is not part of the current implementation. |
| **Not public** | Evidence exists privately but cannot be redistributed safely. |

Claims are intentionally narrower than aspirations. A passing structural or safety test does not establish that model-generated metadata is factually correct, and a private implementation does not imply redistribution permission.

## Evidence map

- [Design decisions](design-decisions.md) — why these boundaries and technologies were chosen; supported by the reviewed implementation and alternatives.
- [Threat model](threat-model.md) — what data and authority could be harmed and how each is constrained; supported by trust-boundary review and focused checks.
- [Prompt contract](prompt-contract.md) — what the evidence-first v3 prompt requests and rejects; supported by the implemented contract and synthetic evaluations.
- [Approval and automation](approval-and-automation.md) — where the human boundary sits and how whole-library work is constrained; supported by storage/API and campaign invariants.
- [Verification evidence](verification-evidence.md) — what passed for alpha.24 on 2026-08-15; a dated private-verification summary with explicit limits.
- [Engineering notes](engineering-notes.md) — which reproduced failures changed the design and which regression gates resulted.
- [Synthetic export](synthetic-export.example.json) — the documented result shape using a fabricated, non-catalog fixture.
- [Asset manifest](../assets/manifest.json) — exact hashes, byte sizes, dimensions, and publication classification for every public image.
- [Release-note draft](releases/case-study-2026.08.15.md) — metadata-only notes for the existing signed case-study tag; no binary or source attachment.

## Publication boundary

Safe public evidence includes original prose, original diagrams, fabricated fixtures, exact aggregate counts from the inspected private snapshot, bounded pass/fail summaries, and application captures generated only from the deterministic synthetic catalog with no browser/account pane or machine path visible.

The following remain private:

- application and upstream source;
- portable or expanded builds;
- catalogs, catalog rows, titles, descriptions, covers, and media links;
- browser profiles, cookies, tokens, conversations, account/browser screenshots, HAR files, and cached pages;
- full local diagnostics, filesystem paths, and machine-identifying details; and
- model-generated enrichment based on the private catalog.

The repository workflow enforces this boundary before documentation can pass.

## Maintenance rule

Refresh the dated evidence after a material private version, architecture, dependency, or release-pipeline change. Preserve older Git history rather than silently rewriting a previous result.

Every product capture must be reproducible from the synthetic fixture, visually inspected for paths/account data, under the image-size budget, clearly labeled synthetic in surrounding prose, and covered by the publication audit's required-file list.
