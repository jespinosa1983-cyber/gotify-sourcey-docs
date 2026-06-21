---
name: gotify-sourcey-validation
description: Deterministically validate the pinned Gotify specification, Sourcey output, evidence packet, and coverage claims.
source:
  type: cli-tool
  command: node
  args:
    - run.mjs
  timeout_seconds: 60
  sandbox:
    profile: readonly
    cwd_policy: skill-directory
inputs:
  project_root:
    type: string
    required: true
    description: Project root relative to this skill directory.
  docs_dir:
    type: string
    required: false
    description: Generated Sourcey directory relative to the project root.
runx:
  category: quality
  input_resolution:
    required:
      - project_root
---

# Gotify Sourcey Validation

Validate a pinned Gotify Swagger snapshot and its Sourcey documentation without network mutation or model inference.

The runner checks the source SHA-256, operation and schema counts, evidence coverage, required generated files, search coverage, rendered title and three representative API paths, five maintainer-facing report gaps, and the HTTPS public URL claim. It returns a compact JSON validation result suitable for a sealed runx receipt.

Use this only from a checkout that contains `source/spec.json`, `evidence.json`, `report.md`, and the generated Sourcey directory. A missing or mismatched artifact fails closed.
