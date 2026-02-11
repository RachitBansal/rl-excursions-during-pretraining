# RL Excursions during Pre-training

Blog and project site for the paper:

**"RL Excursions during Pre-training: How early is too early for On-policy Learning?"**

We study when and how to introduce reinforcement learning (RL) objectives during LLM training. The blog summarizes our findings on RL applied to intermediate pretraining checkpoints, sharpening vs. distribution expansion, and rollout budget trade-offs.

## Running the blog locally

This site is built with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/).

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Project structure

- **`src/maintext/rl_excursions.md`** – Main blog post (narrative version of the paper). Edit this file to add content.
- **`src/routes/+page.svelte`** – Home page; renders the blog post.
- **`src/routes/+layout.ts`** – Site layout and header (title, authors, affiliations, date). Update here when you add author names and affiliations.
- **`src/lib/components/`** – Reusable UI (Header, Markdown, Seo, etc.).
- **`static/assets/figures/`** – Images and figures. Paper figures (e.g. from `assets/figures/` at repo root) can be copied here and referenced in the markdown.
- **`src/routes/isoflops/`** – Legacy IsoCompute post route. You can remove this route and its content when you no longer need it.

## Build and deploy

```bash
npm run build
```

Static output is in `build/` (or as configured by your SvelteKit adapter). Deploy that folder to GitHub Pages, Vercel, or any static host.
