![](/assets/figures/teaser.gif)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>[teaser figure on compute allocation across three dimensions, to prettify]
</p>

A persistent blocker to scaling up reinforcement learning (RL) for LLMs is the absence of a ***concrete workflow*** : **a recipe that tells practitioners *what* to scale in the RL, *how* to scale it, and *what outcomes of scaling one should expect*.** In many areas of modern-day AI, such workflows emerge from [empirical](https://arxiv.org/pdf/2001.08361) [scaling laws](https://arxiv.org/pdf/2203.15556): small-scale experiments reveal how performance should grow with compute, data, or model size. These laws inform compute allocation, models to use, and hyperparameter settings.

For RL, scaling laws remain far less understood compared to pre-training or supervised learning due to the interplay between data collection (***exploration***) and optimization (***learning from data***). Recent works have begun to sketch what these laws might look like in classical [deep](https://arxiv.org/abs/2104.03113) [RL](https://value-scaling.github.io/) [settings](https://arxiv.org/abs/2301.13442). But in the LLM setting, this line of work is still in its infancy. The [most relevant prior results](https://arxiv.org/abs/2510.13786) show that, under **specific conditions** (a particular problem mixture), reward curves in RL follow a clean sigmoidal shape when run for longer. Another [prior work](https://arxiv.org/abs/2509.25300) shows that RL training exhibits similar scaling behavior as pre-training in the model size, but ignores other hyperparameters. Simply fitting the shape of a learning curve or showing gains with larger models however does not answer one major question scaling laws intend to address: ***resource allocation** to set up an RL run under the conditions that a downstream user faces*. Given a base model, a problem set, and a total budget on compute, how should one spend this compute? If we had 10x more compute, how should that be spent? Which hyperparameters affect this resource allocation question the most and why? How does resource allocation change when the base model changes?

We have been working toward answering these questions. This article aims to frame the core scaling issues and provide practical guidance for allocating compute in on-policy RL for LLMs, with a particular focus on compute spent on **online sampling (rollouts)**. The picture that emerges is nuanced: ***scaling behavior depends not only on the total compute budget, but also on the interaction between the base model and the prompt distribution.*** Nevertheless, we find that **predictable allocation rules for key hyperparameters emerge as sampling compute increases**. Concretely, as we discuss in detail, for on-policy RL algorithms that optimize policies using multiple parallel rollouts per sequential gradient step, we observe the following:

- **Optimal parallel rollouts per problem (<i>n</i>) grows with sampling compute budget (<i>C</i>)**. As the total sampling budget increases, the optimal <i>n</i> grows following *a predictable sigmoid curve*. This indicates to maximize performance, practitioners should configure <i>n</i> based on their the compute budget regime**:** allocating larger <i>n</i> when given higher compute budgets; smaller <i>n</i> when the compute budget is small.
- **Easy and hard problems: similar scaling trends, but different mechanisms.** While both easy and hard problem sets benefit from scaling <i>n</i>, the underlying mechanisms are different. On easy problems, larger number of rollouts (<i>n</i>) primarily acts to sharpen the policy on already solvable problems, indicated by the improvements in the worst@k metric. In contrast, on hard problem sets, scaling <i>n</i> is essential for expanding coverage (discovering rare successful trajectories), directly improving the best@k metric.
- **The number of unique problems per batch (<i>B</i><sub>problem</sub>) has marginal impact**. We find that varying the number of unique problems per batch (<i>B</i><sub>problem</sub>) yields negligible changes in validation reward, provided it remains neither too small or too large. Thus, under fixed hardware constraints ($B$ = <i>B</i><sub>problem</sub> × <i>n</i>), this insensitivity dictates a dynamic allocation strategy: prioritize **large <i>B</i><sub>problem</sub>** (small <i>n</i>) at low compute budgets, but shift to **large <i>n</i>** (small <i>B</i><sub>problem</sub>) at high compute budgets to maximize performance, though the trade-off on hard problems where reward is hard to obtain is more nuanced.
- **The saturation point of compute-optimal number of rollouts (<i>n</i>) is determined by problem set size, difficulty, and the interaction between the base model and the prompt set**. The value at which <i>n</i> saturates is governed by three specific interactions: a) **problem set size:** Smaller datasets lower the saturation point due to early overfitting: validation reward degrades despite training reward gains, making large <i>n</i> values simply infeasible; b) **problem difficulty:** Harder problems saturate at a smaller compute-optimal <i>n</i> values because they require a critical mass of sequential updates to make progress otherwise find it hard to balance optimization and exploration with too large <i>n</i>. Moreover, skewed dataset compositions also skew <i>n</i> values due to interference between easy and hard prompts; and **c) base model**, which dictates learnability and transfer across prompts being trained upon.

---

## Where RL Scaling Laws Come From (When They Exist), Conceptually

