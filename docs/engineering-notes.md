# Engineering notes

[Evidence guide](README.md) · [Design decisions](design-decisions.md) · [Threat model](threat-model.md) · [Verification snapshot](verification-evidence.md)

The most important lesson was consistent across database, browser, and release failures: an intended boundary is not evidence. Each boundary needed an observable runtime check and a defined recovery path.

## Resolved failures that shaped the design

### Native-module ABI mismatch

An early private alpha packaged a `better-sqlite3` binary built for Node ABI 137 while Electron required ABI 146. The executable opened, but database startup failed. The release pipeline now rebuilds the module for the exact Electron runtime, launches that packaged runtime to query SQLite, and restores and rechecks the Node development binary afterward. The failed alpha remains historical evidence and is not represented as a successful release.

### Temporary-path startup coupling

The extracted desktop application originally depended on a backend executable from temporary unpacking. The current packaged architecture loads the bundled backend in process and communicates through an application-private Windows named pipe, removing the temporary executable and fixed TCP-port dependency from production.

### Visible-response miscorrelation

An older assistant answer could remain visible while a newer prompt pack was active. Capture now correlates the submitted user turn, expected response shape, record count, and ordered record numbers before any result is accepted. A response that belongs to another pack is preserved for review but is not mapped onto current records.

### Syntactically valid but unusable output

JSON parsing alone was too weak. Quality gates now check required bilingual fields, description substance, ordered controlled tags, evidence shape, and record identity. Invalid and incomplete output remains inspectable and retryable; it does not count as a successful automated save.

### Portable upgrade without recovery evidence

A working ZIP is not enough. The current private test extracts the release from a renamed path containing spaces, preserves only durable `portable-data/data`, replaces disposable state, injects a post-activation failure, and verifies restoration of the prior build.

## What I learned

1. **Read-only is an end-to-end property.** A library flag is insufficient if opening SQLite can still create coordination files. A disposable snapshot makes the no-touch source boundary observable and testable.
2. **The target runtime must execute native dependencies.** Package metadata and a successful build do not prove ABI compatibility; loading and querying the module under Electron does.
3. **Validation is part of the product workflow.** Model output needs identity correlation, domain-quality rules, review states, and recoverable failure handling—not just a JSON parser.
4. **Portability includes state semantics.** A portable app needs explicit durable and disposable directories, transactional activation, and rollback behavior.
5. **Honest boundaries strengthen a case study.** The engineering can be explained with synthetic evidence without publishing unlicensed source, private data, or credentials.

## Current and deferred architecture

The implemented private alpha uses Electron, React, TypeScript, Node.js, and a private named-pipe service. A Tauri/Rust authority is a deferred evaluation, not the current architecture. It would proceed only after database, browser, packaging, and recovery behavior can be reproduced without weakening the tested trust boundaries.
