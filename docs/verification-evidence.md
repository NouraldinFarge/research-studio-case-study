# Verification evidence

This page records bounded verification of private Research Studio `v0.1.0-alpha.24` on 2026-08-15. It does not publish source, binaries, catalogs, local paths, browser/account state, assistant conversations, or complete private logs.

## Claim semantics

- **Passed** — the named check completed successfully against the reviewed private workspace or a disposable environment.
- **Observed** — the runtime behavior or failure was reproduced directly.
- **Current** — true for this dated snapshot, not a guarantee about later runtimes, websites, dependencies, or data.
- **Private evidence** — detailed artifacts cannot be redistributed safely; the public statement is deliberately narrower.

## Evidence boundary

- **Private:** implementation, upstream material, portable/source archives, real database, session, conversations, logs, and machine paths.
- **Public:** this bounded matrix, aggregate counts, original diagrams, synthetic UI captures, and a fabricated JSON fixture.
- **Synthetic capture:** the public product images use a deterministic 12-title fixture. They do not show the embedded account/browser pane.

## Alpha.24 verification matrix

| Boundary | Method | Result |
| --- | --- | --- |
| Version/config alignment | Compare package, application config, and standalone contract | All report `0.1.0-alpha.24` |
| Static quality | Server + renderer TypeScript, ESLint with zero warnings, Prettier check | Passed |
| Focused programs | Configuration, read-only storage, schema migration, startup recovery, two automation layers, browser input, provider boundary, protection policy, prompt safety/quality/evals, capture, activity tracker, API, two backend lifecycles, and three architecture boundaries | 20 programs passed |
| Prompt evaluations | Catalog-only, unsupported-premise, confidence/source mismatch, coherent multi-source fixtures | 4 evaluations passed |
| Production build | Vite renderer, TypeScript server, bundled Electron backend | Passed |
| Bundled backend | Start/stop the generated application service | Passed |
| Dependency audit | `npm audit --audit-level=moderate` | 0 vulnerabilities |
| Install-script policy | Explicit allowlist for required native/build scripts; installer helper denied | No unreviewed pending scripts |
| Schema upgrade | Backed-up v6-to-v7 canonical tag migration and label backfill | Passed |
| Human approval | Validate/stage draft, verify no result, approve/revalidate, create result | Passed; no result exists before approval |
| Export authority | JSON, CSV, JSONL, and enhanced SQLite eligibility | Approved-only across every path |
| Prompt provenance | Active/used version lock and create-revision flow | Historical job prompt identity preserved |
| Campaign planning | Workload review, one-title pilot, batch size 2, checkpoint/resume, circuit breaker | Passed |
| Startup recovery | Reopen stale job/browser-run fixtures | Interrupted states reconciled with durable reasons |
| Assistant correlation | Prompt completeness, new turn identity, conversation reload, response shape/count/order | Passed |
| Activity monitoring | Thinking, writing, paused, stable-complete, and incomplete JSON states | Passed |
| Source database protection | App-owned snapshot, read-only flag, `query_only`, blocked schema mutation | Passed |
| Source immutability | Compare size, mtime, WAL/SHM state, and SHA-256 before/after real-catalog smoke | Unchanged |
| Catalog consistency | SQLite `integrity_check` and `foreign_key_check` on the app-owned snapshot | `ok`; 0 violations |
| Catalog profile | Count inspected private snapshot | 31,521 series; 2,242,170 episodes; 31,050 covers; 305,842 primary tag associations |
| Catalog use | Browse one record and execute text search through the app API | Passed |
| Network policy | Protocol/literal address, bounded DNS, redirect and final-host checks | Private/invalid/timed-out targets blocked |
| Packaged transport | Start bundled service under the release application | Application-private Windows named pipe; no TCP listener |
| Native SQLite | Query SQLite under packaged Electron, then restore/query Node development runtime | Electron ABI 146 and Node ABI 137 passed; SQLite 3.53.2 |
| Packaged interface | Load bundled React through `research-studio://app/` in Electron | Passed |
| Portable archive | Required files, version/manifest, forbidden installer scan, native and UI smoke | Passed |
| Process cleanup | Graceful window close, exact candidate-process drain, post-exit quiescence | No functional cache/socket/GPU cleanup error |
| Transactional deployment | Verify temporary extraction, final active path, and version | Passed |
| Upgrade semantics | Preserve durable data only; replace cache/logs/previews/binaries | Passed |
| Rollback | Inject activation failure after candidate swap | Previous active build and durable data restored |
| Path portability | Run from a renamed path containing spaces | Passed |
| Historical source archive | Nested ZIP structure, checksums, path safety, source/private exclusion | Passed |
| Release inventory | ZIP-only versions plus retained/metadata-only receipt reconciliation | Passed |

## Real-catalog immutability evidence

The read-only smoke sequence captured the source SHA-256, opened an app-owned snapshot through Research Studio, queried aggregate counts, ran integrity and foreign-key checks, browsed and searched, confirmed a schema mutation returned the expected read-only conflict, stopped the service, and hashed the source again.

Before and after SHA-256:

`265A008B120A1542352455EC015016BB5A676D17F6B8CEB6494B7398C2E0269E`

The file size, modification time, and SQLite sidecar state were also unchanged. This proves the tested workflow did not alter that source file; it is not a general proof about all possible SQLite filesystems or external processes.

## Release evidence

The exact one-click alpha.24 path produced a private Windows x64 portable ZIP, independently verified its structure, queried the packaged native module, rendered the bundled production interface, and transactionally promoted the flat active build. The matching source snapshot contains clean source, lockfile, tests, contracts, and documentation but excludes databases, browser state, generated output, native binaries, and credentials.

Both artifacts remain private because successful verification does not grant redistribution rights.

## Known notice

Electron's internal ASAR implementation emits a Node `fs.Stats` deprecation notice during one native verification path. The trace originates inside Electron, the check exits successfully, and SQLite is queried correctly. It remains an upgrade-review item rather than being hidden or suppressed.

## What this does not prove

- AI-produced metadata is factually correct in every case.
- Provider terms, account retention, cost, or rate-limit policy has been approved.
- Every Windows host, catalog variant, display, or assistive technology has been tested.
- The optional .NET engine passed the Electron release matrix.
- The application is code-signed, independently audited, production-ready, or licensed for public redistribution.
- Manual sign-in, MFA, CAPTCHA, and account-security challenges are automated.
- A valid schema or an approved state is itself evidence that a claim is true; the reviewer remains accountable.

These limits are part of the engineering result, not hidden footnotes.
