#!/usr/bin/env python3
"""
Strip markdown image URLs (paths) and run lightweight syntax checks.

Primary use case: turn a Notion-exported markdown file into a "no-image" version
that still renders captions/alt text in our site (Markdown.svelte treats
__IMAGE_PLACEHOLDER__ specially).

Default behavior:
- Writes a sibling file "<input>.noimg.md"
- Replaces every:
    ![alt](url)
    ![alt](url "title")
  with:
    ![alt](__IMAGE_PLACEHOLDER__)
    ![alt](__IMAGE_PLACEHOLDER__ "title")
- Prints a small report of likely markdown issues around image/link syntax.

This is NOT a full Markdown parser; it’s a pragmatic lint for our content.
"""

from __future__ import annotations

import argparse
import dataclasses
import pathlib
import re
import sys
from typing import Dict, List, Tuple


PLACEHOLDER = "__IMAGE_PLACEHOLDER__"


# Match standard markdown image syntax on a single line:
# ![alt](url "title")
# Notes:
# - url must not contain whitespace (consistent with our renderer assumptions)
# - title is optional and must be a double-quoted string without internal double quotes
IMG_RE = re.compile(
    r"!\[(?P<alt>[^\]]*)\]\((?P<url>[^)\s]+)(?P<title>\s+\"[^\"]*\")?\)"
)

# Detect image-with-attrs syntax used elsewhere in this repo:
# ![alt](url "title"){width=... id=...}
IMG_ATTR_TAIL_RE = re.compile(r"!\[[^\]]*\]\([^)]*\)\{[^}]*\}")

# Notion exports sometimes embed huge inline base64 payloads as links like:
# [](data:image/png;base64,.....)
DATA_URI_LINE_RE = re.compile(r"^\s*\[\]\(data:image\/[^;]+;base64,[^)]+\)\s*$")

# KaTeX (strict warn) is unhappy with some Unicode whitespace/invisible chars that
# appear in Notion exports (e.g. thin space/hair space/invisible separator).
# We normalize them to plain ASCII equivalents.
UNICODE_NORMALIZE_MAP: Dict[str, str] = {
    "\u00A0": " ",  # NO-BREAK SPACE
    "\u2005": " ",  # FOUR-PER-EM SPACE
    "\u2009": " ",  # THIN SPACE
    "\u200A": " ",  # HAIR SPACE
    "\u200B": "",   # ZERO WIDTH SPACE
    "\u2060": "",   # WORD JOINER
    "\u2063": "",   # INVISIBLE SEPARATOR
    "\uFEFF": "",   # ZERO WIDTH NO-BREAK SPACE (BOM)
}

UNICODE_NORMALIZE_RE = re.compile(
    "[" + "".join(re.escape(k) for k in UNICODE_NORMALIZE_MAP.keys()) + "]"
)


@dataclasses.dataclass(frozen=True)
class Issue:
    line: int
    kind: str
    excerpt: str


def normalize_katex_unicode(text: str) -> Tuple[str, Dict[str, int]]:
    """
    Replace/strip problematic Unicode chars that often break KaTeX rendering.
    Returns (new_text, counts_by_codepoint_string).
    """
    counts: Dict[str, int] = {}

    def repl(m: re.Match[str]) -> str:
        ch = m.group(0)
        counts[ch] = counts.get(ch, 0) + 1
        return UNICODE_NORMALIZE_MAP.get(ch, "")

    return UNICODE_NORMALIZE_RE.sub(repl, text), counts


