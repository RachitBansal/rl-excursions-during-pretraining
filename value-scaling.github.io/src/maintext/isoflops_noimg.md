
![Figure 1: Compute-optimal allocation of parallel rollouts per problem (n). We analyze how the optimal number of rollouts per problem (n) evolves with the total rollout sampling budget in RL with outcome rewards (GRPO). We find the compute-optimal n is not static, but increases as more sampling compute budget is provided (left). We find this allocation can be represented via a sigmoid fit (right).](__IMAGE_PLACEHOLDER__)

**Figure 1 [teaser, to prettify]: Compute-optimal allocation of parallel rollouts per problem ($n$).** We analyze how the optimal number of rollouts per problem ($n$) evolves with the total rollout sampling budget in RL with outcome rewards (GRPO). We find the compute-optimal $n$ is not static, but increases as more sampling compute budget is provided (left). We find this allocation can be represented via a sigmoid fit (right).

A persistent blocker to scaling up reinforcement learning (RL) for LLMs is the absence of a ***concrete workflow*** : **a recipe that tells practitioners *what* to scale in the RL, *how* to scale it, and *what outcomes of scaling one should expect*.** In many areas of modern-day AI, such workflows emerge from [empirical](https://arxiv.org/pdf/2001.08361) [scaling laws](https://arxiv.org/pdf/2203.15556): small-scale experiments reveal how performance should grow with compute, data, or model size. These laws inform compute allocation, models to use, and hyperparameter settings.

For RL, scaling laws remain far less understood compared to pretraining or supervised learning due to the interplay between data collection (***exploration***) and optimization (***learning from data***). Recent works have begun to sketch what these laws might look like in classical [deep](https://arxiv.org/abs/2104.03113) [RL](https://value-scaling.github.io/) [settings](https://arxiv.org/abs/2301.13442). But in the LLM setting, this line of work is still in its infancy. The [most relevant prior results](https://arxiv.org/abs/2510.13786) show that, under **specific conditions** (a particular problem mixture), reward curves in RL follow a clean sigmoidal shape when run for longer. Another [prior work](https://arxiv.org/abs/2509.25300) shows that RL training exhibits similar scaling behavior as pretraining in the model size, but ignores other hyperparameters. Simply fitting the shape of a learning curve or showing gains with larger models however does not answer one major question scaling laws intend to address: ***resource allocation** to set up an RL run under the conditions that a downstream user faces*. Given a base model, a problem set, and a total budget on compute, how should one spend this compute? If we had 10x more compute, how should that be spent? Which hyperparameters affect this resource allocation question the most and why? How does resource allocation change when the base model changes?

We have been working toward answering these questions. This article aims to frame the core scaling issues and provide practical guidance for allocating compute in on-policy RL for LLMs, with a particular focus on compute spent on **online sampling (rollouts)**. The picture that emerges is nuanced: ***scaling behavior depends not only on the total compute budget, but also on the interaction between the base model and the prompt distribution.*** Nevertheless, we find that **predictable allocation rules for key hyperparameters emerge as sampling compute increases**. Concretely, as we discuss in detail, for on-policy RL algorithms that optimize policies using multiple parallel rollouts per sequential gradient step, we observe the following:

- **Optimal parallel rollouts per problem ($n$) grows with sampling compute budget ($C$)**. As the total sampling budget increases, the optimal $n$ grows following *a predictable sigmoid curve*. This indicates to maximize performance, practitioners should configure $n$ based on their the compute budget regime**:** allocating larger $n$ when given higher compute budgets; smaller $n$ when the compute budget is small.
- **Easy and hard problems: similar scaling trends, but different mechanisms.** While both easy and hard problem sets benefit from scaling $n$, the underlying mechanisms are different. On easy problems, larger number of rollouts ($n$) primarily acts to sharpen the policy on already solvable problems, indicated by the improvements in the worst@k metric. In contrast, on hard problem sets, scaling $n$ is essential for expanding coverage (discovering rare successful trajectories), directly improving the best@k metric.
- **The number of unique problems per batch ($B_\text{problem}$) has marginal impact**. We find that varying the number of unique problems per batch ($B_{\text{problem}}$) yields negligible changes in validation reward, provided it remains neither too small or too large. Thus, under fixed hardware constraints ($B = B_{\text{problem}} \times n$), this insensitivity dictates a dynamic allocation strategy: prioritize **large $B_{\text{problem}}$** (small $n$) at low compute budgets, but shift to **large $n$** (small $B_{\text{problem}}$) at high compute budgets to maximize performance, though the trade-off on hard problems where reward is hard to obtain is more nuanced.
- **The saturation point of compute-optimal number of rollouts ($n$) is determined by problem set size, difficulty, and the interaction between the base model and the prompt set**. The value at which $n$ saturates is governed by three specific interactions: a) **problem set size:** Smaller datasets lower the saturation point due to early overfitting: validation reward degrades despite training reward gains, making large $n$ values simply infeasible; b) **problem difficulty:** Harder problems saturate at a smaller compute-optimal $n$ values because they require a critical mass of sequential updates to make progress otherwise find it hard to balance optimization and exploration with too large $n$. Moreover, skewed dataset compositions also skew $n$ values due to interference between easy and hard prompts; and **c) base model**, which dictates learnability and transfer across prompts being trained upon.

---

## Where RL Scaling Laws Come From (When They Exist), Conceptually

