# Gotify REST API docs generated with Sourcey

This repository publishes a reproducible Sourcey build of the Gotify REST API.

Live site: https://jespinosa1983-cyber.github.io/gotify-sourcey-docs/

## Pinned source

- Repository: https://github.com/gotify/server
- Commit: `8221c0b895fdd1b1b84c0d5784e9422eb314ecb5`
- Specification: `docs/spec.json` at that commit
- License: MIT (Gotify logo separately uses CC BY 4.0)
- Source snapshot: `source/spec.json`

## Build

Requirements: Node.js 20 or newer and Sourcey 3.6.3.

```powershell
npm install -g sourcey@3.6.3
sourcey validate .\source\spec.json
sourcey build .\source\spec.json -o .\docs
```

The build validates 41 operations and 22 schemas and writes static HTML, search, sitemap, Open Graph, and `llms.txt` artifacts to `docs/`.

## Evidence

- `evidence.json`: machine-readable source, command, coverage, and spot checks.
- `report.md`: maintainer-facing findings and recommendations.
- `docs/evidence/receipt.json`: CI-issued runx receipt for the governed validation.
- `docs/evidence/verification.json`: independent runx verification verdict.

This is an independent documentation build, not an official Gotify site.
