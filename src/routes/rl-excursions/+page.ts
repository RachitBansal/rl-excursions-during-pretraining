import { base } from "$app/paths";
import textRaw from "../../maintext/rl_excursions.md?raw";

export function load() {
  // Prefix with base so images work: local (base="") -> /assets/figures/; GitHub Pages (base="/rl-excursions-during-pretraining") -> full path.
  const prefix = base ? base : "";
  const text = textRaw.replace(
    /src="\/assets\/figures\//g,
    `src="${prefix}/assets/figures/`
  );
  return { text };
}
