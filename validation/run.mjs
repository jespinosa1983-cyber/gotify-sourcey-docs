import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const projectRootInput = process.env.RUNX_INPUT_PROJECT_ROOT ?? "..";
const docsDirInput = process.env.RUNX_INPUT_DOCS_DIR ?? "docs";
const projectRoot = path.resolve(skillDir, projectRootInput);
const docsDir = path.resolve(projectRoot, docsDirInput);

const methods = new Set(["get", "post", "put", "patch", "delete", "options", "head", "trace"]);

async function readText(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

async function requireFile(filePath) {
  const info = await stat(filePath);
  if (!info.isFile() || info.size === 0) {
    throw new Error(`required file is empty: ${filePath}`);
  }
  return info.size;
}

try {
  const specText = await readText("source/spec.json");
  const evidenceText = await readText("evidence.json");
  const report = await readText("report.md");
  const spec = JSON.parse(specText);
  const evidence = JSON.parse(evidenceText);

  const operations = [];
  for (const [route, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (methods.has(method)) operations.push({ method: method.toUpperCase(), route, operation });
    }
  }

  const apiPath = path.join(docsDir, "api.html");
  const indexPath = path.join(docsDir, "index.html");
  const searchPath = path.join(docsDir, "search-index.json");
  const llmsPath = path.join(docsDir, "llms.txt");
  await Promise.all([requireFile(apiPath), requireFile(indexPath), requireFile(searchPath), requireFile(llmsPath)]);

  const [apiHtml, indexHtml, searchText] = await Promise.all([
    readFile(apiPath, "utf8"),
    readFile(indexPath, "utf8"),
    readFile(searchPath, "utf8"),
  ]);
  const searchEntries = JSON.parse(searchText);
  const specSha256 = createHash("sha256").update(specText).digest("hex");

  const checks = {
    source_sha_matches: specSha256 === evidence.source?.spec_sha256,
    operation_count_matches: operations.length === 41 && evidence.coverage?.operations === 41,
    schema_count_matches: Object.keys(spec.definitions ?? {}).length === 22 && evidence.coverage?.schemas === 22,
    evidence_operations_match: Array.isArray(evidence.operations) && evidence.operations.length === 41,
    search_index_has_coverage: Array.isArray(searchEntries) && searchEntries.length >= 41,
    title_rendered: apiHtml.includes("Gotify REST-API") && indexHtml.includes("Gotify REST-API"),
    application_rendered: apiHtml.includes("/application"),
    message_rendered: apiHtml.includes("/message"),
    stream_rendered: apiHtml.includes("/stream"),
    report_has_five_gaps: (report.match(/^### /gm) ?? []).length >= 5,
    public_url_is_https: /^https:\/\//.test(evidence.public_url ?? ""),
    runx_version_observed: evidence.observations?.some(
      (observation) => observation.command === "runx --version" && observation.output === "runx-cli 0.6.8",
    ) === true,
  };

  const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failed.length > 0) {
    process.stderr.write(`validation failed: ${failed.join(", ")}\n`);
    process.exit(65);
  }

  process.stdout.write(`${JSON.stringify({
    status: "validated",
    source_commit: evidence.source.commit,
    spec_sha256: specSha256,
    operations: operations.length,
    schemas: Object.keys(spec.definitions ?? {}).length,
    search_entries: searchEntries.length,
    public_url: evidence.public_url,
    docs_dir: path.relative(projectRoot, docsDir).replaceAll("\\", "/"),
    checks,
  })}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(66);
}
