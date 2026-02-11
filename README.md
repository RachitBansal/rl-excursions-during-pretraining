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

## Institution logos in the header

Logos appear next to author names and in the affiliation line. To set them up:

1. **Add the logo image**  
   Put your logo file in `static/assets/figures/`, e.g. `harvard.png`. Use PNG or SVG; keep it small (roughly 50–80px tall) for a sharp look.

2. **Register the logo in the header**  
   In `src/lib/components/Header.svelte`, add an entry to `logoMap` and to `affiliationLogoMap`:
   ```js
   // In logoMap:
   harvard: { src: "/assets/figures/harvard.png", alt: "Harvard University" },
   // In affiliationLogoMap (use the exact string you put in +layout.ts):
   "Harvard University": logoMap.harvard,
   ```
   Optional: add a class like `affil-logo--harvard` on the `<img>` and a style `.affil-logo--harvard { height: 18px; }` to tune size.

3. **Use it in the layout**  
   In `src/routes/+layout.ts`, set each author’s `affils` to the key you used (e.g. `["harvard"]`), and include the full affiliation string in `affiliations` (e.g. `"Harvard University"`) so the legend shows the logo too.

**Harvard is already wired up.** Add `static/assets/figures/harvard.png` (e.g. from your university’s brand assets) and the logos will show.
- **`src/routes/isoflops/`** – Legacy IsoCompute post route. You can remove this route and its content when you no longer need it.
- **`BLOG_STRUCTURE.md`** (repo root) – Map of paper sections to blog files and where to edit. Kept in root so `npm run build` doesn’t overwrite it (build output goes to `docs/`).

## Build and deploy

The site is built as **static files** (SvelteKit `adapter-static`). Output goes to the **`docs/`** folder.

```bash
npm run build
```

### Option A: GitHub Pages (from this repo)

Your config already outputs to `docs/`, which GitHub Pages can serve from the same repo.

1. **Build** the site (use `GITHUB_PAGES=1` so asset paths work when served from `.../rl-excursions-during-pretraining/`):
   ```bash
   GITHUB_PAGES=1 npm run build
   ```
2. **Commit and push** the `docs/` folder:
   ```bash
   git add docs
   git commit -m "Publish blog"
   git push
   ```
3. **Turn on GitHub Pages**: Repo → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main` (or your default), Folder: **/docs** → Save.
4. The site will be at `https://<your-username>.github.io/rl-excursions-during-pretraining/` (or your custom domain if you set one).

After the first time, run `npm run build` and commit/push `docs/` whenever you update the blog.

### Option B: Vercel

1. Push the repo to GitHub and go to [vercel.com](https://vercel.com).
2. **Import** the repo. Vercel will detect SvelteKit.
3. **Build settings**: Build command `npm run build`, output directory is **not** `docs` for Vercel—you’d use the default SvelteKit output. So either:
   - Temporarily change `svelte.config.js` to use the default adapter output (no `pages`/`assets`), then deploy; or
   - In Vercel, set **Output Directory** to `docs` if you keep the current config.
4. Deploy. Vercel will give you a URL and redeploy on each push.

### Option C: Netlify

1. Push to GitHub, then at [netlify.com](https://netlify.com): **Add new site** → **Import from Git**.
2. Build command: `npm run build`. Publish directory: **docs**.
3. Deploy. You’ll get a URL; you can add a custom domain in site settings.
