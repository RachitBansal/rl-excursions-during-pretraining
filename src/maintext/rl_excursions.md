<!-- ---
title: "RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?"
subtitle: "When can a language model start learning from its *own* generations?"
authors:
  - "Anonymous authors"
date: "2026-02-11"
tags: [llm-training, reinforcement-learning, reasoning, grpo, rlvr, pretraining]
--- -->

<!--
This post is a blog-style adaptation of the paper:
"RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?"
Replace placeholder figure links in `assets/` with real images exported from the paper.
-->

<!-- # RL excursions during pre-training: how early is *too* early for on-policy learning? -->

<figure>
  <img src="docs/assets/figures/figure_1.png" alt="Overview figure placeholder showing early RL works, expansion vs sharpening, and rollout budget tradeoffs." width="100%"/>
  <figcaption><strong>Figure 1.</strong> A one-picture summary: RL works surprisingly early; RL can <em>expand</em> or <em>sharpen</em> the output distribution depending on the pipeline; rollout count trades off sample-efficiency vs FLOP-efficiency.</figcaption>
</figure>

TEST

Modern LLM training usually looks like this:

> **Pretrain (next-token prediction)** → **SFT (next-token prediction)** → **RL (on-policy)**

This separation raises a simple question that we don’t often test directly:

**When does a model become capable of learning from its own generations?**

In this post we run a controlled case study on math reasoning, where rewards are unambiguous, and ask:

> **How and when should an RL objective be used in LLM training?**

---

## TL;DR

- **RL can work *much earlier* than standard practice.** On GSM8K-style math, running RL directly on intermediate pretraining checkpoints boosts accuracy even when the model is still “under-trained” by standard scaling-law heuristics.
- **RL-only can match the “gold standard” SFT→RL pipeline (sometimes).** On GSM8K, direct RL on the base checkpoint reaches performance comparable to SFT→RL once the model has seen enough pretraining tokens.
- **RL doesn’t always just “sharpen.”** In our setting, RL directly on the base model tends to improve both pass@1 *and* pass@k (distribution **expansion**), while RL after SFT often improves pass@1 but hurts pass@k (distribution **sharpening**).
- **More rollouts aren’t always better.** Increasing GRPO rollouts per prompt improves *sample efficiency* but can be *worse per FLOP*, especially when rewards are sparse.

If you only remember one thing: **“Post-training” might not need to wait until *after* pretraining.**

---

## Table of contents

