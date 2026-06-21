# Gotify Sourcey documentation report

Captured: 2026-06-21

## Summary

Sourcey 3.6.3 successfully validated and rendered the Gotify REST API specification pinned at commit `8221c0b895fdd1b1b84c0d5784e9422eb314ecb5`. The static site covers 29 paths, 41 operations, 22 schemas, seven security definitions, and 63 search-index entries. It includes navigable API HTML, client-side search, sitemap, Open Graph output, `llms.txt`, and `llms-full.txt`.

The target is suitable for a public proof: `gotify/server` is active, non-archived, has more than one source file, uses the MIT license, has a current public release, and commits its Swagger 2.0 specification in the repository. The generated site is independent and is not represented as official Gotify documentation.

## Pinned provenance

- Repository: https://github.com/gotify/server
- Commit: https://github.com/gotify/server/commit/8221c0b895fdd1b1b84c0d5784e9422eb314ecb5
- Raw specification: https://raw.githubusercontent.com/gotify/server/8221c0b895fdd1b1b84c0d5784e9422eb314ecb5/docs/spec.json
- License: https://github.com/gotify/server/blob/8221c0b895fdd1b1b84c0d5784e9422eb314ecb5/LICENSE
- Current release checked: https://github.com/gotify/server/releases/tag/v2.9.1
- Adapter: Sourcey OpenAPI quick-build adapter, consuming Swagger 2.0 JSON

## Commands

```powershell
sourcey --version
# 3.6.3

sourcey validate .\source\spec.json
# Valid: Gotify REST-API. v2.1.0
# Operations: 41
# Schemas: 22

sourcey build .\source\spec.json -o .\docs
# Spec: Gotify REST-API. v2.1.0
# Operations: 41
# Schemas: 22
# Time: 3.9s
```

## What worked well

1. All 41 operations have stable `operationId` and summary fields, so Sourcey produced a complete navigable reference rather than unnamed endpoints.
2. All operations have at least one parameter record and at least one response record; request and response panels therefore contain useful source-derived structure.
3. All operations have tags, producing coherent application, auth, client, info, message, OIDC, plugin, and user groupings.
4. Sourcey rendered the seven API-key/basic-auth definitions and operation-level security metadata where the source declares it.
5. The generated API page contains real source paths including `/application`, `/message`, and `/stream`, and the `Create a message` summary is present.
6. The site emitted 63 searchable records plus compact and full LLM context exports.

## Maintainer-facing gaps

### 1. The specification version is stale relative to releases

The pinned `docs/spec.json` reports `info.version: 2.1.0`, while the latest public Gotify release is `v2.9.1`. A generated docs reader can reasonably mistake the API description for an old server release even though the specification itself contains newer OIDC operations.

Recommendation: derive `info.version` from the release/build version during spec generation, or explain clearly that it is an independent API-schema version.

### 2. Generated examples default to localhost

The source declares `host: localhost` with both HTTP and HTTPS schemes. The static API HTML contains 289 `localhost` occurrences because Sourcey correctly carries that host into generated examples. These examples are safe for self-hosting but not immediately usable against a real deployment.

Recommendation: document a deployment base-URL placeholder or provide a Sourcey build-time server override while preserving the committed source snapshot.

### 3. Most operations lack long descriptions

Twenty-four of 41 operations have no `description`. Summaries keep the reference usable, but application, client, message, plugin, health, and version endpoints often omit behavioral constraints, authorization nuance, pagination semantics, or side effects.

Recommendation: prioritize descriptions for mutation, token, pagination, upload, and streaming operations. Sourcey will surface the added prose without template changes.

### 4. Security intent is not explicit on every operation

The spec has no global `security` block. Thirty-three operations declare operation-level security; eight do not. Some may be intentionally public, but the absence is not distinguishable from omitted metadata in a generated reference.

Recommendation: use explicit `security: []` for intentionally public operations and a named requirement for protected operations. This makes anonymous access auditable and prevents consumers from inferring intent.

### 5. One-page quick mode limits guide context

Quick mode produces a strong API reference, but it cannot explain deployment URL substitution, token choice, elevated authentication, OIDC/PKCE sequences, WebSocket behavior, or the distinction between application and client tokens as a guided workflow.

Recommendation: keep the same pinned OpenAPI tab and add short Markdown guides for authentication, sending a first message, streaming, pagination, and elevated operations in a configured Sourcey site.

## Coverage notes

The generated reference documents all 41 source operations, exceeding the 20-operation threshold. Evidence includes every method/path/operation ID, source metrics, output artifacts, and three live-content spot checks. No endpoint behavior was tested against a running Gotify instance; this report evaluates source-to-documentation coverage only.

## Receipt

The governed runx validation receipt remains pending official runx GitHub authorization. No receipt reference is fabricated.
