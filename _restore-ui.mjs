import fs from "fs";
import path from "path";

const ROOT = "d:/Priya/bookento-web";
const TRANSCRIPTS =
  "C:/Users/Designer01/.cursor/projects/d-Priya-bookento-web/agent-transcripts";

const UI_TARGETS = [
  "src/app/page.jsx",
  "src/components/home/section-header.jsx",
  "src/styles/globals.css",
  "src/lib/layout/page-layout.constants.js",
  "src/components/shared/empty-state.jsx",
];

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

function isBad(content, rel) {
  if (!content) return true;
  if (rel === "src/app/page.jsx") {
    return content.includes("HomeResponsive");
  }
  if (rel === "src/components/home/section-header.jsx") {
    return content.includes("@/components/shared/section-header");
  }
  if (rel === "src/styles/globals.css") {
    return content.includes("@utility content-card") && !content.includes("--primary: #1865EA");
  }
  return false;
}

const lastGood = new Map();

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
      if (c.type !== "tool_use" || c.name !== "Write") continue;
      const inp = c.input || {};
      const rel = normalizeProjectPath(inp.path);
      if (!UI_TARGETS.includes(rel) || !inp.contents) continue;
      if (!isBad(inp.contents, rel)) {
        lastGood.set(rel, { content: inp.contents, source: path.basename(file) });
      }
    }
  }
}

for (const [rel, meta] of lastGood.entries()) {
  const dest = path.join(ROOT, rel.replace(/\//g, path.sep));
  fs.writeFileSync(dest, meta.content, "utf8");
  console.log(`Restored ${rel} from ${meta.source}`);
}

if (!lastGood.has("src/components/home/section-header.jsx")) {
  console.log("section-header: using shared implementation inline");
}
