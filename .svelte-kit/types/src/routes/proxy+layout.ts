// @ts-nocheck
import type { LayoutLoad } from "./$types";

export const prerender = true;
export const trailingSlash = "always";

export const load = async ({ url }: Parameters<LayoutLoad>[0]) => {
  return {
    pathname: url.pathname,
    header: {
      title:
        "RL Excursions during Pretraining: How early is too early for On-policy Learning?",
      // Edit authors and affiliations for your paper.
      authors: [
        { name: "Rachit Bansal*", url: "https://rachitbansal.github.io/", affils: ["harvard"], line: 1 },
        { name: "Clara Mohri*", url: "https://cmohri.github.io/", affils: ["harvard"], line: 1 },
        { name: "Tian (Sunny) Qin*", url: "https://sunnytqin.github.io/", affils: ["harvard"], line: 1 },
        { name: "David Alvarez-Melis†", url: "https://dmelis.github.io/", affils: ["harvard"], line: 2 },
        { name: "Sham Kakade†", url: "https://shamulent.github.io/", affils: ["harvard"], line: 2 },
      ],
      affiliations: [
        "* Equal contribution",
        "† Equal advising",
      ],
      correspondence: "Correspondence: {rachitbansal, tqin, cmohri}@g.harvard.edu",
      date: " ", // e.g. "2025" or "Under review"
    },
  };
};
