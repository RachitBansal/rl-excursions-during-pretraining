#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert all <i>...</i> math symbols to $$...$$ in a Markdown file,
and normalize any B_problem / B_{problem} / B_{\text{problem}} variants
to B_\text{problem} inside math.

Usage:
  python convert_i_to_display_math.py input.md output.md
"""

import re
import sys
from pathlib import Path


def normalize_b_problem(expr: str) -> str:
    """
    Inside a math expression, normalize common variants of B_problem to B_\\text{problem}.
    This is a best-effort, mechanical normalization.
    """
    # B_problem  -> B_\text{problem}
    expr = re.sub(r"\bB_problem\b", r"B_\\text{problem}", expr)

    # B_{problem} -> B_\text{problem}
    expr = re.sub(r"\bB_\{problem\}\b", r"B_\\text{problem}", expr)

    # B_{\\text{problem}} -> B_\text{problem}
    expr = re.sub(r"\bB_\{\\text\{problem\}\}\b", r"B_\\text{problem}", expr)

    # B_{\\mathrm{problem}} -> B_\text{problem} (just in case)
    expr = re.sub(r"\bB_\{\\mathrm\{problem\}\}\b", r"B_\\text{problem}", expr)

    return expr


def convert_i_tags_to_display_math(text: str) -> str:
    """
    Replace every <i>...</i> with $$ ... $$ (display math), preserving inner content.
    Also normalize B_problem -> B_\\text{problem} within the replaced content.
    """
    # Allow <i ...> with attributes, and match across newlines
    pattern = re.compile(r"<i\b[^>]*>(.*?)</i>", re.DOTALL | re.IGNORECASE)

    def repl(m: re.Match) -> str:
        inner = m.group(1)
        inner = normalize_b_problem(inner)
        return f"${inner}$"

    return pattern.sub(repl, text)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python convert_i_to_display_math.py input.md output.md", file=sys.stderr)
        return 2

    in_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])

    if not in_path.exists():
        print(f"Error: input file not found: {in_path}", file=sys.stderr)
        return 1

    text = in_path.read_text(encoding="utf-8")
    converted = convert_i_tags_to_display_math(text)
    out_path.write_text(converted, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
