#!/usr/bin/env python3
"""Apply design token migrations to className strings in src/."""
import os
import re

ROOT = r"d:\Priya\bookento-web\src"
REPORT = r"d:\Priya\bookento-web\_migrate_applied.txt"

SIMPLE_REPLACEMENTS = [
    ("border-[#E5E7EB]", "border-border"),
    ("bg-[#E8EAF0]", "bg-muted"),
    ("text-[#B1B1B1]", "text-[var(--nav-inactive)]"),
    ("hover:bg-[#F3F4F6]", "hover:bg-muted"),
]

# #1865EA arbitrary Tailwind color classes -> design tokens
PRIMARY_PREFIXES = [
    "text",
    "bg",
    "border",
    "fill",
    "stroke",
    "ring",
    "outline",
    "decoration",
    "caret",
    "divide",
    "from",
    "to",
    "via",
    "accent",
]

CARD_SHADOW_REPLACEMENTS = [
    ("shadow-[0_2px_12px_rgba(15,23,42,0.04)]", "shadow-card"),
    ("shadow-[0_2px_12px_rgba(15,23,42,0.06)]", "shadow-card"),
    ("shadow-[0_2px_10px_rgba(15,23,42,0.04)]", "shadow-card"),
    ("shadow-[0_2px_10px_rgba(15,23,42,0.05)]", "shadow-card"),
    ("shadow-[0_1px_4px_rgba(15,23,42,0.04)]", "shadow-card"),
    ("shadow-[0_2px_8px_rgba(15,23,42,0.05)]", "shadow-card"),
    ("shadow-[0_2px_8px_rgba(15,23,42,0.06)]", "shadow-card"),
    ("shadow-[0_4px_24px_rgba(15,23,42,0.06)]", "shadow-card"),
    ("shadow-[0_4px_24px_rgba(15,23,42,0.04)]", "shadow-card"),
    ("shadow-[0_4px_20px_rgba(15,23,42,0.06)]", "shadow-card"),
    ("shadow-[0_4px_24px_rgba(15,23,42,0.05)]", "shadow-card"),
    ("hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]", "hover:shadow-card-hover"),
    ("shadow-[0_10px_28px_rgba(15,23,42,0.08)]", "shadow-card-hover"),
    ("shadow-[0_8px_24px_rgba(15,23,42,0.1)]", "shadow-card-hover"),
    ("shadow-[0_12px_28px_rgba(15,23,42,0.1)]", "shadow-card-hover"),
    ("hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]", "hover:shadow-card-hover"),
    ("shadow-[0_8px_30px_rgba(15,23,42,0.08)]", "shadow-card-hover"),
    ("shadow-[0_8px_30px_rgba(15,23,42,0.06)]", "shadow-card-hover"),
    ("shadow-[0_8px_30px_rgba(15,23,42,0.12)]", "shadow-card-hover"),
]

PRIMARY_PATTERN = re.compile(
    r"((?:[\w-]+:)*)(text|bg|border|fill|stroke|ring|outline|decoration|caret|divide|from|to|via|accent)-\[#1865EA\]((?:\/\d+)?)",
    re.I,
)

exts = {".js", ".jsx", ".ts", ".tsx"}
changed_files = []


def migrate_content(text: str) -> str:
    for old, new in SIMPLE_REPLACEMENTS:
        text = text.replace(old, new)

    def primary_repl(match):
        prefix = match.group(1) or ""
        utility = match.group(2).lower()
        opacity = match.group(3) or ""
        token_map = {
            "text": "text-primary",
            "bg": "bg-primary",
            "border": "border-primary",
            "fill": "fill-primary",
            "stroke": "stroke-primary",
            "ring": "ring-primary",
            "outline": "outline-primary",
            "decoration": "decoration-primary",
            "caret": "caret-primary",
            "divide": "divide-primary",
            "from": "from-primary",
            "to": "to-primary",
            "via": "via-primary",
            "accent": "accent-primary",
        }
        return f"{prefix}{token_map.get(utility, utility + '-primary')}{opacity}"

    text = PRIMARY_PATTERN.sub(primary_repl, text)

    for old, new in CARD_SHADOW_REPLACEMENTS:
        text = text.replace(old, new)

    return text


for dirpath, _, filenames in os.walk(ROOT):
    for fn in filenames:
        if os.path.splitext(fn)[1] not in exts:
            continue
        path = os.path.join(dirpath, fn)
        with open(path, encoding="utf-8") as f:
            original = f.read()
        updated = migrate_content(original)
        if updated != original:
            with open(path, "w", encoding="utf-8", newline="\n") as f:
                f.write(updated)
            rel = os.path.relpath(path, ROOT)
            changed_files.append(rel)

# Update icons.js separately
icons_path = os.path.join(ROOT, "theme", "icons.js")
icons_content = '''/** Shared icon sizes and nav icon paths */

export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  fab: 28,
};

/** Tailwind size classes matching globals.css icon utilities */
export const iconClass = {
  xs: "size-4",
  sm: "size-[1.125rem]",
  md: "size-5",
  lg: "size-6",
};

export const navIcons = {
  home: "/icons/nav/12.svg",
  shorts: "/icons/nav/13.svg",
  bookings: "/icons/nav/14.svg",
  chats: "/icons/nav/15.svg",
  profile: "/icons/nav/16.svg",
};
'''
with open(icons_path, encoding="utf-8") as f:
    icons_original = f.read()
if icons_original != icons_content:
    with open(icons_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(icons_content)
    if "theme\\icons.js" not in changed_files and "theme/icons.js" not in changed_files:
        changed_files.append("theme/icons.js")

lines = [
    f"Changed files: {len(changed_files)}",
    "",
    *sorted(changed_files),
]
open(REPORT, "w", encoding="utf-8").write("\n".join(lines))
print("\n".join(lines))
