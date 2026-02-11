import{s as x,n as b}from"../chunks/scheduler.CHFMnfDQ.js";import{S as k,i as T,c as m,s as L,e as R,b as d,d as y,f as v,g as _,h as c,j as D,m as f,k as M,l as w,a as $,t as u,n as g}from"../chunks/index.B7zo_JMq.js";import{S as F,a as E,M as A}from"../chunks/ScrollMeter.BCPujD7v.js";const H=`# RL Excursions during Pre-training: How early is too early for On-policy Learning?

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
`;function I(S){let e,s,t,a,l,o,i,p;return e=new F({props:{title:"RL Excursions during Pre-training: How early is too early for On-policy Learning?",description:"We study when and how to introduce RL objectives during LLM training: RL on intermediate pretraining checkpoints, sharpening vs expansion, and rollout budgets."}}),a=new E({props:{containerSelector:".md-output"}}),i=new A({props:{source:H}}),{c(){m(e.$$.fragment),s=L(),t=R("div"),m(a.$$.fragment),l=L(),o=R("div"),m(i.$$.fragment),this.h()},l(n){d(e.$$.fragment,n),s=y(n),t=v(n,"DIV",{});var r=_(t);d(a.$$.fragment,r),l=y(r),o=v(r,"DIV",{class:!0});var h=_(o);d(i.$$.fragment,h),h.forEach(c),r.forEach(c),this.h()},h(){D(o,"class","layout-xl text-base space-y-12")},m(n,r){f(e,n,r),M(n,s,r),M(n,t,r),f(a,t,null),w(t,l),w(t,o),f(i,o,null),p=!0},p:b,i(n){p||($(e.$$.fragment,n),$(a.$$.fragment,n),$(i.$$.fragment,n),p=!0)},o(n){u(e.$$.fragment,n),u(a.$$.fragment,n),u(i.$$.fragment,n),p=!1},d(n){n&&(c(s),c(t)),g(e,n),g(a),g(i)}}}class P extends k{constructor(e){super(),T(this,e,null,I,x,{})}}export{P as component};
