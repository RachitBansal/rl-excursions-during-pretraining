# Blog structure (RL Excursions paper)

This file maps the repository layout to the paper so you can add content easily.

## Where to edit

| What | File / location |
|------|------------------|
| **Blog post body** | `src/maintext/rl_excursions.md` |
| **Site title, authors, date** | `src/routes/+layout.ts` → `header` |
| **SEO title/description** | `src/routes/+page.svelte` → `<Seo>` |
| **Figures** | Put in `static/assets/figures/`, reference in markdown as `/assets/figures/your_figure.png` |

## Paper → blog sections (in `rl_excursions.md`)

The placeholder `rl_excursions.md` is already split into:

1. **Abstract** – One-paragraph summary.
2. **§1 Introduction** – Motivation, off-policy vs on-policy, main question.
3. **§2 Methodology** – Pretraining checkpoints, three methods (RL-only, SFT-only, SFT→RL), data (OpenMathInstruct, GSM8K, MATH), pass@k.
4. **§3 Main results**
   - 3.1 RL effective early (e.g. 4B tokens), GSM8K vs MATH.
   - 3.2 Sharpening (SFT→RL) vs expansion (direct RL on $M_t$).
5. **§4 RL rollouts** – Sparse rewards, $n$ (rollouts per prompt), sample vs compute efficiency.
6. **§5 Discussion** – Early RL as proof-of-concept, future directions.
7. **References** – Citations.

Add your narrative and figures section by section; the Markdown component supports math (e.g. `$M_t$`) and your existing syntax (see `COLOR_SYNTAX.md` if you use it).

## Optional cleanup

- **Remove IsoCompute content**: Delete `src/routes/rl-excursions/` and optionally `src/maintext/iso_compute_final0.md` if you no longer need that post.
- **Favicon**: Replace `static/assets/figures/isocompute_ico.jpg` and update `src/app.html` if you want a custom icon.
