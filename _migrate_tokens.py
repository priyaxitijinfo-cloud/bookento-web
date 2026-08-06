import os
import re

ROOT = r"d:\Priya\bookento-web\src"
OUT = r"d:\Priya\bookento-web\_migrate_results.txt"

PATTERNS = [
    ("border-[#E5E7EB]", "border-border"),
    ("bg-[#E8EAF0]", "bg-muted"),
    ("text-[#B1B1B1]", "text-[var(--nav-inactive)]"),
]

PRIMARY_RE = re.compile(
    r"(?<![\w-])(?:text|bg|border|fill|stroke|from|to|via|ring|outline|decoration|accent|caret|divide|shadow)-\[#1865EA\]",
    re.I,
)
SHADOW_RE = re.compile(r"shadow-\[0_[^\]]+\]")
HEX_RE = re.compile(r"#(?:[0-9A-Fa-f]{3,8})\b")

exts = {".js", ".jsx", ".ts", ".tsx", ".css"}
lines = []

for dirpath, _, filenames in os.walk(ROOT):
    for fn in filenames:
        if os.path.splitext(fn)[1] not in exts:
            continue
        path = os.path.join(dirpath, fn)
        try:
            text = open(path, encoding="utf-8").read()
        except Exception as e:
            lines.append(f"ERR {path}: {e}")
            continue
        rel = os.path.relpath(path, ROOT)
        for old, _ in PATTERNS:
            if old in text:
                lines.append(f"PATTERN {old} in {rel}")
        for m in PRIMARY_RE.finditer(text):
            lines.append(f"PRIMARY {m.group(0)} in {rel}")
        for m in SHADOW_RE.finditer(text):
            lines.append(f"SHADOW {m.group(0)[:100]} in {rel}")
        if rel.startswith("app"):
            for m in HEX_RE.finditer(text):
                ctx = text[max(0, m.start()-50):m.end()+50]
                if "className" in ctx or "class=" in ctx or "-[" in ctx or "cn(" in ctx:
                    lines.append(f"APP_HEX {m.group(0)} in {rel}: {ctx.replace(chr(10),' ')[:120]}")

open(OUT, "w", encoding="utf-8").write("\n".join(lines) or "NO MATCHES")
print(f"Wrote {len(lines)} lines")
