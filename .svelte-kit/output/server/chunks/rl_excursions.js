const textRaw = `![We analyze the effect of RL across intermediate pretraining checkpoints](/assets/figures/figure_1.gif "Figure 1. We analyze the effect of RL across intermediate pretraining checkpoints $\\mathcal{M}_t$ and across two settings: RL directly on the base model (**RL Only**; $\\mathcal{M}_t^{\\text{RL}}$), and RL after SFT (**Standard Pipeline**; $\\mathcal{M}_t^{\\text{SFT}\\rightarrow\\text{RL}}$). We observe: (1) On-policy learning is effective starting very early during standard pretraining. $\\mathcal{M}_t^{\\text{RL}}$ models show significant improvement in both $\\texttt{pass@1}$ and $\\texttt{pass@k}$ metrics as soon as $2\\text{K}$ steps ($\\sim 4\\text{B}$ tokens) of pretraining. (2) In line with prior work, $\\mathcal{M}_t^{\\text{SFT}\\rightarrow\\text{RL}}$ improves pass@1 performance over $\\mathcal{M}_t^{\\text{SFT}}$, but harms $\\texttt{pass@32}$ suggesting sharpening. (3) In contrast, $\\mathcal{M}_t^{\\text{RL}}$ consistently leads to an increase in $\\texttt{pass@32}$ performance suggesting that RL can actually expand the model distribution to learn new capabilities.")


<!-- ## TL;DR

Modern LLM training usually looks like this:

> **Pretraining** → **Supervised fine-tuning (SFT)** → **Reinforcement Learning (RL) via verfiable rewards**

where, pre-training and SFT employ a next-token prediction (NTP) objective on a static external dataset ("off-policy"). While, RL employs a policy optimization objective on the LLM generations ("on-policy").

The use of two distinct training objectives raises a basic but underexplored question
> **At what point during training does an LLM become capable of learning from its own generations (i.e., on-policy)?**
 -->

<!-- ## Rethinking the Training Pipeline -->

As of February 2026, Large Language Model (LLM) training follows a standard pipeline: **pretraining** $\\rightarrow$ **supervised fine-tuning** (**SFT**) $\\rightarrow$ **reinforcement learning** (**RL**) via verifiable rewards[^ouyang2022]. These stages contrast in their objectives: Pretraining and SFT employ a Next-Token Prediction (NTP) objective on a static external dataset ("off-policy"). Whereas RL employs a policy optimization objective on the model's own generations ("on-policy").



The use of two distinct training objectives raises several interesting but underexplored questions. In this work we systematically investigate this transition between off-policy and on-policy training objectives, asking: 

> **How and when should we be using an RL objective during LLM training?**

Furthermore, there has been a recent growing interest in applying RL earlier in training[^arxiv-org-2510-01265] [^arxiv-org-2509-19249] [^arxiv-org-2512-03442]. As a precursor, we ask concretely: *at what point during pretraining does the model's self-generated data become good enough that on-policy learning actually yields meaningful gradient signals?*

To answer these questions, we perform a rigorous case study of on-policy learning with a focus on LLM reasoning capabilities.
We pretrain an LLM from scratch on a high-quality, reasoning heavy corpus, and sample several intermediate pre-training checkpoints. We perform RL on the base pre-training checkpoints and study these models in comparison with (i) SFT on the base checkpoints, and (ii) the standard SFT $\\rightarrow$ RL pipeline.
For all our experiments, we use math reasoning as a testbed since it provides a clean setting with unambiguous and verifiable rewards.
<!-- , and outcome-based RL methods like GRPO are known to work well (at least in post-training). But we're hoping the lessons we learn here generalize to other RL-training scenarios.  -->
In a nutshell, we derive the following insights:
- **Models start to learn from their own generations very early in training**. That is, RL is effective surprisingly early in pretraining. Training with RL significantly improves performance across datasets and metrics prior to pretraining on a large number of tokens.
- **RL can lead to expansion of the output distribution.** Contrary to recent findings that RL only sharpens the output distribution, we find that early stage RL considerably improves pass@k performance, indicating that "expansion". We find that the sharpening vs. expansion effect with RL depends on the training pipelines.
- **Effect of number of rollouts at different stages of model training.** Early pre-training checkpoints might yield sparse or noisy reward. We observe that a larger number of rollouts provides diminishing returns with compute and fewer rollouts could in fact be
more FLOP-efficient.

Together, our findings demonstrate the feasibility of
applying RL objectives to what would typically be considered “under-trained” models suggesting that early-stage RL objectives may be effective in improving downstream performance.

---
## Experimental Setup

### Pretraining checkpoints

We pretrain a **1B-parameter** decoder-only model (OLMo2 architecture[^arxiv-org-2501-00656]) from scratch on **50B tokens** of a high-quality mixture (DOLMino, from OLMo2), saving intermediate checkpoints throughout. We then take these checkpoints and run different "post-training" pipelines *from each checkpoint*.

<details>
<summary>Pretraining details</summary>

- **Architecture:** OLMo2 1B
- **Tokens:** 50B total (≈ 2.5× Chinchilla-optimal[^arxiv-org-2203-15556] token count for this model size)
- **Optimizer:** AdamW with cosine LR decay, peak LR 4e-4
- **Seq length:** 4096
- **Batch size:** 512
- **Data mixture (DOLMino high-quality):** Wikipedia, high-quality web, ~20% math, plus code/reasoning sources

</details>

### Three training pipelines

Let **M<sub>t</sub>** be the base checkpoint after *t* pretraining steps/tokens. We compare three distinct training pipelines:

1. **RL only:** M<sub>t</sub> → M<sub>t</sub><sup>RL</sup>
   We run RL (GRPO) directly on the base checkpoint.

2. **SFT only:** M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup>
   We train on ground-truth solutions (teacher-written reasoning traces) using the NTP objective. We use the *same questions* as in RL, but here the model learns from expert demonstrations.

3. **Standard pipeline:** M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup> → M<sub>t</sub><sup>SFT→RL</sup>
   Taking SFT from above, we then apply RL. This is the typical modern recipe and our gold-standard baseline.

### Data and evaluation

**Training data:** For both RL and SFT, we use [OpenMathInstruct](https://huggingface.co/datasets/nvidia/OpenMathInstruct-1)[^toshniwal2024]—a dataset of math questions with multiple ground-truth solutions per question.

**Benchmarks:** We evaluate on GSM8K[^arxiv-org-2110-14168] (grade-school math) and MATH[^hendrycks2021] (competition-level problems).

**Metrics:** We report pass@k for k ∈ {1, 8, 32} at temperature T = 0.6.

> **What is pass@k?** pass@1 measures how often the model gets the right answer on its first try. pass@k (for k > 1) measures whether *any* of k sampled solutions is correct, telling us about the upperbound on model's reasoning capabilities.


<details>
<summary>Details on OpenMathInstruct</summary>

OpenMathInstruct consists of math questions with multiple ground-truth solutions per question. In **SFT**, we train on the provided solutions from the dataset. In **RL**, the model generates its own solutions and receives reward based on whether the final answer is correct.

The dataset contains two main categories:
- **Majority:** Questions inspired by the MATH dataset—challenging competition-level problems
- **Minority:** Questions inspired by GSM8K—grade-school level math problems

</details>

<details>
<summary>Note on evaluating base checkpoints</summary>

Pretraining checkpoints don't reliably follow instruction formatting, so we need to evaluate them differently. We care about the model's *reasoning ability*, not its instruction-following ability.

- **Base checkpoints (M<sub>t</sub>):** Evaluated with **8-shot** prompting (few-shot examples teach the format)
- **All trained models (SFT/RL):** Evaluated **0-shot** (they learn the format during training)

</details>

## Result 1: RL works surprisingly early.

Let's look at what happens when we run RL directly on early pretraining checkpoints.

### Direct-RL competes with the gold standard pipeline on GSM8K.

![GSM8K results across checkpoints](/assets/figures/gsm_passatk_comparison.png "Figure 2. GSM8K results across checkpoints. RL-only improves early and can match SFT→RL after enough pretraining.")

We are seeing very promising results on GSM8K. As early as **4B pretraining tokens**, running RL gives us meaningful improvements. For example, pass@1 accuracy jumps from ~2% (base checkpoin, M<sub>t</sub>) to ~18% (after RL, M<sub>t</sub><sup>RL</sup>).  What makes this especially interesting is that 4B tokens is *before* we've even hit the Chinchilla-optimal[^arxiv-org-2203-15556] token count (i.e., 20B) for this model size. In other words, RL is helping even when the model is still pretty "under-trained" by conventional standards.

**More importantly, RL-only competes with the standard pipeline.** By the time we've pretrained on 10B+ tokens, the RL-only model actually *outperforms* the SFT-only model on pass@1, and performs on par with the full SFT→RL pipeline (M<sub>t</sub><sup>SFT→RL</sup>, the gold-standard baseline).

We are quite surprised by this results because the RL-only model M<sub>t</sub><sup>RL</sup> never trains on ground-truth reasoning traces. It only sees its own generated solutions, and a reward signal for whether the final answer is correct. Yet it matches or outperforms the performance of models that explicitly train on expert-written solutions. This suggests that **ground-truth solution traces may not be strictly necessary or even optimal** to unlock certain reasoning behaviors. A pretraining model can happily bootstrap its way there from self-generated attempts.

We also see significant improvements in pass@k for k=8 and k=32, which we'll dig into more in the next section (add link here).

### Limitations on MATH. 

![MATH results across checkpoints](/assets/figures/math_passatk_comparison.png "Figure 3. MATH results. RL-only improves over the base checkpoint but doesn't catch up to SFT or SFT→RL on this harder distribution.")

The story on MATH is more nuanced. We still consistently see 5-10% improvements in pass@1, pass@8, and pass@32 over the base checkpoints. 
But on MATH, RL-only (M<sub>t</sub><sup>RL</sup>) never quite catches up to SFT or the standard SFT→RL pipeline (M<sub>t</sub><sup>SFT→RL</sup>). The gap persists even as we continue pretraining. MATH problems are significantly harder than GSM8K (competition-level vs. grade-school), and it seems like training purely on on-policy data from early checkpoints has its limits. The model's self-generated solutions might not be diverse or correct enough to bootstrap strong reasoning on really challenging problems.

Is this a fundamental limitation of the approach, or could we fix it with more data or a larger model? We are currently investigating this!

**Result 1 takeaway:** RL from early checkpoints is effective, but task difficulty matters. For easy problems, it can match the standard pipeline. For harder problems, there's still a gap.



---
## Result 2: Can we settle the long-time RL debate, sharpening or expansion?

One of the heated debates in recent work is what RL actually *does* to a model's output distribution. Many works[^arxiv-org-2507-14843] [^yue2025] claim that RL only sharpens the distribution without teaching any new reasoning behaviors. 


We can think about RL's effect in two ways:

- **Sharpening:** pass@1 improves, but pass@k (for large k) doesn't improve and sometimes it can even decrease. In other words, the model concentrates probability mass on a smaller set of solutions. It's getting more confident about specific paths, but not discovering new ones.

- **Expansion:** Both pass@1 and pass@k improve together. This indicates that the model discovers more correct new successful reasoning paths it didn't have before.

Recent work has claimed that RL mostly just *sharpens* the distribution without giving the model genuinely new reasoning capabilities. But we found that **whether RL has a sharpening or expansion effect depends on the training pipeline.**

![Training dynamics: sharpening vs expansion](/assets/figures/gsm8k_rl_train_dynamics_comparison.png "Figure 4. Training dynamics. Left: SFT→RL shows sharpening (pass@1 up, pass@32 down during RL). Right: RL-only shows expansion (both pass@1 and pass@32 up).")

### Standard pipeline (SFT→RL) tends to sharpen


When RL comes *after* SFT, we reproduce the sharpening effect that others have observed that pass@1 continues to improve during RL while pass@32 actually decreases slightly during RL (after increasing during SFT).
**We hypothesize that** during SFT, the model has already seen ground-truth solutions for these exact questions. So when RL kicks in, it's mostly refining and concentrating around the reasoning paths it learned during SFT, rather than discovering new ones.

### RL-only tends to expand

When we run RL directly on the base checkpoint (skipping SFT entirely), we instead observe the expansion effect where **both pass@1 and pass@32 improve**. Without prior exposure to ground-truth solutions, the model appears to explore and discover new reasoning paths through on-policy learning.


<details>
<summary><strong>An important detour: brittleness on early checkpoints</strong></summary>

![Seed brittleness at early checkpoints](/assets/figures/gsm8k_seed_rewards.png "Figure A1. Seed brittleness at early checkpoints: training reward can look similar while test performance diverges sharply.")


Despite these promising results, we also noticed that directly running RL on early checkpoints is **unstable**. 

Between 4B and 10B pretraining tokens, we found that RL performance is highly sensitive to random seed. Some seeds give us significant improvements on GSM8K; others barely improve over the base checkpoint at all. But interestingly, both the good and bad seeds achieve similar training rewards. It suggests that RL on early checkpoints can sometimes lead to superficial pattern learning or memorization during RL, rather than genuine reasoning development. The model might be "gaming" the reward signal in ways that don't transfer to actual problem-solving ability. This is a real limitation we're still trying to understand. 
    
For earlier checkpoints in our main results, we ran RL across 4 different seeds and reported the best-performing one. 

</details>

**Result 2 takeaway:** RL's effect isn't fixed. Whether you see sharpening or expansion depends on what the model has already learned and how much room it has to explore.

## Result 3: How Many Rollouts Do You Actually Need?

![Rollout scaling trade-offs](/assets/figures/gsm8k_rollouts_p1-2.png)
![pass@1 and pass@8 for different rollout counts](/assets/figures/gsm8k_rollouts_p8-2.png "Figure 6. Rollout scaling trade-offs. pass@1 and pass@8 results for different rollout counts on GSM8K-Easy and GSM8K-Hard splits, shown as a function of both training examples and FLOPs. More rollouts improves sample efficiency, but fewer rollouts can be more FLOP-efficient—especially on the hard split.")

When we ran RL on early pretraining checkpoints, we ran into a pretty practical problem: the model is pretty bad at the training questions. So we had to deal with the **sparse rewards** problem: most of the model's attempts are wrong, so RL doesn't get much useful learning signal from its rollouts.

We had a very natural idea: what if we just sample *more* rollouts per question? If the model only gets 1 out of 10 attempts right, maybe sampling 64 attempts instead of 5 will give us enough correct solutions to learn from.

However, more rollouts also means more compute per training step. So we wanted to understand **when taking compute into consideration, wether increasing rollouts improve RL training.** 

### Experimental setup

To study this properly, we simulated "easy" and "hard" training scenarios by splitting our *training* dataset based on how well the base model does on each question. We designed two subsets from OpenMathInstruct:

<details>
<summary>About OpenMathInstruct structure</summary>

OpenMathInstruct contains two main categories of questions: the majority are inspired by the MATH dataset, which consists of challenging competition-level math problems, while a minority are inspired by the GSM8K dataset, which consists of grade-school level math problems.

</details>

From the training set, we only consider GSM8k-like questions and partition them into two sets:

- **GSM8K-Easy:** Questions where the base model gets 16-64 correct solutions out of 64 attempts (it's doing okay)
- **GSM8K-Hard:** Questions where the base model gets ≤8 correct solutions out of 64 attempts (it's struggling)

We then trained with GRPO using either **n=5 rollouts** or **n=64 rollouts** per question, and tracked performance as a function of both:
1. **Training examples seen** (sample efficiency)
2. **FLOPs consumed** (compute efficiency)

### What we found

The results reveal a clear **sample efficiency vs. compute efficiency trade-off**:

**Sample efficiency (examples seen):**  
With n=64 rollouts, models converge faster in terms of training steps. You're squeezing more learning signal out of each question, so you need fewer examples to reach good performance.

**Compute efficiency (FLOPs):**  
With n=5 rollouts, training is way more FLOP-efficient, especially early in training. You reach similar performance levels with a fraction of the compute budget.
As training continues (toward 10⁶ FLOPs), the gap narrows. Eventually n=64 catches up or even slightly surpasses n=5. But in the early stages, *fewer rollouts win on compute*.

### Three key takeaways on rollouts

**1. Final performance doesn't depend much on rollout count.** 
Both n=5 and n=64 converge to similar pass@k peaks. You're not missing out on capability by using fewer rollouts.

**2. Clear trade-off between sample and compute efficiency.**
- More rollouts (n=64) gives better sample efficiency, meaning faster convergence per training step.
- Fewer rollouts (n=5) gives better compute efficiency, meaning similar performance with less compute.

**3. The compute advantage is especially pronounced on hard problems.**
On GSM8K-Hard (where rewards are sparse), using n=5 rollouts significantly outperforms n=64 in terms of FLOP efficiency.

**Result 3 takeaway:** If you're training RL with sparse rewards, **fewer rollouts can actually be more efficient**[^compute-optimal-rl-llm-scaling-github-io]. You don't need massive rollout scaling to get good performance.


## What's Next?

This study is very much ongoing—we see it as a controlled probe into *when* RL can help, not a complete recipe for replacing the standard pipeline.

### Some important caveats

**Task and algorithm scope:**  
We intentionally chose RLVR with GRPO[^arxiv-org-2307-04964] and focused on math reasoning. It's a clean setup to study the problem, but by no means comprehensive. Different RL algorithms or tasks (e.g., coding, general reasoning, instruction following) might behave quite differently.

**Data mixture matters:**  
Our base model was pretrained on a corpus with substantial math (20%) and reasoning-related content (30%). "RL readiness" likely depends heavily on what's in the pretraining mix—a model trained mostly on web text might show different dynamics.

**Model scale:**  
All our results are from a 1B model. Larger models may show different transitions—maybe they become "RL-ready" earlier, or maybe the brittleness we observed goes away. We don't know yet.

### Open directions we're excited about

**Mixing RL into pretraining:**  
Our analysis suggests RL can be effective surprisingly early in training. This raises a natural question: what if we don't wait for pretraining to finish, but instead *interleave* RL with the standard next-token prediction objective during pretraining itself?

Recent work has started exploring "RL pretraining"[^arxiv-org-2506-08007] [^arxiv-org-2510-01265] [^arxiv-org-2509-19249], but there are tons of open questions: How should you schedule the two objectives? What fraction of compute should go to each? Does the optimal data mixture change if you're doing both objectives at once?

**Data mixtures and the expansion vs. sharpening effect:**  
We found that pretraining on lots of math makes RL effective quickly. But we also found that RL after SFT tends to sharpen rather than expand. This suggests an interesting hypothesis: **the effect of RL depends heavily on what the model has already seen.**

If we combine NTP and RL objectives during pretraining, maybe the optimal data mixture is different from what's currently standard. The common paradigm is to pretrain on general web data and save task-specific data for later. But if we're doing RL from the start, maybe we want more structured reasoning content earlier? Or maybe we want to ensure diversity in problem types to encourage expansion?

These are open questions we're still thinking about—and we'd love to hear your thoughts too!



**Feedback?**  
This is a living document and we're actively working on this project. If you have questions, ideas, or want to discuss any of these findings, feel free to reach out!



## Appendix: additional training curves and ablations

These plots are useful for you to sanity-check training dynamics and evaluation choices.

<details>
<summary><strong>Training convergence across checkpoints </strong></summary>
    
In this work, we are interested in understanding, given sufficient compute, how well each method performs. Therefore, we train all our RL and SFT runs until convergence. In the two plots below, we confirm that both our SFT and RL runs have been trained until convergence. 

<figure>
  <img src="/assets/figures/gsm8k_rl_sft_comparison.png" alt="RL train/val reward and GSM8K pass@1 over RL steps for multiple pretraining checkpoints." width="100%"/>
  <figcaption><strong>Figure A2.</strong> RL reward curves (train/val) and GSM8K pass@1 over RL steps show convergence across checkpoints.</figcaption>
</figure>

    
<figure>
  <img src="/assets/figures/gsm8k_sft_epoch_comparison.png" alt="SFT epoch comparison (5 vs 10 epochs) showing convergence across checkpoints on GSM8K pass@k." width="100%"/>
  <figcaption><strong>Figure A3.</strong> SFT epoch ablation indicates performance converges by ~5 epochs.</figcaption>
</figure>
</details>


<details>
<summary><strong>How we evaluate base checkpoints </strong></summary>
The pretraining checkpoints do not have instruct following capabilities. Our goal is to evaluate their math capabilities, so we use 8-shot in-context examples to prompt the model to answer questions in the correct format. 
<figure>
  <img src="/assets/figures/gsm8k_base_eval_shots.png" alt="n-shot prompting ablation (0/1/8-shot) for evaluating base checkpoints on GSM8K and MATH pass@k." width="100%"/>
  <figcaption><strong>Figure A4.</strong> Few-shot prompting ablation for base checkpoints: 8-shot yields the strongest evaluation performance.</figcaption>
</figure>

</details>

## Citation

Please cite this work as:

\`\`\`bibtex
@misc{rbcmsq2026rlexcursions,
  author={Rachit Bansal* and Clara Mohri* and Tian (Sunny) Qin* and David Alvarez-Melis and Sham Kakade},
  title={RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?},
  howpublished={url{https://rachitbansal.github.io/rl-excursions/}},
  year={2026}
}
\`\`\`
[^biderman2023]: Biderman et al. (2023). [Pythia: A Suite for Analyzing Large Language Models Across Training and Scaling](https://proceedings.mlr.press/v202/biderman23a.html). ICML 2023.

[^arxiv-org-2510-15020]: Chen et al. (2025). [The Coverage Principle: How Pre-Training Enables Post-Training](https://arxiv.org/abs/2510.15020).

[^arxiv-org-2107-03374]: Chen et al. (2021). [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374).

[^compute-optimal-rl-llm-scaling-github-io]: Cheng et al. (2026). [Isocompute Playbook: Optimally Scaling Sampling Compute for RL Training of LLMs](https://compute-optimal-rl-llm-scaling.github.io/).

[^arxiv-org-2110-14168]: Cobbe et al. (2021). [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168).

[^arxiv-org-2310-12773]: Dai et al. (2023). [Safe RLHF: Safe Reinforcement Learning from Human Feedback](https://arxiv.org/abs/2310.12773).

[^arxiv-org-2506-08007]: Dong et al. (2025). [Reinforcement Pre-Training](https://arxiv.org/abs/2506.08007).

[^arxiv-org-2503-07453]: Foster et al. (2025). [Is a Good Foundation Necessary for Efficient Reinforcement Learning?](https://arxiv.org/abs/2503.07453).

[^arxiv-org-2501-12948]: Guo et al. (2025). [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948).

[^arxiv-org-2510-01265]: Hatamizadeh et al. (2025). [RLP: Reinforcement as a Pretraining Objective](https://arxiv.org/abs/2510.01265).

[^hendrycks2021]: Hendrycks et al. (2021). [Measuring Mathematical Problem Solving with the MATH Dataset](https://arxiv.org/abs/2103.03874). NeurIPS 2021.

[^arxiv-org-2203-15556]: Hoffmann et al. (2022). [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556).

[^li2024]: Li et al. (2024). [Datacomp-LM: In Search of the Next Generation of Training Sets for Language Models](https://arxiv.org/abs/2406.11794). NeurIPS 2024.

[^arxiv-org-2509-19249]: Li et al. (2025). [Reinforcement Learning on Pre-Training Data](https://arxiv.org/abs/2509.19249).

[^arxiv-org-1711-05101]: Loshchilov & Hutter (2019). [Decoupled Weight Decay Regularization](https://arxiv.org/abs/1711.05101).

[^arxiv-org-2501-00656]: Team OLMo (2024). [2 OLMo 2 Furious](https://arxiv.org/abs/2501.00656).

[^ouyang2022]: Ouyang et al. (2022). [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155). NeurIPS 2022.

[^arxiv-org-2305-18290]: Rafailov et al. (2023). [Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290). NeurIPS 2023.

[^arxiv-org-2402-03300]: Shao et al. (2024). [DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300).

[^arxiv-org-2409-19256]: Sheng et al. (2024). [HybridFlow: A Flexible and Efficient RLHF Framework](https://arxiv.org/abs/2409.19256).

[^toshniwal2024]: Toshniwal et al. (2024). [OpenMathInstruct-1: A 1.8 Million Math Instruction Tuning Dataset](https://arxiv.org/abs/2402.10176). NeurIPS 2024.

[^wei2022]: Wei et al. (2022). [Finetuned Language Models Are Zero-Shot Learners](https://arxiv.org/abs/2109.01652). ICLR 2022.

[^arxiv-org-2507-14843]: Wu et al. (2025). [The Invisible Leash: Why RLVR May or May Not Escape Its Origin](https://arxiv.org/abs/2507.14843).

[^arxiv-org-2512-03442]: Xing et al. (2025). [PretrainZero: Reinforcement Active Pretraining](https://arxiv.org/abs/2512.03442).

[^yue2025]: Yue et al. (2025). [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model?](https://arxiv.org/abs/2504.13837).

[^arxiv-org-2512-07783]: Zhang et al. (2025). [On the Interplay of Pre-Training, Mid-Training, and RL on Reasoning Language Models](https://arxiv.org/abs/2512.07783).

[^arxiv-org-2307-04964]: Zheng et al. (2023). [Secrets of RLHF in Large Language Models Part I: PPO](https://arxiv.org/abs/2307.04964).

[^zhou2023]: Zhou et al. (2023). [Lima: Less Is More for Alignment](https://arxiv.org/abs/2305.11206). NeurIPS 2023.
`;
export {
  textRaw as t
};