To begin, it helps to recall why scaling laws can be derived in supervised learning or pretraining, and what makes learning dynamics predictable in these settings. In supervised learning, the objective is typically cross entropy, which is smooth and optimized over a fixed data distribution. This results in relatively well-behaved optimization dynamics, where small parameter updates lead to small and predictable changes in the loss. Consequently, under well-chosen hyperparameters, which can often be identified through small-scale experiments, the training dynamics of supervised learning become predictable, allowing the loss to be modeled as a function of compute or data. The **statistical structure of the data**, such as the covariance spectrum, remains constant through training. A simple mental model is that the [decay of this spectrum](https://arxiv.org/abs/2102.06701) governs the power law scaling behavior observed in practice. We emphasize that this perspective is an approximation rather than a formal proof, but it provides useful intuition for why scaling laws emerge in supervised learning. In RL, the challenge of deriving any scaling law is two fold: 

1. ***the objective given by the  expected reward (unlike cross-entropy) behaves non-smoothly across training iterations which make small perturbations to the parameters*,**
2. ***the data distribution itself depends on the policy being optimized***. 

When training LLMs with a binary 0/1 reward, we observe that the first challenge of non-smooth rewards is relatively mild, and that in some regimes it is indeed possible to predict the expected reward. However, we did also see in our early experiments that attempting to fit other performance metrics beyond reward (e.g., pass@k or worst@k) poses additional predictability challenges due to objective shift. For this reason, rather than fitting performance directly, we fit **compute-optimal hyperparameters** as a function of resources. 

The second challenge is more fundamental. In online, on-policy RL, the base policy and every policy update determines the distribution of future experience, which is non-stationary. This in turn alters the effective data covariance seen by the policy. As training progresses, both the policy parameters and the data distribution evolve together. This violates the stationary data assumption with a fixed covariance spectrum that underlies many of the standard intuitions for scaling laws in supervised learning, and therefore the usual recipes for deriving scaling laws (e.g., in pretraining) are not directly applicable in RL.

***We therefore will first seek an RL recipe whose learning dynamics scale predictably with additional compute.*** In online RL, performance scaling is governed by two tightly coupled mechanisms: **exploration**, which determines what data is collected, and **optimization**, which determines what and how effectively the model learns from that data. These mechanisms are inherently in tension. Exploration favors sampling unlikely but potentially informative behaviors, while optimization pushes the policy toward responses that already achieve high reward. In LLM settings, exploratory responses are often extremely low probability under the current policy, and training on them can destabilize optimization. A common symptom of this instability is pathological behavior in the model’s next-token entropy, which may grow uncontrollably. As a result, naive RL recipes lead to highly unstable coupling between data generation and unpredictable learning dynamics. To mitigate this, we design what we refer to as a **“healthy” RL recipe**, in which exploration and optimization are coupled smoothly enough that future data generation remains predictable. Concretely, this entails avoiding off-policy samples, and using entropy or KL regularization only when supported by the problem composition. Empirically, as we show in later sections, such recipes exhibit stable entropy dynamics and enable performance to scale in a regular manner, thereby admitting meaningful scaling-law analysis.

Given this tight coupling between data collection and optimization, small changes in exploration can substantially alter the data the model trains on next, leading to qualitatively different learning dynamics. As a result, ***RL training behavior differs substantially between easy and hard problems***. We further find that repeatedly updating on the same data leads to overfitting and causes the policy distribution to shift too rapidly, breaking predictability. This effect is consistent with [our prior work](https://value-scaling.github.io/), which shows that ***clean scaling laws in RL emerge only when off-policy reuse is limited (i.e., a low updates-to-data ratio) and optimization remains stable**.* Motivated by these findings, we focus on on-policy RL in the remainder of this post, and analyze scaling mechanisms separately for easy and hard problem regimes.

---

## Our Main Scaling Question: Compute-Optimal Sampling in LLM RL

Before we prescribe our healthy RL recipes or state our results, we first formally outline the key scaling setups that we operate in. Ultimately, scaling laws are useful because they help us decide how to allocate limited resources such as compute or data in order to achieve the best possible performance. Typically, these laws are obtained by running controlled small-scale experiments and extrapolating the observed trends. Therefore, it is helpful to begin with a basic question: **what resources actually matter in LLM RL?** In our setting, where RL is used to train a given base model on a fixed problem set, what are these resources?

In standard RL, two resources are crucial: **compute**, often measured in training FLOPs, and **data**, measured in the number of environment transitions collected online. In LLM RL, an environment naturally corresponds to a single prompt or problem, and as mentioned above, we assume access to a fixed set of such problems. When running RL post-training of a given base model on this fixed problem set, data is created entirely by spending compute on a given problem (prompt) set because every training rollout is obtained by rolling out the model (and problems are often negligibly-sized in comparison; though not always, e.g., in multi-turn settings, but we do only operate in a single-turn setting). This makes the distinction between compute and data less clear. Thus, for our study, we consider ***compute to be the only fundamental resource***. 

Given the primary resource of compute, it is natural to divide it into **training compute** and **sampling compute**. In LLM RL, sampling compute usually dominates the overall cost because every step of exploration requires generating multiple samples in an autoregressive manner. In addition, we typically train on all the data that is collected. Unless response lengths are scaled drastically, both training and inference compute scale (roughly) linearly with the number of tokens. This gives us a useful simplification for studying scaling. ***We can treat the sampling compute budget as the main quantity to allocate,*** since training compute grows in direct proportion to it, and focus on finding the most effective way to spend sampling compute. Before we go into our problem statement, we present some notation to simplify our discussion.

### Notation and Definitions

We define the primary symbols and their relationships as follows:

- $C$**:** sampling compute, measured as the **number of rollouts**. We use rollouts instead of tokens because the number of tokens generated per rollout is hard to predict ahead of time.
- **$M$**: the total number of **gradient update iterations** in training (often called “*steps”* in common open LLM-RL frameworks).
- $B$: the **rollout batch size** per iteration, i.e., the total number of rollouts collected in one iteration.

The total rollout compute scales as:

$$
C \propto B \times M
$$

$B$ can be further broken down into two components:

- **$B_\text{problem}$**: the number of **unique problems** in the rollout batch of each gradient step.
- **$n$:** the number of rollouts sampled **per problem** (also referred to as the *group size* in [GRPO](https://arxiv.org/pdf/2402.03300)).

To sum up, rollout compute $C$ can be decomposed into three resources, that we can allocate:

$$
C \propto  B_\text{problem} \times n \times M
$$

### Problem Statement

Our central scaling question, put informally is:

:::callout_begin type="info":::
**Given a base model and a problem set, how should we spend a fixed amount of sampling compute to achieve the highest possible post-training performance?**
:::callout_end:::

This simple question abstracts all of the complexity of modern LLM RL. We make a simplifying assumption and assume that response length, on an average, is captured in the constants, we are now left to allocate sampling compute into $B_\text{problem}, n, \text{~and~} M$. In principle, we could carry out our analysis accounting for the compute spent in terms of the total tokens sampled instead of the total rollouts. However, in our experiments we observed that although response length might vary across settings, these variations manifest primarily as a constant offset in log-log space, leaving the fundamental scaling trends intact. Hence, our conclusions would be similar whether or not we accounted for the sequence length, and we chose to ignore it for simplicity. Our scaling study is based on one model and a problem set, so we do not count them as resources. Hence, our formal resource allocation question is given by:

:::callout_begin type="tip":::
**Given a base model, a problem set, and a sampling budget $C \leq C_\text{max}$, find the configurations of $n, M, B_{\mathrm{problem}}$ that attain the best possible performance as measured by a target performance metric.**
:::callout_end:::

Ideally, as more sampling compute is provided, the optimal values of $n, M, B_{\mathrm{problem}}$ should be such that more compute translates to better performance. This means that the underlying recipe for which we prescribe values of $n, M, B_{\mathrm{problem}}$ should be such that it ***scales in an healthy manner*** as more sampling compute is allocated. RL runs with LLMs often destabilize or collapse with many optimization steps, and this means that we must first prescribe a scalable/healthy RL recipe before studying the above resource allocation question.  We anchor our main experiments on [Qwen2.5-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) and leverage [Qwen3-4B-Instruct](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) and [Llama3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) for expanding our observations later.

---

## What Constitutes a Healthy RL Recipe for a Given Base Model?

Now, we discuss several characteristics of optimization and exploration mechanisms that support stable and healthy RL. From our experiments, we identify a few key factors that consistently govern whether optimization and exploration remain stable and scalable: (1) the difficulty distribution of the dataset, (2) the behavior of token entropy, and (3) the learning rate. These are not the only factors, in fact, we also observe that “staleness” (or how off-policy the generated rollouts are) also affects scaling and performance, but leave a discussion of it from the current blog post to focus on fully on-policy recipes. We study each of the remaining factors in this section.

### Factor 1: Dataset Difficulty Distribution

The first factor that informs the health of an RL run is the composition of the problem set. Easy problems, where the base model can already sample multiple correct traces, tend to produce [rapid entropy collapse](https://arxiv.org/abs/2505.22617) of the model’s next token distribution. In contrast, making progress on [very hard problems](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/), where the base model can hardly sample ***any*** correct trace, requires careful optimization that actively couples with exploration. In fact, as we will show later, RL training behaves rather unpredictably when the problem set is too hard, as the model must balance between **exploration on unsolvable problems** and **exploitation of reachable ones** (i.e., those with at least one successful pass). Recent works show training on such problems requires algorithmic modifications to make very hard problems “appear” easy first (see [our blog post](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/) and [RL grokking](https://rdi.berkeley.edu/blog/rl-grokking-recipe)). This means that the difficulty of the problem set relative to the base model often very directly determines  the knobs behind a healthy RL recipe. 

**A practical way to quantify this difficulty is to evaluate the base model’s performance on the problem set prior to training.** In this blog, we use the [Guru-Math](https://arxiv.org/abs/2506.14965) dataset for its sizable, carefully curated math problem collection with verified answers, which allows us to perform controlled sampling. We first measure the problem difficulty by *avg@16* (average accuracy over 16 trials obtained for a given problem) with the base model we use for RL training and then construct training problem sets by difficulty: 

- ***Easy*** problem set: **avg@16 in [0.3, 0.6]** (6k samples), with a 300-sample in-domain validation set.
- ***Hard*** problem set: **avg@16 in [0.0, 0.0625]** (5k samples), with a 300-sample in-domain validation set.

![Figure 2: Distributions of problem difficulty for the Easy and Hard problem sets. Difficulty is quantified using avg@16, the average pass rate over 16 generations per problem.](__IMAGE_PLACEHOLDER__)

<!-- 
**Figure 2: Distributions of problem difficulty for the Easy and Hard problem sets.** Difficulty is quantified using avg@16, the average pass rate over 16 generations per problem. -->

Beyond these primary Easy and Hard sets for our experiments, we also curate a **Heterogeneous** set (mixing easy and hard set in different proportions) and an **Extremely Hard** (pass@128 = 0) for extending our observations. We default to utilizing the recipe for the Hard set on these problem sets as well. We discuss results on this set later in this post (see the section titled “The Bigger Picture”).


### Factor 2: Entropy Control


The interaction between the problem distribution and the base model is clearly reflected in token-level entropy and, somewhat correlatedly, the KL divergence to the base model. While neither directly measures task performance, both serve as sensitive indicators of optimization health. When entropy or KL becomes too large or too small, learning can stall or become unstable. Intuitively, entropy controls how broadly the policy explores at the token level, while the KL divergence anchors the policy to the base model and limits excessive drift. The behavior of these quantities depends on problem difficulty. It is often a common practice to add an entropy regularizer for training. On easy problems, running RL without a sufficiently large entropy regularizer often leads to premature entropy collapse. However, on hard problems, running RL with an entropy regularizer alone often leads to an explosion in entropy and response length. A KL constraint by itself typically over-constrains exploration and is unnecessary in most regimes, indeed RL runs can work just as well without a KL constraint. However, on hard problems, where entropy can explode early in training, a KL anchor is effective at delaying or totally avoiding instability. For this reason, ***whenever we use an entropy loss, we pair it with a KL loss to provide a stabilizing anchor.***


[Prior work](https://arxiv.org/abs/2510.13786) often employs a **zero variance filtering** (”zero-var filter” in Figure 3 below) mechanism when using rollout-based policy gradient methods such as GRPO, removing training prompts where all rollouts are either all incorrect or all correct. This filtering typically serves two purposes. First, it increases the effective batch size by keeping prompts that produce a non-zero policy gradient. Second, when entropy and KL regularizers are used, it prevents these regularizers from being applied on rollouts that do not contribute to an active policy gradient. The second mechanism is particularly important on hard problems, where RL optimization naturally pushes the policy toward higher entropy in order to discover rare positive trajectories that are unlikely to be produced by the base model but succeed. This [increase in entropy is driven by the policy gradient](https://arxiv.org/abs/2506.09026) itself and is often necessary for effective exploration. 


Even with zero-variance filtering applied, problems in which rare positives are sampled can still experience entropy explosions, since the resulting entropy or KL regularizers remain active. More concretely, our experiments (Figure 3) show that applying zero-variance filtering to the KL and entropy terms mitigates some of the most severe instabilities on hard problems. However, we find that it does not fully eliminate instability in all cases. **Removing KL and entropy regularization entirely yields the most stable training dynamics**. Thus, we adopt **KL+entropy regularization on the Easy set**, where entropy otherwise tends to collapse, and **no KL or entropy regularization on the Hard set**, to avoid instability.

**Experiment setup.** We use Qwen2.5-7B-Instruct as the base model with a max output length of 8,192 tokens and employ the [GRPO](https://arxiv.org/abs/2402.03300) algorithm. We fix $B_\text{problem}=256$ and $n=16$. On both the Easy and Hard sets, we perform ablations over (1) the presence of KL and entropy regularization and (2) the application of the zero-variance filter, including variants where the filter is applied only to the KL and entropy loss terms.

![Figure 3: Ablations of KL+entropy and zero-var filter across the Easy and Hard problem set. On the Easy set, all configurations improve steadily, with standard KL+entropy achieving the highest reward (left). On the Hard set, while applying zero-variance filtering to the KL and entropy terms helps mitigate instability, disabling these regularizers entirely results in significantly more stable training (right).](__IMAGE_PLACEHOLDER__)

**Figure 3: Ablations of KL+entropy and zero-var filter across the Easy and Hard problem set.** On the Easy set, all configurations improve steadily, with standard “KL+entropy” achieving the highest reward ***(left)***. On the Hard set, while applying zero-variance filtering to the KL and entropy terms helps mitigate instability, disabling these regularizers entirely results in significantly more stable training ***(right)***.

### Factor 3: Learning-Rate Scaling

Building on the perspective of stable entropy and KL dynamics, the **learning rate (LR)**, denoted as $\eta$, governs the magnitude of policy updates per unit of advantage. It is well-established that different model scales exhibit varying sensitivities to the learning rate ([Kaplan et al. 2020](https://arxiv.org/abs/2001.08361); [Hoffman et al. 2022](https://arxiv.org/abs/2203.15556)), and additionally the best learning rate depends on the batch size in supervised learning ([Krizhevsky 2014](https://arxiv.org/abs/1404.5997); [Goyal et al. 2017](https://arxiv.org/abs/1706.02677); [McCandlish et al. 2018](https://arxiv.org/abs/2505.23971)). Since we vary the batch size $B$ in our experiments, establishing a robust baseline LR and a systematic scaling strategy is essential. To formalize this choice, we first identify a **base learning rate anchor**. We then study how different scaling rules perform as the batch size increases. Based on our experiments *(Figure 4)*, we adopt $\eta_{\text{base}} = 10^{-6}$ as the anchor for a batch size of $B=1,024$ and utilize the **square-root scaling** rule with respect to $B$.

**Experiment setup.** We conduct these experiments on the Easy set using the [AdamW](https://arxiv.org/abs/1711.05101) optimizer. The learning rate is linearly warmed up for 10 steps and then held constant for the remainder of training. We fix a baseline configuration with $B_\text{problem}=128,n=8,B=128\times 8=1,024$ and run a grid search for a good base LR anchor. We then increase $n$ to $64$ and $B$ to $128\times64=8,192$ and compare three scaling strategies:

- **Constant LR:** $\eta$ remains fixed regardless of changes in $B$.
- **Linear scaling:** $\eta$ scales linearly with $B$.
- **Square-root scaling:** $\eta$ scales proportionally to $\sqrt{B}$.

As shown in Figure 4 below, we observe that ***square-root scaling enables faster convergence while avoiding the instability seen in linear scaling.*** Although we ran this experiment on the easy problem set, we expect the same learning rate scaling strategy to apply across problem sets of varying difficulty. Conceptually, the way the learning rate should scale with batch size is governed by gradient variance and noise. While problem difficulty may change the optimal *absolute* learning rate, it should not fundamentally change the underlying scaling relationship as batch size increases.

![Figure 4: Base LR selection and scaling strategy validation. We sweep of the base learning rate at B=1024, and identify η=10^-6 as the baselineLR (left). We then compare LR scaling methods at a larger batch size (B=8192). Square-root scaling enables faster convergence without the instability observed in linear scaling, validating it as the robust choice for large-scale training (right).](__IMAGE_PLACEHOLDER__)

**Figure 4: Base LR selection and scaling strategy validation.** We sweep of the base learning rate at $B=1024$, and identify $\eta=10^{-6}$ as the baselineLR ***(left)***. We then compare LR scaling methods at a larger batch size ($B=8192$). **Square-root scaling** enables faster convergence without the instability observed in linear scaling, validating it as the robust choice for large-scale training ***(right)***.

[add configuration table to be clear]

:::takeaway_begin:::
**Key Takeaways**:

1. RL training exhibits distinct training behaviors depending on problem difficulty. We therefore explicitly **curate and control for both Easy and Hard datasets** to ensure the recipe is robust to different saturation points and exploration requirements. On heterogeneous datasets that we discuss later, we simply use the recipe corresponding to the Hard dataset to avoid instability.
2. The necessity of regularization changes based on the difficulty level. **Easy tasks** benefit from KL divergence and entropy constraints to prevent premature collapse, whereas **Hard tasks** achieve peak performance when these constraints are removed to allow unconstrained exploration. Training on mixed datasets is most stable when no KL divergence or entropy are used.
3. Learning rate should not be fixed as the total batch size $B$ changes. Of the schemes we compared, the **square-root learning rate scaling** strategy is the best.
:::takeaway_end:::
---

## Results: Compute-Optimal Allocation of Sampling FLOPs in LLM RL

We now turn to our central question: ***given a fixed sampling compute budget, how should we allocate it across the RL sampling knobs to maximize performance?*** Recall that the rollout compute $C$ scales $\propto B_{\text{problem}} \times {n \times M}$. Our goal is ***not*** to tune a single best configuration for training, but to identify **allocation workflows** for distributing a fixed sampling budget across problems per batch $B_{\mathrm{problem}}$ and rollouts $n$ sampled for each problem in the batch. Across all experiments in this section, we sweep $(n, B_\text{problem}, M)$ across a range of compute budgets $C$. For a fixed compute budget $C = C_0$, we evaluate multiple allocations and define the ***compute-optimal frontier*** as the highest IID validation set reward achievable using total compute $C_0$. We get different plots on the frontier as we increase and sweep over values of $C_0$.

**Data analysis workflow.** To make our scaling law prescriptions, we subsample the data from runs to only a smaller set of ***record-breaking*** points on a learning curve of reward (or any other performance metric) as a function of increasing compute. A record-breaking point is defined as the first point in a run that attains a higher validation reward relative to all previous points. For computing this higher reward, we first bucketize the reward into discrete bins and then pick the first points where the bucket increments. See [this] footnote for a detailed explanation on why utilizing record-breaking points for deriving the fit is sufficient. We then fit a monotonic function to the record-breaking points to obtain prescriptions for compute-optimal values of $n$, $B_\text{problem}$, and $M$. Because this pre-processing is order-preserving, this procedure does not introduce spurious non-monotonicity and yields the same frontier in practice as fitting over all points.

Unless otherwise stated, we use Qwen2.5-7B-Instruct as the base model with the max output length 8,192 and the healthy *RL* recipe from above. We use on-policy updates with an Adam optimizer, scaling the learning rate proportionally to $\sqrt{B}$, where the rollout batch size $B = B_\mathrm{problem} \times n$ (base LR = 1e-6 at $B=1024$); KL and entropy regularization are enabled on the Easy set and disabled on the Hard set (as discussed above); we fix the sampling temperature to 0.6 and $\text{top}_p$ to 1.0 for training and evaluation; we use GRPO to estimate advantages and truncated importance sampling ([TIS](https://fengyao.notion.site/flash-rl)) to mitigate training-inference logit mismatch. 

**Experimental setup.** We sweep over valid configurations $(B_{\text{problem}}, n)$ from the Cartesian product $\{32~(2^5), \dots, 1024~(2^{10})\} \times \{8~(2^3), \dots, 2048 ~(2^{11})\}$, subject to the hardware constraint $B_{\text{problem}} \times n \leq B_{\max}$. We set $B_{\max} = 65,536$ for the Easy set and $16,384$ for the Hard set. The value of $B_\text{max}$ is smaller for the hard set to allow for more sequential iterations, within our allowed computational budget. The total compute cost for these experiments was approximately 120,000 NVIDIA H200 GPU hours.

We concretely study compute-optimal allocation rules in three settings that allocate a subset of resources: 

1. $n$ vs $M$ (parallel rollouts vs sequential iterations)
2. $n$ vs $B_\text{problem}$ (parallel rollouts vs the number of problems in a batch)
3. allocation across all resources.

### Question 1:  Trading Off Parallel Sampling $n$ with Sequential Iterations $M$

$$
C \propto \underbrace{B_{\text{problem}}}_{\text{fixed}}
\times \color{blue}\underbrace{{n \times M}}_{\color{blue}{\text{user allocated}}}

$$

We now examine compute allocation with the number of problems $B_\text{problem}$ held constant, focusing on **the trade-off between parallel samples $n$ and sequential iterations $M$** under a fixed compute budget.

**Fitting workflow.** We plot reward vs compute $C$ curves for each fixed $n$ and fit a **monotonic sigmoid** to summarize how the validation set reward (avg@4) scales with compute for that $n$. As mentioned above, we then define the **compute-optimal frontier** as the upper envelope of these fitted curves (see Figure 5). Then, to indicate which $n$ lies on the frontier at each compute level, we color the frontier in Figure 5 by $n^*(C)$, which is the value of $n$ whose fitted compute–reward curve achieves the compute-optimal frontier at $C$. Finally, in Figure 6, we fit a log-log plot to show  $n^*(C)$ as a function of  $C$ to summarize the empirical scaling behavior. We make four important observations in this setting.

**1) The value of $𝑛$ that lies on the compute-optimal frontier shifts systematically higher as the sampling compute** $C$ **increases (Figure 5).** It is natural to expect larger values of $n$ to be generally favorable at higher compute budgets, since increasing $n$ reduces noise in advantage estimates and lowers policy-gradient variance but eats up more sampling compute. Consistent with this, the frontier-attaining $n^*(C)$ shifts to larger values as $C$ grows, and we observe the same trend in both the Easy and Hard problem sets. Smaller values of $n$ exhibit rapid initial gains but plateau at a relatively lower compute regime, whereas larger $n$ sustain improvement over a broader compute range (*Figure 5*). This behavior also suggests that parallel and sequential compute are not exactly interchangeable. Choosing $n$ so that we are able to perform a sufficient number of sequential updates $M$ is necessary to achieve strong performance. 

![image.png](__IMAGE_PLACEHOLDER__)

**Figure 5. Reward frontier a function of compute $(B_\text{problem}=32)$,** where the frontier is computed by maximizing over values of $n$. The compute-optimal frontier shifts to larger $n$ with more $C$, showing that more parallelism becomes optimal at higher budgets. For easy problems ***(left)***, **small** $n$ improves fast but plateaus; larger **$n$ sustains gains and dominates at high compute. For the hard ones***(right)***,  the same trend holds, but rewards are lower and saturate earlier, with the frontier reaching a smaller value than $n$ on the easy problems.

**2) Compute-optimal values of $n$ are well-approximated by a sigmoid function of** $C$  **(Figure 6).**  We next seek to fit a functional relationship for the compute optimal value $n^*(C)$ as a function of the available compute $C$. A natural first step is to hypothesize an appropriate functional form. As shown in Figure 5, increasing $C$ admits larger compute optimal values of $n$, and over a substantial range this relationship appears approximately linear on a log-log scale. The key question is whether this growth continues indefinitely or eventually saturates. Empirically, we observe a clear saturation in Figure 6. Even when evaluating rollout widths up to $n=2,048$, values significantly larger than the saturation point, they fail to extend the frontier, with $n=512$ continuing to dominate.

We argue that this behavior is expected for a fixed base model and a fixed problem set. To build intuition, it is helpful to view increasing $n$ as analogous to spending more compute per gradient step. In empirical risk minimization, increasing capacity alone does not reduce validation error beyond a certain point unless additional training data is available or the train-test gap is reduced. This principle also underlies pretraining scaling rules from [Chinchilla](https://arxiv.org/abs/2203.15556) that prescribe scaling both pretraining data and model capacity together. Perhaps most closely related to our RL training setup, [our prior work](https://arxiv.org/abs/2406.14532) on rejection fine-tuning shows that the optimal value of $n$ on the training set is often capped by an upper bound. Increasing $n$ alone cannot overcome limitations imposed by a fixed problem set for training or base model. As a result, the compute optimal value of $n$ must eventually saturate even for RL, which is precisely what we observe empirically. We empirically validate this hypothesis regarding model-data interaction in the later analysis section, where we demonstrate how the saturation point shifts given *a different base model, problem set size, and distribution*.

![image.png](__IMAGE_PLACEHOLDER__)

**Figure 6: Compute-optimal scaling of the parallel compute $n$** ($B_{\text{problem}}=32$)**.** The optimal value of rollouts $𝑛$ **shifts systematically higher** as the total sampling compute increases. Points show a running-average estimate of the frontier-attaining  $n^*(C)$ at each compute budget (colored by reward), and the red curves fit a sigmoid parameterizing $\log n$ as a function of $\log C$. For both the easy set ***(left)*** and hard set ***(right)***, $n^*(C)$ rises from small to very large values as compute increases. On the hard set, the final  value converges significantly below the maximal value of $n$ ($2^{10}$), and this value is lower than the easy set.  

**3) Next**, **we find that the compute-optimal allocation *trend* remains consistent across difficulty levels, although we find harder sets prefer smaller values of** $n$ **(Figure 6)**. We find that the qualitative compute optimal allocation trend remains consistent across problem difficulty. On both easy and hard problem sets, the compute optimal value of $n$ increases with total compute $C$ before eventually plateauing. However, the plateau occurs at markedly ***smaller*** values of $n$ on harder problems. In particular, very large values of $n$, such as $n=512$, yield lower final performance on the hard set and do not lie on the compute optimal frontier. ***This suggests that task difficulty imposes an upper bound on how large $n$ can be used effectively**. **While it may seem intuitive that harder problems should benefit from larger $n$ due to increased sampling, we observe the opposite behavior in practice.*** On sufficiently hard problem sets, increasing $n$ allocates substantial compute to problems where the model receives little or no learning signal. In contrast, smaller values of $n$ focus optimization on the subset of prompts where nonzero signal is already present and meaningful improvement is possible. **Therefore, if compute is bounded**, it is better to use a smaller value of $n$ to increase the frequency of parameter updates (small $n$, large $M$, more epochs on the same prompt set) that exploits reachable gains, rather than large parallel compute on problems that are persistently unsolved (large $n$, small $M$, fewer training epochs).

**4) Implications on optimization dynamics on the easy and hard sets and the role of various performance metrics (Figure 7).** We saw in point 3 above that a smaller value of $n$ was more preferable for optimizing validation *average reward* (avg@4 per problem), and we attributed this behavior to the underlying optimization dynamics (i.e., solving more problems vs producing more correct rollouts on the same problem). In this point, we aim to better **understand this optimization dynamics and evaluate how $n^*(C)$ changes if we were to change the target performance metric we study.**

In particular, we consider two performance metrics: ***best@k** (or pass@k)* and ***worst@k**.* Recall the definitions:

- **best@k:** the proportion of problems where *at least one* generated response out of $k$ is correct. This measures the model's **coverage** over the validation problem set.
- ***worst@k*:** the proportion of problems where all $k$ generated responses are correct, also referred to as *perfect solvability.* This measures the robustness of the training procedure (i.e., the degree to which it can “**sharpen**” around the right solution).

Modulo compute-optimality, a larger value of $n$ coupled with as many sequential update steps as needed, should in principle, result in higher values for both best@k and worst@k on a training dataset. However, this is not quite the case when compute is bounded. We empirically identify the optimal values of $n^*(C)$ for obtaining the highest best@k and worst@k scores on the validation set, across different $B_\mathrm{problem}$ values for the largest value of $C$, and show this number in Figure 7 below. We choose $k=4$, much smaller than any value of $n$ we study ($n \gg k$), so that none of the trends in Figure 7 are “edge” cases or artifacts of empirical/fitting/workflow/statistical error. Perhaps surprisingly, we now see an interesting divergence in trends of compute-optimal $n$ that impacts the Easy and Hard sets differently. 

1. On the easy set, **a larger $n$ is compute-optimal for worst@4 (sharpening) performance, whereas relatively smaller values of $n$ are compute-optimal for the best@4 performance.** This means that a larger $n$ primarily improves by sharpening more on easy problems, while a smaller $n$ suffices to sample one correct rollout (expected since the set is easy).
2. Conversely, for hard problems, **a larger $n$ is more critical for pushing the best@4 (coverage) boundary, while a relatively smaller $n$ is compute-optimal for improving worst@4 (sharpening).** However, there is a limit beyond which a larger $n$ does not improve coverage on new problems in a compute-optimal manner, as indicated by Figure 7 that optimal values here remain generally lower than on the easy set. On the *Extremely Hard* set consisting of all pass@128=0 problems (shown in the later analysis section), we see a clearer tradeoff of coverage and sharpening: while larger $n$ improves best@k, excessive $n$ degrades worst@k and lowers the average reward. Thus, if targeting average reward, the optimal $n$ on hard problems is the value that balances coverage and sharpening well. 

The net effect of these distinct optimization dynamics is a similar trend of compute-optimal $n$ on the validation average reward (Figures 5 & 6), but these results imply that the target performance metric itself dictates the landscape of compute-optimal $n$. 

![Figure 7: Values of n that optimize the best@4 and worst@4 performance for different B_problem values, when evaluated at the largest allowed compute budget. On the Easy set (left), the compute-optimal n is smaller for best@4 (blue) than for worst@4 (red), indicating that improving robustness (worst@4) requires substantially more parallel rollouts than improving coverage. In contrast, this trend reverses on the Hard set (right): a larger n is needed to improve best@4 compute-optimally, while worst@4 saturates at smaller n.](__IMAGE_PLACEHOLDER__)

**Figure 7: Values of $n$ that optimize the best@4 and worst@4 performance for different** $B_\text{problem}$ **values, when evaluated at the largest allowed compute budget.** On the Easy set ***(left)***, the compute-optimal $n$ is smaller for best@4 (blue) than for worst@4 (red), indicating that improving robustness (worst@4) requires substantially more parallel rollouts than improving coverage. In contrast, this trend reverses on the Hard set ***(right)***: a larger $n$ is needed to improve best@4 compute-optimally, while worst@4 saturates at smaller $n$.

:::takeaway_begin:::
**Key Result Takeaways**:

1. The compute-optimal $n$ frontier **shifts systematically higher** as the total sampling compute increases. The trend remains consistent **across training dataset difficulties.**
2. The source of gain from large $n$ **shifts based on the training data difficulty**: scaling $n$ improves **sharpening** (worst@4) on the Easy set, but expands **coverage** (best@4) on the Hard set. 
:::takeaway_end:::

:::takeaway_begin:::
**Workflow Takeaways:**

- Depending upon the composition of the problem set, and how effectively can the base model learn on this set, we might see different underlying mechanisms for performance improvement. It is advisable to evaluate the mode of performance improvement for your base model on your prompt set, and accordingly use it to set $n$ as a function of the available $C$.
:::takeaway_end:::

[](__IMAGE_PLACEHOLDER__)

[](__IMAGE_PLACEHOLDER__)

### Question 2: Bounded Parallel Compute: Trading off $B_\text{problem}$ with $n$

$$
C \propto \underbrace{B}_{\text{fixed}} \times M = {\color{blue}\underbrace{B_{\text{problem}} \times n}_{\text{user allocated}}} \times M
$$

Next, we study a different scaling question, where wish to allocate a fixed total batch size $B$ into the number of prompts used and the number of rollouts per prompt used. This question is important in practical settings where hardware parallelism (e.g., number of GPUs / data-parallel workers) is fixed, and a practitioner needs to make this compute allocation. In such cases, $B$ is often chosen as the largest rollout batch size that saturates sampling throughput (”system batch size”). 

We specify the number of sequential iterations $M$ ***a priori*** and seek allocations of $B_\text{problem}$ and $n$ under a fixed total batch budget $B_\text{problem} \times n \leq B$ that maximize performance. We observe the following:

**1) On the easy problems, allocate more parallel compute $n$ when sequential steps $M$ is large.** In this regime, we examine the compute-optimal value of $n$ under a fixed total batch size (illustrated with $B=8,192$ for brevity), as $M$ varies. As shown in Figure 8, the optimal choice $n^*(M)$ exhibits a sigmoidal dependence on $M$. This behavior suggests that when more sequential update steps are available, it is generally preferable to allocate additional compute toward increasing $n$, rather than increasing $B_\text{problem}$. In contrast, when $M$ is small, allocating batch size toward a larger $B_\text{problem}$ is more effective, as it enables many more epochs of training on the same problems within a limited number of sequential updates. 

On the Hard set, however, the scaling behavior is less consistent. The compute-optimal value $n^*(M)$ exhibits a non-monotonic dependence on $M$ (see Appendix A, Figure x), which implies a similarly irregular trend for the optimal $B_\text{problem}$.

![Figure 8: Compute-optimal allocation shifts from B_problem to n under a fixed total batch size constraint (B=8,192) on easy problems. We fix the total rollout budget per step (B = B_problem × n) and sweep the number of sequential iterations (M). A sigmoid curve can explain the frontier of optimal n per problem. This curve indicates that n*(M) increases with M, a proxy of total compute C given a fixed B (left). The corresponding compute-optimal number of prompts B_problem*(M) decreases with the available sampling compute according to an (inverse) sigmoid (right). These indicate the strategic shift toward higher per-problem sampling at larger compute budgets.](__IMAGE_PLACEHOLDER__)

**Figure 8.  Compute-optimal allocation shifts from $B_{\text{problem}}$ to $n$ under a fixed total batch size constraint ($B=8,192$) on easy problems**. We fix the total rollout budget per step ($B = B_{\text{problem}} \times n$) and sweep the number of sequential iterations ($M$). A sigmoid curve can explain the frontier of optimal $n$ per problem. This curve indicates that $n^*(M)$ increases with $M$, a proxy of total compute $C$ given a fixed $B$ **(*left).*** The corresponding compute-optimal number of prompts $B_{\text{problem}}^*(M)$ decreases with the available sampling compute according to an (inverse) sigmoid ***(right)***. These indicate the strategic shift toward higher per-problem sampling at larger compute budgets.

**2) The *transition point* to a larger $n$ value on the compute-optimal consistently happens when that larger $n$ run reaches approximately one epoch (Figure 9).** An epoch is defined as the problem set size $D$ divided by the batch size $B_{\text{problem}}$. This offers an explanation for the finding “small $n$ for small $C$; larger $n$ for larger $C$”, consistent across Question1 (fix $B_\text{problem}$) and Question2 (fix $B$): in a small $C$ regime, the larger $n$ underperforms because it hasn't yet seen the full problem set. However, once the larger $n$ completes a full pass (i.e., one epoch), the smaller $n$, which is now iterating over seen data, begins to yield diminishing returns. Thus, the larger $n$ overtakes the small $n$ at large $C$ regime.

![Figure 9: Compute-optimal frontiers (under a fixed B=8,192) and analysis of training epochs at transition points. Larger n outperforms smaller n as compute increases. Vertical drop-lines mark the transition points where switching to a larger n becomes optimal (left). These transitions consistently occur at about one epoch (right). This indicates that larger n overtakes smaller n after a full pass over the training problems, offering one perspective to explain the scaling behavior: small n for small C; large n for large C.](__IMAGE_PLACEHOLDER__)

**Figure 9. Compute-optimal frontiers (under a fixed $B=8,192$) and analysis of training epochs at transition points.** Larger $n$ outperforms smaller $n$ as compute increases. Vertical drop-lines mark the transition points where switching to a larger $n$ becomes optimal ***(left).*** These transitions consistently occur at about one epoch ***(right)***. This indicates that larger $n$ overtakes smaller $n$ after a full pass over the training problems, offering one perspective to explain the scaling behavior: “small $n$ for small $C$; large $n$ for large $C$.”

A natural follow-up question is: what role does $B_{\text{problem}}$ play? So far, we have shown larger $n$ is preferred for larger $C$. However, given the constraint $B = B_{\text{problem}} \times n$, we do not expect the trend to be monotonic due to the confounding effect of $B_{\text{problem}}$. To disentangle this, we analyze the sensitivity of performance to $B_{\text{problem}}$ while holding $n$ fixed.

$$
C \propto {\color{blue}\underbrace{B_{\text{problem}}}_{\text{user allocated}}} \times \underbrace{n}_{\text{fixed}} \times {\color{blue}\underbrace{M}_{\text{user allocated}}}
$$

**3) $B_\text{problem}$ has a marginal effect on validation performance when fixing $n$ on easy problems.**  As shown in Figure 10, when fixing $n$, varying $B_\text{problem}$ provides little variance on validation reward. In contrast, increasing $n$ (fixing $B_\text{problem}$) shows a strong correlation with improved validation scores, up to the saturation point discussed in Question 1. This explains the sigmoidal trend in Figure 9: since $n$ is the primary driver of performance and $B_\text{problem}$ yields little difference, increasing $n$ is preferred for large $C$ and $B_\text{problem}$ decreases in return ($B_\text{problem}=B/n$). 

Overall, we find that setting a large $n$ (up to the saturation point), combined with a moderate $B_\text{problem}$, is the most robust strategy. For example, in our experiments, we observed no significant threshold effects for $B_\text{problem}$ between 32 and 1024 on the Easy set. However, on the Hard set or a skewed problem distribution, we speculate they may require a higher minimum $B_\text{problem}$ for effective training. This behavior is intuitive. On a uniformly constructed Easy set (Figure 2), a relatively small but representative subset of problems already provides a good estimate of the underlying expectation. In contrast, for hard problems to the base model, training on a larger set of problems is necessary, since a small subset of problems that receive early learning signal can otherwise dominate the training distribution. At the same time, the value of $n$ remains important. The resulting trade-off between problem coverage and per-problem $n$ leads to less predictable behavior on the Hard set.

![Figure 10: Differences in validation reward attained when varying B_problem (fixed n=16; left) vs. varying n (fixed B_problem=32; right). We observe that even in the setting where B_problem × n is fixed, modifying the value of n has a substantially larger influence on the validation reward compared to a much smaller variation in results when varying the number of problems during training.](__IMAGE_PLACEHOLDER__)

**Figure 10: Differences in validation reward  attained when varying $B_\text{problem}$ (fixed $n=16$; *left*) vs. varying $n$ (fixed $B_\text{problem}=32$; *right*).** We observe that even in the setting where $B_\text{problem} \times n$ is fixed, modifying the value of $n$ has a substantially larger influence on the validation reward compared to a much smaller variation in results when varying the number of problems during training.

---

:::takeaway_begin:::
**Key Result Takeaways**:

1. With a fixed total batch size $B$, increasing compute favors allocating more rollouts ($n$) per problem and fewer problems per batch ($B_{\text{problem}}$). On the Easy set, this trend is especially clean, since large $B_{\text{problem}}$ leads to rapid overfitting (as a result of multi-epoch training).
2. On the Easy set, the compute-optimal value of $n$ increases with the allowed number of sequential iterations $M$ and eventually saturates, following a sigmoidal scaling pattern.
3. For the Hard dataset, $B_{\text{problem}}$ must exceed a minimum threshold when sequential compute is unconstrained. Here, incomplete optimization of training reward, rather than overfitting, limits validation performance, making overly small $B_{\text{problem}}$ suboptimal. However, $n$ is still the more critical resource to allocate, and it generally increases as total $B$ is scaled up.

**Workflow Takeaways:**

- It is preferable to train on fewer problems with a sampling large budget $n$ if we are allowed training for multiple epochs on the same problem set. On the other hand, if multi-epoch training is not possible, then it might be preferable to include on more problems in a batch.
:::takeaway_end:::

### Question 3: Putting It All Together

$$
C \propto \color{blue}\underbrace{{B_{\text{problem}} \cdot n \cdot M}}_{\color{blue}{\text{varying}}}

$$

Finally, we relax all constraints and optimize $(B_{\text{problem}},n,M)$ jointly under a fixed compute budget. Consistent with our previous findings, **the compute-optimal strategy is primarily defined by scaling $n$**. As shown in Figure 12, the optimal $n^*(C)$ follows a clean sigmoidal trajectory as compute increases, regardless of problem difficulty. In this regime, $B_{\text{problem}}$ acts as a stability constraint rather than a performance driver. We find that $B_{\text{problem}}$ fluctuates within a moderate range (e.g., maintaining $B_{\text{problem}} \ge 32$ for Hard tasks) but does not exhibit a distinct scaling law. Thus, the practical recipe is simple: **scale $n$ with compute** according to the sigmoidal fit, while keeping $B_{\text{problem}}$ large enough to stabilize training.

(old)

So far, our results highlight the importance of allocating compute toward the number of rollouts $n$, rather than towards either the number of sequential iterations $M$ or the number of problems per batch $B_\text{problem}$, albeit in different resource allocation settings. In this section, we combine these findings and study the regime in which all three resources, $B_\text{problem}$, $n$, and $M$, are chosen jointly under a fixed compute budget.

Consistent with the preceding analysis, we find that $n$ remains the most critical hyperparameter in this setting. Larger compute budgets consistently favor larger values of $n$ on both the Easy and Hard datasets. At the same time, $B_\text{problem}$ must lie within a moderate range, neither too large nor too small, across all compute levels, echoing our findings from the previous section. Analogous to our fitting workflow from before, we can estimate the compute-optimal value $n^*(C)$ using a sigmoidal fit on a log–log scale as a function of compute $C$, as shown in Figure 11.

![image.png](__IMAGE_PLACEHOLDER__)

**Figure 11. The frontier reward curve as a function of compute ,** where the frontier is computed by maximizing over values of $n, B_\text{problem}, M$. Curves are monotonic sigmoid fits; colors mark $n$**.** The compute-optimal frontier still shifts to larger $n$ as compute increases, showing that higher-rollout parallelism becomes optimal at higher budgets for both the easy and hard problem sets. On the other, the value of $B_\text{problem}$ for each segment is either constant (e.g., 64 on the hard set) or varies substantially (on the easy set), but this variation results in only little fluctuation in performance (see Figure 11 for sensitivity of this choice).

![Figure 12: Compute-optimal parallel rollouts n* as a function of total compute C (Joint Optimization). We sweep all hyperparameters (n, B_problem, M) to find the global optimal configuration at each compute budget. Left (Easy) & Right (Hard): The optimal n increases monotonically with compute, well-fitted by a sigmoid function (dashed black lines). Note that despite the freedom to vary B_problem, the scaling behavior is dominated by n, which saturates at a lower value on the Hard set compared to the Easy set.](__IMAGE_PLACEHOLDER__)

**Figure 12. Compute-optimal parallel rollouts $n^*$ as a function of total compute $C$ (Joint Optimization).** We sweep all hyperparameters ($n, B_{\text{problem}}, M$) to find the global optimal configuration at each compute budget. **Left (Easy) & Right (Hard):** The optimal $n$ increases monotonically with compute, well-fitted by a sigmoid function (dashed black lines). Note that despite the freedom to vary $B_{\text{problem}}$, the scaling behavior is dominated by $n$, which saturates at a lower value on the Hard set compared to the Easy set.

:::takeaway_begin:::
**Key Takeaways:** 

1. When jointly optimizing across all hyperparameters ($n, B_{\text{problem}}, M$), the compute-optimal value of $n$ still increases with $C$, similar to the findings from Questions 1 & 2.
2. Note the best total rollout size $B$ must generally increase as $C$ increases, though the compute-optimal value of $B_\text{problem}$ can be roughly chosen to be a constant at all compute budgets.
3. Our prescribed workflow suggests tuning $n$ first for a new model or new run, followed by allocating $B_\text{problem}$ to a reasonable value and setting $M$ accordingly to the remaining compute. This provides the practical recommendation for users.
:::takeaway_end:::

---

## The Bigger Picture: Role of the Base Model and the Prompt Set

The recurring takeaway from the analyses above is that **the compute-optimal number of rollouts, $n$, increases with available sampling compute $C$** and eventually saturates as training becomes bottlenecked by other factors. While this conclusion is straightforward, a more interesting observation is that the same qualitative trend appears on both easy and hard datasets. This naturally raises several questions: why does this behavior persist across problem difficulty? Does it extend beyond the single base model considered so far? More broadly, under what interactions between a base model and a prompt distribution should we expect this trend to generalize? In the remainder of this section, we address these questions using a combination of conceptual arguments and empirical evidence. We begin by studying an “idealized” setting of training on a single problem, examine when predictions from the one-prompt case break down, and finally analyze how interactions of the base model and prompt set deviations from this ideal behavior.

### Base Case: Only One Training Problem

To build a conceptual model, let us study the simplest setting where we are provided with *one single problem* in the training set. We model this setting as a simple multi-armed bandit problem, where each arm represents one possible response to the problem. We assume training of a tabular softmax policy (i.e., softmax on independently represented logits denoting the response). Please see this for [setup](https://arxiv.org/abs/2402.17235).

Now let’s say that the base model attains an average pass@1 rate of $p$ on this prompt and say $n$ i.i.d.  response samples drawn from the policy are used for training at one gradient step. First note that $n$ independent samples change $\text{pass}@n$ exponentially: $\text{pass@}n = 1-(1-p)^n$. Does $n$ change the policy gradient update on the problem in one update? Averaging over $n$ samples does **not** change the expected policy gradient direction: the expected update is identical to that obtained from a single sample. What it does change is the **variance** of the gradient estimate, which decreases by a factor $n$. Prior work shows that, when using a single sample per update, tabular (stochastic) softmax policy gradient enjoys an $O(1/t)$ rate on the policy suboptimality (i.e., bound on optimal performance - attained performance) after $t$ update steps. When $n$ independent samples are used by averaging over the policy gradient update, repeating the same analysis yields $\mathbb{E} \Big[ \text{suboptimality at step} t \Big]  =  O \left(\frac{1}{n\cdot  t}\right)$, as the convergence rate is still linear in $t$, but the constant (that depends on $n$) now improves. Since the number of update steps $t$ corresponds to the number of sequential iterations $M$, while the total sampling compute is $C = n \times M$, this implies that in this single-prompt, tabular setting the error depends primarily on the total compute budget $C$. 

In short, in the one-problem setting, ***any allocation of compute between parallel sampling ($n$) and sequential updates ($M$) achieves comparable performance***, when their product is fixed.

### Extending to Multiple Training Problems with Different Base Models

While the theoretical argument above paints a simple picture for resource allocation, several nuances arise when extending this tabular analysis to a base model trained on a problem set of multiple problems. We discuss these nuances next.

**1) Training on multiple problems.** The guarantee above that $n$ (rollouts per problem) and $M$ (sequential iterations) are interchangeable for a single problem relies on a tabular setting in which updates on one problem do not affect any others. In this regime, learning rates can be adjusted to account for batch size $B_{\text{problem}}$, and training on the smallest $B_{\text{problem}}$ to maximize $n$ is the most beneficial. However, this is clearly not the case in practice. While scaling $n$ takes precedence in Questions 2 & 3, we do observe that on hard datasets, there is a minimal value of $B_\text{problem}$ that is needed to make progress on the validation score. Empirically, this leads to an optimal value of $B_{\text{problem}}$ that is not too large (and of course, not too small).

We attribute this effect to [interference](https://www.notion.so/rl-excursions-Playbook-Workflows-for-Scaling-Sampling-FLOPs-for-RL-Training-of-LLMs-29f1951bd76780c58c96f3c07103e974?pvs=21) across problems. When multiple problems are trained jointly, updates interfere, meaning that different problems are learned at different rates. This causes overall progress to slow relative to the single problem setting. In this regime, allocating compute to larger values of $n$ is preferable to increasing $M$, since higher rollout counts enable more uniform updates across problems within each iteration. This shifts the balance toward parallel sampling rather than sequential iterations, mitigating interference and improving overall learning efficiency.

**2) Incorporating a base model.** We now incorporate the role of a base model. The tabular analysis above ignores representation learning and treats the base model only through its initial success rate on a problem. In the single-problem setting, the only relevant statistic is the base model’s $\text{pass}@1$. As long as this pass rate is non-zero, the $O(1/t)$ convergence guarantee applies. If the pass rate is zero, exploration must be explicitly addressed to ensure that at least one correct rollout can be sampled. This raises a question for the multi-problem setting: what statistic sufficiently captures the role of the base model when training with RL? 

**A mental model of interference.** A natural choice is the distribution of $\text{pass}@1$ across prompts. This statistic is sufficient in the tabular regime and also underlies [inference-time scaling laws](https://arxiv.org/abs/2502.17578) that relate $\text{pass}@n$ at a population level to the $\text{pass}@1$ distribution. However, in RL the model also learns from the $n$ rollouts it produces, and this static statistic no longer fully characterizes training dynamics. This is because updates across multiple problems introduce interference, which inference-only scaling does not face. A useful mental model is that interference is minimized and updates are closed to tabular when learning happens in a fashion that is roughly distributed uniformly across prompts. From this perspective, changes in the $\text{pass}@1$ distribution over training can act as a diagnostic for interference. When the distribution improves approximately uniformly, then interference is relatively controlled; when improvements are highly uneven, stronger interference effects are present and we might observe a rich-gets-richer phenomenon. In our early experiments, we observe roughly uniform improvements in $\text{pass}@1$ across problems with the base model we study (Qwen2.5-Instruct). On the Hard set, we observed uniform improvement on a narrow subset of hard problems, and no improvement on the others. As a result, any difference in performance are primarily driven by absolute $\text{pass}@n$ values, leading to distinct underlying trends (coverage vs sharpening) on Hard and Easy sets in Question 1. Despite these differences, both problem sets ultimately exhibit the same scaling law. 

**We also evaluate whether our scaling conclusions extend to other datasets.** To understand if interference makes prediction infeasible on some datasets, we train on several Heterogeneous mixtures of Easy and Hard problems (Figure 11), as well as on an “extra hard” set consisting of problems on which the base model attains an empirical $\text{pass}@128$ of $0$. These mixtures induce different degrees of dataset skew, which we expect to affect the rate at which $\text{pass}@1$ improves during training (a smaller $n$ is likely to now improve $\text{pass}@1$ more on easier problems in the subset resulting in more interference, while a larger $n$ should somewhat alleviate this issue). Despite this variation, Figure 11 reveals a **consistent crossover trend:** beyond a dataset-dependent compute threshold, larger values of $n$ outperform smaller ones across most validation sets. On particularly hard validation sets, larger $n$ often dominates almost entirely, or the range of compute over which smaller $n$ is optimal shrinks substantially. This behavior aligns with our findings from Question 1 and suggests that the rate of $\text{pass}@1$ improvement controls both the width of the compute range over which a given $n$ is optimal and the minimum compute-optimal value of $n$. **Crucially, our central takeaway remains unchanged:** larger compute budgets $C$ consistently support larger compute-optimal values of $n$, even across diverse and highly skewed dataset mixtures.

![**Figure 11.**]()

**Figure 11: Results across difficulty levels for small ($n=8$) and large ($n=64$) budgets under different training data distributions (each with 5K total samples) using Qwen2.5-7B-Instruct. Data Definitions:** Hard (pass@128=0), Easy (pass@128 $\in [0.3, 0.6]$), and Very Easy (pass@128 $\in [0.6, 0.9]$). **Training Settings:** Row 1: Hard Only (100% Hard); Row 2: Dual Mix (50% Hard, 50% Easy); Row 3: Tri Mix (50% Hard, 25% Easy, 25% Very Easy, i.e., the J-shaped distribution recommended in [Polaris](https://www.notion.so/1dfa954ff7c38094923ec7772bf447a1?pvs=21)). On each data distribution, we observe a consistent trend that larger $n$ performs better at higher compute in in-domain evaluations, except for the very easy eval (Column 3). This task is likely so easy that added sequential or parallel compute **does not** make much difference in learning. Putting it all together, we see that training on all hard problems causes significant catastrophic forgetting on (very) easy problems, where the model could have decent pass rates, likely due to large distribution shift. When mixing easy problems in training, the catastrophic forgetting is largely mitigated on both easy and very easy problems, in exchange for a slight drop (~2%) on hard problems. A notable phenomenon is that mixing very easy problems (Row 3) doesn’t even help the in-domain very easy evaluation set, and degrades both easy and hard performance (compare with Row 2). These indicate: (1) if the focus is only on improving hard problem performance, it helps to **train on all hard data**; (2) otherwise, mixing easy data largely helps **maintain the model’s capability**, but very easy data are not useful.

Of course, interference does depend on the choice of the base model, and indeed we see that ***different base models may respond to interference in qualitatively different ways.*** While we did observe that some models, such as Qwen2.5-7B-Instruct, made roughly uniform progress across problems on the easy set (or on a subset of problems in the hard set), we found that other models such as Llama3.1-8B-Instruct did not. This heterogeneity affects how increasing $n$ influences per-prompt optimization dynamics and, in turn, shifts the range of $n$ values that appear compute-optimal in practice. For instance, as shown in Figure 12, although a larger $n=16$ outperforms $n=8$ at higher compute budgets, the compute-optimal $n$ for Llama3.1-8B-Instruct is substantially smaller than that of Qwen2.5-7B-Instruct. Notably, the training reward for Llama3.1 plateaus at $n=128$, suggesting the model struggles to effectively optimize for a high degree of parallel rollouts. We further experiment on Qwen3-4B-Instruct (Figure 13) and observe larger $n=64$ yields better results than $n=8$. While the validation reward ceases to rise at $n=128$, the training reward continues to rise at high compute. Thus, the degradation on the validation set is likely attributable to a train-test gap, which we investigate in the subsequent section.

![**Figure 12:** **Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. While $n = 16$ outperforms $n = 8$ at higher compute budgets, further increasing $n$ to $128$ degrades both training and validation performance, indicating optimization difficulties at large $n$.](__IMAGE_PLACEHOLDER__)

**Figure 12:** **Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. While $n = 16$ outperforms $n = 8$ at higher compute budgets, further increasing $n$ to $128$ degrades both training and validation performance, indicating optimization difficulties at large $n$.

![**Figure 13:** **Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. Larger $n$ values, such as $n = 64$, outperform smaller ones (e.g., $n = 8$) at higher compute. Notably, training rewards for $n = 128$ remain high and in fact, $n=128$ appears on the compute-optimal frontier after a considerable amount of compute has been spent (right), but it falls below the compute-optimal frontier on the validation set (left). This is due to early overfitting before the benefits of larger $n$ can be realized and highlights a clear train–test gap.](__IMAGE_PLACEHOLDER__)

**Figure 13:** **Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set** (initial pass rate 0.3–0.6) for different values of $n$. Larger $n$ values, such as $n = 64$, outperform smaller ones (e.g., $n = 8$) at higher compute. Notably, training rewards for $n = 128$ remain high and in fact, $n=128$ appears on the compute-optimal frontier after a considerable amount of compute has been spent (right), but it falls below the compute-optimal frontier on the validation set (left). This is due to early overfitting before the benefits of larger $n$ can be realized and highlights a clear train–test gap.

**3) Train-test gap.** Finally, our scaling results are reported on validation metrics, even though optimization dynamics are primarily driven by the training set composition. As a result, the emergence of scaling laws on the validation set depends on sustained transfer of performance from the training to the test set, which is not guaranteed. For instance, when the prompt set is too small, training may overfit prematurely within a fixed number of gradient steps. In such cases, larger values of $n$ may no longer appear compute-optimal at higher compute budgets, simply because additional training beyond some number of training steps fails to improve test-set performance (see Figure 13 as an example, where $n=128$ is never compute-optimal). 

When overfitting dominates, scaling laws may only hold for certain ranges of hyperparameters that avoid the overfitting regime, but naively plotting scaling trends using our workflow above will result in incorrect conclusions. To illustrate this, we run training with different prompt set sizes, including sets substantially smaller than the default size of 6,000 problems used above. We observe that the compute-optimal values of $n$ cap out at much smaller levels when the prompt set is smaller. This behavior is expected, as validation performance begins to degrade with additional training compute in the small-prompt regime due to overfitting, meaning that there is no way for larger $n$ values to achieve the frontier. As discussed above, this also justifies the sigmoid shape of the hypothesized relationship between $n^*(C)$ and $C$ in Figure 6. 

Technically, we can also plot compute-optimal scaling laws for training performance instead of validation in the hope that compute-optimal hyperparameter configurations for best training rewards also results in best validation performance. We find evidence to the contrary as in many cases  training runs with smaller values of $n$ (keeping $B_\mathrm{problem}$ fixed) result in better training rewards for the same amount of total training compute spent (see Figure 14). While this result appears contradictory at first, ***it is perhaps expected as training reward (in our logging scheme) logs rewards on samples that were used for training: hence, logging statistics on this set results in a natural bias.*** More mechanistically, on the training set: 1) RL runs with smaller values of $n$ are able to epoch faster on the training problems for the same amount of sampling compute as runs with larger values of $n$; and 2) when we run RL with small values of $n$  then we are able to improve training performance quickly on easy problems without making any progress on the hard ones, which means that the total training performance is dominated by only one set of the data (easy problems), which rightly does not reflect in good validation performance. 

![**Figure 14**: **Impact of data size ($D$) on compute-optimal frontiers for Qwen2.5-7B-Instruct (easy set).** With a larger dataset ($D=6\text{k}$), we continues to improve with more parallel rollouts ($n=512$; ***left***). With a smaller dataset ($D=500$), performance peaks at $n=256$, and a larger $n$ leads to degradation ($n=256$).](__IMAGE_PLACEHOLDER__)

**Figure 14**: **Impact of data size ($D$) on compute-optimal frontiers for Qwen2.5-7B-Instruct (easy set).** With a larger dataset ($D=6\text{k}$), we continues to improve with more parallel rollouts ($n=512$; ***left***). With a smaller dataset ($D=500$), performance peaks at $n=256$, and a larger $n$ leads to degradation ($n=256$).

[add a takeaway box discussing how we think our findings apply in different settings, summarizing our experiments from above]

:::takeaway_begin:::
**Key Takeaways:**

1. While sequential and parallel computation are perfectly interchangeable in a tabular setting, interference across problems prevents a perfect exchange in practical LLM training. As a result, allocating compute toward parallel sampling to achieve a roughly uniform rate of improvement across training problems is often preferable to more sequential training iterations.
2. Although different base models exhibit different levels of interference on different problem sets, we observe similar scaling rules for how compute should be allocated to the number of parallel rollouts across different prompt set combinations and base models, although the underlying causes of those scaling trends are different. 
3. The size of the training problem set manifests as a train–test gap: when the training set is small, validation performance saturates early. This leads to lower saturation values for $n$ and $M$, and correspondingly higher optimal values of $B_\text{problem}$.
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

In the main results, we show one fixed value for $B_\text{problem}=32$ for brevity. Figures 1x and 1x demonstrate that the scaling trend described in the main text, where larger compute budgets favor increased parallel rollouts ($n$), holds across different fixed values of $B_\text{problem}$. While it appears that larger $B_\text{problem}$ settings saturate at lower $n$ values (e.g., $n=16$ at $B_\text{problem}=1,024$), this might be attributable to the total batch size constraint ($B_{\max} \geq B_\text{problem} \cdot n$) in the sweep experiments. The precise interaction between $B_\text{problem}$ and the saturation point of $n$ remains an open question for future investigation.

![**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Easy set. Each subplot fixed $B_\text{problem}$ and sweeps $n$.**](__IMAGE_PLACEHOLDER__)

**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Easy set. Each subplot fixed $B_\text{problem}$ and sweeps $n$.**

![**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Hard set.** Each subplot fixed $B_\text{problem}$ and sweeps $n$.](__IMAGE_PLACEHOLDER__)

**Figure 1x.** **Compute-optimal frontiers across varying problem batch sizes ($B_\text{problem}$) on the Hard set.** Each subplot fixed $B_\text{problem}$ and sweeps $n$.

Besides, here we show more results under different fixed B on the 2 sets showing similar trend as we demonstrate on Section 3.2 that it’s increasingly preferable to allocate more parallel rollouts per problem given higher sampling budgets.

Fix B, easy

![image.png](__IMAGE_PLACEHOLDER__)

Fix B, hard

![image.png](__IMAGE_PLACEHOLDER__)

:::fold_end:::

:::fold_begin title="B. Generalization to OOD tasks":::

### B. Generalization to OOD tasks

In the main text, we prioritize in-domain validation results to minimize the influence of train-test distribution shifts, thereby allowing for a cleaner analysis of compute allocation scaling. In reality, practical post-training workflows require models to generalize to unseen distributions like downstream tasks. We examine whether the benefits of increasing parallel rollouts ($n$) extend to out-of-domain (OOD) downstream tasks. As illustrated in Figure 1x, we observe that larger values of $n$ lead to higher performance on AIME24.

![Figure 1x: AIME 24 scores trained with varying parallel rollouts ($n$) under a fixed problem batch size ($B_\text{problem}=32$).](__IMAGE_PLACEHOLDER__)

Figure 1x: AIME 24 scores trained with varying parallel rollouts ($n$) under a fixed problem batch size ($B_\text{problem}=32$).

![image.png](__IMAGE_PLACEHOLDER__)

![image.png](__IMAGE_PLACEHOLDER__)

:::fold_end:::

:::fold_begin title="C. Effects of baseline estimation variance":::

### C. Effects of baseline estimation variance

We discuss in the main content how and why larger $n$ could outperform small $n$ at high compute regime from exploration and optimization perspective. Another theoretical advantage of larger $n$ in the GRPO algorithm is that it provides a more robust estimator for the baseline (group average reward), thereby reducing the variance of the advantage estimates. To isolate the performance gain attributed specifically to precise baseline estimation versus simply training on more data, we conducted an ablation study with a fixed problem batch size of ($B_\text{problem}=128$). We compared three settings:

1. **Large $n=256$**
2. **Small** $n=64$
3. **Decoupled: small $n=64$ for policy update and large $n=256$ for baseline estimation.** We generate 256 rollouts to compute high-precision advantage estimates, but randomly subsample only 64 rollouts to compute the policy gradient update.

We observe a performance **(1) > (3) > (2)**. 

- (3) > (2) confirms that a lower-variance baseline estimator contributes to the gains.
- The standard (1) $n=256$ run still outperforms the (3) setting, suggesting that while baseline precision matters, the primary benefit of scaling $n$ comes from the broader exploration.

![image.png](__IMAGE_PLACEHOLDER__)

### (optional) D. Off-policy

### (optional) E. pope qwen3

![image.png](__IMAGE_PLACEHOLDER__)

:::fold_end:::

## Reference

[todo by gemini]

---

:::fold_begin title="More Results":::

## More Results

### Large n generalizes better on OOD tasks

Beyond the in-domain validation reward, we see larger $n$ brings downstream task AIME24/25 benefits over small $n$. These show larger $n$ offers better generalizability.

[figure: AIME24 best score is achieved at 32-512: 27.9, compare with other common configs; maybe also AIME25]

[figure: OOD hard set]

### When the base model changes?

[figure: qwen3-4b, llama]

### When the dataset size $|D|$ changes?

[figure: compare the compute-n slope of |D|=500 vs. 5000]

### When the dataset domain shifts beyond math?

[tbd]

:::fold_end:::

:::fold_begin title="Is there a ceiling of n?":::

## Is there a ceiling of n? for B32k, we see it's the upper bound for some Broll.

[tbd]

:::fold_end:::

:::fold_begin title="Leveraging Off-Policy Data in RL":::

### Leveraging Off-Policy Data in RL

Reusing old trajectories can dramatically **increase sample efficiency**, but only as long as the **current policy has not drifted too far from the behavior policy that generated them**; beyond that point, importance weights, KL, and entropy updates become noisy and biased. We view recent GRPO variants as lying on a spectrum between fully on-policy and partially off-policy training, and ask **how far off-policy we can safely go on top of an otherwise stable recipe**.

To probe this, we exploit the internal update mechanism of GRPO-style methods and introduce a parameter (\sigma), which **denotes how many times we split and then update on rollouts sampled at the current step**. The case (\sigma = 1) corresponds to a purely on-policy setting, while any (\sigma > 1) introduces off-policy reuse. As (\sigma) grows, the last mini-batches in an update are generated by policies increasingly far from the current one.

- **Experimental setup.**
    - We sweep ($\sigma \in {1,2,4,16}$), covering on-policy to increasingly off-policy updates, and run this sweep separately on the medium and hard subsets.
    - All other settings (models, batch sizes, KL/entropy configuration, masking, etc.) match the previous best recipes. This lets us isolate the effect of off-policy reuse while keeping the rest of the recipe fixed.
1. Strict **on-policy** training remains the optimal strategy, particularly on Easy tasks. However, on Hard tasks, the performance gap narrows significantly, making off-policy updates a potential efficient alternative.

| Difficulty \ sigma | s = 1 | s = 2 | s = 4 | s = 16 |
| --- | --- | --- | --- | --- |
| 0.3-0.6 | **63.3%** | 60.8% | 59.6% | 59.7% |
| 0.0-0.0625 | 10.0% | **11.4%** | 10.3% | 10.3% |
| 0.0-0.3 | **16.4%** | 16.0% | 15.8% | 15.5% |
- **See similar compute-optimal results across different $B_\text{problem}$**
    
    ![image.png](__IMAGE_PLACEHOLDER__)
    
- **See similar compute-optimal results across different $B$**
    
    ![image.png](__IMAGE_PLACEHOLDER__)
    
:::fold_end:::

:::fold_begin title="(archived writing and results)":::

## (archived writing and results)

- **Archived contents in Question3**
    
    ![**Figure 11. Compute-optimal scaling fits from the full  ($n$, $B_{problem}$, $M$) sweep.** **Top row:** the compute-optimal value of the number of parallel rollouts $n^*(C)$ increases with compute and can be explained by a  sigmoid parameterizing $\log n$ as a function of $\log C$ for both easy (left) and hard (right) sets. **Bottom row:** the corresponding compute-optimal global batch size $B^*(C)$ (note that this is not $B^*_\text{problem}$, but the total $B$) also grows with compute, again captured by a sigmoid fit. These results mean that the number of problems in a batch appearing on the compute-optimal frontier is roughly constant, i.e., $B^*_\text{problem} \approx 32$ for the above points. In both curves, the points show the (running averaged) frontier-attaining ones(colored by validation reward); red dashed curves are the fitted trends.](__IMAGE_PLACEHOLDER__)
    
    **Figure 11. Compute-optimal scaling fits from the full  ($n$, $B_{problem}$, $M$) sweep.** **Top row:** the compute-optimal value of the number of parallel rollouts $n^*(C)$ increases with compute and can be explained by a  sigmoid parameterizing $\log n$ as a function of $\log C$ for both easy (left) and hard (right) sets. **Bottom row:** the corresponding compute-optimal global batch size $B^*(C)$ (note that this is not $B^*_\text{problem}$, but the total $B$) also grows with compute, again captured by a sigmoid fit. These results mean that the number of problems in a batch appearing on the compute-optimal frontier is roughly constant, i.e., $B^*_\text{problem} \approx 32$ for the above points. In both curves, the points show the (running averaged) frontier-attaining ones(colored by validation reward); red dashed curves are the fitted trends.
    
    ![**Figure 12. Best validation reward varying $B_\text{problem}$ on the Easy set, and corresponding configurations of $n$ and $B.$** Best validation reward stays robustly high at smaller $B_\text{problem}$ ***(left)***. The saturation $n$ remains high before at small $B_\text{problem}$but drops as $B_\text{problem}$ increases beyond the critical threshold $B_\text{problem} \approx 64$ ***(middle)***. The total effective batch size $B$ scales linearly at small $B_\text{problem}$ while plateaus later; this is because the saturation $n$ drops as $B_\text{problem}$ increases, counteracting the growth of $B$, given $B=B_\text{problem} \cdot n$ ***(right)***.](__IMAGE_PLACEHOLDER__)
    
    **Figure 12. Best validation reward varying $B_\text{problem}$ on the Easy set, and corresponding configurations of $n$ and $B.$** Best validation reward stays robustly high at smaller $B_\text{problem}$ ***(left)***. The saturation $n$ remains high before at small $B_\text{problem}$but drops as $B_\text{problem}$ increases beyond the critical threshold $B_\text{problem} \approx 64$ ***(middle)***. The total effective batch size $B$ scales linearly at small $B_\text{problem}$ while plateaus later; this is because the saturation $n$ drops as $B_\text{problem}$ increases, counteracting the growth of $B$, given $B=B_\text{problem} \cdot n$ ***(right)***.
    

**Token together, these results suggest that RL training is optimally configured within a sustained high performance regime, characterized by moderate problem diversity and sufficiently large but not excessive parallel sampling.** While the exact critical thresholds we observe are specific to the base model and dataset under study, exhaustively identifying these values for every new setting is computationally infeasible. Rather than treating these thresholds as fixed constants to be tuned, we now ask a more fundamental question: **what underlying mechanisms give rise to this regime, and why does the optimal configuration take this form?** In the next section, we develop a simple mental model to explain how the interaction between the base model, the prompt set, and optimization dynamics produces the observed compute optimal behavior, and how this perspective can guide practical decisions without full sweeps.

**1) We find that maximal validation rewards are achieved in the regime of moderate $B_\text{problem}$ and high $n$ (Figure 10).** We observe **an empirical critical threshold for $B_\text{problem}$** ($\approx
64$ in our setup): above this threshold, both the validation reward and saturation $n$ degrade significantly; below it, validation rewards remain on par with the optimal performance with a stable high saturation $n$. Although intuitively we expect a larger $B_\text{problem}$ to accommodate a larger $n$, our results show that excessive problem diversity forces a performance drop. [hypothesis on this] Also, a very small $B_\text{problem}$ is likely to lead to overfitting or training instability, while we did not observe this issue down to $B_\text{problem}=8$.

Similarly, we identify **a critical saturation $n$** value ($\approx 512$ in our setup): above this threshold, increasing $n$ yields marginal benefits or, more frequently, performance regression. We observe larger $n$ requires more sampling compute to converge, making the training process more prone to instability. Below the critical saturation $n$, the reward degrades significantly. We have covered the benefits of larger $n$ values in Question1. 

~~These suggest RL training is optimally configured in the sustained high-performance regime. While these critical values are specific to base models and datasets, conducting exhaustive sweeps for every new setting is computationally prohibitive. Therefore, rather than modeling these exact values, the subsequent section investigates (1) the generalizability of these findings across different base models, problem difficulties, and sizes; and (2) whether it is possible to identify the critical point in the early stages of training.~~

**2) Similar findings on the compute-optimal $n$ (Figure 11).** Finally, aggregating the full sweep over ($n$, $B_{\text{problem}}$, $M$) shows a consistent pattern: as sampling compute $C$ increases, the compute-optimal frontier shifts toward larger $n$ on both Easy and Hard problems (Figure 10). Within the configurations we ran, the compute-optimal **rollout batch sizes** $B^*(C) = B_{\text{problem}}^*(C) \times n^*(C)$ also tend to increase with $C$ (Figure 11). In contrast, we observed that configurations with small values of $n$ improved quickly at low compute values but plateaus (and even degraded on the validation set!) much earlier than runs with larger n.

**Experiment setup.** We perform a grid sweep over $B_\text{problem} \in \{8,16,32,64,...,1024\}, n \in \{8,16,...,2048\}$. To maintain computational efficiency, for each $B_\text{problem}$, we identify the **saturation $n$,** defined as the threshold beyond which increasing $n$ yields no further improvement in validation reward (as we observed in Question1). The sweep for a given $B_\text{problem}$ is terminated once the saturation $n$ is reached.

**Experiment setup.** We fix three values of $B \in \{4096,\;8192,\;16384\}$. For each value of $B$, we sweep $(B_\text{problem},n)$  pairs with $B_\text{problem} \in \{32,64,...,1024\}$, $n=\frac{B}{B_\text{problem}}$. For example, if $B=8192, B_{\text{problem}}=32$, then $n=256$. Unlike Question 1 where $B_{\text{problem}}$ was fixed, here we fix $B$ and trade off $B_{\text{problem}}$ against $n$ via $B = B_{\text{problem}} \times n$.

**Experiment setup.** We evaluate a range of values of $B_{\text{problem}} \in \{ 32,64,128,256\}$. For each value of $B_{\text{problem}}$, we sweep $n$ across powers of 2 ($n$  $\in \{8,16,32\dots\}$), up to the largest value constrained by total batch size $B = B_{\text{problem}} \times n \le 65,536 \;(2^{16})$ on the Easy set and $B=16,384\;(2^{14})$ on the Hard set. For example, at $B_{\text{problem}}=32$, the sweep includes $n \le 2048$ on the Easy set. In the main text, we primarily visualize results for $B_\text{problem}=32$ for clarity as we observe consistent scaling trends across all $B_{\text{problem}}$ settings (full results are provided in Appendix).

Consider running standard REINFORCE with a binary rewards with a softmax parameterized policy. Let $g$ denote the stochastic, REINFORCE policy gradient computed using $n$ rollouts sampled during training. Then:

$\mathbb{E} \left[g \right]= p \cdot (1−b) \cdot (1−p) + (1−p) \cdot (0−b) \cdot(−p) = p \cdot (1−p),$

where $b$ denotes a scalar baseline (e.g., average reward obtained). Thus, a gradient ascent step with learning rate $\eta$ yields an expected logit update $\Delta z \approx \eta p \cdot (1 - p)$ over one gradient step. Translating this into an expected change in pass@1 performance gives:

$\Delta p = \frac{d p}{d z} \Delta z \approx \left[p \cdot (1 - p) \right] \cdot \left[\eta p \cdot (1 - p) \right] = \eta p^2 (1 - p)^2$.

:::fold_end:::

:::fold_begin title="Elaborate Analysis: Relationship Between n and C":::

## Elaborate Analysis: Relationship Between $n$ and $C$

The recurring takeaway when answering all the questions above is that the value of $n$ grows in the available sampling compute $C$ before saturation. While this is a simple conclusion, as we saw, more interestingly, this trend does hold true for both types of datasets: Easy and Hard. Why is this the case? Here we dig deeper into some of the metrics to understand the role of increasing $n$ in RL with LLMs. 

**What does increasing $n$ do conceptually?** Increasing $n$ does not increase total samples utilized as long as the total compute is bounded and the number of problems in the batch $B_\text{problem}$ is fixed; instead, it **reallocates the sampling budget to earlier in training**. This means that each prompt receives more rollouts before the policy has changed substantially. In contrast, increasing $M$ spreads the same sampling budget across more sequential updates, repeatedly revisiting prompts under increasingly updates policies.

This distinction matters because exploration in RL with LLMs is highly **dependent on the optimization trajectory**. Once the policy collapses onto a narrow set/style of responses, the probability of discovering very different but rare positive traces reduces. At that point, additional compute primarily sharpens already-discovered modes rather than expanding coverage, inhibiting further gains in reward.

We observe this dynamic through two complementary diagnostics:

**1) First, smaller $n$ leads to a lower final value of token-level entropy and does so quite quickly, indicating a rapid loss of stochasticity in generation.** Larger $n$ consistently leads to an increase in mean token entropy throughout training. We observe a similar positive correlation in validation performance: as $n$ increases, so do the best validation scores and the sampling compute required to reach them. This suggests that larger $n$ delays convergence, facilitating a larger meaningful compute spend. Of course, not all problem set and base model combinations will exhibit this trend, and we believe that the underlying biases and representations of the base model (and how those shape interference during on-policy RL, more on this below) are factors influencing this issue, but we found this trend pretty consistent with our base models. 

![**Figure 12: Higher token diversity correlates with improved validation scores and the capacity to effectively leverage more compute.** Mean token-level entropy increases monotonically with $n$ ***(left)***. Larger $n$ achieves higher validation scores ***(middle)***, demonstrating that the method can utilize increased computational budgets to secure better rewards, rather than saturating early ***(right)***.](__IMAGE_PLACEHOLDER__)

**Figure 12: Higher token diversity correlates with improved validation scores and the capacity to effectively leverage more compute.** Mean token-level entropy increases monotonically with $n$ ***(left)***. Larger $n$ achieves higher validation scores ***(middle)***, demonstrating that the method can utilize increased computational budgets to secure better rewards, rather than saturating early ***(right)***.

**2) Second, small $n$ limits response-level diversity.** We also observe that with a small $n$, the best@4 metric degrades rapidly on the easy set and underperforms relative to large $n$ on the hard set. This suggests that the policy prematurely loses its exploratory capabilities, producing fewer unique attempts even when multiple samples are drawn in the sequential rollouts.

![Figure 13: **Comparison of best@4 and worst@4 validation reward for small $n=8$ vs. large $n=128$ on Easy (top row) and Hard (bottom row) sets**. We observe two different dynamics: on the Easy set, large n yields a higher and more sustained best@4, but also drives a substantially higher worst@4 **(larger gap between $n=128$  and  $n=8$); on the Hard set, large $n$ improves best@4 with a clear separation from small $n$, while worst@4 remains relatively close between the two settings with similar peak values.](__IMAGE_PLACEHOLDER__)

Figure 13: **Comparison of best@4 and worst@4 validation reward for small $n=8$ vs. large $n=128$ on Easy (top row) and Hard (bottom row) sets**. We observe two different dynamics: on the Easy set, large n yields a higher and more sustained best@4, but also drives a substantially higher worst@4 **(larger gap between $n=128$  and  $n=8$); on the Hard set, large $n$ improves best@4 with a clear separation from small $n$, while worst@4 remains relatively close between the two settings with similar peak values.

Together, these results suggest that small $n$ induces insufficient exploration early in training. The model quickly sharpens on problems it can already solve, leading to higher initial best@4 and consistently higher worst@4. However, these gains taper off as exploration stalls, preventing progress on the remaining prompts. **This effect mirrors the [“ray interference” phenomenon](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/),** early collapse constrains the directions in which optimization can later move inhibiting progress on other problems. 

**3) This tradeoff manifests differently across dataset difficulty.** Recall from our discussion to Question 1, on the easy set, both small and large $n$ eventually achieve similar coverage (best@4), but larger $n$ yields substantially more sharpening (worst@4). On the hard set, the situation reverses: sharpening is comparable across $n$, but larger $n$ maintains better coverage by sustaining exploration longer. In both of these cases, larger $n$ therefore leads to a higher overall average reward, although depending upon the performance metric, we do observe different trends. The ratios of zero-advantage (all “1”/ all “0” pass rates) problems offers a mechanistic explanation for these dynamics. 

- **On the Easy set**, the proportion of all-0 problems is close to zero thus negligible. The primary driver is the lower proportion of all-1s in large-$n$ runs, which has higher chance to sample negative samples and thus strengthens the sharpening effect. As a result, on Easy, larger *n* leads to higher worst@4, while best@4 is similar to small $n$ .
- **On the Hard set**, larger $n$ reduces the proportions of both all-0 and all-1 outcomes while the reduction in all-0 is more critical as it implies a higher coverage. The gradients derived from **solving previously unsolved problems** might make sharpening effects less pronounced here for as sharpening is diluted by the magnitude of the new task gradients. Overall, larger $n$ improves best@k via enhanced coverage, while worst@4 is preserved or only slightly degraded.

![**Figure 14: Zero-advantage ratio in training batches,** sampled at the 2M rollouts compute level. We report the proportion zero-advantage problems  (all-1 or all-0 rewards, which give zero advantage in GRPO) in the training batch under different task difficulties. **On Easy tasks **(*left*)**, increasing $n$ mainly reduces the all-1 ratio, strengthening the sharpening effect. On Hard tasks, larger $n$ reduces both all-1 **(*middle***, to a much lesser extent than Easy**)** and all-0 ratios **(right)**.](__IMAGE_PLACEHOLDER__)

**Figure 14: Zero-advantage ratio in training batches,** sampled at the 2M rollouts compute level. We report the proportion zero-advantage problems  (all-1 or all-0 rewards, which give zero advantage in GRPO) in the training batch under different task difficulties. **On Easy tasks **(*left*)**, increasing $n$ mainly reduces the all-1 ratio, strengthening the sharpening effect. On Hard tasks, larger $n$ reduces both all-1 **(*middle***, to a much lesser extent than Easy**)** and all-0 ratios **(right)**.

:::takeaway_begin:::
**Key Takeaways:**

1. Larger $n$ outperforms small $n$ in high-compute regimes by **maintaining broader exploration**. While small $n$ prematurely restricts token entropy and response diversity, larger $n$ delays policy sharpening, allowing the model to utilize increased compute budgets effectively.
2. Although larger $n$ is beneficial for performance on both datasets, **the dynamics differs:** on easy problems, it primarily improves **sharpening**, whereas on hard problems, it drives **coverage.**
:::takeaway_end:::

~~: the number of **policy** **updates** per data batch. $\sigma=1$ denotes strictly *on-policy training*. This is related to the notion of off-policyness in traditional RL. We will set $\sigma=1$ in our experiments to make optimization and exploration smoothly coupled and extending to $\sigma > 1$ is left to future work.~~

A workflow to find the best compute-allocation

1. Mind best and worst@k
2. Mind training reward distribution

others

- what’s our frontier definition; stop criteria? critical batch size?

[](https://www.notion.so/2c81951bd76780a59cdcdf8589ee66eb?pvs=21)

![image.png](__IMAGE_PLACEHOLDER__)

- ~~More accurate baseline estimation~~
    
    ~~A second, independent benefit of larger $n$ arises from more accurate advantage estimation. In GRPO, advantages are computed relative to a group-level baseline. As $n$ increases, this baseline becomes a lower-variance estimate of the underlying reward distribution, reducing gradient noise and stabilizing optimization. We illustrate this effect with a simple simulation that visualizes how the baseline estimate concentrates as n grows.~~
    
    ![image.png](__IMAGE_PLACEHOLDER__)
    
    - Code to plot (can replace with real data difficulty distribution)
        
        ```jsx
        import numpy as np
        import matplotlib.pyplot as plt
        
        # Reproducibility
        rng = np.random.default_rng(7)
        
        # Simulation settings
        k = 6000  # number of prompts or questions
        x = rng.random(k)  # true pass rate per prompt, Uniform(0, 1)
        
        n16 = 16
        n64 = 64
        
        y16 = rng.binomial(n=n16, p=x, size=k)  # successes out of 16
        y64 = rng.binomial(n=n64, p=x, size=k)  # successes out of 64
        
        p16 = y16 / n16  # estimated pass rate
        p64 = y64 / n64
        
        rmse16 = float(np.sqrt(np.mean((p16 - x) ** 2)))
        rmse64 = float(np.sqrt(np.mean((p64 - x) ** 2)))
        
        # Plot
        plt.figure(figsize=(8, 5.5), dpi=150)
        
        plt.scatter(x, p16, s=10, alpha=0.18, marker="o", label=f"Estimate with n={n16}")
        plt.scatter(x, p64, s=10, alpha=0.18, marker="^", label=f"Estimate with n={n64}")
        
        # Ideal reference line
        plt.plot([0, 1], [0, 1], linestyle="--", linewidth=2, label="Ideal: estimate = true")
        
        plt.title("Binomial pass rate estimates become less noisy as group size increases")
        plt.xlabel("True pass rate (x)")
        plt.ylabel("Estimated pass rate (y/n)")
        plt.xlim(0, 1)
        plt.ylim(0, 1)
        plt.grid(True, alpha=0.25)
        plt.legend(frameon=False, loc="upper left")
        
        plt.text(
            0.02,
            0.02,
            f"RMSE\nn={n16}: {rmse16:.4f}\nn={n64}: {rmse64:.4f}",
            transform=plt.gca().transAxes,
            fontsize=10,
            va="bottom",
        )
        
        plt.tight_layout()
        plt.show()
        
        ```
        

~~To answer this question, we need to develop a scalable RL recipe and prescribe rules for setting hyperparameters. In particular, typical RL algorithms consist of a number of hyperparameters: beyond $B_{problem}, n,$ and $M$, some key design choices are:~~

- ~~whether to run RL **on-policy** or **off-policy**~~
- ~~the **off-policyness ratio** $\sigma$, which determines the maximal lag between the sampling policy and the training policy~~
- ~~the **clipping ratio** ($\epsilon_{\text{low}}, \epsilon_{\text{high}}$), which governs how much deviation is allowed per token.~~

~~Together, these hyperparameters define the *shape* of an RL training run. Any theory of compute-optimal scaling must describe how to set these hyperparameters and prescribe rules for partitioning $\mathcal{C}$ into $B, n, M$.  It not only has to explain not only how to balance $n$ and $M$, but how these other parameters affect the optimization behavior of the algorithm.~~

~~We have been working towards answering these questions. While our work is still in progress and you can expect more from us in the coming months, in this blog post, we provide an initial formulation of some key scaling questions, provide some answers in the context of LLM RL, and offer broader perspectives (with a few speculations!) on how LLM RL actually behaves. The answers are nuanced, revealing scenarios where scaling departs from the familiar patterns of scaling in supervised learning. Our goal is to o~~

[https://www.notion.so](https://www.notion.so)

Scaling laws are useful because they help practitioners decide how to allocate limited resources such as compute or data in order to achieve the best possible performance. In supervised learning, these laws are obtained by running controlled small-scale experiments and extrapolating the observed trends. To understand how such principles might extend to LLM RL, it is helpful to begin with a basic question: **what resources actually matter in LLM RL?**

In standard single-task RL, two resources are central. One is compute, typically measured in GPU FLOPs used for training. The other is data, which corresponds to environment transitions collected during learning. LLM RL behaves differently. In most on-policy LLM RL settings, the data is created entirely by spending compute because every training trajectory is obtained by rolling out the model. This makes the distinction between compute and data less meaningful. For practical purposes, compute is the only fundamental resource.

Once we identify compute as the primary resource, it is natural to divide it into training compute and sampling compute. In LLM RL, sampling compute usually dominates the overall cost because every step of exploration requires running the model forward. This observation provides a useful simplification for studying scaling laws. We can treat the sampling compute budget as the main quantity to allocate and focus on determining the most effective way to use it.

This leads to the central scaling question that guides our analysis:

~~For RL, scaling laws still remain blurry. Recent advances have started sketching what RL scaling laws might look like for classical on-policy and off-policy RL (our prior work) and, more recently, in RL for LLM training. But in the LLM context, this study is still at its earliest stages. The most relevant prior work demonstrates that *under some very particular conditions* (one specific prompt mixture on two base models), RL training curves can exhibit a clean sigmoid as we scale compute. This is encouraging but also a special setting where a practitioner might expect to run RL. In general though, we lack a principled understanding of how to scale RL runs: Given a base model and an arbitrary prompt set, **how should a practitioner allocate compute? What knobs matter? Which ones don’t? What’s a scalable RL recipe? And how predictable is the asymptotic performance?**~~

![best_n_compute_frontier_115_0.3_0.6_ema_0.8_reward_0.1_0.8_0.01_min1e05_compiled.png](__IMAGE_PLACEHOLDER__)

![image.png](__IMAGE_PLACEHOLDER__)

- hard set fix B views
    
    ![image.png](__IMAGE_PLACEHOLDER__)
    
    ![08aa93f20af7f95aa70df2daa1591503.png](__IMAGE_PLACEHOLDER__)
    
    ![1fc3d6530c0f18aea639e5fb31a51af6.png](__IMAGE_PLACEHOLDER__)
    
    ![4ad328e868215c8f4c2ee9b1e9dbf0d4.png](__IMAGE_PLACEHOLDER__)
    

![**Figure 11. Best validation reward varying $B_\text{problem}$ and $n$ on the easy problems.** Best validation reward stays robustly high at smaller $B_\text{problem}$ while degrades at large $B_\text{problem}$ ***(left)***. The critical saturation $n$ remains high $\approx 512$ at small $B_\text{problem}$ but drops as $B_\text{problem}$ increases beyond the critical threshold $B_\text{problem} \approx 64$ ***(right)***. This suggests that optimal validation rewards are achieved in the regime of a moderate $B_\text{problem}$ and high $n$.](__IMAGE_PLACEHOLDER__)

**Figure 11. Best validation reward varying $B_\text{problem}$ and $n$ on the easy problems.** Best validation reward stays robustly high at smaller $B_\text{problem}$ while degrades at large $B_\text{problem}$ ***(left)***. The critical saturation $n$ remains high $\approx 512$ at small $B_\text{problem}$ but drops as $B_\text{problem}$ increases beyond the critical threshold $B_\text{problem} \approx 64$ ***(right)***. This suggests that optimal validation rewards are achieved in the regime of a moderate $B_\text{problem}$ and high $n$.

![**Figure 9.  Optimal allocations of** $n^*(M)$ and $B^*(M)$ **under a fixed total rollout batch size** $B$. **Left:** a sigmoid curve can explain the frontier of optimal $n$ per prompt. This curve indicates that $n^*(M)$ increases with $M$. **Right:** the corresponding compute-optimal number of prompts $B_{\text{problem}}^*(M)$ decreases with the available sampling compute (since $B = B_{\text{problem}} · n$), and the relationship can also be explained by an (inverse) sigmoid, highlighting the shift toward higher per-prompt sampling at larger compute budgets. ](__IMAGE_PLACEHOLDER__)

**Figure 9.  Optimal allocations of** $n^*(M)$ and $B^*(M)$ **under a fixed total rollout batch size** $B$. **Left:** a sigmoid curve can explain the frontier of optimal $n$ per prompt. This curve indicates that $n^*(M)$ increases with $M$. **Right:** the corresponding compute-optimal number of prompts $B_{\text{problem}}^*(M)$ decreases with the available sampling compute (since $B = B_{\text{problem}} · n$), and the relationship can also be explained by an (inverse) sigmoid, highlighting the shift toward higher per-prompt sampling at larger compute budgets. 

![Figure 10. Compute-optimal allocation between prompt-level batch size and sequential updates at fixed rollout budget $B$. Across $B=4096,8192,16384$, frontier points (colored by validation reward) reveal an approximately linear trend in log-space: $\log_2(B_{\mathrm{problem}}/n)=aM+b$. This trend summarizes how the frontier shifts from larger prompt batches at small $M$ to smaller $\,B_{\mathrm{problem}}/n\,$ as training proceeds with more sequential iterations.](__IMAGE_PLACEHOLDER__)

Figure 10. Compute-optimal allocation between prompt-level batch size and sequential updates at fixed rollout budget $B$. Across $B=4096,8192,16384$, frontier points (colored by validation reward) reveal an approximately linear trend in log-space: $\log_2(B_{\mathrm{problem}}/n)=aM+b$. This trend summarizes how the frontier shifts from larger prompt batches at small $M$ to smaller $\,B_{\mathrm{problem}}/n\,$ as training proceeds with more sequential iterations.

:::fold_end:::

:::fold_begin title="(notes about question2 - Amrith)":::

## (notes about question2 - Amrith)

Also do we think for question 2 there might be a way to tell this story from the perspective of "effective parallel batch size" which is the number of problems in a batch on which we get a gradient signal. For example, it is possible that the effective parallel batch size still follows a sigmoid relationship. Broadly, in larger total compute regimes we want to give up sequential compute for a larger effective batch size. Although, in question 2 sequential compute is unbounded so the question is more about how to allocate parallel compute optimally to increase the effective batch size.

- When B is small, for the given dataset and base model we might find that having a smaller B_problem and smaller n is better to see more problems with a gradient signal throughout training. Since we may be in the regime where having a small enough n is good enough on a bunch of problems to get some gradient signal but we may have to increase n to a very large value on the other problems which we don't have the parallel budget for.
- When we increase B (parallel budget), now we might see that having a larger n might be better to increase the total number of effective samples seen, because now we can take n to values where a large fraction of the dataset will see some gradient signal.
- Finally, when we increase B to an even higher value, its possible that the optimal B_problem is now larger (but it has to be necessarily larger than the optimal B_problem in the first stage), and we can sill afford a higher n than first stage.

- archived variant 2 for now
    
    We study two variants of this question. In the first, we specify the number of sequential iterations $M$ **apriori**  and seek allocations of $B_\text{problem}$ and $n$ under a fixed total batch budget $B_\text{problem} \times n \leq B$ that maximize performance. In the second, the number of sequential iterations $M$ is unconstrained and can be chosen optimally for each configuration $(B_\text{problem}, n)$. The first setting corresponds to training under a fixed wall-clock time budget, while the second captures regimes where training is bottlenecked by available parallel GPU resources rather than sequential time, and the user can decide the total number of sequential iterations for each training run on the fly. Formally, we solve the following optimization problems:
    
    $n^*(M) :=  \argmax_{n}~ \text{Perf}(B_\text{problem}, n, M)~~ \text{s.t.}~~ B_\text{problem} \times n = B$ (first variant)
    
    $n^* := \argmax_{n}~~ \left[\max_{M}~ \text{Perf}(B_\text{problem}, n, M) \right] ~\text{s.t.}~ B_\text{problem} \times n = B$ (second variant)
    
    **1) First variant: Allocating parallel compute when sequential compute $M$ is specified apriori.** We first consider the setting in which the sequential compute budget $M$ is fixed a priori. In this regime, we examine the compute-optimal value of $n$ under a fixed total batch size of $B = 8192$ tokens, as $M$ varies. As shown in Figure 9, the optimal choice $n^*(M)$ exhibits a sigmoidal dependence on $M$. This behavior suggests that when more sequential update steps are available, it is generally preferable to allocate additional compute toward increasing $n$, rather than increasing $B_\text{problem}$. In contrast, when $M$ is small, allocating batch size toward a larger $B_\text{problem}$ is more effective, as it enables multiple epochs of training on the same problems within a limited number of sequential updates. Figure 10 illustrates this trade-off by showing the resulting ratios of $B_\text{problem}/n$ across this regime. We also plot the “epoch view” of our results in Figure 8, and find that a large number of training epochs is useful in the small $M$ regime.
    
    We repeat the same analysis on the Hard problem set and observe qualitatively different behavior. In this case, the compute-optimal value of $n^*(M)$ exhibits a distinct non-monotonic dependence on $M$, with larger values of $n$ being optimal even at small $M$. However, once $M$ becomes sufficiently large, a similar trend emerges as in the Easy set: increasing the total batch size $B$ favors larger values of $n$. This U-shaped behavior is intuitive, since when $M$ is fixed, small values of $n$ are simply insufficient to make progress on a meaningful fraction of hard problems. While smaller $n$ could be effective if $M$ were allowed to vary, as in Questions 1 and 3, this flexibility is absent in the present setting. Finally, the non-monotonic behavior in optimal values of $n$ directly implies a corresponding non-monotonic trend in optimal values of $B_\text{problem}$.
    
    [merge variant 1 and 2 as one point, and add texts for fix n]
    
    **2) Second variant: allocating more parallel compute is better when the amount of sequential compute is unconstrained.** We next consider a more relaxed setting in which the number of sequential iterations $M$ is unconstrained and can be tuned by the user on the fly, but the total batch size is allocated between $B_\text{problem}$ and $n$ (see the equation above). On the Easy set, we observe behavior similar to the first variant: larger values of $n$ lead to better performance, even at the cost of a smaller $B_\text{problem}$, since arbitrarily many sequential updates can be performed. We illustrate these results by plotting performance as a function of the number of training steps for different values of $B_\text{problem}$, while holding $n$ fixed, as shown in Figure ??.  On the Hard problem set, however, the trend is more nuanced. We find that moderately smaller values of $n$, together with sufficiently large $B_\text{problem}$, are often preferred. In our experiments, configurations with $B_\text{problem} \geq 32$ and an appropriately chosen $n$ consistently outperform settings with very small $n$, although the performance gap across configurations is relatively modest.
    
    We attribute these differences to the train–test gap. As discussed in the next section, small $n$ combined with a very large $B_\text{problem}$ can lead to overfitting on the training set of easy problems, causing validation performance to plateau or  degrade as sequential training continues. Intuitively, easy problems primarily reinforce behaviors already likely in the model, and training on a large number of such problems in the same batch accelerates overfitting through multi-epoch training. In this regime, larger values of $n$ delay overfitting by emphasizing within-problem exploration and reducing multi-epoch training. In contrast, the Hard set is dominated by optimization difficulty, since observing reward is rare. Here, revisiting the same problems across many epochs, even with slightly smaller $n$, is more effective. More generally, we speculate that the more skewed the problem distribution, the larger the minimum value of $B_\text{problem}$ required for stable and effective training. This explains a trend that differs cross problem difficulty levels. Because we operate under a fixed total rollout budget $B = B_{\mathrm{problem}} \times n$  , increasing $n$ necessarily reduces $B_{\mathrm{problem}} = B/n$, which lowers the effective epoch (problem-revisit times); this is visible in the epoch drop at the frontier switch.
    
    ![**Figure 8. Plotting performance as a function of compute under a fixed $B$.** $B=B_{\text{problem}}\times n$ trades off the number of prompts and rollouts per prompt**.** The compute-optimal frontier shifts from smaller $n$ (larger $B_{\text{problem}}$) in low compute regimes to larger $n$ (smaller $B_{\text{problem}}$) at higher compute, indicating that allocating more parallel rollouts per problem becomes increasingly preferable given higher sampling budgets. The annotated   $Epoch$ quantifies the effective revisit count of each problem. As  $n$ increases (and thus $B_{\mathrm{problem}}$ decreases for fixed $B$), the effective epoch drops, indicating less multi-epoch training and might delay overfitting on Easy.
    ](__IMAGE_PLACEHOLDER__)
    
    **Figure 8. Plotting performance as a function of compute under a fixed $B$.** $B=B_{\text{problem}}\times n$ trades off the number of prompts and rollouts per prompt**.** The compute-optimal frontier shifts from smaller $n$ (larger $B_{\text{problem}}$) in low compute regimes to larger $n$ (smaller $B_{\text{problem}}$) at higher compute, indicating that allocating more parallel rollouts per problem becomes increasingly preferable given higher sampling budgets. The annotated   $Epoch$ quantifies the effective revisit count of each problem. As  $n$ increases (and thus $B_{\mathrm{problem}}$ decreases for fixed $B$), the effective epoch drops, indicating less multi-epoch training and might delay overfitting on Easy.
    

**Figure 5. Reward frontier a function of compute $(B_\text{problem}=32)$,** where the frontier is computed by maximizing over values of $n$. The compute-optimal frontier shifts to larger $n$ with more $C$, showing that more parallelism becomes optimal at higher budgets. For easy problems ***(left)***, **small** $n$ improves fast but plateaus; larger **$n$ sustains gains and dominates at high compute. For the hard ones***(right)***,  the same trend holds, but rewards are lower and saturate earlier, with the frontier reaching a smaller value than $n$ on the easy problems.

:::fold_end:::