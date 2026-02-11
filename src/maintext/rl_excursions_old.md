# RL Excursions during Pre-training: How early is too early for On-policy Learning?

<!-- Blog post for the paper. Replace placeholder content below with your narrative. -->

## Abstract

*[Summarize: RL applied to intermediate pretraining checkpoints; RL effective from ~25% pretraining; direct RL can match SFT→RL; sharpening vs expansion; rollout budget insights.]*

---

## 1. Introduction

*[Motivation: standard pipeline is pretrain → SFT → RL; when can an LLM learn from its own generations?]*

---

## 2. Methodology and Experimental Design

*[1B model, DOLMino pretraining, checkpoints $M_t$; three methods: RL-only ($M^{RL}_t$), SFT-only ($M^{SFT}_t$), Standard pipeline ($M^{SFT→RL}_t$); OpenMathInstruct, GSM8K, MATH; pass@k.]*

---

## 3. Main Results

### 3.1 RL is effective early in pretraining

*[RL improves performance from ~4B tokens; $M^{RL}_t$ competitive with $M^{SFT→RL}_t$ on GSM8K; limitations on MATH.]*

### 3.2 Sharpening vs. expansion with RL

*[Standard pipeline: RL sharpens (pass@1 up, pass@32 down). Direct RL on $M_t$: expansion (both pass@1 and pass@32 improve).]*

---

## 4. RL Rollouts

*[Sparse rewards on early checkpoints; varying $n$ (rollouts per prompt); trade-off between sample efficiency and compute efficiency; $n=5$ vs $n=64$.]*

---

## 5. Discussion and Future Directions

*[Early-stage RL as proof-of-concept; incorporating RL into pretraining; pretraining data and objectives.]*

---

## References

*[Add key citations from the paper when you add content.]*
