import fs from "fs";
import path from "path";

const TRANSCRIPTS =
  "C:/Users/Designer01/.cursor/projects/d-Priya-bookento-web/agent-transcripts";
const ROOT = "d:/Priya/bookento-web";

const TARGETS = {
  "src/app/(user)/notifications/page.jsx": ["NotificationFilterTabs", "UserPageShell"],
  "src/app/(user)/appointments/page.jsx": ["BookingTabBar", "BookingListCard"],
  "src/app/page.jsx": ["UpcomingAppointmentCard", "MobileScrollRow"],
};

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
    .replace(/^d:\/Priya\/bookento-web\//i, "");
}

const found = new Map();

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
      const rel = normalizeProjectPath(c.input?.path);
      const content = c.input?.contents;
      const markers = TARGETS[rel];
      if (!markers || !content) continue;
      if (content.includes("Responsive")) continue;
      if (markers.every((m) => content.includes(m))) {
        found.set(rel, { content, source: path.basename(file) });
      }
    }
  }
}

for (const [rel, meta] of found.entries()) {
  const dest = path.join(ROOT, rel.replace(/\//g, path.sep));
  fs.writeFileSync(dest, meta.content, "utf8");
  console.log(`Restored mobile design: ${rel} (${meta.content.length}b from ${meta.source})`);
}

if (found.size === 0) console.log("No matches found");
