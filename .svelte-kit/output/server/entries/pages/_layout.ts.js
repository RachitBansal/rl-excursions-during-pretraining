const prerender = true;
const trailingSlash = "always";
const load = async ({ url }) => {
  return {
    pathname: url.pathname,
    header: {
      title: "RL Excursions during Pre-training: How early is too early for On-policy Learning?",
      // Edit authors and affiliations for your paper.
      authors: [
        { name: "Rachit Bansal*", affils: ["harvard"] },
        { name: "Tian (Sunny) Qin*", affils: ["harvard"] },
        { name: "Clara Mohri*", affils: ["harvard"] },
        { name: "David Alvarez-Melis", affils: ["harvard"] },
        { name: "Sham Kakade", affils: ["harvard"] }
      ],
      affiliations: [
        "Harvard University",
        "Kempner Institute at Harvard",
        "* Equal contribution"
      ],
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
