const prerender = true;
const trailingSlash = "always";
const load = async ({ url }) => {
  return {
    pathname: url.pathname,
    header: {
      title: "RL Excursions during Pre-training: How early is too early for On-policy Learning?",
      // Edit authors and affiliations for your paper.
      authors: [
        { name: "Rachit Bansal*", url: "https://rachitbansal.github.io/", affils: ["harvard"], line: 1 },
        { name: "Clara Mohri*", url: "https://claramohri.github.io/", affils: ["harvard"], line: 1 },
        { name: "Tian (Sunny) Qin*", url: "https://sunnytqin.github.io/", affils: ["harvard"], line: 1 },
        { name: "David Alvarez-Melis†", url: "https://dmelis.github.io/", affils: ["harvard"], line: 2 },
        { name: "Sham Kakade†", url: "https://shamulent.github.io/", affils: ["harvard"], line: 2 }
      ],
      affiliations: [
        "* Equal contribution",
        "† Equal advising"
      ],
      correspondence: "Correspondence: {rachitbansal, tqin, cmohri}@g.harvard.edu",
      date: " "
      // e.g. "2025" or "Under review"
    }
  };
};
export {
  load,
  prerender,
  trailingSlash
};
