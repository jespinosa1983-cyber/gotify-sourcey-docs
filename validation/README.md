# Gotify Sourcey validation skill

This dependency-free runx `cli-tool` validates the pinned source, generated site, coverage evidence, public URL claim, and maintainer-facing report.

Direct smoke test:

```bash
RUNX_INPUT_PROJECT_ROOT=.. RUNX_INPUT_DOCS_DIR=docs node run.mjs
```

Governed CI run:

```bash
runx skill ./validation -R ./ci-receipts \
  -i project_root=.. -i docs_dir=ci-docs --json
```

The GitHub Actions workflow performs a fresh Sourcey build into `ci-docs` before the governed validation.
