import type { LayoutLoad } from "./$types";

export const prerender = true;
export const trailingSlash = "always";

export const load: LayoutLoad = async ({ url }) => {
  return {
    pathname: url.pathname,
    header: {
      title:
        "RL Excursions during Pre-training: How early is too early for On-policy Learning?",
      // Edit authors and affiliations for your paper.
      authors: [
        { name: "Rachit Bansal*", affils: ["harvard"] },
        { name: "Clara Mohri*", affils: ["harvard"] },
        { name: "Tian (Sunny) Qin*", affils: ["harvard"] },
        { name: "David Alvarez-Melis", affils: ["harvard"] },
        { name: "Sham Kakade", affils: ["harvard"] },
      ],
      affiliations: [
        "Harvard University",
        "Kempner Institute at Harvard",
        "* Equal contribution",
      ],
      date: " ", // e.g. "2025" or "Under review"
    },
  };
};
