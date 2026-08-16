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

| Document | Question answered | Evidence type |
| --- | --- | --- |
| [Design decisions](design-decisions.md) | Why were these boundaries and technologies chosen? | Reviewed implementation and alternatives |
| [Threat model](threat-model.md) | What data and authority could be harmed, and how is that constrained? | Trust-boundary review and focused checks |
| [Prompt contract](prompt-contract.md) | What does the evidence-first v3 prompt request and reject? | Implemented contract and synthetic evaluations |
| [Approval and automation](approval-and-automation.md) | Where is the human boundary and how is whole-library work constrained? | Storage/API and campaign invariants |
| [Verification evidence](verification-evidence.md) | What passed for alpha.24 on 2026-08-15? | Dated private verification summary |
| [Engineering notes](engineering-notes.md) | Which failures changed the design? | Reproduced failures and regression gates |
| [Synthetic export](synthetic-export.example.json) | What does a documented result look like? | Fabricated, non-catalog fixture |

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
