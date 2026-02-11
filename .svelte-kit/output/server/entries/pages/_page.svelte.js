import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import { S as Seo, a as ScrollMeter, M as Markdown } from "../../chunks/ScrollMeter.js";
const text = "# RL Excursions during Pre-training: How early is too early for On-policy Learning?\n\n<!-- Blog post for the paper. Replace placeholder content below with your narrative. -->\n\n## Abstract\n\n*[Summarize: RL applied to intermediate pretraining checkpoints; RL effective from ~25% pretraining; direct RL can match SFT→RL; sharpening vs expansion; rollout budget insights.]*\n\n---\n\n## 1. Introduction\n\n*[Motivation: standard pipeline is pretrain → SFT → RL; when can an LLM learn from its own generations?]*\n\n---\n\n## 2. Methodology and Experimental Design\n\n*[1B model, DOLMino pretraining, checkpoints $M_t$; three methods: RL-only ($M^{RL}_t$), SFT-only ($M^{SFT}_t$), Standard pipeline ($M^{SFT→RL}_t$); OpenMathInstruct, GSM8K, MATH; pass@k.]*\n\n---\n\n## 3. Main Results\n\n### 3.1 RL is effective early in pretraining\n\n*[RL improves performance from ~4B tokens; $M^{RL}_t$ competitive with $M^{SFT→RL}_t$ on GSM8K; limitations on MATH.]*\n\n### 3.2 Sharpening vs. expansion with RL\n\n*[Standard pipeline: RL sharpens (pass@1 up, pass@32 down). Direct RL on $M_t$: expansion (both pass@1 and pass@32 improve).]*\n\n---\n\n## 4. RL Rollouts\n\n*[Sparse rewards on early checkpoints; varying $n$ (rollouts per prompt); trade-off between sample efficiency and compute efficiency; $n=5$ vs $n=64$.]*\n\n---\n\n## 5. Discussion and Future Directions\n\n*[Early-stage RL as proof-of-concept; incorporating RL into pretraining; pretraining data and objectives.]*\n\n---\n\n## References\n\n*[Add key citations from the paper when you add content.]*\n";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Seo, "Seo").$$render(
    $$result,
    {
      title: "RL Excursions during Pre-training: How early is too early for On-policy Learning?",
      description: "We study when and how to introduce RL objectives during LLM training: RL on intermediate pretraining checkpoints, sharpening vs expansion, and rollout budgets."
    },
    {},
    {}
  )} <div>${validate_component(ScrollMeter, "ScrollMeter").$$render($$result, { containerSelector: ".md-output" }, {}, {})} <div class="layout-xl text-base space-y-12">${validate_component(Markdown, "Markdown").$$render($$result, { source: text }, {}, {})}</div></div>`;
});
export {
  Page as default
};
