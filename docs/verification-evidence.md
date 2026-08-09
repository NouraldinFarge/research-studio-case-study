# Verification evidence

This page records what was verified against the private Research Studio implementation on 2026-08-08. It contains results, not private logs, local paths, application source, catalogs, browser sessions, or binaries.

## Evidence boundary

- **Evidence location:** private development workspace and disposable synthetic test directories.
- **Public material:** this summary, original diagrams, and a fabricated export example.
- **Not published:** source, portable builds, catalog rows, assistant conversations, cookies, credentials, HAR files, screenshots, and full local diagnostics.

## Verification snapshot

| Boundary | Current evidence | Result |
| --- | --- | --- |
| Locked install | Clean `npm ci` from the private lockfile | 620 packages installed |
| Dependency review | Production-only and complete npm audits | 0 known advisories in both scopes |
| Static analysis | Server and renderer TypeScript, ESLint, Prettier | 2 TypeScript projects and all configured source paths passed |
| Focused verification | Configuration, database safety, automation, policy, prompts, capture, API, backend, transport, renderer, and desktop boundaries | 14 focused programs passed |
| Production build | Vite renderer, TypeScript server, bundled Electron backend | 29 client modules plus both backend outputs built |
| Source database protection | Snapshot preview, blocked mutation, source file and sidecar comparison | Read-only smoke passed; source file size and timestamp were unchanged |
| Catalog consistency | SQLite `integrity_check` and `foreign_key_check` on the app-owned snapshot | `ok`; 0 foreign-key violations |
| Private catalog profile | Counts queried from the inspected private snapshot | 31,521 series; 2,242,170 episodes; 31,050 covers; 305,842 primary tag associations |
| Model-output controls | Schema, evidence, bilingual quality, record correlation, incomplete-output recovery | Focused prompt/capture/automation checks passed |
| Network target policy | Protocol, literal address, DNS answer, timeout, and post-navigation checks | Public synthetic address allowed; private, empty, and timed-out resolutions blocked |
| Production transport | Packaged backend startup | Application-private Windows named pipe; no packaged TCP listener |
| Native SQLite | Module loaded and queried under packaged Electron and restored Node runtimes | Electron ABI 146 and Node ABI 137 passed; SQLite 3.53.2 |
| Portable archive | Structure, version, forbidden-installer scan, bundled interface smoke | Passed as a private ZIP-only artifact |
| Deployment recovery | Disposable path-with-spaces upgrade and injected activation failure | Durable data preserved; cache/logs replaced; prior build restored on failure |
| Historical source archive | Exclusion policy, nested checksums, source version, unsafe-path scan | Passed as a private immutable ZIP |

## What the snapshot does not prove

- It does not guarantee that model-produced metadata is correct.
- It does not replace human review of a particular enrichment result.
- It does not authorize public distribution of the implementation or binaries.
- It does not prove compatibility with every catalog variant or Windows configuration.
- It does not turn manual authentication, MFA, CAPTCHA, or account challenges into automated steps.

These limits are part of the engineering result, not footnotes to hide.