def iter_issues(lines: List[str]) -> List[Issue]:
    issues: List[Issue] = []

    for i, line in enumerate(lines, start=1):
        s = line.rstrip("\n")

        # 0) Huge inline base64 blobs (usually from exports) — should be removed.
        if DATA_URI_LINE_RE.match(s):
            issues.append(Issue(i, "inline_base64_data_uri", s[:220]))
            continue

        # 0b) KaTeX-unfriendly Unicode that should be normalized.
        if UNICODE_NORMALIZE_RE.search(s):
            issues.append(Issue(i, "katex_unicode_whitespace", s[:220]))

        # 1) Suspicious: "![...(" exists but our regex can't match any image on the line.
        if (
            "![" in s
            and "](" in s
            and not IMG_RE.search(s)
            and not IMG_ATTR_TAIL_RE.search(s)
        ):
            issues.append(
                Issue(
                    line=i,
                    kind="unparsed_image_syntax",
                    excerpt=s[:220],
                )
            )

        # 2) Unbalanced simple markers for image/link brackets/parens (heuristic).
        if "![" in s:
            # crude check: count of "](" should not exceed ")"
            if s.count("](") > s.count(")"):
                issues.append(Issue(i, "unclosed_paren_after_link", s[:220]))

        # 3) Titles with extra double quotes inside parentheses: (... "..." "...") is suspicious.
        # This is exactly what broke rendering earlier.
        if "![" in s and "](" in s and '"' in s:
            # Consider only the first "(...)" span after "](" if present.
            j = s.find("](")
            if j != -1:
                k = s.find(")", j + 2)
                if k != -1:
                    inside = s[j + 2 : k]
                    q = inside.count('"')
                    if q not in (0, 2):
                        issues.append(Issue(i, "suspicious_quote_count_in_image_parens", s[:220]))

        # 4) Attr tail opened but not closed.
        if "){" in s and "}" not in s:
            issues.append(Issue(i, "unclosed_image_attrs_brace", s[:220]))

    return issues


def strip_image_paths(text: str, placeholder: str = PLACEHOLDER) -> Tuple[str, int]:
    """
    Replace markdown image URLs with a placeholder, preserving alt and optional title.
    Returns (new_text, num_replaced).
    """

    replaced = 0

    # First, drop any standalone data-uri link lines to avoid massive markdown bloat.
    lines = text.splitlines(True)
    kept: List[str] = []
    for line in lines:
        if DATA_URI_LINE_RE.match(line.rstrip("\n")):
            replaced += 1
            continue
        kept.append(line)
    text = "".join(kept)

    # Normalize problematic unicode (helps KaTeX warnings).
    text, _counts = normalize_katex_unicode(text)

    def repl(m: re.Match[str]) -> str:
        nonlocal replaced
        replaced += 1
        alt = m.group("alt") or ""
        title = m.group("title") or ""
        return f"![{alt}]({placeholder}{title})"

    return IMG_RE.sub(repl, text), replaced


def main(argv: List[str]) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("input", type=pathlib.Path, help="Path to input .md file")
    ap.add_argument(
        "--output",
        type=pathlib.Path,
        default=None,
        help="Output path (default: <input>.noimg.md next to input)",
    )
    ap.add_argument(
        "--in-place",
        action="store_true",
        help="Overwrite the input file instead of writing <input>.noimg.md",
    )
    ap.add_argument(
        "--placeholder",
        type=str,
        default=PLACEHOLDER,
        help=f"Placeholder URL to use (default: {PLACEHOLDER})",
    )
    args = ap.parse_args(argv)

    in_path: pathlib.Path = args.input
    if not in_path.exists():
        print(f"ERROR: input not found: {in_path}", file=sys.stderr)
        return 2

    raw = in_path.read_text(encoding="utf-8")
    out_text, n = strip_image_paths(raw, placeholder=args.placeholder)

    out_path: pathlib.Path
    if args.in_place:
        out_path = in_path
    else:
        out_path = args.output or in_path.with_suffix(in_path.suffix + ".noimg.md")

    out_path.write_text(out_text, encoding="utf-8")

    # Report issues on a KaTeX-normalized view of the source, since we auto-fix
    # these characters for downstream rendering.
    raw_norm, norm_counts = normalize_katex_unicode(raw)
    lines = raw_norm.splitlines()
    issues = iter_issues(lines)

    print(f"Input:  {in_path}")
    print(f"Output: {out_path}")
    print(f"Images rewritten: {n}")
    if norm_counts:
        total = sum(norm_counts.values())
        parts = []
        for ch, cnt in sorted(norm_counts.items(), key=lambda kv: (-kv[1], kv[0])):
            code = f"U+{ord(ch):04X}"
            parts.append(f"{code} x{cnt}")
        print(f"KaTeX unicode normalized: {total} ({', '.join(parts)})")
    print(f"Issues found: {len(issues)}")
    if issues:
        print("\n--- Issues (line:kind:excerpt) ---")
        for it in issues:
            print(f"{it.line}:{it.kind}:{it.excerpt}")

    # Non-zero exit if issues found (useful for CI / quick checks)
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))


