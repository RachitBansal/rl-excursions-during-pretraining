import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import { S as Seo, a as ScrollMeter, M as Markdown } from "../../chunks/ScrollMeter.js";
import { t as textRaw } from "../../chunks/rl_excursions.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Seo, "Seo").$$render(
    $$result,
    {
      title: "RL Excursions during Pre-training: How early is too early for On-policy Learning?",
      description: "We study when and how to introduce RL objectives during LLM training: RL on intermediate pretraining checkpoints, sharpening vs expansion, and rollout budgets."
    },
    {},
    {}
  )} <div>${validate_component(ScrollMeter, "ScrollMeter").$$render($$result, { containerSelector: ".md-output" }, {}, {})} <div class="layout-xl text-base space-y-12">${validate_component(Markdown, "Markdown").$$render($$result, { source: textRaw }, {}, {})}</div></div>`;
});
export {
  Page as default
};