- [The puzzle: off-policy vs on-policy training](#the-puzzle-off-policy-vs-on-policy-training)
- [Experimental setup in one page](#experimental-setup-in-one-page)
- [Result 1: RL is effective early in pretraining](#result-1-rl-is-effective-early-in-pretraining)
- [Result 2: RL can expand or sharpen the output distribution](#result-2-rl-can-expand-or-sharpen-the-output-distribution)
- [Result 3: rollout budgets under sparse rewards](#result-3-rollout-budgets-under-sparse-rewards)
- [Practical takeaways](#practical-takeaways)
- [Limitations and open questions](#limitations-and-open-questions)
- [Citation](#citation)
- [Appendix: additional training curves and ablations](#appendix-additional-training-curves-and-ablations)

---

## The puzzle: off-policy vs on-policy training

Pretraining and supervised fine-tuning (SFT) optimize the **next-token prediction** objective. Conceptually, that’s an *off-policy* regime: the model is trained to imitate a fixed dataset.

Reinforcement learning (RL), in contrast, is **on-policy**: the model samples outputs from itself, gets feedback, and updates to increase reward.

So the transition from SFT to RL is a big change:

- from *imitation* → to *self-generated data*
- from *dense token-level supervision* → to *sparse outcome-level supervision* (at least in the RLVR setting we study)

That makes the following question natural:

> **At what point during pretraining does the model’s self-generated data become good enough that on-policy learning helps rather than hurts?**

Math is a clean testbed because the reward can be **verifiable** (did the final answer match?).

---

## Experimental setup in one page

### What we trained

We pretrain a **1B-parameter** decoder-only model (OLMo2 architecture) from scratch on **50B tokens** of a high-quality mixture (DOLMino, from OLMo2), saving intermediate checkpoints throughout. We then take checkpoints and run different “post-training” pipelines *from each checkpoint*.

<details>
<summary><strong>Pretraining details (click to expand)</strong></summary>

- **Architecture:** OLMo2 1B
- **Tokens:** 50B total (≈ 2.5× Chinchilla-optimal token count for this model size)
- **Optimizer:** AdamW with cosine LR decay, peak LR 4e-4
- **Seq length:** 4096
- **Batch size:** 512
- **Data mixture (DOLMino high-quality):** includes Wikipedia, high-quality web, ~20% math, plus code/reasoning sources

</details>

### Three training pipelines

Let **M<sub>t</sub>** be the base checkpoint after *t* pretraining steps/tokens.

We compare:

1. **RL only:**  
   **M<sub>t</sub> → M<sub>t</sub><sup>RL</sup>**  
   Run RL directly on the base checkpoint.

2. **SFT only:**  
   **M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup>**  
   Train on ground-truth solutions (teacher-written reasoning traces).

3. **Gold-standard pipeline:**  
   **M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup> → M<sub>t</sub><sup>SFT→RL</sup>**  
   SFT then RL, which is the typical modern recipe.

Here’s a diagram you can paste into any Mermaid-enabled renderer:

```mermaid
flowchart LR
  Mt["M_t (pretraining checkpoint)"] -->|RLVR (GRPO)| MRL["M_t^RL (RL-only)"]
  Mt -->|SFT on solutions| MSFT["M_t^SFT (SFT-only)"]
  MSFT -->|RLVR (GRPO)| MSFTRL["M_t^(SFT→RL) (standard pipeline)"]
```

### RL objective: RLVR with GRPO

We use **Reinforcement Learning from Verifiable Rewards (RLVR)** with **GRPO**: the model generates solutions and receives a reward based on whether the final answer is correct (plus a formatting reward so models learn to follow the expected answer format).

### Data and evaluation

- **Training data:** OpenMathInstruct (math questions with multiple ground-truth solutions)
  - We use either (a) a GSM8K-like subset or (b) the full MATH-heavy mix.
- **Benchmarks:** GSM8K and MATH
- **Metric:** pass@k for k ∈ {1, 8, 32} at temperature T = 0.6  
  (probability that at least one of k samples is correct)

<details>
<summary><strong>Why pass@k? (and how to read it)</strong></summary>

- **pass@1** ≈ “How often the model’s first answer is correct.”
- **pass@32** ≈ “If you sample 32 times and take the best, how often do you get at least one correct answer?”

pass@k is a nice lens because it separates:
- improvements due to better *typical* behavior (pass@1), and
- improvements due to better *coverage* / diversity of correct reasoning paths (larger k).

</details>

### A small evaluation gotcha (important!)

Early pretraining checkpoints don’t reliably follow instruction formatting. To evaluate base checkpoints fairly:

- **Base checkpoints M<sub>t</sub>** are evaluated with **8-shot** prompting (few-shot examples teach the format).
- **All trained models (SFT/RL variants)** are evaluated **0-shot**, because they learn the format during training.

---

## Result 1: RL is effective early in pretraining

Let’s start with the simplest question:

> **If you take an early checkpoint and run RL, does anything good happen?**

### GSM8K: yes — and surprisingly early

On GSM8K-style training, RL on early checkpoints produces large gains.

<figure>
  <img src="/assets/figures/gsm_passatk_comparison.png" alt="Placeholder for GSM8K pass@1, pass@8, pass@32 vs pretraining tokens for base, RL-only, SFT-only, and SFT→RL." width="100%"/>
  <figcaption><strong>Figure 2.</strong> GSM8K results across checkpoints. RL-only improves early and can match SFT→RL after enough pretraining.</figcaption>
</figure>

One striking data point: **at ~4B pretraining tokens**, RL raises GSM8K **pass@1** from about **2% → 18%**.

Even more interesting: once the checkpoint is later (≈10B+ tokens), **RL-only is competitive with the standard SFT→RL pipeline**.

### Why that’s surprising

RL-only never trains on ground-truth reasoning traces. It only sees:
- its *own* generated solutions, and
- a reward for correctness (plus format).

Yet it can match a pipeline that explicitly trains on solutions.

A practical implication is that **ground-truth solution traces may not be strictly necessary** to unlock certain reasoning behaviors, as long as you can supply a *verifiable* reward.

### MATH: RL helps, but hits a ceiling

Now for the harder benchmark.

<figure>
  <img src="/assets/figures/math_passatk_comparison.png" alt="Placeholder for MATH pass@k results vs pretraining tokens. RL-only improves but lags SFT and SFT→RL." width="100%"/>
  <figcaption><strong>Figure 3.</strong> MATH results. RL-only improves over the base checkpoint but doesn’t catch up to SFT or SFT→RL on this harder distribution.</figcaption>
</figure>

On MATH-heavy training, RL still improves over the base model — but **does not reach** the performance of SFT or SFT→RL at later checkpoints.

One interpretation: **on-policy learning from self-generated traces has limits when the task is too hard**, because early samples contain too few correct trajectories to learn from.

That observation motivates the next two sections: what RL is doing to the output distribution, and how rollout budgets affect sparse-reward learning.

---

## Result 2: RL can expand or sharpen the output distribution

A recurring claim in recent RLVR work is:

> RL mostly **sharpens** — it improves pass@1, but doesn’t increase pass@k for large k.

We test this claim and find: **it depends.**

### Two behaviors

We’ll use these terms:

- **Sharpening:** pass@1 improves, pass@k (large k) doesn’t improve (or even decreases).  
  *Intuition:* the model concentrates probability mass on a smaller set of solutions.

- **Expansion:** pass@1 and pass@k both improve.  
  *Intuition:* the model discovers more correct “modes” — new successful reasoning paths.

### Standard pipeline (SFT→RL) tends to sharpen

When RL comes *after* SFT, we often see:

- pass@1 goes up,
- pass@32 goes down a bit.

<figure>
  <img src="/assets/figures/gsm8k_rl_train_dynamics_comparison.png" alt="Placeholder: training dynamics showing sharpening in SFT→RL and expansion in RL-only." width="100%"/>
  <figcaption><strong>Figure 4.</strong> Training dynamics. Left: SFT→RL shows sharpening (pass@1 up, pass@32 down during RL). Right: RL-only shows expansion (both pass@1 and pass@32 up).</figcaption>
</figure>

### RL-only tends to expand (in our setting)

When we run RL directly on the base checkpoint, we consistently see **pass@32 improve**, suggesting **expansion**.

A plausible explanation:

- After SFT, the model has already been shown ground-truth solutions for the same training questions.
- RL then mainly “locks in” the highest-reward paths it already knows, reducing exploration/diversity (sharpening).
- Without SFT, RL must explore more to find reward at all — and in doing so, it can discover new successful traces (expansion).

### A caution: early RL can be brittle

This is not all upside. RL-only on *very early* checkpoints is **unstable across random seeds**.

<figure>
  <img src="/assets/figures/gsm8k_seed_rewards.png" alt="Placeholder: early checkpoint RL seed brittleness—training reward similar, but test pass@k diverges." width="100%"/>
  <figcaption><strong>Figure 7.</strong> Seed brittleness at early checkpoints: training reward can look similar while test performance diverges sharply.</figcaption>
</figure>

What this suggests is subtle but important:

- **Training reward is not always a reliable proxy** for “real” reasoning improvements when the base model is weak.
- Early on-policy learning may latch onto superficial patterns that maximize reward on the training distribution without learning robust reasoning.

---

## Result 3: rollout budgets under sparse rewards

Early checkpoints suffer from a basic problem: **reward sparsity**.

If the model almost never produces a correct solution, then the RL signal becomes:
- sparse (few positives),
- noisy (high-variance gradients),
- and potentially misleading (format hacks, memorization, etc.).

A natural knob in GRPO is **n = number of rollouts per prompt**.

> If correct solutions are rare, maybe sampling more rollouts per prompt makes learning possible?

### The experiment

We simulate “early” vs “late” competence by splitting the GSM8K-like training set into:

- **GSM8K-Easy:** prompts where the base model already gets many correct samples (16–64 correct out of 64 rollouts).
- **GSM8K-Hard:** prompts where the base model gets few correct samples (≤8 correct out of 64 rollouts).

Then we run RL with:
- **n = 5** rollouts per prompt, vs
- **n = 64** rollouts per prompt,

and measure GSM8K test pass@k as a function of:
- **samples seen**, and
- **FLOPs**.

<figure>
  <img src="/assets/figures/gsm8k_rollouts_p1-2.png" alt="Placeholder: effect of rollouts on pass@1 and pass@8 vs FLOPs and vs samples." width="100%"/>
  <figcaption><strong>Figure 5.</strong> Rollout scaling trade-offs. More rollouts improves sample efficiency, but fewer rollouts can be more FLOP-efficient—especially on the hard split.</figcaption>
</figure>

### What we learned

Three takeaways:

1. **Asymptotic performance is similar.** Both n=5 and n=64 often converge to similar best pass@k.
2. **n=64 is more sample-efficient.** You learn faster per training example (per prompt).
3. **n=5 can be more FLOP-efficient.** Especially early in training and on harder splits where reward is sparse, spending compute on *more prompts* (not more rollouts per prompt) wins.

This lines up with an intuition from exploration: when rewards are rare, it can be better to **see more states** rather than spend many samples on the same state.

---

## Practical takeaways

If you’re training reasoning models with RLVR today, here’s what this study suggests.

### 1) “RL readiness” comes earlier than you think (for some tasks)

For GSM8K-like math with verifiable rewards, on-policy learning starts paying off *very early* in pretraining. You don’t necessarily need to wait for a fully-finished base model.

### 2) Track pass@k, not just pass@1

If you only look at pass@1, you can miss whether RL is:

- **sharpening** (maybe good for deterministic deployment), or
- **expanding** (good for best-of-k / tool-assisted settings).

### 3) Expect brittleness on weak checkpoints

If you try RL very early:
- run multiple seeds,
- use validation metrics that correlate with generalization,
- and watch for “reward without reasoning” failure modes.

### 4) Don’t blindly scale rollouts per prompt

If your budget is fixed, **n is a trade-off**:

- increase n when you need *sample efficiency* (limited dataset, limited prompts),
- decrease n when you care about *FLOP efficiency* (limited compute) or want broader coverage across prompts.

---

## Limitations and open questions

This study is intentionally narrow: it’s a controlled probe of *when* RL can help, not a full replacement recipe for pretraining.

Some important limitations:

- **Task scope:** math reasoning with verifiable rewards is unusually clean.
- **Data mixture:** our base model is pretrained on a corpus that includes a substantial fraction of math/reasoning content; “RL readiness” may shift with pretraining mix.
- **Model scale:** results are from a 1B model; larger models may show different transitions.
- **Algorithm scope:** we used RLVR with GRPO; other RL algorithms or denser rewards (e.g., process reward) could change the picture.

Open directions we’re excited about:

- **Mixing RL into pretraining:** can we interleave RL and next-token prediction in a stable way?
- **Curricula for early RL:** can we schedule task difficulty (or reward shaping) so early checkpoints don’t get stuck?
- **Understanding expansion vs sharpening:** when does RL discover new modes vs collapse onto existing ones?
- **Generalization beyond math:** what are the right “verifiable rewards” in other domains?

---



---

## Appendix: additional training curves and ablations

These plots are useful for readers who want to sanity-check training stability and evaluation choices.

<details>
<summary><strong>RL training convergence across checkpoints (Figure 6)</strong></summary>

<figure>
  <img src="/assets/figures/gsm8k_rl_sft_comparison.png" alt="Placeholder: RL train/val reward and GSM8K pass@1 over RL steps for multiple pretraining checkpoints." width="100%"/>
  <figcaption><strong>Figure 6.</strong> RL reward curves (train/val) and GSM8K pass@1 over RL steps show convergence across checkpoints.</figcaption>
</figure>

</details>

<details>
<summary><strong>SFT convergence (Figure 8)</strong></summary>

<figure>
  <img src="/assets/figures/appx_fixB_easy.png" alt="Placeholder: SFT epoch comparison (5 vs 10 epochs) showing convergence across checkpoints on GSM8K pass@k." width="100%"/>
  <figcaption><strong>Figure 8.</strong> SFT epoch ablation indicates performance converges by ~5 epochs.</figcaption>
</figure>

</details>

<details>
<summary><strong>How we evaluate base checkpoints (Figure 9)</strong></summary>

<figure>
  <img src="/assets/figures/gsm8k_base_eval_shots.png" alt="Placeholder: n-shot prompting ablation (0/1/8-shot) for evaluating base checkpoints on GSM8K and MATH pass@k." width="100%"/>
  <figcaption><strong>Figure 9.</strong> Few-shot prompting ablation for base checkpoints: 8-shot yields the strongest evaluation performance.</figcaption>
</figure>

</details>

## Citation

If you build on this work, please cite the accompanying paper:

```bibtex
@article{anonymous2026rlexcursions,
  title   = {RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?},
  author  = {Anonymous Authors},
  journal = {Under review},
  year    = {2026}
}
```

---

*If you want to adapt this markdown for a project page (like a GitHub Pages site), you can:*
- export your plots from the paper into `assets/`,
- replace the placeholders,
- and optionally add interactive plot embeds (Plotly/Observable) for Figures 2–5.
