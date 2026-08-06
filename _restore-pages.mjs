import fs from "fs";
import path from "path";

const ROOT = "d:/Priya/bookento-web";
const TRANSCRIPTS =
  "C:/Users/Designer01/.cursor/projects/d-Priya-bookento-web/agent-transcripts";

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".jsonl")) out.push(p);
  }
  return out;
}

function normalizeProjectPath(p) {
  return (p || "")
    .replace(/\\/g, "/")
    .replace(/^D:\/Priya\/Bookento-Web\//i, "")
    .replace(/^d:\/Priya\/bookento-web\//i, "")
    .replace(/^D:\/Priya\/bookento-web\//i, "");
}

function isPagePath(rel) {
  return /^src\/app\/.*page\.jsx$/.test(rel);
}

function isResponsiveWrapper(content) {
  if (!content) return true;
  if (content.includes("@/components/responsive")) return true;
  if (/return\s*<\w+Responsive\s*\/?>/.test(content)) return true;
  if (content.length < 400 && content.includes("Responsive")) return true;
  return false;
}

/** Prefer last good (non-responsive) write per page. */
const lastGood = new Map();
const allWrites = new Map();

for (const file of walk(TRANSCRIPTS)) {
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      continue;
    }
    for (const c of obj.message?.content || []) {
      if (c.type !== "tool_use") continue;
      const inp = c.input || {};
      const rel = normalizeProjectPath(inp.path);
      if (!isPagePath(rel)) continue;

      let content = null;
      if (c.name === "Write" && inp.contents) content = inp.contents;
      if (c.name === "StrReplace" && inp.new_string && !inp.old_string?.includes("Responsive")) {
        // partial - skip for full restore
      }

      if (!content) continue;

      allWrites.set(rel, { content, source: path.basename(file), tool: c.name });

      if (!isResponsiveWrapper(content)) {
        lastGood.set(rel, { content, source: path.basename(file) });
      }
    }
  }
}

const restored = [];
const missing = [];

for (const [rel, meta] of lastGood.entries()) {
  const dest = path.join(ROOT, rel.replace(/\//g, path.sep));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, meta.content, "utf8");
  restored.push({ rel, source: meta.source, bytes: meta.content.length });
}

// List pages still on responsive wrappers
for (const rel of allWrites.keys()) {
  if (!lastGood.has(rel)) missing.push(rel);
}

const report = [
  "RESTORE REPORT",
  "==============",
  `Restored: ${restored.length}`,
  ...restored.sort((a, b) => a.rel.localeCompare(b.rel)).map((r) => `  OK  ${r.rel} (${r.bytes}b from ${r.source})`),
  "",
  `Still missing good version: ${missing.length}`,
  ...missing.sort().map((r) => `  ??  ${r}`),
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, "_restore-report.txt"), report, "utf8");
console.log(report);
