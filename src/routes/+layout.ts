import type { LayoutLoad } from "./$types";

export const prerender = true;
export const trailingSlash = "always";

export const load: LayoutLoad = async ({ url }) => {
  return {
    pathname: url.pathname,
    header: {
      title:
        "IsoCompute Playbook: Optimally Scaling Sampling Compute for RL Training of LLMs",
      // Edit these three fields to update the header author block.
      authors:
        "Zhoujun Cheng¹²*, Yutao Xie¹*, Yuxiao Qu³*, Amrith Setlur³*, Shibo Hao¹², Varad Pimpalkhute², Tongtong Liang¹, Feng Yao¹, Hector Liu², Eric Xing², Virginia Smith³, Ruslan Salakhutdinov³, Zhiting Hu¹, Taylor Killian², Aviral Kumar³",
      affiliations: [
        "¹ UC San Diego",
        "² MBZUAI-IFM",
        "³ Carnegie Mellon University",
        "* equal contribution",
      ],
      date: "2026 01/19",
    },
  };
};
