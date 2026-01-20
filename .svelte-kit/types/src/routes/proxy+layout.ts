// @ts-nocheck
import type { LayoutLoad } from "./$types";

export const prerender = true;
export const trailingSlash = "always";

export const load = async ({ url }: Parameters<LayoutLoad>[0]) => {
  return {
    pathname: url.pathname,
    header: {
      title:
        "IsoCompute Playbook: Optimally Scaling Sampling Compute for RL Training of LLMs",
      // Edit these three fields to update the header author block.
      authors: [
        { name: "Zhoujun Cheng*", affils: ["ucsd", "mbzuai"] },
        { name: "Yutao Xie*", affils: ["ucsd"] },
        { name: "Yuxiao Qu*", affils: ["cmu"] },
        { name: "Amrith Setlur*", affils: ["cmu"] },
        { name: "Shibo Hao", affils: ["ucsd", "mbzuai"] },
        { name: "Varad Pimpalkhute", affils: ["mbzuai"] },
        { name: "Tongtong Liang", affils: ["ucsd"] },
        { name: "Feng Yao", affils: ["ucsd"] },
        { name: "Zhengzhong Liu", affils: ["mbzuai"] },
        { name: "Eric Xing", affils: ["mbzuai","cmu"] },
        { name: "Virginia Smith", affils: ["cmu"] },
        { name: "Ruslan Salakhutdinov", affils: ["cmu"] },
        { name: "Zhiting Hu", affils: ["ucsd"] },
        { name: "Taylor Killian", affils: ["mbzuai"] },
        { name: "Aviral Kumar", affils: ["cmu"] },
      ],
      affiliations: [
        // "UC San Diego",
        // "MBZUAI-IFM",
        // "Carnegie Mellon University",
        "* Equal contribution",
        // "Work done during internship at MBZUAI-IFM",
      ],
      date: " ",
    },
  };
};