To begin, it helps to recall why scaling laws can be derived in supervised learning or pre-training, and what makes learning dynamics predictable in these settings. In supervised learning, the objective is typically cross entropy, which is smooth and optimized over a fixed data distribution. This results in relatively well-behaved optimization dynamics, where small parameter updates lead to small and predictable changes in the loss. Consequently, under well-chosen hyperparameters, which can often be identified through small-scale experiments, the training dynamics of supervised learning become predictable, allowing the loss to be modeled as a function of compute or data. The **statistical structure of the data**, such as the covariance spectrum, remains constant through training. A simple mental model is that the [decay of this spectrum](https://arxiv.org/abs/2102.06701) governs the power law scaling behavior observed in practice. We emphasize that this perspective is an approximation rather than a formal proof, but it provides useful intuition for why scaling laws emerge in supervised learning. In RL, the challenge of deriving any scaling law is two fold: 

1. ***the objective given by the  expected reward (unlike cross-entropy) behaves non-smoothly across training iterations which make small perturbations to the parameters*,**
2. ***the data distribution itself depends on the policy being optimized***. 

When training LLMs with a binary 0/1 reward, we observe that the first challenge of non-smooth rewards is relatively mild, and that in some regimes it is indeed possible to predict the expected reward. However, we did also see in our early experiments that attempting to fit other performance metrics beyond reward (e.g., pass@k or worst@k) poses additional predictability challenges due to objective shift. For this reason, rather than fitting performance directly, we fit **compute-optimal hyperparameters** as a function of resources. 

The second challenge is more fundamental. In online, on-policy RL, the base policy and every policy update determines the distribution of future experience, which is non-stationary. This in turn alters the effective data covariance seen by the policy. As training progresses, both the policy parameters and the data distribution evolve together. This violates the stationary data assumption with a fixed covariance spectrum that underlies many of the standard intuitions for scaling laws in supervised learning, and therefore the usual recipes for deriving scaling laws (e.g., in pre-training) are not directly applicable in RL.

***We therefore will first seek an RL recipe whose learning dynamics scale predictably with additional compute.*** In online RL, performance scaling is governed by two tightly coupled mechanisms: **exploration**, which determines what data is collected, and **optimization**, which determines what and how effectively the model learns from that data. These mechanisms are inherently in tension. Exploration favors sampling unlikely but potentially informative behaviors, while optimization pushes the policy toward responses that already achieve high reward. In LLM settings, exploratory responses are often extremely low probability under the current policy, and training on them can destabilize optimization. A common symptom of this instability is pathological behavior in the model’s next-token entropy, which may grow uncontrollably. As a result, naive RL recipes lead to highly unstable coupling between data generation and unpredictable learning dynamics. To mitigate this, we design what we refer to as a **“healthy” RL recipe**, in which exploration and optimization are coupled smoothly enough that future data generation remains predictable. Concretely, this entails avoiding off-policy samples, and using entropy or KL regularization only when supported by the problem composition. Empirically, as we show in later sections, such recipes exhibit stable entropy dynamics and enable performance to scale in a regular manner, thereby admitting meaningful scaling-law analysis.

Given this tight coupling between data collection and optimization, small changes in exploration can substantially alter the data the model trains on next, leading to qualitatively different learning dynamics. As a result, ***RL training behavior differs substantially between easy and hard problems***. We further find that repeatedly updating on the same data leads to overfitting and causes the policy distribution to shift too rapidly, breaking predictability. This effect is consistent with [our prior work](https://value-scaling.github.io/), which shows that ***clean scaling laws in RL emerge only when off-policy reuse is limited (i.e., a low updates-to-data ratio) and optimization remains stable**.* Motivated by these findings, we focus on on-policy RL in the remainder of this post, and analyze scaling mechanisms separately for easy and hard problem regimes.

---

## Our Main Scaling Question: Compute-Optimal Sampling in LLM RL

Before we prescribe our healthy RL recipes or state our results, we first formally outline the key scaling setups that we operate in. Ultimately, scaling laws are useful because they help us decide how to allocate limited resources such as compute or data in order to achieve the best possible performance. Typically, these laws are obtained by running controlled small-scale experiments and extrapolating the observed trends. Therefore, it is helpful to begin with a basic question: **what resources actually matter in LLM RL?** In our setting, where RL is used to train a given base model on a fixed problem set, what are these resources?

In standard RL, two resources are crucial: **compute**, often measured in training FLOPs, and **data**, measured in the number of environment transitions collected online. In LLM RL, an environment naturally corresponds to a single prompt or problem, and as mentioned above, we assume access to a fixed set of such problems. When running RL post-training of a given base model on this fixed problem set, data is created entirely by spending compute on a given problem (prompt) set because every training rollout is obtained by rolling out the model (and problems are often negligibly-sized in comparison; though not always, e.g., in multi-turn settings, but we do only operate in a single-turn setting). This makes the distinction between compute and data less clear. Thus, for our study, we consider ***compute to be the only fundamental resource***. 

Given the primary resource of compute, it is natural to divide it into **training compute** and **sampling compute**. In LLM RL, sampling compute usually dominates the overall cost because every step of exploration requires generating multiple samples in an autoregressive manner. In addition, we typically train on all the data that is collected. Unless response lengths are scaled drastically, both training and inference compute scale (roughly) linearly with the number of tokens. This gives us a useful simplification for studying scaling. ***We can treat the sampling compute budget as the main quantity to allocate,*** since training compute grows in direct proportion to it, and focus on finding the most effective way to spend sampling compute. Before we go into our problem statement, we present some notation to simplify our discussion.

### Notation and Definitions

We define the primary symbols and their relationships as follows:

- **<i>C</i>:** sampling compute, measured as the **number of rollouts**. We use rollouts instead of tokens because the number of tokens generated per rollout is hard to predict ahead of time.
- **<i>M</i>**: the total number of **gradient update iterations** in training (often called “*steps”* in common open LLM-RL frameworks).
- **<i>B</i>**: the **rollout batch size** per iteration, i.e., the total number of rollouts collected in one iteration.

The total rollout compute scales as:

$$
C \propto B \times M
$$

<i>B</i> can be further broken down into two components:

- **<i>B</i><sub>problem</sub>**: the number of **unique problems** in the rollout batch of each gradient step.
- **<i>n</i>:** the number of rollouts sampled **per problem** (also referred to as the *group size* in [GRPO](https://arxiv.org/pdf/2402.03300)).

To sum up, rollout compute <i>C</i> can be decomposed into three resources, that we can allocate:

$$
C \propto B_{\text{problem}} \times n \times M
$$

### Problem Statement

Our central scaling question, put informally is:

:::callout_begin type="info":::
**Given a base model and a problem set, how should we spend a fixed amount of sampling compute to achieve the highest possible post-training performance?**
:::callout_end:::

This simple question abstracts all of the complexity of modern LLM RL. We make a simplifying assumption and assume that response length, on an average, is captured in the constants, we are now left to allocate sampling compute into <i>B</i><sub>problem</sub>, <i>n</i>, and <i>M</i>. In principle, we could carry out our analysis accounting for the compute spent in terms of the total tokens sampled instead of the total rollouts. However, in our experiments we observed that although response length might vary across settings, these variations manifest primarily as a constant offset in log-log space, leaving the fundamental scaling trends intact. Hence, our conclusions would be similar whether or not we accounted for the sequence length, and we chose to ignore it for simplicity. Our scaling study is based on one model and a problem set, so we do not count them as resources. Hence, our formal resource allocation question is given by:

:::callout_begin type="tip":::
**Given a base model, a problem set, and a sampling budget <i>C</i> ≤ <i>C</i><sub>max</sub>, find the configurations of <i>n</i>, <i>M</i>, <i>B</i><sub>problem</sub> that attain the best possible performance as measured by a target performance metric.**
:::callout_end:::

Ideally, as more sampling compute is provided, the optimal values of <i>n</i>, <i>M</i>, <i>B</i><sub>problem</sub> should be such that more compute translates to better performance. This means that the underlying recipe for which we prescribe values of <i>n</i>, <i>M</i>, <i>B</i><sub>problem</sub> should be such that it ***scales in an healthy manner*** as more sampling compute is allocated. RL runs with LLMs often destabilize or collapse with many optimization steps, and this means that we must first prescribe a scalable/healthy RL recipe before studying the above resource allocation question.  We anchor our main experiments on [Qwen2.5-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) and leverage [Qwen3-4B-Instruct](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) and [Llama3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) for expanding our observations later.

---

## What Constitutes a Healthy RL Recipe for a Given Base Model?

Now, we discuss several characteristics of optimization and exploration mechanisms that support stable and healthy RL. From our experiments, we identify a few key factors that consistently govern whether optimization and exploration remain stable and scalable: (1) the difficulty distribution of the dataset, (2) the behavior of token entropy, and (3) the learning rate. These are not the only factors, in fact, we also observe that “staleness” (or how off-policy the generated rollouts are) also affects scaling and performance, but leave a discussion of it from the current blog post to focus on fully on-policy recipes. We study each of the remaining factors in this section.

### Factor 1: Dataset Difficulty Distribution

The first factor that informs the health of an RL run is the composition of the problem set. Easy problems, where the base model can already sample multiple correct traces, tend to produce [rapid entropy collapse](https://arxiv.org/abs/2505.22617) of the model’s next token distribution. In contrast, making progress on [very hard problems](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/), where the base model can hardly sample ***any*** correct trace, requires careful optimization that actively couples with exploration. In fact, as we will show later, RL training behaves rather unpredictably when the problem set is too hard, as the model must balance between **exploration on unsolvable problems** and **exploitation of reachable ones** (i.e., those with at least one successful pass). Recent works show training on such problems requires algorithmic modifications to make very hard problems “appear” easy first (see [our blog post](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/) and [RL grokking](https://rdi.berkeley.edu/blog/rl-grokking-recipe)). This means that the difficulty of the problem set relative to the base model often very directly determines  the knobs behind a healthy RL recipe. 

**A practical way to quantify this difficulty is to evaluate the base model’s performance on the problem set prior to training.** In this blog, we use the [Guru-Math](https://arxiv.org/abs/2506.14965) dataset for its sizable, carefully curated math problem collection with verified answers, which allows us to perform controlled sampling. We first measure the problem difficulty by *avg@16* (average accuracy over 16 trials obtained for a given problem) with the base model we use for RL training and then construct training problem sets by difficulty: 

- ***Easy*** problem set: **avg@16 in [0.3, 0.6]** (6k samples), with a 300-sample in-domain validation set.
- ***Hard*** problem set: **avg@16 in** **[0.0, 0.0625]** (5k samples), with a 300-sample in-domain validation set.

![**Figure 2: Distributions of problem difficulty for the Easy and Hard problem sets.** Difficulty is quantified using avg@16, the average pass rate over 16 generations per problem.](/assets/figures/sec2_data_dist.png){width=500px}

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 2: Distributions of problem difficulty for the Easy and Hard problem sets.</b> Difficulty is quantified using avg@16, the average pass rate over 16 generations per problem.
</p>

Beyond these primary Easy and Hard sets for our experiments, we also curate a **Heterogeneous** set (mixing easy and hard set in different proportions) and an **Extremely Hard** (pass@128 = 0) for extending our observations. We default to utilizing the recipe for the Hard set on these problem sets as well. We discuss results on this set later in this post (see the section titled “The Bigger Picture”).

### Factor 2: Entropy Control

The interaction between the problem distribution and the base model is clearly reflected in token-level entropy and, somewhat correlatedly, the KL divergence to the base model. While neither directly measures task performance, both serve as sensitive indicators of optimization health. When entropy or KL becomes too large or too small, learning can stall or become unstable. Intuitively, entropy controls how broadly the policy explores at the token level, while the KL divergence anchors the policy to the base model and limits excessive drift. The behavior of these quantities depends on problem difficulty. It is often a common practice to add an entropy regularizer for training. On easy problems, running RL without a sufficiently large entropy regularizer often leads to premature entropy collapse. However, on hard problems, running RL with an entropy regularizer alone often leads to an explosion in entropy and response length. A KL constraint by itself typically over-constrains exploration and is unnecessary in most regimes, indeed RL runs can work just as well without a KL constraint. However, on hard problems, where entropy can explode early in training, a KL anchor is effective at delaying or totally avoiding instability. For this reason, ***whenever we use an entropy loss, we pair it with a KL loss to provide a stabilizing anchor.***

[Prior work](https://arxiv.org/abs/2510.13786) often employs a **zero variance filtering** (”zero-var filter” in Figure 3 below) mechanism when using rollout-based policy gradient methods such as GRPO, removing training prompts where all rollouts are either all incorrect or all correct. This filtering typically serves two purposes. First, it increases the effective batch size by keeping prompts that produce a non-zero policy gradient. Second, when entropy and KL regularizers are used, it prevents these regularizers from being applied on rollouts that do not contribute to an active policy gradient. The second mechanism is particularly important on hard problems, where RL optimization naturally pushes the policy toward higher entropy in order to discover rare positive trajectories that are unlikely to be produced by the base model but succeed. This [increase in entropy is driven by the policy gradient](https://arxiv.org/abs/2506.09026) itself and is often necessary for effective exploration. 

Even with zero-variance filtering applied, problems in which rare positives are sampled can still experience entropy explosions, since the resulting entropy or KL regularizers remain active. More concretely, our experiments (Figure 3) show that applying zero-variance filtering to the KL and entropy terms mitigates some of the most severe instabilities on hard problems. However, we find that it does not fully eliminate instability in all cases. **Removing KL and entropy regularization entirely yields the most stable training dynamics**. Thus, we adopt **KL+entropy regularization on the Easy set**, where entropy otherwise tends to collapse, and **no KL or entropy regularization on the Hard set**, to avoid instability.

**Experiment setup.** We use Qwen2.5-7B-Instruct as the base model with a max output length of 8,192 tokens and employ the [GRPO](https://arxiv.org/abs/2402.03300) algorithm. We fix <i>B</i><sub>problem</sub> = 256 and <i>n</i> = 16. On both the Easy and Hard sets, we perform ablations over (1) the presence of KL and entropy regularization and (2) the application of the zero-variance filter, including variants where the filter is applied only to the KL and entropy loss terms.

![**Figure 3: Ablations of KL+entropy and zero-var filter across the Easy and Hard problem set.** On the Easy set, **all configurations improve steadily, with standard "KL+entropy" achieving the highest reward ***(left)***. On the Hard set, while applying zero-variance filtering to the KL and entropy terms helps mitigate instability, disabling these regularizers entirely results in significantly more stable training ***(right)***.]( /assets/figures/sec2_kl_ent_ablation.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 3: Ablations of KL+entropy and zero-var filter across the Easy and Hard problem set.</b> On the Easy set, all configurations improve steadily, with standard “KL+entropy” achieving the highest reward <b><i>(left)</i></b>. On the Hard set, while applying zero-variance filtering to the KL and entropy terms helps mitigate instability, disabling these regularizers entirely results in significantly more stable training <b><i>(right)</i></b>.
</p>

### Factor 3: Learning-Rate Scaling

Building on the perspective of stable entropy and KL dynamics, the **learning rate (LR)**, denoted as *η*, governs the magnitude of policy updates per unit of advantage. It is well-established that different model scales exhibit varying sensitivities to the learning rate ([Kaplan et al. 2020](https://arxiv.org/abs/2001.08361); [Hoffman et al. 2022](https://arxiv.org/abs/2203.15556)), and additionally the best learning rate depends on the batch size in supervised learning ([Krizhevsky 2014](https://arxiv.org/abs/1404.5997); [Goyal et al. 2017](https://arxiv.org/abs/1706.02677); [McCandlish et al. 2018](https://arxiv.org/abs/2505.23971)). Since we vary the batch size <i>B</i> in our experiments, establishing a robust baseline LR and a systematic scaling strategy is essential. To formalize this choice, we first identify a **base learning rate anchor**. We then study how different scaling rules perform as the batch size increases. Based on our experiments *(Figure 4)*, we adopt *η*<sub>base</sub> = 10<sup>-6</sup> as the anchor for a batch size of <i>B</i> = 1,024 and utilize the **square-root scaling** rule with respect to <i>B</i>.

**Experiment setup.** We conduct these experiments on the Easy set using the [AdamW](https://arxiv.org/abs/1711.05101) optimizer. The learning rate is linearly warmed up for 10 steps and then held constant for the remainder of training. We fix a baseline configuration with <i>B</i><sub>problem</sub> = 128, <i>n</i> = 8, <i>B</i> = 128 × 8 = 1,024 and run a grid search for a good base LR anchor. We then increase <i>n</i> to 64 and <i>B</i> to 128 × 64 = 8,192 and compare three scaling strategies:

- **Constant LR:** *η* remains fixed regardless of changes in <i>B</i>.
- **Linear scaling:** *η* scales linearly with <i>B</i>.
- **Square-root scaling:** *η* scales proportionally to √<i>B</i>.

As shown in Figure 4 below, we observe that ***square-root scaling enables faster convergence while avoiding the instability seen in linear scaling.*** Although we ran this experiment on the easy problem set, we expect the same learning rate scaling strategy to apply across problem sets of varying difficulty. Conceptually, the way the learning rate should scale with batch size is governed by gradient variance and noise. While problem difficulty may change the optimal *absolute* learning rate, it should not fundamentally change the underlying scaling relationship as batch size increases.

![**Figure 4: Base LR selection and scaling strategy validation.** We sweep of the base learning rate at $B=1024$, and identify $\eta=10^{-6}$ as the baselineLR ***(left)***. We then compare LR scaling methods at a larger batch size ($B=8192$). **Square-root scaling** enables faster convergence without the instability observed in linear scaling, validating it as the robust choice for large-scale training ***(right)***.]( /assets/figures/sec2_lr_scaling.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 4: Base LR selection and scaling strategy validation.</b> We sweep of the base learning rate at <i>B</i> = 1024, and identify *η* = 10<sup>-6</sup> as the baselineLR <b><i>(left)</i></b>. We then compare LR scaling methods at a larger batch size (<i>B</i> = 8192). <b>Square-root scaling</b> enables faster convergence without the instability observed in linear scaling, validating it as the robust choice for large-scale training <b><i>(right)</i></b>.
</p>

[add configuration table to be clear]

:::takeaway_begin:::
**Key Takeaways**:

1. RL training exhibits distinct training behaviors depending on problem difficulty. We therefore explicitly **curate and control for both Easy and Hard datasets** to ensure the recipe is robust to different saturation points and exploration requirements. On heterogeneous datasets that we discuss later, we simply use the recipe corresponding to the Hard dataset to avoid instability.
2. The necessity of regularization changes based on the difficulty level. **Easy tasks** benefit from KL divergence and entropy constraints to prevent premature collapse, whereas **Hard tasks** achieve peak performance when these constraints are removed to allow unconstrained exploration. Training on mixed datasets is most stable when no KL divergence or entropy are used.
3. Learning rate should not be fixed as the total batch size <i>B</i> changes. Of the schemes we compared, the **square-root learning rate scaling** strategy is the best.
:::takeaway_end:::
---

## Results: Compute-Optimal Allocation of Sampling FLOPs in LLM RL

We now turn to our central question: ***given a fixed sampling compute budget, how should we allocate it across the RL sampling knobs to maximize performance?*** Recall that the rollout compute <i>C</i> scales ∝ <i>B</i><sub>problem</sub> × <i>n</i> × <i>M</i>. Our goal is ***not*** to tune a single best configuration for training, but to identify **allocation workflows** for distributing a fixed sampling budget across problems per batch <i>B</i><sub>problem</sub> and rollouts <i>n</i> sampled for each problem in the batch. Across all experiments in this section, we sweep (<i>n</i>, <i>B</i><sub>problem</sub>, <i>M</i>) across a range of compute budgets <i>C</i>. For a fixed compute budget <i>C</i> = <i>C</i><sub>0</sub>, we evaluate multiple allocations and define the ***compute-optimal frontier*** as the highest IID validation set reward achievable using total compute <i>C</i><sub>0</sub>. We get different plots on the frontier as we increase and sweep over values of <i>C</i><sub>0</sub>.

**Data analysis workflow.** To make our scaling law prescriptions, we subsample the data from runs to only a smaller set of ***record-breaking*** points on a learning curve of reward (or any other performance metric) as a function of increasing compute. A record-breaking point is defined as the first point in a run that attains a higher validation reward relative to all previous points. For computing this higher reward, we first bucketize the reward into discrete bins and then pick the first points where the bucket increments. See [this] footnote for a detailed explanation on why utilizing record-breaking points for deriving the fit is sufficient. We then fit a monotonic function to the record-breaking points to obtain prescriptions for compute-optimal values of <i>n</i>, <i>B</i><sub>problem</sub>, and <i>M</i>. Because this pre-processing is order-preserving, this procedure does not introduce spurious non-monotonicity and yields the same frontier in practice as fitting over all points.

Unless otherwise stated, we use Qwen2.5-7B-Instruct as the base model with the max output length 8,192 and the healthy *RL* recipe from above. We use on-policy updates with an Adam optimizer, scaling the learning rate proportionally to √<i>B</i>, where the rollout batch size <i>B</i> = <i>B</i><sub>problem</sub> × <i>n</i> (base LR = 1e-6 at <i>B</i>=1024); KL and entropy regularization are enabled on the Easy set and disabled on the Hard set (as discussed above); we fix the sampling temperature to 0.6 and top_p to 1.0 for training and evaluation; we use GRPO to estimate advantages and truncated importance sampling ([TIS](https://fengyao.notion.site/flash-rl)) to mitigate training-inference logit mismatch. 

**Experimental setup.** We sweep over valid configurations (<i>B</i><sub>problem</sub>, <i>n</i>) from the Cartesian product {32 (2<sup>5</sup>), ..., 1024 (2<sup>10</sup>)} × {8 (2<sup>3</sup>), ..., 2048 (2<sup>11</sup>)}, subject to the hardware constraint <i>B</i><sub>problem</sub> × <i>n</i> ≤ <i>B</i><sub>max</sub>. We set <i>B</i><sub>max</sub> = 65,536 for the Easy set and 16,384 for the Hard set. The value of <i>B</i><sub>max</sub> is smaller for the hard set to allow for more sequential iterations, within our allowed computational budget. The total compute cost for these experiments was approximately 120,000 NVIDIA H200 GPU hours.

We concretely study compute-optimal allocation rules in three settings that allocate a subset of resources: 

1. <i>n</i> vs <i>M</i> (parallel rollouts vs sequential iterations)
2. <i>n</i> vs <i>B</i><sub>problem</sub> (parallel rollouts vs the number of problems in a batch)
3. allocation across all resources.

### Question 1:  Trading Off Parallel Sampling <i>n</i> with Sequential Iterations <i>M</i>

$$
C \propto \underbrace{B_{\text{problem}}}_{\text{fixed}}
\times \color{blue}\underbrace{{n \times M}}_{\color{blue}{\text{user allocated}}}

$$

We now examine compute allocation with the number of problems <i>B</i><sub>problem</sub> held constant, focusing on **the trade-off between parallel samples <i>n</i> and sequential iterations <i>M</i>** under a fixed compute budget.

**Fitting workflow.** We plot reward vs compute <i>C</i> curves for each fixed <i>n</i> and fit a **monotonic sigmoid** to summarize how the validation set reward (avg@4) scales with compute for that <i>n</i>. As mentioned above, we then define the **compute-optimal frontier** as the upper envelope of these fitted curves (see Figure 5). Then, to indicate which <i>n</i> lies on the frontier at each compute level, we color the frontier in Figure 5 by *n*\*(<i>C</i>), which is the value of <i>n</i> whose fitted compute–reward curve achieves the compute-optimal frontier at <i>C</i>. Finally, in Figure 6, we fit a log-log plot to show  *n*\*(<i>C</i>) as a function of  <i>C</i> to summarize the empirical scaling behavior. We make four important observations in this setting.

**1) The value of <i>n</i> that lies on the compute-optimal frontier shifts systematically higher as the sampling compute** <i>C</i> **increases (Figure 5).** It is natural to expect larger values of <i>n</i> to be generally favorable at higher compute budgets, since increasing <i>n</i> reduces noise in advantage estimates and lowers policy-gradient variance but eats up more sampling compute. Consistent with this, the frontier-attaining *n*\*(<i>C</i>) shifts to larger values as <i>C</i> grows, and we observe the same trend in both the Easy and Hard problem sets. Smaller values of <i>n</i> exhibit rapid initial gains but plateau at a relatively lower compute regime, whereas larger <i>n</i> sustain improvement over a broader compute range (*Figure 5*). This behavior also suggests that parallel and sequential compute are not exactly interchangeable. Choosing <i>n</i> so that we are able to perform a sufficient number of sequential updates <i>M</i> is necessary to achieve strong performance. 

![image.png](/assets/figures/sec3_q1_fixBprob_frontier.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 5. Reward frontier a function of compute (<i>B</i><sub>problem</sub> = 32),</b> where the frontier is computed by maximizing over values of <i>n</i>. The compute-optimal frontier shifts to larger <i>n</i> with more <i>C</i>, showing that more parallelism becomes optimal at higher budgets. For easy problems <b><i>(left)</i></b>, <b>small</b> <i>n</i> improves fast but plateaus; larger <b><i>n</i> sustains gains and dominates at high compute. For the hard ones</b><b><i>(right)</i></b>,  the same trend holds, but rewards are lower and saturate earlier, with the frontier reaching a smaller value than <i>n</i> on the easy problems.
</p>

**2) Compute-optimal values of <i>n</i> are well-approximated by a sigmoid function of** <i>C</i>  **(Figure 6).**  We next seek to fit a functional relationship for the compute optimal value *n*\*(<i>C</i>) as a function of the available compute <i>C</i>. A natural first step is to hypothesize an appropriate functional form. As shown in Figure 5, increasing <i>C</i> admits larger compute optimal values of <i>n</i>, and over a substantial range this relationship appears approximately linear on a log-log scale. The key question is whether this growth continues indefinitely or eventually saturates. Empirically, we observe a clear saturation in Figure 6. Even when evaluating rollout widths up to <i>n</i> = 2,048, values significantly larger than the saturation point, they fail to extend the frontier, with <i>n</i> = 512 continuing to dominate.

We argue that this behavior is expected for a fixed base model and a fixed problem set. To build intuition, it is helpful to view increasing <i>n</i> as analogous to spending more compute per gradient step. In empirical risk minimization, increasing capacity alone does not reduce validation error beyond a certain point unless additional training data is available or the train-test gap is reduced. This principle also underlies pre-training scaling rules from [Chinchilla](https://arxiv.org/abs/2203.15556) that prescribe scaling both pre-training data and model capacity together. Perhaps most closely related to our RL training setup, [our prior work](https://arxiv.org/abs/2406.14532) on rejection fine-tuning shows that the optimal value of <i>n</i> on the training set is often capped by an upper bound. Increasing <i>n</i> alone cannot overcome limitations imposed by a fixed problem set for training or base model. As a result, the compute optimal value of <i>n</i> must eventually saturate even for RL, which is precisely what we observe empirically. We empirically validate this hypothesis regarding model-data interaction in the later analysis section, where we demonstrate how the saturation point shifts given *a different base model, problem set size, and distribution*.

![image.png](/assets/figures/sec3_q1_fixBprob_sigmoid.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 6: Compute-optimal scaling of the parallel compute <i>n</i></b> (<i>B</i><sub>problem</sub> = 32)<b>.</b> The optimal value of rollouts <i>n</i> <b>shifts systematically higher</b> as the total sampling compute increases. Points show a running-average estimate of the frontier-attaining *n*\*(<i>C</i>) at each compute budget (colored by reward), and the red curves fit a sigmoid parameterizing log <i>n</i> as a function of log <i>C</i>. For both the easy set <b><i>(left)</i></b> and hard set <b><i>(right)</i></b>, *n*\*(<i>C</i>) rises from small to very large values as compute increases. On the hard set, the final  value converges significantly below the maximal value of <i>n</i> (2<sup>10</sup>), and this value is lower than the easy set.
</p>

**3) Next**, **we find that the compute-optimal allocation *trend* remains consistent across difficulty levels, although we find harder sets prefer smaller values of** <i>n</i> **(Figure 6)**. We find that the qualitative compute optimal allocation trend remains consistent across problem difficulty. On both easy and hard problem sets, the compute optimal value of <i>n</i> increases with total compute <i>C</i> before eventually plateauing. However, the plateau occurs at markedly ***smaller*** values of <i>n</i> on harder problems. In particular, very large values of <i>n</i>, such as <i>n</i> = 512, yield lower final performance on the hard set and do not lie on the compute optimal frontier. ***This suggests that task difficulty imposes an upper bound on how large <i>n</i> can be used effectively**. **While it may seem intuitive that harder problems should benefit from larger <i>n</i> due to increased sampling, we observe the opposite behavior in practice.*** On sufficiently hard problem sets, increasing <i>n</i> allocates substantial compute to problems where the model receives little or no learning signal. In contrast, smaller values of <i>n</i> focus optimization on the subset of prompts where nonzero signal is already present and meaningful improvement is possible. **Therefore, if compute is bounded**, it is better to use a smaller value of <i>n</i> to increase the frequency of parameter updates (small <i>n</i>, large <i>M</i>, more epochs on the same prompt set) that exploits reachable gains, rather than large parallel compute on problems that are persistently unsolved (large <i>n</i>, small <i>M</i>, fewer training epochs).

**4) Implications on optimization dynamics on the easy and hard sets and the role of various performance metrics (Figure 7).** We saw in point 3 above that a smaller value of <i>n</i> was more preferable for optimizing validation *average reward* (avg@4 per problem), and we attributed this behavior to the underlying optimization dynamics (i.e., solving more problems vs producing more correct rollouts on the same problem). In this point, we aim to better **understand this optimization dynamics and evaluate how *n*\*(<i>C</i>) changes if we were to change the target performance metric we study.**

In particular, we consider two performance metrics: ***best@k** (or pass@k)* and ***worst@k*:** Recall the definitions:

- **best@k:** the proportion of problems where *at least one* generated response out of *k* is correct. This measures the model's **coverage** over the validation problem set.
- ***worst@k*:** the proportion of problems where all *k* generated responses are correct, also referred to as *perfect solvability.* This measures the robustness of the training procedure (i.e., the degree to which it can “**sharpen**” around the right solution).

Modulo compute-optimality, a larger value of <i>n</i> coupled with as many sequential update steps as needed, should in principle, result in higher values for both best@k and worst@k on a training dataset. However, this is not quite the case when compute is bounded. We empirically identify the optimal values of *n*\*(<i>C</i>) for obtaining the highest best@k and worst@k scores on the validation set, across different <i>B</i><sub>problem</sub> values for the largest value of <i>C</i>, and show this number in Figure 7 below. We choose *k*=4, much smaller than any value of <i>n</i> we study (<i>n</i> ≫ *k*), so that none of the trends in Figure 7 are “edge” cases or artifacts of empirical/fitting/workflow/statistical error. Perhaps surprisingly, we now see an interesting divergence in trends of compute-optimal <i>n</i> that impacts the Easy and Hard sets differently. 

1. On the easy set, **a larger <i>n</i> is compute-optimal for worst@4 (sharpening) performance, whereas relatively smaller values of <i>n</i> are compute-optimal for the best@4 performance.** This means that a larger <i>n</i> primarily improves by sharpening more on easy problems, while a smaller <i>n</i> suffices to sample one correct rollout (expected since the set is easy).
2. Conversely, for hard problems, **a larger <i>n</i> is more critical for pushing the best@4 (coverage) boundary, while a relatively smaller <i>n</i> is compute-optimal for improving worst@4 (sharpening).** However, there is a limit beyond which a larger <i>n</i> does not improve coverage on new problems in a compute-optimal manner, as indicated by Figure 7 that optimal values here remain generally lower than on the easy set. On the *Extremely Hard* set consisting of all pass@128=0 problems (shown in the later analysis section), we see a clearer tradeoff of coverage and sharpening: while larger <i>n</i> improves best@k, excessive <i>n</i> degrades worst@k and lowers the average reward. Thus, if targeting average reward, the optimal <i>n</i> on hard problems is the value that balances coverage and sharpening well. 

The net effect of these distinct optimization dynamics is a similar trend of compute-optimal <i>n</i> on the validation average reward (Figures 5 & 6), but these results imply that the target performance metric itself dictates the landscape of compute-optimal <i>n</i>. 

![**Figure 7: Values of $n$ that optimize the best@4 and worst@4 performance for different** $B_\text{problem}$ **values, when evaluated at the largest allowed compute budget.** On the Easy set ***(left)***, the compute-optimal $n$ is smaller for best@4 (blue) than for worst@4 (red), indicating that improving robustness (worst@4) requires substantially more parallel rollouts than improving coverage. In contrast, this trend reverses on the Hard set ***(right)***: a larger $n$ is needed to improve best@4 compute-optimally, while worst@4 saturates at smaller $n$.](/assets/figures/sec3_q1_fixBprob_bestworstk.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 7: Values of <i>n</i> that optimize the best@4 and worst@4 performance for different</b> <i>B</i><sub>problem</sub> <b>values, when evaluated at the largest allowed compute budget.</b> On the Easy set <b><i>(left)</i></b>, the compute-optimal <i>n</i> is smaller for best@4 (blue) than for worst@4 (red), indicating that improving robustness (worst@4) requires substantially more parallel rollouts than improving coverage. In contrast, this trend reverses on the Hard set <b><i>(right)</i></b>: a larger <i>n</i> is needed to improve best@4 compute-optimally, while worst@4 saturates at smaller <i>n</i>.
</p>

:::takeaway_begin:::
**Key Result Takeaways**:

1. The compute-optimal <i>n</i> frontier **shifts systematically higher** as the total sampling compute increases. The trend remains consistent **across training dataset difficulties.**
2. The source of gain from large <i>n</i> **shifts based on the training data difficulty**: scaling <i>n</i> improves **sharpening** (worst@4) on the Easy set, but expands **coverage** (best@4) on the Hard set. 
:::takeaway_end:::

:::takeaway_begin:::
**Workflow Takeaways:**

- Depending upon the composition of the problem set, and how effectively can the base model learn on this set, we might see different underlying mechanisms for performance improvement. It is advisable to evaluate the mode of performance improvement for your base model on your prompt set, and accordingly use it to set <i>n</i> as a function of the available <i>C</i>.
:::takeaway_end:::

<!-- [](__IMAGE_PLACEHOLDER__)

[](__IMAGE_PLACEHOLDER__) -->

### Question 2: Bounded Parallel Compute: Trading off <i>B</i><sub>problem</sub> with <i>n</i>

$$
C \propto \underbrace{B}_{\text{fixed}} \times M = {\color{blue}\underbrace{B_{\text{problem}} \times n}_{\text{user allocated}}} \times M
$$

Next, we study a different scaling question, where wish to allocate a fixed total batch size <i>B</i> into the number of prompts used and the number of rollouts per prompt used. This question is important in practical settings where hardware parallelism (e.g., number of GPUs / data-parallel workers) is fixed, and a practitioner needs to make this compute allocation. In such cases, <i>B</i> is often chosen as the largest rollout batch size that saturates sampling throughput (”system batch size”). 

We specify the number of sequential iterations <i>M</i> ***a priori*** and seek allocations of <i>B</i><sub>problem</sub> and <i>n</i> under a fixed total batch budget <i>B</i><sub>problem</sub> × <i>n</i> ≤ <i>B</i> that maximize performance. We observe the following:

**1) On the easy problems, allocate more parallel compute <i>n</i> when sequential steps <i>M</i> is large.** In this regime, we examine the compute-optimal value of <i>n</i> under a fixed total batch size (illustrated with <i>B</i> = 8,192 for brevity), as <i>M</i> varies. As shown in Figure 8, the optimal choice *n*\*(<i>M</i>) exhibits a sigmoidal dependence on <i>M</i>. This behavior suggests that when more sequential update steps are available, it is generally preferable to allocate additional compute toward increasing <i>n</i>, rather than increasing <i>B</i><sub>problem</sub>. In contrast, when <i>M</i> is small, allocating batch size toward a larger <i>B</i><sub>problem</sub> is more effective, as it enables many more epochs of training on the same problems within a limited number of sequential updates. 

On the Hard set, however, the scaling behavior is less consistent. The compute-optimal value *n*\*(<i>M</i>) exhibits a non-monotonic dependence on <i>M</i> (see Appendix A, Figure x), which implies a similarly irregular trend for the optimal <i>B</i><sub>problem</sub>.

![**Figure 8.  Compute-optimal allocation shifts from $B_{\text{problem}}$ to $n$ under a fixed total batch size constraint ($B=8,192$) on easy problems**. We fix the total rollout budget per step ($B = B_{\text{problem}} \times n$) and sweep the number of sequential iterations ($M$). A sigmoid curve can explain the frontier of optimal $n$ per problem. This curve indicates that $n^*(M)$ increases with $M$, a proxy of total compute $C$ given a fixed $B$ **(*left).*** The corresponding compute-optimal number of prompts $B_{\text{problem}}^*(M)$ decreases with the available sampling compute according to an (inverse) sigmoid ***(right)***. These indicate the strategic shift toward higher per-problem sampling at larger compute budgets.](/assets/figures/sec3_q2_fixB_sigmoid.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 8.  Compute-optimal allocation shifts from <i>B</i><sub>problem</sub> to <i>n</i> under a fixed total batch size constraint (<i>B</i> = 8,192) on easy problems.</b> We fix the total rollout budget per step (<i>B</i> = <i>B</i><sub>problem</sub> × <i>n</i>) and sweep the number of sequential iterations (<i>M</i>). A sigmoid curve can explain the frontier of optimal <i>n</i> per problem. This curve indicates that *n*\*(<i>M</i>) increases with <i>M</i>, a proxy of total compute <i>C</i> given a fixed <i>B</i> <b><i>(left).</i></b> The corresponding compute-optimal number of prompts <i>B</i><sub>problem</sub>*(<i>M</i>) decreases with the available sampling compute according to an (inverse) sigmoid <b><i>(right)</i></b>. These indicate the strategic shift toward higher per-problem sampling at larger compute budgets.
</p>

**2) The *transition point* to a larger <i>n</i> value on the compute-optimal consistently happens when that larger <i>n</i> run reaches approximately one epoch (Figure 9).** An epoch is defined as the problem set size *D* divided by the batch size <i>B</i><sub>problem</sub>. This offers an explanation for the finding “small <i>n</i> for small <i>C</i>; larger <i>n</i> for larger <i>C</i>”, consistent across Question1 (fix <i>B</i><sub>problem</sub>) and Question2 (fix <i>B</i>): in a small <i>C</i> regime, the larger <i>n</i> underperforms because it hasn't yet seen the full problem set. However, once the larger <i>n</i> completes a full pass (i.e., one epoch), the smaller <i>n</i>, which is now iterating over seen data, begins to yield diminishing returns. Thus, the larger <i>n</i> overtakes the small <i>n</i> at large <i>C</i> regime.

![**Figure 9. Compute-optimal frontiers (under a fixed $B=8,192$) and analysis of training epochs at transition points.** Larger $n$ outperforms smaller $n$ as compute increases. Vertical drop-lines mark the transition points where switching to a larger $n$ becomes optimal ***(left).*** These transitions consistently occur at about one epoch ***(right)***. This indicates that larger $n$ overtakes smaller $n$ after a full pass over the training problems, offering one perspective to explain the scaling behavior: "small $n$ for small $C$; large $n$ for large $C$.](/assets/figures/sec3_q2_fixB_frontierepoch.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 9. Compute-optimal frontiers (under a fixed <i>B</i> = 8,192) and analysis of training epochs at transition points.</b> Larger <i>n</i> outperforms smaller <i>n</i> as compute increases. Vertical drop-lines mark the transition points where switching to a larger <i>n</i> becomes optimal <b><i>(left).</i></b> These transitions consistently occur at about one epoch <b><i>(right)</i></b>. This indicates that larger <i>n</i> overtakes smaller <i>n</i> after a full pass over the training problems, offering one perspective to explain the scaling behavior: “small <i>n</i> for small <i>C</i>; large <i>n</i> for large <i>C</i>.”
</p>

A natural follow-up question is: what role does <i>B</i><sub>problem</sub> play? So far, we have shown larger <i>n</i> is preferred for larger <i>C</i>. However, given the constraint <i>B</i> = <i>B</i><sub>problem</sub> × <i>n</i>, we do not expect the trend to be monotonic due to the confounding effect of <i>B</i><sub>problem</sub>. To disentangle this, we analyze the sensitivity of performance to <i>B</i><sub>problem</sub> while holding <i>n</i> fixed.

$$
C \propto {\color{blue}\underbrace{B_{\text{problem}}}_{\text{user allocated}}} \times \underbrace{n}_{\text{fixed}} \times {\color{blue}\underbrace{M}_{\text{user allocated}}}
$$

**3) <i>B</i><sub>problem</sub> has a marginal effect on validation performance when fixing <i>n</i> on easy problems.**  As shown in Figure 10, when fixing <i>n</i>, varying <i>B</i><sub>problem</sub> provides little variance on validation reward. In contrast, increasing <i>n</i> (fixing <i>B</i><sub>problem</sub>) shows a strong correlation with improved validation scores, up to the saturation point discussed in Question 1. This explains the sigmoidal trend in Figure 9: since <i>n</i> is the primary driver of performance and <i>B</i><sub>problem</sub> yields little difference, increasing <i>n</i> is preferred for large <i>C</i> and <i>B</i><sub>problem</sub> decreases in return (<i>B</i><sub>problem</sub> = <i>B</i>/<i>n</i>). 

Overall, we find that setting a large <i>n</i> (up to the saturation point), combined with a moderate <i>B</i><sub>problem</sub> is the most robust strategy. For example, in our experiments, we observed no significant threshold effects for <i>B</i><sub>problem</sub> between 32 and 1024 on the Easy set. However, on the Hard set or a skewed problem distribution, we speculate they may require a higher minimum <i>B</i><sub>problem</sub> for effective training. This behavior is intuitive. On a uniformly constructed Easy set (Figure 2), a relatively small but representative subset of problems already provides a good estimate of the underlying expectation. In contrast, for hard problems to the base model, training on a larger set of problems is necessary, since a small subset of problems that receive early learning signal can otherwise dominate the training distribution. At the same time, the value of <i>n</i> remains important. The resulting trade-off between problem coverage and per-problem <i>n</i> leads to less predictable behavior on the Hard set.

![**Figure 10: Differences in validation reward  attained when varying $B_\text{problem}$ (fixed $n=16$; *left*) vs. varying $n$ (fixed $B_\text{problem}=32$; *right*).** We observe that even in the setting where $B_\text{problem} \times n$ is fixed, modifying the value of $n$ has a substantially larger influence on the validation reward compared to a much smaller variation in results when varying the number of problems during training.](/assets/figures/sec3_q2_fixn_varyBprob.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 10: Differences in validation reward  attained when varying <i>B</i><sub>problem</sub> (fixed <i>n</i> = 16; <i>left</i>) vs. varying <i>n</i> (fixed <i>B</i><sub>problem</sub> = 32; <i>right</i>).</b> We observe that even in the setting where <i>B</i><sub>problem</sub> × <i>n</i> is fixed, modifying the value of <i>n</i> has a substantially larger influence on the validation reward compared to a much smaller variation in results when varying the number of problems during training.
</p>

---

:::takeaway_begin:::
**Key Result Takeaways**:

1. With a fixed total batch size <i>B</i>, increasing compute favors allocating more rollouts (<i>n</i>) per problem and fewer problems per batch (<i>B</i><sub>problem</sub>). On the Easy set, this trend is especially clean, since large <i>B</i><sub>problem</sub> leads to rapid overfitting (as a result of multi-epoch training).
2. On the Easy set, the compute-optimal value of <i>n</i> increases with the allowed number of sequential iterations <i>M</i> and eventually saturates, following a sigmoidal scaling pattern.
3. For the Hard dataset, <i>B</i><sub>problem</sub> must exceed a minimum threshold when sequential compute is unconstrained. Here, incomplete optimization of training reward, rather than overfitting, limits validation performance, making overly small <i>B</i><sub>problem</sub> suboptimal. However, <i>n</i> is still the more critical resource to allocate, and it generally increases as total <i>B</i> is scaled up.

**Workflow Takeaways:**

- It is preferable to train on fewer problems with a sampling large budget <i>n</i> if we are allowed training for multiple epochs on the same problem set. On the other hand, if multi-epoch training is not possible, then it might be preferable to include on more problems in a batch.
:::takeaway_end:::

### Question 3: Putting It All Together

$$
C \propto \color{blue}\underbrace{{B_{\text{problem}} \cdot n \cdot M}}_{\color{blue}{\text{varying}}}

$$

Finally, we relax all constraints and optimize (<i>B</i><sub>problem</sub>, <i>n</i>, <i>M</i>) jointly under a fixed compute budget. Consistent with our previous findings, **the compute-optimal strategy is primarily defined by scaling <i>n</i>**. As shown in Figure 12, the optimal *n*\*(<i>C</i>) follows a clean sigmoidal trajectory as compute increases, regardless of problem difficulty. In this regime, <i>B</i><sub>problem</sub> acts as a stability constraint rather than a performance driver. We find that <i>B</i><sub>problem</sub> fluctuates within a moderate range (e.g., maintaining <i>B</i><sub>problem</sub> ≥ 32 for Hard tasks) but does not exhibit a distinct scaling law. Thus, the practical recipe is simple: **scale <i>n</i> with compute** according to the sigmoidal fit, while keeping <i>B</i><sub>problem</sub> large enough to stabilize training.

![image.png](/assets/figures/sec3_q3_frontier.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 11. The frontier reward curve as a function of compute ,</b> where the frontier is computed by maximizing over values of <i>n</i>, <i>B</i><sub>problem</sub>, <i>M</i>. Curves are monotonic sigmoid fits; colors mark <i>n</i><b>.</b> The compute-optimal frontier still shifts to larger <i>n</i> as compute increases, showing that higher-rollout parallelism becomes optimal at higher budgets for both the easy and hard problem sets. On the other, the value of <i>B</i><sub>problem</sub> for each segment is either constant (e.g., 64 on the hard set) or varies substantially (on the easy set), but this variation results in only little fluctuation in performance (see Figure 11 for sensitivity of this choice).
</p>

![**Figure 12. Compute-optimal parallel rollouts $n^*$ as a function of total compute $C$ (Joint Optimization).** We sweep all hyperparameters ($n, B_{\text{problem}}, M$) to find the global optimal configuration at each compute budget. **Left (Easy) & Right (Hard):** The optimal $n$ increases monotonically with compute, well-fitted by a sigmoid function (dashed black lines). Note that despite the freedom to vary $B_{\text{problem}}$, the scaling behavior is dominated by $n$, which saturates at a lower value on the Hard set compared to the Easy set.](/assets/figures/sec3_q3_sigmoid.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 12. Compute-optimal parallel rollouts *n*\* as a function of total compute <i>C</i> (Joint Optimization).</b> We sweep all hyperparameters (<i>n</i>, <i>B</i><sub>problem</sub>, <i>M</i>) to find the global optimal configuration at each compute budget. <b>Left (Easy) & Right (Hard):</b> The optimal <i>n</i> increases monotonically with compute, well-fitted by a sigmoid function (dashed black lines). Note that despite the freedom to vary <i>B</i><sub>problem</sub>, the scaling behavior is dominated by <i>n</i>, which saturates at a lower value on the Hard set compared to the Easy set.
</p>

:::takeaway_begin:::
**Key Takeaways:** 

1. When jointly optimizing across all hyperparameters (<i>n</i>, <i>B</i><sub>problem</sub>, <i>M</i>), the compute-optimal value of <i>n</i> still increases with <i>C</i>, similar to the findings from Questions 1 & 2.
2. Note the best total rollout size <i>B</i> must generally increase as <i>C</i> increases, though the compute-optimal value of <i>B</i><sub>problem</sub> can be roughly chosen to be a constant at all compute budgets.
3. Our prescribed workflow suggests tuning <i>n</i> first for a new model or new run, followed by allocating <i>B</i><sub>problem</sub> to a reasonable value and setting <i>M</i> accordingly to the remaining compute. This provides the practical recommendation for users.
:::takeaway_end:::

---

## The Bigger Picture: Role of the Base Model and the Prompt Set

The recurring takeaway from the analyses above is that **the compute-optimal number of rollouts, <i>n</i>, increases with available sampling compute <i>C</i>** and eventually saturates as training becomes bottlenecked by other factors. While this conclusion is straightforward, a more interesting observation is that the same qualitative trend appears on both easy and hard datasets. This naturally raises several questions: why does this behavior persist across problem difficulty? Does it extend beyond the single base model considered so far? More broadly, under what interactions between a base model and a prompt distribution should we expect this trend to generalize? In the remainder of this section, we address these questions using a combination of conceptual arguments and empirical evidence. We begin by studying an “idealized” setting of training on a single problem, examine when predictions from the one-prompt case break down, and finally analyze how interactions of the base model and prompt set deviations from this ideal behavior.

### Base Case: Only One Training Problem

To build a conceptual model, let us study the simplest setting where we are provided with *one single problem* in the training set. We model this setting as a simple multi-armed bandit problem, where each arm represents one possible response to the problem. We assume training of a tabular softmax policy (i.e., softmax on independently represented logits denoting the response). Please see this for [setup](https://arxiv.org/abs/2402.17235).

Now let’s say that the base model attains an average pass@1 rate of *p* on this prompt and say <i>n</i> i.i.d.  response samples drawn from the policy are used for training at one gradient step. First note that <i>n</i> independent samples change pass@*n* exponentially: pass@*n* = 1-(1-*p*)*<sup>n</sup>*. Does <i>n</i> change the policy gradient update on the problem in one update? Averaging over <i>n</i> samples does **not** change the expected policy gradient direction: the expected update is identical to that obtained from a single sample. What it does change is the **variance** of the gradient estimate, which decreases by a factor <i>n</i>. Prior work shows that, when using a single sample per update, tabular (stochastic) softmax policy gradient enjoys an *O*(1/*t*) rate on the policy suboptimality (i.e., bound on optimal performance - attained performance) after *t* update steps. When <i>n</i> independent samples are used by averaging over the policy gradient update, repeating the same analysis yields E [ suboptimality at step *t* ]  =  *O* (1 / (<i>n</i> · *t*)), as the convergence rate is still linear in *t*, but the constant (that depends on <i>n</i>) now improves. Since the number of update steps *t* corresponds to the number of sequential iterations <i>M</i>, while the total sampling compute is <i>C</i> = <i>n</i> × <i>M</i>, this implies that in this single-prompt, tabular setting the error depends primarily on the total compute budget <i>C</i>. 

In short, in the one-problem setting, ***any allocation of compute between parallel sampling (<i>n</i>) and sequential updates (<i>M</i>) achieves comparable performance***, when their product is fixed.

### Extending to Multiple Training Problems with Different Base Models

While the theoretical argument above paints a simple picture for resource allocation, several nuances arise when extending this tabular analysis to a base model trained on a problem set of multiple problems. We discuss these nuances next.

**1) Training on multiple problems.** The guarantee above that <i>n</i> (rollouts per problem) and <i>M</i> (sequential iterations) are interchangeable for a single problem relies on a tabular setting in which updates on one problem do not affect any others. In this regime, learning rates can be adjusted to account for batch size <i>B</i><sub>problem</sub>, and training on the smallest <i>B</i><sub>problem</sub> to maximize <i>n</i> is the most beneficial. However, this is clearly not the case in practice. While scaling <i>n</i> takes precedence in Questions 2 & 3, we do observe that on hard datasets, there is a minimal value of <i>B</i><sub>problem</sub> that is needed to make progress on the validation score. Empirically, this leads to an optimal value of <i>B</i><sub>problem</sub> that is not too large (and of course, not too small).

We attribute this effect to [interference](https://www.notion.so/IsoFLOPs-Playbook-Workflows-for-Scaling-Sampling-FLOPs-for-RL-Training-of-LLMs-29f1951bd76780c58c96f3c07103e974?pvs=21) across problems. When multiple problems are trained jointly, updates interfere, meaning that different problems are learned at different rates. This causes overall progress to slow relative to the single problem setting. In this regime, allocating compute to larger values of <i>n</i> is preferable to increasing <i>M</i>, since higher rollout counts enable more uniform updates across problems within each iteration. This shifts the balance toward parallel sampling rather than sequential iterations, mitigating interference and improving overall learning efficiency.

**2) Incorporating a base model.** We now incorporate the role of a base model. The tabular analysis above ignores representation learning and treats the base model only through its initial success rate on a problem. In the single-problem setting, the only relevant statistic is the base model’s pass@1. As long as this pass rate is non-zero, the *O*(1/*t*) convergence guarantee applies. If the pass rate is zero, exploration must be explicitly addressed to ensure that at least one correct rollout can be sampled. This raises a question for the multi-problem setting: what statistic sufficiently captures the role of the base model when training with RL? 

**A mental model of interference.** A natural choice is the distribution of pass@1 across prompts. This statistic is sufficient in the tabular regime and also underlies [inference-time scaling laws](https://arxiv.org/abs/2502.17578) that relate pass@*n* at a population level to the pass@1 distribution. However, in RL the model also learns from the <i>n</i> rollouts it produces, and this static statistic no longer fully characterizes training dynamics. This is because updates across multiple problems introduce interference, which inference-only scaling does not face. A useful mental model is that interference is minimized and updates are closed to tabular when learning happens in a fashion that is roughly distributed uniformly across prompts. From this perspective, changes in the pass@1 distribution over training can act as a diagnostic for interference. When the distribution improves approximately uniformly, then interference is relatively controlled; when improvements are highly uneven, stronger interference effects are present and we might observe a rich-gets-richer phenomenon. In our early experiments, we observe roughly uniform improvements in pass@1 across problems with the base model we study (Qwen2.5-Instruct). On the Hard set, we observed uniform improvement on a narrow subset of hard problems, and no improvement on the others. As a result, any difference in performance are primarily driven by absolute pass@*n* values, leading to distinct underlying trends (coverage vs sharpening) on Hard and Easy sets in Question 1. Despite these differences, both problem sets ultimately exhibit the same scaling law. 

**We also evaluate whether our scaling conclusions extend to other datasets.** To understand if interference makes prediction infeasible on some datasets, we train on several Heterogeneous mixtures of Easy and Hard problems (Figure 13), as well as on an “extra hard” set consisting of problems on which the base model attains an empirical pass@128 of 0. These mixtures induce different degrees of dataset skew, which we expect to affect the rate at which pass@1 improves during training (a smaller <i>n</i> is likely to now improve pass@1 more on easier problems in the subset resulting in more interference, while a larger <i>n</i> should somewhat alleviate this issue). Despite this variation, Figure 13 reveals a **consistent crossover trend:** beyond a dataset-dependent compute threshold, larger values of <i>n</i> outperform smaller ones across most validation sets. On particularly hard validation sets, larger <i>n</i> often dominates almost entirely, or the range of compute over which smaller <i>n</i> is optimal shrinks substantially. This behavior aligns with our findings from Question 1 and suggests that the rate of pass@1 improvement controls both the width of the compute range over which a given <i>n</i> is optimal and the minimum compute-optimal value of <i>n</i>. **Crucially, our central takeaway remains unchanged:** larger compute budgets <i>C</i> consistently support larger compute-optimal values of <i>n</i>, even across diverse and highly skewed dataset mixtures.

![**Figure 13.**](/assets/figures/sec4_skewed_data_dist.png)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 13: Results across difficulty levels for small (<i>n</i> = 8) and large (<i>n</i> = 64) budgets under different training data distributions (each with 5K total samples) using Qwen2.5-7B-Instruct. Data Definitions:</b> Hard (pass@128=0), Easy (pass@128 ∈ [0.3, 0.6]), and Very Easy (pass@128 ∈ [0.6, 0.9]). <b>Training Settings:</b> Row 1: Hard Only (100% Hard); Row 2: Dual Mix (50% Hard, 50% Easy); Row 3: Tri Mix (50% Hard, 25% Easy, 25% Very Easy, i.e., the J-shaped distribution recommended in [Polaris](https://www.notion.so/1dfa954ff7c38094923ec7772bf447a1?pvs=21)). On each data distribution, we observe a consistent trend that larger <i>n</i> performs better at higher compute in in-domain evaluations, except for the very easy eval (Column 3). This task is likely so easy that added sequential or parallel compute <b>does not</b> make much difference in learning. Putting it all together, we see that training on all hard problems causes significant catastrophic forgetting on (very) easy problems, where the model could have decent pass rates, likely due to large distribution shift. When mixing easy problems in training, the catastrophic forgetting is largely mitigated on both easy and very easy problems, in exchange for a slight drop (~2%) on hard problems. A notable phenomenon is that mixing very easy problems (Row 3) doesn’t even help the in-domain very easy evaluation set, and degrades both easy and hard performance (compare with Row 2). These indicate: (1) if the focus is only on improving hard problem performance, it helps to <b>train on all hard data</b>; (2) otherwise, mixing easy data largely helps <b>maintain the model’s capability</b>, but very easy data are not useful.
</p>

Of course, interference does depend on the choice of the base model, and indeed we see that ***different base models may respond to interference in qualitatively different ways.*** While we did observe that some models, such as Qwen2.5-7B-Instruct, made roughly uniform progress across problems on the easy set (or on a subset of problems in the hard set), we found that other models such as Llama3.1-8B-Instruct did not. This heterogeneity affects how increasing <i>n</i> influences per-prompt optimization dynamics and, in turn, shifts the range of <i>n</i> values that appear compute-optimal in practice. For instance, as shown in Figure 14, although a larger <i>n</i> = 16 outperforms <i>n</i> = 8 at higher compute budgets, the compute-optimal <i>n</i> for Llama3.1-8B-Instruct is substantially smaller than that of Qwen2.5-7B-Instruct. Notably, the training reward for Llama3.1 plateaus at <i>n</i> = 128, suggesting the model struggles to effectively optimize for a high degree of parallel rollouts. We further experiment on Qwen3-4B-Instruct (Figure 15) and observe larger <i>n</i> = 64 yields better results than <i>n</i> = 8. While the validation reward ceases to rise at <i>n</i> = 128, the training reward continues to rise at high compute. Thus, the degradation on the validation set is likely attributable to a train-test gap, which we investigate in the subsequent section.

![**Figure 14:** **Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. While $n = 16$ outperforms $n = 8$ at higher compute budgets, further increasing $n$ to $128$ degrades both training and validation performance, indicating optimization difficulties at large $n$.](/assets/figures/sec4_llama_easy.png){width=800px}

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 14:</b> <b>Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set</b> (initial pass rate 0.3–0.6) for different values of <i>n</i>. While <i>n</i> = 16 outperforms <i>n</i> = 8 at higher compute budgets, further increasing <i>n</i> to 128 degrades both training and validation performance, indicating optimization difficulties at large <i>n</i>.
</p>

![**Figure 15:** **Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. Larger $n$ values, such as $n = 64$, outperform smaller ones (e.g., $n = 8$) at higher compute. Notably, training rewards for $n = 128$ remain high and in fact, $n=128$ appears on the compute-optimal frontier after a considerable amount of compute has been spent (right), but it falls below the compute-optimal frontier on the validation set (left). This is due to early overfitting before the benefits of larger $n$ can be realized and highlights a clear train–test gap.](/assets/figures/sec4_qwen3_easy.png){width=800px}

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 15:</b> <b>Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set</b> (initial pass rate 0.3–0.6) for different values of <i>n</i>. Larger <i>n</i> values, such as <i>n</i> = 64, outperform smaller ones (e.g., <i>n</i> = 8) at higher compute. Notably, training rewards for <i>n</i> = 128 remain high and in fact, <i>n</i> = 128 appears on the compute-optimal frontier after a considerable amount of compute has been spent (right), but it falls below the compute-optimal frontier on the validation set (left). This is due to early overfitting before the benefits of larger <i>n</i> can be realized and highlights a clear train–test gap.
</p>

**3) Train-test gap.** Finally, our scaling results are reported on validation metrics, even though optimization dynamics are primarily driven by the training set composition. As a result, the emergence of scaling laws on the validation set depends on sustained transfer of performance from the training to the test set, which is not guaranteed. For instance, when the prompt set is too small, training may overfit prematurely within a fixed number of gradient steps. In such cases, larger values of <i>n</i> may no longer appear compute-optimal at higher compute budgets, simply because additional training beyond some number of training steps fails to improve test-set performance (see Figure 13 as an example, where <i>n</i> = 128 is never compute-optimal). 

When overfitting dominates, scaling laws may only hold for certain ranges of hyperparameters that avoid the overfitting regime, but naively plotting scaling trends using our workflow above will result in incorrect conclusions. To illustrate this, we run training with different prompt set sizes, including sets substantially smaller than the default size of 6,000 problems used above. We observe that the compute-optimal values of <i>n</i> cap out at much smaller levels when the prompt set is smaller. This behavior is expected, as validation performance begins to degrade with additional training compute in the small-prompt regime due to overfitting, meaning that there is no way for larger <i>n</i> values to achieve the frontier. As discussed above, this also justifies the sigmoid shape of the hypothesized relationship between *n*\*(<i>C</i>) and <i>C</i> in Figure 6. 

Technically, we can also plot compute-optimal scaling laws for training performance instead of validation in the hope that compute-optimal hyperparameter configurations for best training rewards also results in best validation performance. We find evidence to the contrary as in many cases  training runs with smaller values of <i>n</i> (keeping <i>B</i><sub>problem</sub> fixed) result in better training rewards for the same amount of total training compute spent (see Figure 16). While this result appears contradictory at first, ***it is perhaps expected as training reward (in our logging scheme) logs rewards on samples that were used for training: hence, logging statistics on this set results in a natural bias.*** More mechanistically, on the training set: 1) RL runs with smaller values of <i>n</i> are able to epoch faster on the training problems for the same amount of sampling compute as runs with larger values of <i>n</i>; and 2) when we run RL with small values of <i>n</i>  then we are able to improve training performance quickly on easy problems without making any progress on the hard ones, which means that the total training performance is dominated by only one set of the data (easy problems), which rightly does not reflect in good validation performance. 

![](/assets/figures/sec3_varyD.png){width=800px}

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 16:</b> <b>Impact of data size (<i>D</i>) on compute-optimal frontiers for Qwen2.5-7B-Instruct (easy set).</b> With a larger dataset (<i>D</i>=6k), we continues to improve with more parallel rollouts (<i>n</i> = 512; <b><i>left</i></b>). With a smaller dataset (<i>D</i>=500), performance peaks at <i>n</i> = 256, and a larger <i>n</i> leads to degradation (<i>n</i> = 256).
</p>

:::takeaway_begin:::
**Key Takeaways:**

1. While sequential and parallel computation are perfectly interchangeable in a tabular setting, interference across problems prevents a perfect exchange in practical LLM training. As a result, allocating compute toward parallel sampling to achieve a roughly uniform rate of improvement across training problems is often preferable to more sequential training iterations.
2. Although different base models exhibit different levels of interference on different problem sets, we observe similar scaling rules for how compute should be allocated to the number of parallel rollouts across different prompt set combinations and base models, although the underlying causes of those scaling trends are different. 
3. The size of the training problem set manifests as a train–test gap: when the training set is small, validation performance saturates early. This leads to lower saturation values for <i>n</i> and <i>M</i>, and correspondingly higher optimal values of <i>B</i><sub>problem</sub>.
:::takeaway_end:::

---

## Discussion, Summary, and Future Work

A central takeaway from this work is that **healthy RL recipes are inherently dependent on the prompt distribution and the behavior of RL training depends on the interaction between the base model and the prompt set**, and that this dependence manifests directly in how optimal hyperparameters scale with compute. The same algorithm can exhibit qualitatively different scaling behavior on easy versus hard problem sets. On easier problems, increasing parallel rollout compute primarily improves sharpening and robustness, whereas on harder problems the dominant effect is expanded coverage. While trends in compute-optimal hyperparameters are often consistent when measured using average reward, they can diverge substantially under alternative metrics such as best@k and worst@k. This sensitivity to both data difficulty and evaluation metric highlights a key departure from supervised learning, where scaling behavior is typically more uniform once the model size is fixed. In RL, scaling laws are therefore inherently more nuanced and conditional, reflecting the coupled effects of optimization dynamics, exploration, task structure, and evaluation criteria. This study provides a concrete framework for identifying and reasoning about these trends in specific base-model and prompt-set settings, and empirically illustrates them across several representative regimes.

Our analysis also surfaces an important open challenge for future work: **interference across problems**. In an idealized single-problem setting, one might expect clean exponential improvements with increasing sampling compute. In practice, however, RL is performed over mixtures of problems, where progress on some tasks can interfere with learning on others. This population-level interference alters both the coefficients and effective hyperparameter values in observed scaling laws.

A promising direction is to identify sufficient statistics early in training that capture the degree of interference across problems, enabling more accurate predictions of how additional compute will translate into subsequent learning progress. We believe that tracking changes in the pass@1 distribution over the course of training provides a natural starting point for studying interference. Developing such models would be a critical step toward predictive scaling laws for RL on heterogeneous data mixtures. Mathematically, this points toward approximate closed-form rules for compute-optimal hyperparameters that generalize across base models and prompt distributions by estimating a small number of statistics that summarize the pass@1 landscape and incorporating them into scaling-law fits. This remains an interesting direction for future work.

---

## Appendices

:::fold_begin title="A. Additional compute-optimal results":::

### A. Additional compute-optimal results

In the main results, we show one fixed value for <i>B</i><sub>problem</sub> = 32 for brevity. Figures 1x and 1x demonstrate that the scaling trend described in the main text, where larger compute budgets favor increased parallel rollouts (<i>n</i>), holds across different fixed values of <i>B</i><sub>problem</sub>. While it appears that larger <i>B</i><sub>problem</sub> settings saturate at lower <i>n</i> values (e.g., <i>n</i> = 16 at <i>B</i><sub>problem</sub> = 1,024), this might be attributable to the total batch size constraint (<i>B</i><sub>max</sub> ≥ <i>B</i><sub>problem</sub> · <i>n</i>) in the sweep experiments. The precise interaction between <i>B</i><sub>problem</sub> and the saturation point of <i>n</i> remains an open question for future investigation.

<!-- ![**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Easy set. Each subplot fixed $B_\text{problem}$ and sweeps $n$.**](__IMAGE_PLACEHOLDER__) -->

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 1x.</b> <b>Compute-optimal frontiers across varying problem batch sizes (<i>B</i><sub>problem</sub>) on the Easy set. Each subplot fixed <i>B</i><sub>problem</sub> and sweeps <i>n</i>.</b>
</p>

<!-- ![**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Hard set.** Each subplot fixed $B_\text{problem}$ and sweeps $n$.](__IMAGE_PLACEHOLDER__) -->

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
<b>Figure 1x.</b> <b>Compute-optimal frontiers across varying problem batch sizes (<i>B</i><sub>problem</sub>) on the Hard set.</b> Each subplot fixed <i>B</i><sub>problem</sub> and sweeps <i>n</i>.
</p>

Besides, here we show more results under different fixed B on the 2 sets showing similar trend as we demonstrate on Section 3.2 that it’s increasingly preferable to allocate more parallel rollouts per problem given higher sampling budgets.

Fix B, easy

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

Fix B, hard

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

:::fold_end:::

:::fold_begin title="B. Generalization to OOD tasks":::

### B. Generalization to OOD tasks

In the main text, we prioritize in-domain validation results to minimize the influence of train-test distribution shifts, thereby allowing for a cleaner analysis of compute allocation scaling. In reality, practical post-training workflows require models to generalize to unseen distributions like downstream tasks. We examine whether the benefits of increasing parallel rollouts (<i>n</i>) extend to out-of-domain (OOD) downstream tasks. As illustrated in Figure 1x, we observe that larger values of <i>n</i> lead to higher performance on AIME24.

![Figure 1x: AIME 24 scores trained with varying parallel rollouts ($n$) under a fixed problem batch size ($B_\text{problem}=32$).](__IMAGE_PLACEHOLDER__)

<p align="left" style="color: #666; font-size: 0.9em; margin-top: 5px;">
Figure 1x: AIME 24 scores trained with varying parallel rollouts (<i>n</i>) under a fixed problem batch size (<i>B</i><sub>problem</sub> = 32).
</p>

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

:::fold_end:::

:::fold_begin title="C. Effects of baseline estimation variance":::

### C. Effects of baseline estimation variance

We discuss in the main content how and why larger <i>n</i> could outperform small <i>n</i> at high compute regime from exploration and optimization perspective. Another theoretical advantage of larger <i>n</i> in the GRPO algorithm is that it provides a more robust estimator for the baseline (group average reward), thereby reducing the variance of the advantage estimates. To isolate the performance gain attributed specifically to precise baseline estimation versus simply training on more data, we conducted an ablation study with a fixed problem batch size of (<i>B</i><sub>problem</sub> = 128). We compared three settings:

1. **Large <i>n</i> = 256**
2. **Small** <i>n</i> = 64
3. **Decoupled: small <i>n</i> = 64 for policy update and large <i>n</i> = 256 for baseline estimation.** We generate 256 rollouts to compute high-precision advantage estimates, but randomly subsample only 64 rollouts to compute the policy gradient update.

We observe a performance **(1) > (3) > (2)**. 

- (3) > (2) confirms that a lower-variance baseline estimator contributes to the gains.
- The standard (1) <i>n</i> = 256 run still outperforms the (3) setting, suggesting that while baseline precision matters, the primary benefit of scaling <i>n</i> comes from the broader exploration.

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

### (optional) D. Off-policy

### (optional) E. pope qwen3

<!-- ![image.png](__IMAGE_PLACEHOLDER__) -->

:::fold_end:::