# Design decisions

These concise records describe the implemented private alpha. They separate current behavior from alternatives that were considered or deferred.

## Decision summary

| Decision | Chosen approach | Primary reason |
| --- | --- | --- |
| Source inspection | App-owned consistent snapshot opened read-only with SQLite `query_only` | Make the no-touch source boundary observable |
| Write authority | Explicit working copy before schema or enrichment writes | Keep source and editable state unmistakably separate |
| Assistant integration | Embedded persistent session with manual authentication | Preserve one-window UX without automating credentials or challenges |
| Prompt execution | Manual packs of 1–5; campaign pilot of 1 then batches of 2 | Keep correlation and recovery practical at whole-library scale |
| Prompt identity | Lock active/used versions; create revisions | Preserve reproducible job provenance |
| Model-output handling | Correlate and validate, stage on job, then explicitly approve | Prevent a model or automation loop from creating approved results |
| Tag contract | Canonical IDs returned by the assistant; labels derived locally | Prevent bilingual drift, unknown tags, and mismatched pairs |
| Restart handling | Reconcile interrupted job/run phases when a working copy opens | Avoid false permanently-running states after a crash |
| Production transport | Application-private Windows named pipe | Avoid a packaged TCP listener and fixed-port collision |
| Desktop boundary | Sandboxed, context-isolated renderer with a narrow preload bridge | Minimize renderer authority |
| Distribution | Private versioned portable ZIP, never an installer | Keep deployment inspectable, movable, and reversible |
| Upgrade behavior | Preserve only durable data and retain the prior active build until verification passes | Bound state migration and provide rollback |
| Current framework | Electron/Node | Preserve verified behavior while the product remains an alpha |

## Source snapshot before read-only preview

**Context:** SQLite can create coordination files even when an application intends only to read. A source database therefore needs protection beyond a connection flag.

**Decision:** create an app-owned consistent preview snapshot and inspect that snapshot through a read-only connection with `query_only` enabled.

**Consequence:** preview creation costs disk space and time, but the source file and its directory remain outside normal SQLite coordination behavior. Write-capable work still requires a separate explicit working copy.

## Persistent embedded browser, manual account security

**Context:** opening a separate browser weakened the one-window workflow, while automating sign-in, MFA, CAPTCHA, or account challenges would cross a credential and policy boundary.

**Decision:** embed the assistant using a dedicated persistent Electron session. Keep authentication challenges manual and expose no credentials to the renderer or local service.

**Consequence:** the session can survive portable upgrades when durable app data is preserved, but account challenges can pause automation and require the reviewer.

## Correlation before interpretation

**Context:** a visible assistant answer can belong to an older prompt, and valid JSON can still target the wrong records.

**Decision:** bind capture to the submitted prompt turn, expected object or array shape, expected record count, and ordered record numbers before applying domain-quality validation.

**Consequence:** incomplete and mismatched responses stop safely and remain inspectable. Retry and continuation handling are product features rather than parser edge cases.

## Staged draft before versioned result

**Context:** a response can satisfy its JSON contract while still needing factual review. Persisting a normal result during capture would let the assistant or an automation loop cross the human decision boundary.

**Decision:** successful capture and validation store a staged draft on the job only. Approval is a separate command that revalidates the draft and creates a new immutable result version. Every export queries approved results only.

**Consequence:** the reviewer can inspect, correct, reject, or retry without contaminating exportable result history. Tests must prove both the absence of a result before approval and approved-only behavior in each export format.

## Canonical tag identity, local labels

**Context:** asking a model for independent Chinese and English tag arrays created ordering, translation, spelling, duplication, and taxonomy-membership failure modes.

**Decision:** prompt contract v3 requests only canonical IDs from a local bilingual taxonomy. Research Studio validates evidence for the IDs and derives paired labels itself.

**Consequence:** the prompt is longer because the allowed taxonomy is explicit, but stored tag identity and bilingual alignment become deterministic. Legacy results remain reviewable while new output uses schema v7 IDs.

## Conservative whole-library campaign

**Context:** a 31,521-title queue magnifies any correlation, provider, cost, or quality error. A large “run all” loop is unsafe even when individual batches are bounded.

**Decision:** show workload before launch, require a one-title pilot, continue with batches of two, checkpoint every batch, exclude correction records, and stop on validation or zero-save failures. Never approve automatically.

**Consequence:** throughput is intentionally lower than an unconstrained loop. The campaign is resumable, audit-friendly, and can be stopped without discarding completed batches.

## Private named pipe in packaged production

**Context:** a fixed localhost port is discoverable by other local processes, can collide, and can let a development service accidentally satisfy a packaged smoke test.

**Decision:** packaged production starts the bundled service in process and communicates through an application-private Windows named pipe. Development alone uses loopback HTTP and WebSocket transport.

**Consequence:** production tests must exercise the packaged protocol and cannot be masked by an already-running development server.

## Explicit native-runtime execution

**Context:** the alpha.13 package built successfully but carried a `better-sqlite3` binary for Node ABI 137 while Electron required ABI 146.

**Decision:** rebuild explicitly for Electron, execute a real SQLite query under packaged Electron, then restore and query the Node development binary.

**Consequence:** packaging takes longer, but success now proves native-module loadability in both actual target runtimes.

## Transactional portable activation

**Context:** a portable ZIP can be structurally valid while an upgrade loses user state or replaces a working active build with a broken candidate.

**Decision:** extract to a temporary verified location, preserve only `portable-data/data`, activate the candidate, verify the active path, and restore the prior build after a failed post-activation check.

**Consequence:** cache, logs, previews, binaries, and other disposable state are replaced deliberately. The preserved state contract is small enough to test.

## Deferred Tauri/Rust evaluation

Tauri/Rust is not the current architecture. It remains deferred until database, browser, native packaging, recovery, and one-window behavior can reach parity without weakening the tested trust boundaries.
