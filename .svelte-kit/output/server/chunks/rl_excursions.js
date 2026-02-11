import { c as create_ssr_component, e as escape, f as add_attribute, o as onDestroy, d as each, v as validate_component } from "./ssr.js";
import katex from "katex";
import { marked } from "marked";
import strftime from "strftime";
const Seo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title: title2 } = $$props;
  let { ogTitle = null } = $$props;
  let { description } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title2 !== void 0)
    $$bindings.title(title2);
  if ($$props.ogTitle === void 0 && $$bindings.ogTitle && ogTitle !== void 0)
    $$bindings.ogTitle(ogTitle);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  return `${$$result.head += `<!-- HEAD_svelte-1u7ey3_START -->${$$result.title = `<title>${escape(title2)}</title>`, ""}<meta name="description"${add_attribute("content", description, 0)}><meta property="og:title"${add_attribute("content", ogTitle ?? title2, 0)}><meta property="og:description"${add_attribute("content", description, 0)}><!-- HEAD_svelte-1u7ey3_END -->`, ""}`;
});
var title$1 = "Compute-Optimal Scaling for Value-Based Deep RL";
var link$1 = "https://arxiv.org/abs/2508.14881";
var date$1 = /* @__PURE__ */ new Date(175608e7);
var highlight$1 = true;
var image_before$1 = "/assets/images/model_scaling_before.png";
var image_after$1 = "/assets/images/model_scaling_3d.mp4";
var resources$1 = [
  {
    label: "arXiv",
    url: "https://arxiv.org/abs/2508.14881"
  },
  {
    label: "Code",
    url: "https://github.com/prestonfu/model_scaling"
  },
  {
    label: "Thread",
    url: "https://x.com/preston_fu/status/1962920781387882841"
  },
  {
    label: "Poster",
    url: "/assets/files/model_scaling_poster_neurips.pdf"
  }
];
var content$1 = "[Preston Fu](https://www.prestonfu.com/)\\*,\n[Oleh Rybkin](https://olehrybkin.com/)\\*,\n[Zhiyuan Zhou](https://zhouzypaul.github.io/),\n[Michal Nauman](https://scholar.google.com/citations?user=GnEVRtQAAAAJ&hl=en),\n[Pieter Abbeel](https://people.eecs.berkeley.edu/~pabbeel/),\n[Sergey Levine](https://people.eecs.berkeley.edu/~svlevine/),\n[Aviral Kumar](https://aviralkumar2907.github.io/)\n\n_NeurIPS_, 2025";
const model_scaling = {
  title: title$1,
  link: link$1,
  date: date$1,
  highlight: highlight$1,
  image_before: image_before$1,
  image_after: image_after$1,
  resources: resources$1,
  content: content$1
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  content: content$1,
  date: date$1,
  default: model_scaling,
  highlight: highlight$1,
  image_after: image_after$1,
  image_before: image_before$1,
  link: link$1,
  resources: resources$1,
  title: title$1
}, Symbol.toStringTag, { value: "Module" }));
var title = "Value-Based Deep RL Scales Predictably";
var link = "https://arxiv.org/abs/2502.04327";
var date = /* @__PURE__ */ new Date(17388e8);
var highlight = true;
var image_before = "/assets/images/qscaled_before.png";
var image_after = "/assets/images/qscaled_after.gif";
var resources = [
  {
    label: "arXiv",
    url: "https://arxiv.org/abs/2502.04327"
  },
  {
    label: "Code",
    url: "https://github.com/prestonfu/qscaled"
  },
  {
    label: "Thread",
    url: "https://x.com/_oleh/status/1889016893140516880"
  },
  {
    label: "Poster",
    url: "/assets/files/utd_scaling_poster_icml.pdf"
  }
];
var content = "[Oleh Rybkin](https://olehrybkin.com/),\n[Michal Nauman](https://scholar.google.com/citations?user=GnEVRtQAAAAJ&hl=en),\n[Preston Fu](https://www.prestonfu.com/),\n[Charlie Snell](https://sea-snell.github.io/),\n[Pieter Abbeel](https://people.eecs.berkeley.edu/~pabbeel/),\n[Sergey Levine](https://people.eecs.berkeley.edu/~svlevine/),\n[Aviral Kumar](https://aviralkumar2907.github.io/)\n\n_ICML_, 2025 \\\n_ICLR Robot Learning Workshop_, 2025 (**oral**)";
const utd_scaling = {
  title,
  link,
  date,
  highlight,
  image_before,
  image_after,
  resources,
  content
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  content,
  date,
  default: utd_scaling,
  highlight,
  image_after,
  image_before,
  link,
  resources,
  title
}, Symbol.toStringTag, { value: "Module" }));
strftime.utc();
function trimName(id) {
  return id.match(/\.\.\/projects\/(.*)\.md$/)?.[1];
}
const Jumpbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  var _a;
  const projects = /* @__PURE__ */ Object.assign({ "../../projects/model_scaling.md": __vite_glob_0_0, "../../projects/utd_scaling.md": __vite_glob_0_1 });
  const titleMap = Object.entries(projects).reduce(
    (acc, [path, mod]) => {
      const id2 = trimName(path) || path;
      acc[id2] = mod.title;
      return acc;
    },
    {}
  );
  let { id } = $$props;
  const label = (_a = titleMap[id]) !== null && _a !== void 0 ? _a : id;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  return `<a${add_attribute("href", "#" + id, 0)} class="block -mx-4 mb-4 px-4 py-2 bg-gray-100 hover:bg-slate-100 rounded transition"><span class="text-neutral-500" data-svelte-h="svelte-a7fxhe">↪</span> Our paper: <em>${escape(label)}</em></a>`;
});
const CalloutBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let meta;
  let displayLabel;
  var _a;
  let { html } = $$props;
  let { title: title2 = "" } = $$props;
  let { variant = "note" } = $$props;
  const styles = {
    note: {
      wrap: "bg-slate-50 hover:bg-slate-100/60 border-slate-600",
      badge: "text-slate-700",
      label: "Note"
    },
    info: {
      wrap: "bg-sky-50 hover:bg-sky-100/60 border-sky-700",
      badge: "text-sky-800",
      label: "Takeaways"
    },
    tip: {
      wrap: "bg-emerald-50 hover:bg-emerald-100/60 border-emerald-700",
      badge: "text-emerald-800",
      label: "Tip"
    },
    warning: {
      wrap: "bg-amber-50 hover:bg-amber-100/60 border-amber-700",
      badge: "text-amber-800",
      label: "Warning"
    },
    takeaway: {
      wrap: "bg-[#EFE6DC] hover:bg-[#E4D6C7] border-[#5A3E33]",
      badge: "text-[#5A3E33]",
      label: "Takeaways"
    }
  };
  if ($$props.html === void 0 && $$bindings.html && html !== void 0)
    $$bindings.html(html);
  if ($$props.title === void 0 && $$bindings.title && title2 !== void 0)
    $$bindings.title(title2);
  if ($$props.variant === void 0 && $$bindings.variant && variant !== void 0)
    $$bindings.variant(variant);
  meta = (_a = styles[variant]) !== null && _a !== void 0 ? _a : styles.note;
  displayLabel = title2 || meta.label;
  return `<div${add_attribute("class", `my-4 rounded p-4 pb-1 border-l-4 transition ${meta.wrap}`, 0)}><div${add_attribute("class", `text-xs font-semibold tracking-wide uppercase ${meta.badge}`, 0)}>${escape(displayLabel)}</div> <div class="prose max-w-none mt-1"><div class="md-output"><!-- HTML_TAG_START -->${html}<!-- HTML_TAG_END --></div></div></div>`;
});
const css$2 = {
  code: ".foldbox{margin-top:0.5rem;margin-bottom:0.5rem}.foldbox--boxed{border-radius:0.25rem;border-width:1px;--tw-border-opacity:1;border-color:rgb(229 229 229 / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:rgb(250 250 250 / var(--tw-bg-opacity))}.foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;font-weight:600;--tw-text-opacity:1;color:rgb(23 23 23 / var(--tw-text-opacity));display:flex;align-items:center;gap:0.75rem;font-size:1rem;line-height:1.4rem}.foldbox--boxed > .foldbox__summary{padding-left:1rem;padding-right:1rem;padding-top:0.75rem;padding-bottom:0.75rem}.foldbox--boxed > .foldbox__summary:hover{--tw-bg-opacity:1;background-color:rgb(245 245 245 / var(--tw-bg-opacity))}details.foldbox > summary::-webkit-details-marker{display:none}.foldbox__caret{width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:7px solid currentColor;transform:rotate(0deg);transform-origin:2px 6px;transition:transform 120ms ease;opacity:0.9;flex:0 0 auto}details.foldbox[open] .foldbox__caret{transform:rotate(90deg)}details.foldbox.foldbox--boxed > summary .foldbox__caret{transform:rotate(0deg)}details.foldbox.foldbox--boxed[open] > summary .foldbox__caret{transform:rotate(90deg)}.foldbox--boxed > .foldbox__body{padding-left:1rem;padding-right:1rem;padding-bottom:0.75rem;padding-top:0.5rem}",
  map: null
};
const FoldBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title: title2 = "Details" } = $$props;
  let { open = false } = $$props;
  let { html } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title2 !== void 0)
    $$bindings.title(title2);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.html === void 0 && $$bindings.html && html !== void 0)
    $$bindings.html(html);
  $$result.css.add(css$2);
  return `<details class="foldbox foldbox--boxed my-4" ${open ? "open" : ""} data-foldbox="1"><summary class="foldbox__summary"><span class="foldbox__caret" aria-hidden="true"></span> <span class="foldbox__title">${escape(title2)}</span></summary> <div class="foldbox__body"><div class="md-output"><!-- HTML_TAG_START -->${html}<!-- HTML_TAG_END --></div></div> </details>`;
});
const css$1 = {
  code: '.md-output [id^="fig-"]{scroll-margin-top:120px}.md-output .md-figcaption{width:100%;max-width:100%;display:block;text-align:left;margin-bottom:1rem;color:rgb(107 114 128);font-size:0.875rem;line-height:1.25rem;padding-left:0 !important;padding-right:0 !important}.md-output .md-figgrid-2x2{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:14px 18px;align-items:start;margin:0 0 1rem 0}@media(max-width: 800px){.md-output .md-figgrid-2x2{grid-template-columns:1fr}}.md-output .md-figgrid-2x2 figure{margin:0}.md-output .md-figgrid-2x2 img{width:100%;height:auto;display:block;border-radius:0.25rem}.md-output .md-figgrid-2x2 figcaption{margin-top:0.35rem;font-size:0.875rem;line-height:1.25rem;color:rgb(107 114 128)}.md-output h1{margin-top:1.5rem;margin-bottom:1rem;font-size:1.875rem;line-height:2.25rem;font-weight:700}.md-output h2{margin-top:1.25rem;margin-bottom:0.75rem;font-size:1.1rem;font-weight:600}.md-output h3{margin-top:1rem;margin-bottom:0.5rem;font-size:1.125rem;line-height:1.75rem;font-weight:600}.md-output h4{margin-top:0.75rem;margin-bottom:0.5rem;font-size:1rem;line-height:1.5rem;font-weight:600}.md-output p{margin-bottom:1rem}.md-output strong{font-weight:600}.md-output em{font-style:italic}.md-output code{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(245 245 245 / var(--tw-bg-opacity));padding-left:0.25rem;padding-right:0.25rem;font-size:95%}.md-output pre{margin-bottom:1rem;overflow-x:auto;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(245 245 245 / var(--tw-bg-opacity));padding:1rem}.md-output ul{margin-left:1.25rem;margin-bottom:1rem;list-style-position:outside;list-style-type:disc}.md-output ul>:not([hidden])~.svelte-1cybysc.svelte-1cybysc:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.25rem * var(--tw-space-y-reverse))}.md-output ul{padding-left:1.25rem}.md-output ol{margin-left:1.25rem;margin-bottom:1rem;list-style-position:outside;list-style-type:decimal}.md-output ol>:not([hidden])~.svelte-1cybysc.svelte-1cybysc:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.25rem * var(--tw-space-y-reverse))}.md-output ol{padding-left:1.25rem}.md-output li{margin-bottom:0.25rem}.md-output table{margin-bottom:1rem;width:100%;font-size:95%;border-collapse:collapse;display:block;overflow-x:auto;max-width:100%}.md-output thead{--tw-bg-opacity:1;background-color:rgb(250 250 250 / var(--tw-bg-opacity))}.md-output th,.md-output td{padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;vertical-align:top;border:1px solid rgb(229 231 235)}.md-output th{text-align:left;font-weight:600;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity));white-space:nowrap}.md-output tbody tr:nth-child(even){background-color:rgb(250 250 250 / 0.5)}.math-block{margin-top:1rem;margin-bottom:1rem;text-align:center}.math-inline{vertical-align:baseline}.katex-error{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(254 226 226 / var(--tw-bg-opacity));padding:0.25rem;--tw-text-opacity:1;color:rgb(220 38 38 / var(--tw-text-opacity))}.md-output blockquote{margin-top:0.5rem;margin-bottom:0.5rem;display:inline-block;border-radius:0.25rem;border-left-width:4px;--tw-border-opacity:1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:rgb(250 250 250 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;vertical-align:middle}.md-output blockquote > :first-child{margin-top:0px}.md-output blockquote > :last-child{margin-bottom:0px}details.foldbox.foldbox--h2{margin-top:1rem;margin-bottom:1rem}details.foldbox.foldbox--h2 > .foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0px;padding-right:0px;padding-top:0.25rem;padding-bottom:0.25rem}details.foldbox.foldbox--h2 > .foldbox__body{padding-left:1.5rem;padding-top:0.5rem}details.foldbox.foldbox--h2 .foldbox__h2 > h2{margin:0}details.foldbox.foldbox--h2 .foldbox__h2{pointer-events:auto}details.foldbox.foldbox--h2 .foldbox__h2 h2,details.foldbox.foldbox--h2 .foldbox__h2 h2 *{pointer-events:none}details.foldbox > summary::-webkit-details-marker{display:none}.foldbox__caret{width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:7px solid currentColor;transform:rotate(0deg);transform-origin:2px 6px;transition:transform 120ms ease;opacity:0.9;flex:0 0 auto}details.foldbox[open] .foldbox__caret{transform:rotate(90deg)}details.foldbox.foldbox--h3{margin-top:0.5rem;margin-bottom:0.5rem}details.foldbox.foldbox--h3 > .foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0px;padding-right:0px;padding-top:0.25rem;padding-bottom:0.25rem;padding-left:1rem;font-size:1rem;line-height:1.4rem;font-weight:600;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity));display:flex;align-items:center;gap:0.5rem}details.foldbox.foldbox--h3 > .foldbox__body{padding-left:2rem;padding-top:0.5rem}details.foldbox.foldbox--h3 .foldbox__h3 > h3{margin:0}details.foldbox.foldbox--h3 .foldbox__h3 h3,details.foldbox.foldbox--h3 .foldbox__h3 h3 *{pointer-events:none}details.foldbox > .foldbox__body .foldbox__pin{display:block}details.foldbox.foldbox--h3 > summary .foldbox__caret{transform:rotate(0deg)}details.foldbox.foldbox--h3[open] > summary .foldbox__caret{transform:rotate(90deg) !important}.sm-block h1{margin-top:1.5rem;margin-bottom:1rem;font-size:1.5rem;line-height:2rem;font-weight:700}.sm-block h2{margin-top:1.25rem;margin-bottom:0.75rem;font-size:1rem;line-height:1.5rem;font-weight:600}.sm-block h3{margin-top:1rem;margin-bottom:0.5rem;font-size:1rem;line-height:1.4rem;font-weight:600}.sm-block h4{margin-top:0.75rem;margin-bottom:0.5rem;font-size:0.75rem;line-height:1rem;font-weight:600}.sm-block code{font-size:90%}.md-shell.svelte-1cybysc.svelte-1cybysc{position:relative}.md-shell.svelte-1cybysc:not([data-fn-aligned="1"]) .md-footnotes.svelte-1cybysc{opacity:0}.md-grid.svelte-1cybysc.svelte-1cybysc{display:grid;grid-template-columns:minmax(0, 1fr) minmax(0, var(--md-main-col, 760px)) minmax(0, 1fr);-moz-column-gap:var(--toc-gap, var(--side-gap, 32px));column-gap:var(--toc-gap, var(--side-gap, 32px));align-items:start}.md-output.svelte-1cybysc.svelte-1cybysc{grid-column:2;min-width:0}.md-footnotes.svelte-1cybysc.svelte-1cybysc{position:relative;grid-column:3;width:260px;justify-self:start;padding-left:calc(var(--footnote-gap, 48px) - var(--toc-gap, var(--side-gap, 32px)));font-size:13px;line-height:1.6;color:#6b7280}.md-footnotes.svelte-1cybysc ol.svelte-1cybysc{list-style:none;padding:0;margin:0;position:relative;min-height:100%}.md-footnotes.svelte-1cybysc li.svelte-1cybysc{display:flex;gap:8px;width:100%;margin-bottom:var(--footnote-item-gap, 28px)}.md-footnotes.svelte-1cybysc li.svelte-1cybysc:last-child{margin-bottom:0}.md-footnotes.svelte-1cybysc .fn-label.svelte-1cybysc{font-variant-numeric:tabular-nums;color:#6b7280}.md-footnotes.svelte-1cybysc .fn-text.svelte-1cybysc p{margin:0}.md-footnotes.svelte-1cybysc .fn-text.svelte-1cybysc{min-width:0}.md-footnotes.svelte-1cybysc .fn-text.svelte-1cybysc a{text-decoration-line:underline;text-decoration-color:#a3a3a3;text-underline-offset:3px;overflow-wrap:anywhere;word-break:break-word;-webkit-hyphens:auto;hyphens:auto}.footnote-ref{font-size:0.75em;vertical-align:super;margin-left:1px}.footnote-ref a{color:#6b7280;text-decoration:none}.footnote-ref a:hover{color:#111827}@media(max-width: 1024px){.md-grid.svelte-1cybysc.svelte-1cybysc{grid-template-columns:minmax(0, 1fr);row-gap:16px}.md-output.svelte-1cybysc.svelte-1cybysc{grid-column:1}.md-footnotes.svelte-1cybysc.svelte-1cybysc{position:static;grid-column:1;width:auto}}pre[data-copyable]{position:relative}pre[data-copyable] .copy-btn{position:absolute;top:0.25rem;right:0.25rem;background:#f3f4f6;font-size:0.75rem;padding:0.1rem 0.4rem;border-radius:0.25rem;cursor:pointer;opacity:1;transition:opacity 0.2s}pre[data-copyable]:hover .copy-btn{opacity:1}',
  map: null
};
(function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
});
function normalizeFootnoteId(id) {
  return String(id).replace(/[^a-zA-Z0-9\-_]/g, "");
}
function renderMath(tex, displayMode) {
  try {
    return katex.renderToString(tex, { throwOnError: false, displayMode });
  } catch (_a) {
    const tag = displayMode ? "pre" : "code";
    return `<${tag} class="katex-error">${tex}</${tag}>`;
  }
}
const mathBlock = {
  name: "mathBlock",
  level: "block",
  start: (src) => {
    var _a;
    return (_a = src.match(/\$\$/)) === null || _a === void 0 ? void 0 : _a.index;
  },
  tokenizer(src) {
    const match = /^\$\$([\s\S]+?)\$\$/.exec(src);
    if (match)
      return {
        type: "mathBlock",
        raw: match[0],
        text: match[1].trim()
      };
  },
  renderer: (token) => `<div class="math math-block">${renderMath(token.text, true)}</div>`
};
const mathInline = {
  name: "mathInline",
  level: "inline",
  start: (src) => {
    var _a;
    return (_a = src.match(/\$/)) === null || _a === void 0 ? void 0 : _a.index;
  },
  tokenizer(src) {
    const match = /^\$([^\$\n]+?)\$/.exec(src);
    if (match)
      return {
        type: "mathInline",
        raw: match[0],
        text: match[1].trim()
      };
  },
  renderer: (token) => `<span class="math math-inline">${renderMath(token.text, false)}</span>`
};
const colorText = {
  name: "colorText",
  level: "inline",
  start: (src) => {
    var _a;
    return (_a = src.match(/::/)) === null || _a === void 0 ? void 0 : _a.index;
  },
  tokenizer(src) {
    const match = /^::(gray|brown|orange|yellow|green|blue|purple|pink|red)\[([^\]]+?)\]::/.exec(src);
    if (match) {
      return {
        type: "colorText",
        raw: match[0],
        color: match[1],
        text: match[2]
      };
    }
  },
  renderer: (token) => {
    const colors = {
      gray: "#9B9A97",
      brown: "#64473A",
      orange: "#D9730D",
      yellow: "#DFAB01",
      green: "#0F7B6C",
      blue: "#0B6E99",
      purple: "#6940A5",
      pink: "#AD1A72",
      red: "#E03E3D"
    };
    const color = colors[token.color] || colors.gray;
    const innerHtml = marked.parseInline(token.text);
    return `<span style="color: ${color};">${innerHtml}</span>`;
  }
};
const customRenderer = {
  link(href, title2, text2) {
    const isInternal = /^(\/|#|[A-Za-z0-9\-_]+(\.html?)?$)/.test(href);
    let out = `<a href="${encodeURI(href)}" class="link"`;
    if (!isInternal)
      out += ` target="_blank" rel="external noopener noreferrer"`;
    if (title2)
      out += ` title="${title2}"`;
    out += `>${text2}</a>`;
    return out;
  },
  heading(text2, level, raw, slugger) {
    const id = slugger ? slugger.slug(raw) : slugify(raw || text2);
    return `<h${level} id="${id}">${text2}</h${level}>`;
  },
  blockquote(quote) {
    return `<blockquote class="inline-block bg-neutral-50 border-l-4 border-neutral-600 rounded px-3 py-2 align-middle my-2">${quote}</blockquote>`;
  },
  image(href, title2, text2) {
    if (!href || href === "__IMAGE_PLACEHOLDER__" || href.trim() === "") {
      if (text2) {
        return `<div class="text-left text-gray-400 italic text-sm my-4">[Image: ${text2}]</div>`;
      }
      return "<!-- image placeholder -->";
    }
    const id = text2 ? `fig-${slugify(text2)}` : "";
    let out = `<img src="${href}" alt="${text2 || ""}" ${id ? `id="${id}" ` : ""}class="block mx-auto unselectable" />`;
    if (title2) {
      const m = /\bFigure\s+(\d+)\b/i.exec(String(title2 || ""));
      const figNumAttr = m ? ` data-fig-num="${m[1]}"` : "";
      const cap = boldFigurePrefix(String(title2 || ""));
      out += `<div class='md-figcaption text-left text-gray-500 mb-4 md:px-8 lg:px-12 text-sm'${figNumAttr}>${marked.parse(cap, { smartypants: true })}</div>`;
    }
    return out;
  }
};
function boldFigurePrefix(rawTitle) {
  const s = String(rawTitle || "").trim();
  if (/^(?:\*\*|<strong>|\s*<b>)/i.test(s))
    return s;
  return s.replace(/^(Figure\s+\d+(?:\([a-z]\))?\s*(?:[:.]))(\s*)/i, "**$1**$2");
}
function slugify(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const imageAttrExtension = {
  name: "imageAttr",
  level: "inline",
  start: (src) => src.indexOf("!["),
  tokenizer(src) {
    const re = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\{([^}]+)\}/;
    const match = re.exec(src);
    if (match) {
      const [raw, alt, srcUrl, title2, attrStr] = match;
      const attrs = {};
      attrStr.split(/\s+/).forEach((tok) => {
        if (!tok)
          return;
        const eq = tok.indexOf("=");
        if (eq === -1) {
          attrs[tok] = "";
        } else {
          const k = tok.slice(0, eq);
          const v = tok.slice(eq + 1).replace(/^["']|["']$/g, "");
          if (k)
            attrs[k] = v;
        }
      });
      return {
        type: "imageAttr",
        raw,
        alt,
        src: srcUrl,
        title: title2,
        attrs
      };
    }
  },
  renderer(token) {
    const isVideoSrc = /\.(mp4|webm|ogg)(\?.*)?$/i.test(token.src);
    const declaresVideo = token.attrs["type"] === "video" || Object.prototype.hasOwnProperty.call(token.attrs, "video");
    let out = "";
    if (isVideoSrc || declaresVideo) {
      const lower = token.src.toLowerCase();
      const sourceType = token.attrs["source-type"] || (lower.endsWith(".webm") ? "video/webm" : lower.endsWith(".ogg") ? "video/ogg" : "video/mp4");
      const freezeMs = token.attrs["freeze"] || "10000";
      const figId = token.attrs["id"] || `fig-${slugify(token.alt || "")}`;
      out += `<video class="block mx-auto autoplay-on-fullview md-video unselectable" aria-label="${token.alt || ""}" id="${figId}"`;
      const hasPlaysinline = Object.prototype.hasOwnProperty.call(token.attrs, "playsinline");
      for (const k in token.attrs) {
        if (k === "type" || k === "video" || k === "source-type" || k === "freeze" || k === "controls" || k === "id")
          continue;
        const val = token.attrs[k];
        out += val === "" ? ` ${k}` : ` ${k}="${val}"`;
      }
      out += " muted playsinline";
      if (!hasPlaysinline)
        out += " playsinline";
      out += ` data-freeze-ms="${freezeMs}"`;
      out += `><source src="${token.src}#t=0.1" type="${sourceType}" /></video>`;
    } else {
      const figId = token.attrs["id"] || `fig-${slugify(token.alt)}`;
      out += `<img src="${token.src}" alt="${token.alt}" id="${figId}" class="block mx-auto unselectable"`;
      for (const k in token.attrs) {
        if (k === "id")
          continue;
        out += ` ${k}="${token.attrs[k]}"`;
      }
      out += " />";
    }
    if (token.title) {
      const m = /\bFigure\s+(\d+)\b/i.exec(String(token.title || ""));
      const figNumAttr = m ? ` data-fig-num="${m[1]}"` : "";
      const cap = boldFigurePrefix(String(token.title || ""));
      out += `<div class='md-figcaption text-left text-gray-500 mb-4 md:px-8 lg:px-12 text-sm'${figNumAttr}>${marked.parse(cap, { smartypants: true })}</div>`;
    }
    return out;
  }
};
marked.use({
  gfm: true,
  extensions: [imageAttrExtension, mathBlock, mathInline, colorText],
  renderer: customRenderer
});
const JUMP_RE = /:::jumpbox\s+id="([^"]+)"(?:\s+label="([^"]+)")?\s*:::/gm;
const TAKE_BEGIN_RE = /:::takeaway_begin:::/gm;
const TAKE_END_RE = /:::takeaway_end:::/gm;
const SMALL_BEGIN_RE = /:::small_begin:::/gm;
const SMALL_END_RE = /:::small_end:::/gm;
const CALLOUT_BEGIN_RE = /:::callout_begin(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?\s*:::/gm;
const CALLOUT_END_RE = /:::callout_end:::/gm;
const FOLD_BEGIN_RE = /:::fold_begin(?:\s+title="([^"]+)")?(?:\s+(open))?\s*:::/gm;
const FOLD_END_RE = /:::fold_end:::/gm;
const H2_RE = /^##(?!#)\s+(.+?)\s*$/gm;
const H3_RE = /^###(?!#)\s+(.+?)\s*$/gm;
function createSlugger() {
  const seen = /* @__PURE__ */ new Map();
  return {
    slug(raw) {
      var _a;
      const base = slugify(raw || "") || "section";
      const prev = (_a = seen.get(base)) !== null && _a !== void 0 ? _a : 0;
      seen.set(base, prev + 1);
      return prev === 0 ? base : `${base}-${prev}`;
    }
  };
}
function extractFootnotes(md) {
  const lines = md.split("\n");
  const mainLines = [];
  const footnotes = [];
  let current = null;
  for (const line of lines) {
    const match = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
    if (match) {
      if (current)
        footnotes.push(current);
      const id = match[1];
      current = {
        id,
        safeId: normalizeFootnoteId(id),
        raw: [match[2]]
      };
      continue;
    }
    if (current) {
      if (/^\s{2,}|\t/.test(line)) {
        current.raw.push(line.replace(/^\s+/, ""));
        continue;
      }
      footnotes.push(current);
      current = null;
    }
    mainLines.push(line);
  }
  if (current)
    footnotes.push(current);
  const cleaned = mainLines.join("\n");
  const notes = footnotes.map((fn) => ({
    id: fn.id,
    safeId: fn.safeId,
    html: marked.parse(fn.raw.join("\n"), { smartypants: true })
  }));
  return { main: cleaned, notes };
}
function computeFootnoteNumbering(main, notes) {
  const order = [];
  const seen = /* @__PURE__ */ new Set();
  const re = /\[\^([^\]]+)\]/g;
  let m;
  while ((m = re.exec(main)) !== null) {
    const safeId = normalizeFootnoteId(m[1]);
    if (!safeId || seen.has(safeId))
      continue;
    seen.add(safeId);
    order.push(safeId);
  }
  const noteBySafeId = new Map(notes.map((n) => [n.safeId, n]));
  const numbered = [];
  const idToNum = /* @__PURE__ */ new Map();
  let next = 1;
  for (const safeId of order) {
    const n = noteBySafeId.get(safeId);
    if (!n)
      continue;
    idToNum.set(safeId, next);
    numbered.push(Object.assign(Object.assign({}, n), { num: next }));
    next += 1;
  }
  for (const n of notes) {
    if (idToNum.has(n.safeId))
      continue;
    idToNum.set(n.safeId, next);
    numbered.push(Object.assign(Object.assign({}, n), { num: next }));
    next += 1;
  }
  return { idToNum, numbered };
}
function replaceFootnoteRefs(md, idToNum) {
  return md.replace(/\[\^([^\]]+)\]/g, (_m, id) => {
    const safeId = normalizeFootnoteId(id);
    const num = idToNum.get(safeId);
    const label = num ? String(num) : String(id);
    return `<sup class="footnote-ref"><a href="#fn-${safeId}" data-fn="${safeId}">${label}</a></sup>`;
  });
}
function buildH3Sections(children) {
  const out = [];
  let current = null;
  for (const ch of children) {
    if (isPinnedTakeaway(ch)) {
      if (current)
        out.push(Object.assign({ type: "subsection" }, current));
      current = null;
      out.push({ type: "chunk", chunk: ch });
      continue;
    }
    if (ch.type === "h3") {
      if (current)
        out.push(Object.assign({ type: "subsection" }, current));
      const inline = marked.parseInline(ch.text, { smartypants: true });
      const h3Html = `<h3 id="${ch.id}">${inline}</h3>`;
      current = {
        heading: { id: ch.id, text: ch.text, html: h3Html },
        children: []
      };
      continue;
    }
    const renderable = ch;
    if (current)
      current.children.push(renderable);
    else
      out.push({ type: "chunk", chunk: renderable });
  }
  if (current)
    out.push(Object.assign({ type: "subsection" }, current));
  return out;
}
function shouldOpenH3(sub) {
  if (sub.type !== "subsection")
    return false;
  const text2 = (sub.heading.text || "").trim().toLowerCase();
  return /^question\s*\d+/.test(text2);
}
function isPinnedTakeaway(chunk) {
  if (chunk.type !== "callout")
    return false;
  if (chunk.variant === "takeaway")
    return true;
  if ((chunk.title || "").toLowerCase().includes("takeaway"))
    return true;
  const head = (chunk.content || "").slice(0, 200).toLowerCase();
  return /^\s*\*\*.*takeaway/.test(head);
}
const Markdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chunks;
  let sections;
  (function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  });
  let { source } = $$props;
  let processedSource = source;
  let footnotes = [];
  const htmlCache = /* @__PURE__ */ new Map();
  function toHtml(md) {
    const key = md || "";
    const cached = htmlCache.get(key);
    if (cached !== void 0)
      return cached;
    const html = marked.parse(key, { smartypants: true });
    htmlCache.set(key, html);
    return html;
  }
  let container = null;
  let footnoteAside = null;
  let footnoteList = null;
  let shellEl = null;
  function setupVideos(root) {
    const videos = Array.from(root.querySelectorAll("video.autoplay-on-fullview"));
    const fresh = videos.filter((v) => !v.dataset._wired);
    if (fresh.length === 0)
      return;
    for (const v of fresh) {
      v.controls = false;
      v.dataset._wired = "1";
      let is_touch = false;
      const onFirstTouch = () => {
        is_touch = true;
        window.removeEventListener("touchstart", onFirstTouch);
      };
      window.addEventListener("touchstart", onFirstTouch, { passive: true, once: true });
      const show = () => {
        if (!is_touch)
          v.controls = true;
      };
      const hide = () => {
        if (!is_touch)
          v.controls = false;
      };
      v.addEventListener("mouseenter", show);
      v.addEventListener("mouseleave", hide);
      v.addEventListener("focus", show);
      v.addEventListener("blur", hide);
      let restart_timer = null;
      const clearTimer = () => {
        if (restart_timer !== null) {
          window.clearTimeout(restart_timer);
          restart_timer = null;
        }
      };
      const onEnded = () => {
        const freeze_ms = parseInt(v.dataset.freezeMs || "10000", 10);
        clearTimer();
        restart_timer = window.setTimeout(
          () => {
            try {
              v.currentTime = 0;
            } catch (_a) {
            }
            const p = v.play();
            if (p && typeof p.catch === "function")
              p.catch(() => {
              });
          },
          freeze_ms
        );
      };
      ["play", "pause", "seeking", "emptied", "abort"].map((evt) => v.addEventListener(evt, clearTimer));
      v.addEventListener("ended", onEnded);
      v._cleanupVideo = () => {
        v.removeEventListener("mouseenter", show);
        v.removeEventListener("mouseleave", hide);
        v.removeEventListener("focus", show);
        v.removeEventListener("blur", hide);
        v.removeEventListener("ended", onEnded);
        clearTimer();
      };
    }
    if (!setupVideos._io) {
      const io2 = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const v = entry.target;
            const clear = v._clearRestartTimer;
            if (clear)
              clear();
            if (entry.intersectionRatio >= 1) {
              const p = v.play();
              if (p && typeof p.catch === "function")
                p.catch(() => {
                });
            } else {
              v.pause();
            }
          }
        },
        { threshold: 1 }
      );
      setupVideos._io = io2;
    }
    const io = setupVideos._io;
    fresh.forEach((v) => io.observe(v));
  }
  onDestroy(() => {
    if (!setupVideos._io)
      return;
    return;
  });
  if ($$props.source === void 0 && $$bindings.source && source !== void 0)
    $$bindings.source(source);
  $$result.css.add(css$1);
  {
    {
      const { main, notes } = extractFootnotes(source || "");
      const { idToNum, numbered } = computeFootnoteNumbering(main, notes);
      processedSource = replaceFootnoteRefs(main, idToNum);
      footnotes = numbered;
      htmlCache.clear();
    }
  }
  chunks = (() => {
    var _a, _b, _c, _d, _e;
    const out = [];
    let pos = 0;
    const slugger = createSlugger();
    const doc = processedSource || "";
    while (pos < doc.length) {
      JUMP_RE.lastIndex = pos;
      TAKE_BEGIN_RE.lastIndex = pos;
      SMALL_BEGIN_RE.lastIndex = pos;
      CALLOUT_BEGIN_RE.lastIndex = pos;
      FOLD_BEGIN_RE.lastIndex = pos;
      H2_RE.lastIndex = pos;
      H3_RE.lastIndex = pos;
      const j = JUMP_RE.exec(doc);
      const t = TAKE_BEGIN_RE.exec(doc);
      const s = SMALL_BEGIN_RE.exec(doc);
      const c = CALLOUT_BEGIN_RE.exec(doc);
      const f = FOLD_BEGIN_RE.exec(doc);
      const h2 = H2_RE.exec(doc);
      const h3 = H3_RE.exec(doc);
      if (!j && !t && !s && !c && !f && !h2 && !h3) {
        if (pos < doc.length)
          out.push({ type: "text", content: doc.slice(pos) });
        break;
      }
      const j_idx = j ? j.index : Infinity;
      const t_idx = t ? t.index : Infinity;
      const s_idx = s ? s.index : Infinity;
      const c_idx = c ? c.index : Infinity;
      const f_idx = f ? f.index : Infinity;
      const h2_idx = h2 ? h2.index : Infinity;
      const h3_idx = h3 ? h3.index : Infinity;
      const min_idx = Math.min(j_idx, t_idx, s_idx, c_idx, f_idx, h2_idx, h3_idx);
      if (h2_idx === min_idx) {
        const begin_idx = h2.index;
        const begin_end = begin_idx + h2[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        const text2 = ((_a = h2[1]) !== null && _a !== void 0 ? _a : "").trim();
        const id = slugger.slug(text2);
        out.push({ type: "h2", id, text: text2 });
        pos = begin_end;
      } else if (h3_idx === min_idx) {
        const begin_idx = h3.index;
        const begin_end = begin_idx + h3[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        const text2 = ((_b = h3[1]) !== null && _b !== void 0 ? _b : "").trim();
        const id = slugger.slug(text2);
        out.push({ type: "h3", id, text: text2 });
        pos = begin_end;
      } else if (j_idx === min_idx) {
        if (j_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, j_idx)
          });
        const id = j[1];
        out.push({ type: "jumpbox", id });
        pos = JUMP_RE.lastIndex;
      } else if (t_idx === min_idx) {
        const begin_idx = t.index;
        const begin_end = begin_idx + t[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        TAKE_END_RE.lastIndex = begin_end;
        const tend = TAKE_END_RE.exec(doc);
        if (!tend) {
          out.push({
            type: "text",
            content: doc.slice(begin_idx, begin_end)
          });
          pos = begin_end;
          continue;
        }
        const inner_md = doc.slice(begin_end, tend.index).trim();
        out.push({
          type: "callout",
          variant: "takeaway",
          title: "",
          content: inner_md
        });
        pos = TAKE_END_RE.lastIndex;
      } else if (s_idx === min_idx) {
        const begin_idx = s.index;
        const begin_end = begin_idx + s[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        SMALL_END_RE.lastIndex = begin_end;
        const send = SMALL_END_RE.exec(doc);
        if (!send) {
          out.push({
            type: "text",
            content: doc.slice(begin_idx, begin_end)
          });
          pos = begin_end;
          continue;
        }
        const inner_md = doc.slice(begin_end, send.index).trim();
        out.push({ type: "small", content: inner_md });
        pos = SMALL_END_RE.lastIndex;
      } else if (c_idx === min_idx) {
        const begin_idx = c.index;
        const begin_end = begin_idx + c[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        CALLOUT_END_RE.lastIndex = begin_end;
        const cend = CALLOUT_END_RE.exec(doc);
        if (!cend) {
          out.push({
            type: "text",
            content: doc.slice(begin_idx, begin_end)
          });
          pos = begin_end;
          continue;
        }
        const variantRaw = ((_c = c[1]) !== null && _c !== void 0 ? _c : "note").toLowerCase();
        const variant = ["note", "tip", "warning", "info", "takeaway"].includes(variantRaw) ? variantRaw : "note";
        const title2 = (_d = c[2]) !== null && _d !== void 0 ? _d : "";
        const inner_md = doc.slice(begin_end, cend.index).trim();
        out.push({
          type: "callout",
          variant,
          title: title2,
          content: inner_md
        });
        pos = CALLOUT_END_RE.lastIndex;
      } else {
        const begin_idx = f.index;
        const begin_end = begin_idx + f[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        FOLD_END_RE.lastIndex = begin_end;
        const fend = FOLD_END_RE.exec(doc);
        if (!fend) {
          out.push({
            type: "text",
            content: doc.slice(begin_idx, begin_end)
          });
          pos = begin_end;
          continue;
        }
        const title2 = (_e = f[1]) !== null && _e !== void 0 ? _e : "Details";
        const open = !!f[2];
        const inner_md = doc.slice(begin_end, fend.index).trim();
        out.push({
          type: "fold",
          title: title2,
          open,
          content: inner_md
        });
        pos = FOLD_END_RE.lastIndex;
      }
    }
    return out;
  })();
  sections = (() => {
    const out = [];
    let current = null;
    for (const ch of chunks) {
      if (ch.type === "h2") {
        if (current)
          out.push(Object.assign({ type: "section" }, current));
        const inline = marked.parseInline(ch.text, { smartypants: true });
        const h2Html = `<h2 id="${ch.id}">${inline}</h2>`;
        current = {
          heading: { id: ch.id, text: ch.text, html: h2Html },
          children: []
        };
        continue;
      }
      const renderable = ch;
      if (current)
        current.children.push(renderable);
      else
        out.push({ type: "chunk", chunk: renderable });
    }
    if (current)
      out.push(Object.assign({ type: "section" }, current));
    return out;
  })();
  return `<div class="md-shell svelte-1cybysc"${add_attribute("this", shellEl, 0)}><div class="md-grid svelte-1cybysc"><div class="md-output space-y-6 svelte-1cybysc"${add_attribute("this", container, 0)}>${each(sections, (item, i) => {
    return `${item.type === "chunk" ? `${item.chunk.type === "text" ? `<div class="md-output svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(item.chunk.content)}<!-- HTML_TAG_END --></div>` : `${item.chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: item.chunk.id }, {}, {})}` : `${item.chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(item.chunk.content)}<!-- HTML_TAG_END --></div>` : `${item.chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
      $$result,
      {
        variant: item.chunk.variant,
        title: item.chunk.title,
        html: toHtml(item.chunk.content)
      },
      {},
      {}
    )}` : `${item.chunk.type === "fold" ? `${validate_component(FoldBox, "FoldBox").$$render(
      $$result,
      {
        title: item.chunk.title,
        open: item.chunk.open,
        html: toHtml(item.chunk.content)
      },
      {},
      {}
    )}` : ``}`}`}`}`}` : `${item.type === "section" ? `<details class="foldbox foldbox--h2 svelte-1cybysc" data-h2fold="1" open><summary class="foldbox__summary foldbox__summary--h2"><span class="foldbox__caret" aria-hidden="true"></span> <span class="foldbox__h2 md-output svelte-1cybysc"><!-- HTML_TAG_START -->${item.heading.html}<!-- HTML_TAG_END --> </span></summary> <div class="foldbox__body foldbox__body--h2 svelte-1cybysc">${each(buildH3Sections(item.children), (sub, j) => {
      return `${sub.type === "chunk" ? `${sub.chunk.type === "callout" && isPinnedTakeaway(sub.chunk) ? `<div class="foldbox__pin svelte-1cybysc">${validate_component(CalloutBox, "CalloutBox").$$render(
        $$result,
        {
          variant: sub.chunk.variant,
          title: sub.chunk.title,
          html: toHtml(sub.chunk.content)
        },
        {},
        {}
      )} </div>` : `${sub.chunk.type === "text" ? `<div class="md-output svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(sub.chunk.content)}<!-- HTML_TAG_END --></div>` : `${sub.chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: sub.chunk.id }, {}, {})}` : `${sub.chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(sub.chunk.content)}<!-- HTML_TAG_END --></div>` : `${sub.chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
        $$result,
        {
          variant: sub.chunk.variant,
          title: sub.chunk.title,
          html: toHtml(sub.chunk.content)
        },
        {},
        {}
      )}` : `${sub.chunk.type === "fold" ? `${validate_component(FoldBox, "FoldBox").$$render(
        $$result,
        {
          title: sub.chunk.title,
          open: sub.chunk.open,
          html: toHtml(sub.chunk.content)
        },
        {},
        {}
      )}` : ``}`}`}`}`}`}` : `${sub.type === "subsection" ? `<details class="foldbox foldbox--h3 svelte-1cybysc" data-h3fold="1" ${shouldOpenH3(sub) ? "open" : ""}><summary class="foldbox__summary foldbox__summary--h3"><span class="foldbox__caret" aria-hidden="true"></span> <span class="foldbox__h3 md-output svelte-1cybysc"><!-- HTML_TAG_START -->${sub.heading.html}<!-- HTML_TAG_END --> </span></summary> <div class="foldbox__body foldbox__body--h3 svelte-1cybysc">${each(sub.children, (chunk, k) => {
        return `${chunk.type === "callout" && isPinnedTakeaway(chunk) ? `<div class="foldbox__pin svelte-1cybysc">${validate_component(CalloutBox, "CalloutBox").$$render(
          $$result,
          {
            variant: chunk.variant,
            title: chunk.title,
            html: toHtml(chunk.content)
          },
          {},
          {}
        )} </div>` : `${chunk.type === "text" ? `<div class="md-output svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(chunk.content)}<!-- HTML_TAG_END --></div>` : `${chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: chunk.id }, {}, {})}` : `${chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-1cybysc"><!-- HTML_TAG_START -->${toHtml(chunk.content)}<!-- HTML_TAG_END --></div>` : `${chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
          $$result,
          {
            variant: chunk.variant,
            title: chunk.title,
            html: toHtml(chunk.content)
          },
          {},
          {}
        )}` : `${chunk.type === "fold" ? `${validate_component(FoldBox, "FoldBox").$$render(
          $$result,
          {
            title: chunk.title,
            open: chunk.open,
            html: toHtml(chunk.content)
          },
          {},
          {}
        )}` : ``}`}`}`}`}`}`;
      })}</div> </details>` : ``}`}`;
    })}</div> </details>` : ``}`}`;
  })}</div> ${footnotes.length ? `<aside class="md-footnotes svelte-1cybysc" aria-label="Footnotes"${add_attribute("this", footnoteAside, 0)}><ol class="svelte-1cybysc"${add_attribute("this", footnoteList, 0)}>${each(footnotes, (fn) => {
    return `<li${add_attribute("id", `fn-${fn.safeId}`, 0)}${add_attribute("title", fn.id, 0)} class="svelte-1cybysc"><span class="fn-label svelte-1cybysc">${escape(fn.num)}</span> <span class="fn-text svelte-1cybysc"><!-- HTML_TAG_START -->${fn.html}<!-- HTML_TAG_END --></span> </li>`;
  })}</ol></aside>` : ``}</div> </div>`;
});
const css = {
  code: ":root{--toc-max-width:280px;--toc-left:28px;--toc-max-width-cap:220px}.toc.svelte-wsnayn{position:fixed;left:var(--toc-left, 28px);top:24px;bottom:24px;transform:none;width:var(--toc-max-width, 280px);height:auto;max-height:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;padding-right:0;z-index:50;opacity:0;transition:opacity 400ms ease;text-align:left}.toc.ready.svelte-wsnayn{opacity:1}.toc.hidden.svelte-wsnayn{display:none}.toc-item.hidden.svelte-wsnayn{visibility:hidden;pointer-events:none}.toc-item.svelte-wsnayn{display:block;width:100%;text-align:left;overflow-wrap:anywhere;word-break:break-word;color:#6b7280;font-size:13px;line-height:1.6;text-decoration:none;margin:6px 0}.toc-item.svelte-wsnayn:hover{color:#111827}.toc-item.active.svelte-wsnayn{color:#111827;font-weight:600}.toc-item.sub.svelte-wsnayn{padding-left:14px;color:#9ca3af;font-size:13px}",
  map: null
};
const ScrollMeter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { containerSelector = ".md-output" } = $$props;
  let { headingsSelector = "h2, h3" } = $$props;
  let { tocMaxWidthCap = 320 } = $$props;
  let meterEl = null;
  onDestroy(() => {
  });
  if ($$props.containerSelector === void 0 && $$bindings.containerSelector && containerSelector !== void 0)
    $$bindings.containerSelector(containerSelector);
  if ($$props.headingsSelector === void 0 && $$bindings.headingsSelector && headingsSelector !== void 0)
    $$bindings.headingsSelector(headingsSelector);
  if ($$props.tocMaxWidthCap === void 0 && $$bindings.tocMaxWidthCap && tocMaxWidthCap !== void 0)
    $$bindings.tocMaxWidthCap(tocMaxWidthCap);
  $$result.css.add(css);
  return ` <nav class="${["toc svelte-wsnayn", " "].join(" ").trim()}" aria-hidden="true"${add_attribute("this", meterEl, 0)}>${``} </nav>`;
});
const text = '<!-- ---\ntitle: "RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?"\nsubtitle: "When can a language model start learning from its *own* generations?"\nauthors:\n  - "Anonymous authors"\ndate: "2026-02-11"\ntags: [llm-training, reinforcement-learning, reasoning, grpo, rlvr, pretraining]\n--- -->\n\n<!--\nThis post is a blog-style adaptation of the paper:\n"RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?"\nReplace placeholder figure links in `assets/` with real images exported from the paper.\n-->\n\n# RL excursions during pre-training: how early is *too* early for on-policy learning?\n\n<figure>\n  <img src="../assets/figures/figure_1.png" alt="Overview figure placeholder showing early RL works, expansion vs sharpening, and rollout budget tradeoffs." width="100%"/>\n  <figcaption><strong>Figure 1 (placeholder).</strong> A one-picture summary: RL works surprisingly early; RL can <em>expand</em> or <em>sharpen</em> the output distribution depending on the pipeline; rollout count trades off sample-efficiency vs FLOP-efficiency.</figcaption>\n</figure>\n\nModern LLM training usually looks like this:\n\n> **Pretrain (next-token prediction)** → **SFT (next-token prediction)** → **RL (on-policy)**\n\nThis separation raises a simple question that we don’t often test directly:\n\n**When does a model become capable of learning from its own generations?**\n\nIn this post we run a controlled case study on math reasoning, where rewards are unambiguous, and ask:\n\n> **How and when should an RL objective be used in LLM training?**\n\n---\n\n## TL;DR\n\n- **RL can work *much earlier* than standard practice.** On GSM8K-style math, running RL directly on intermediate pretraining checkpoints boosts accuracy even when the model is still “under-trained” by standard scaling-law heuristics.\n- **RL-only can match the “gold standard” SFT→RL pipeline (sometimes).** On GSM8K, direct RL on the base checkpoint reaches performance comparable to SFT→RL once the model has seen enough pretraining tokens.\n- **RL doesn’t always just “sharpen.”** In our setting, RL directly on the base model tends to improve both pass@1 *and* pass@k (distribution **expansion**), while RL after SFT often improves pass@1 but hurts pass@k (distribution **sharpening**).\n- **More rollouts aren’t always better.** Increasing GRPO rollouts per prompt improves *sample efficiency* but can be *worse per FLOP*, especially when rewards are sparse.\n\nIf you only remember one thing: **“Post-training” might not need to wait until *after* pretraining.**\n\n---\n\n## Table of contents\n\n- [The puzzle: off-policy vs on-policy training](#the-puzzle-off-policy-vs-on-policy-training)\n- [Experimental setup in one page](#experimental-setup-in-one-page)\n- [Result 1: RL is effective early in pretraining](#result-1-rl-is-effective-early-in-pretraining)\n- [Result 2: RL can expand or sharpen the output distribution](#result-2-rl-can-expand-or-sharpen-the-output-distribution)\n- [Result 3: rollout budgets under sparse rewards](#result-3-rollout-budgets-under-sparse-rewards)\n- [Practical takeaways](#practical-takeaways)\n- [Limitations and open questions](#limitations-and-open-questions)\n- [Citation](#citation)\n- [Appendix: additional training curves and ablations](#appendix-additional-training-curves-and-ablations)\n\n---\n\n## The puzzle: off-policy vs on-policy training\n\nPretraining and supervised fine-tuning (SFT) optimize the **next-token prediction** objective. Conceptually, that’s an *off-policy* regime: the model is trained to imitate a fixed dataset.\n\nReinforcement learning (RL), in contrast, is **on-policy**: the model samples outputs from itself, gets feedback, and updates to increase reward.\n\nSo the transition from SFT to RL is a big change:\n\n- from *imitation* → to *self-generated data*\n- from *dense token-level supervision* → to *sparse outcome-level supervision* (at least in the RLVR setting we study)\n\nThat makes the following question natural:\n\n> **At what point during pretraining does the model’s self-generated data become good enough that on-policy learning helps rather than hurts?**\n\nMath is a clean testbed because the reward can be **verifiable** (did the final answer match?).\n\n---\n\n## Experimental setup in one page\n\n### What we trained\n\nWe pretrain a **1B-parameter** decoder-only model (OLMo2 architecture) from scratch on **50B tokens** of a high-quality mixture (DOLMino, from OLMo2), saving intermediate checkpoints throughout. We then take checkpoints and run different “post-training” pipelines *from each checkpoint*.\n\n<details>\n<summary><strong>Pretraining details (click to expand)</strong></summary>\n\n- **Architecture:** OLMo2 1B\n- **Tokens:** 50B total (≈ 2.5× Chinchilla-optimal token count for this model size)\n- **Optimizer:** AdamW with cosine LR decay, peak LR 4e-4\n- **Seq length:** 4096\n- **Batch size:** 512\n- **Data mixture (DOLMino high-quality):** includes Wikipedia, high-quality web, ~20% math, plus code/reasoning sources\n\n</details>\n\n### Three training pipelines\n\nLet **M<sub>t</sub>** be the base checkpoint after *t* pretraining steps/tokens.\n\nWe compare:\n\n1. **RL only:**  \n   **M<sub>t</sub> → M<sub>t</sub><sup>RL</sup>**  \n   Run RL directly on the base checkpoint.\n\n2. **SFT only:**  \n   **M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup>**  \n   Train on ground-truth solutions (teacher-written reasoning traces).\n\n3. **Gold-standard pipeline:**  \n   **M<sub>t</sub> → M<sub>t</sub><sup>SFT</sup> → M<sub>t</sub><sup>SFT→RL</sup>**  \n   SFT then RL, which is the typical modern recipe.\n\nHere’s a diagram you can paste into any Mermaid-enabled renderer:\n\n```mermaid\nflowchart LR\n  Mt["M_t (pretraining checkpoint)"] -->|RLVR (GRPO)| MRL["M_t^RL (RL-only)"]\n  Mt -->|SFT on solutions| MSFT["M_t^SFT (SFT-only)"]\n  MSFT -->|RLVR (GRPO)| MSFTRL["M_t^(SFT→RL) (standard pipeline)"]\n```\n\n### RL objective: RLVR with GRPO\n\nWe use **Reinforcement Learning from Verifiable Rewards (RLVR)** with **GRPO**: the model generates solutions and receives a reward based on whether the final answer is correct (plus a formatting reward so models learn to follow the expected answer format).\n\n### Data and evaluation\n\n- **Training data:** OpenMathInstruct (math questions with multiple ground-truth solutions)\n  - We use either (a) a GSM8K-like subset or (b) the full MATH-heavy mix.\n- **Benchmarks:** GSM8K and MATH\n- **Metric:** pass@k for k ∈ {1, 8, 32} at temperature T = 0.6  \n  (probability that at least one of k samples is correct)\n\n<details>\n<summary><strong>Why pass@k? (and how to read it)</strong></summary>\n\n- **pass@1** ≈ “How often the model’s first answer is correct.”\n- **pass@32** ≈ “If you sample 32 times and take the best, how often do you get at least one correct answer?”\n\npass@k is a nice lens because it separates:\n- improvements due to better *typical* behavior (pass@1), and\n- improvements due to better *coverage* / diversity of correct reasoning paths (larger k).\n\n</details>\n\n### A small evaluation gotcha (important!)\n\nEarly pretraining checkpoints don’t reliably follow instruction formatting. To evaluate base checkpoints fairly:\n\n- **Base checkpoints M<sub>t</sub>** are evaluated with **8-shot** prompting (few-shot examples teach the format).\n- **All trained models (SFT/RL variants)** are evaluated **0-shot**, because they learn the format during training.\n\n---\n\n## Result 1: RL is effective early in pretraining\n\nLet’s start with the simplest question:\n\n> **If you take an early checkpoint and run RL, does anything good happen?**\n\n### GSM8K: yes — and surprisingly early\n\nOn GSM8K-style training, RL on early checkpoints produces large gains.\n\n<figure>\n  <img src="../assets/figures/gsm_passatk_comparison.png" alt="Placeholder for GSM8K pass@1, pass@8, pass@32 vs pretraining tokens for base, RL-only, SFT-only, and SFT→RL." width="100%"/>\n  <figcaption><strong>Figure 2 (placeholder).</strong> GSM8K results across checkpoints. RL-only improves early and can match SFT→RL after enough pretraining.</figcaption>\n</figure>\n\nOne striking data point: **at ~4B pretraining tokens**, RL raises GSM8K **pass@1** from about **2% → 18%**.\n\nEven more interesting: once the checkpoint is later (≈10B+ tokens), **RL-only is competitive with the standard SFT→RL pipeline**.\n\n### Why that’s surprising\n\nRL-only never trains on ground-truth reasoning traces. It only sees:\n- its *own* generated solutions, and\n- a reward for correctness (plus format).\n\nYet it can match a pipeline that explicitly trains on solutions.\n\nA practical implication is that **ground-truth solution traces may not be strictly necessary** to unlock certain reasoning behaviors, as long as you can supply a *verifiable* reward.\n\n### MATH: RL helps, but hits a ceiling\n\nNow for the harder benchmark.\n\n<figure>\n  <img src="../assets/figures/math_passatk_comparison.png" alt="Placeholder for MATH pass@k results vs pretraining tokens. RL-only improves but lags SFT and SFT→RL." width="100%"/>\n  <figcaption><strong>Figure 3 (placeholder).</strong> MATH results. RL-only improves over the base checkpoint but doesn’t catch up to SFT or SFT→RL on this harder distribution.</figcaption>\n</figure>\n\nOn MATH-heavy training, RL still improves over the base model — but **does not reach** the performance of SFT or SFT→RL at later checkpoints.\n\nOne interpretation: **on-policy learning from self-generated traces has limits when the task is too hard**, because early samples contain too few correct trajectories to learn from.\n\nThat observation motivates the next two sections: what RL is doing to the output distribution, and how rollout budgets affect sparse-reward learning.\n\n---\n\n## Result 2: RL can expand or sharpen the output distribution\n\nA recurring claim in recent RLVR work is:\n\n> RL mostly **sharpens** — it improves pass@1, but doesn’t increase pass@k for large k.\n\nWe test this claim and find: **it depends.**\n\n### Two behaviors\n\nWe’ll use these terms:\n\n- **Sharpening:** pass@1 improves, pass@k (large k) doesn’t improve (or even decreases).  \n  *Intuition:* the model concentrates probability mass on a smaller set of solutions.\n\n- **Expansion:** pass@1 and pass@k both improve.  \n  *Intuition:* the model discovers more correct “modes” — new successful reasoning paths.\n\n### Standard pipeline (SFT→RL) tends to sharpen\n\nWhen RL comes *after* SFT, we often see:\n\n- pass@1 goes up,\n- pass@32 goes down a bit.\n\n<figure>\n  <img src="../assets/figures/gsm8k_rl_train_dynamics_comparison.png" alt="Placeholder: training dynamics showing sharpening in SFT→RL and expansion in RL-only." width="100%"/>\n  <figcaption><strong>Figure 4 (placeholder).</strong> Training dynamics. Left: SFT→RL shows sharpening (pass@1 up, pass@32 down during RL). Right: RL-only shows expansion (both pass@1 and pass@32 up).</figcaption>\n</figure>\n\n### RL-only tends to expand (in our setting)\n\nWhen we run RL directly on the base checkpoint, we consistently see **pass@32 improve**, suggesting **expansion**.\n\nA plausible explanation:\n\n- After SFT, the model has already been shown ground-truth solutions for the same training questions.\n- RL then mainly “locks in” the highest-reward paths it already knows, reducing exploration/diversity (sharpening).\n- Without SFT, RL must explore more to find reward at all — and in doing so, it can discover new successful traces (expansion).\n\n### A caution: early RL can be brittle\n\nThis is not all upside. RL-only on *very early* checkpoints is **unstable across random seeds**.\n\n<figure>\n  <img src="../assets/figures/gsm8k_seed_rewards.png" alt="Placeholder: early checkpoint RL seed brittleness—training reward similar, but test pass@k diverges." width="100%"/>\n  <figcaption><strong>Figure 7 (placeholder).</strong> Seed brittleness at early checkpoints: training reward can look similar while test performance diverges sharply.</figcaption>\n</figure>\n\nWhat this suggests is subtle but important:\n\n- **Training reward is not always a reliable proxy** for “real” reasoning improvements when the base model is weak.\n- Early on-policy learning may latch onto superficial patterns that maximize reward on the training distribution without learning robust reasoning.\n\n---\n\n## Result 3: rollout budgets under sparse rewards\n\nEarly checkpoints suffer from a basic problem: **reward sparsity**.\n\nIf the model almost never produces a correct solution, then the RL signal becomes:\n- sparse (few positives),\n- noisy (high-variance gradients),\n- and potentially misleading (format hacks, memorization, etc.).\n\nA natural knob in GRPO is **n = number of rollouts per prompt**.\n\n> If correct solutions are rare, maybe sampling more rollouts per prompt makes learning possible?\n\n### The experiment\n\nWe simulate “early” vs “late” competence by splitting the GSM8K-like training set into:\n\n- **GSM8K-Easy:** prompts where the base model already gets many correct samples (16–64 correct out of 64 rollouts).\n- **GSM8K-Hard:** prompts where the base model gets few correct samples (≤8 correct out of 64 rollouts).\n\nThen we run RL with:\n- **n = 5** rollouts per prompt, vs\n- **n = 64** rollouts per prompt,\n\nand measure GSM8K test pass@k as a function of:\n- **samples seen**, and\n- **FLOPs**.\n\n<figure>\n  <img src="../assets/figures/gsm8k_rollouts_p1-2.png" alt="Placeholder: effect of rollouts on pass@1 and pass@8 vs FLOPs and vs samples." width="100%"/>\n  <figcaption><strong>Figure 5 (placeholder).</strong> Rollout scaling trade-offs. More rollouts improves sample efficiency, but fewer rollouts can be more FLOP-efficient—especially on the hard split.</figcaption>\n</figure>\n\n### What we learned\n\nThree takeaways:\n\n1. **Asymptotic performance is similar.** Both n=5 and n=64 often converge to similar best pass@k.\n2. **n=64 is more sample-efficient.** You learn faster per training example (per prompt).\n3. **n=5 can be more FLOP-efficient.** Especially early in training and on harder splits where reward is sparse, spending compute on *more prompts* (not more rollouts per prompt) wins.\n\nThis lines up with an intuition from exploration: when rewards are rare, it can be better to **see more states** rather than spend many samples on the same state.\n\n---\n\n## Practical takeaways\n\nIf you’re training reasoning models with RLVR today, here’s what this study suggests.\n\n### 1) “RL readiness” comes earlier than you think (for some tasks)\n\nFor GSM8K-like math with verifiable rewards, on-policy learning starts paying off *very early* in pretraining. You don’t necessarily need to wait for a fully-finished base model.\n\n### 2) Track pass@k, not just pass@1\n\nIf you only look at pass@1, you can miss whether RL is:\n\n- **sharpening** (maybe good for deterministic deployment), or\n- **expanding** (good for best-of-k / tool-assisted settings).\n\n### 3) Expect brittleness on weak checkpoints\n\nIf you try RL very early:\n- run multiple seeds,\n- use validation metrics that correlate with generalization,\n- and watch for “reward without reasoning” failure modes.\n\n### 4) Don’t blindly scale rollouts per prompt\n\nIf your budget is fixed, **n is a trade-off**:\n\n- increase n when you need *sample efficiency* (limited dataset, limited prompts),\n- decrease n when you care about *FLOP efficiency* (limited compute) or want broader coverage across prompts.\n\n---\n\n## Limitations and open questions\n\nThis study is intentionally narrow: it’s a controlled probe of *when* RL can help, not a full replacement recipe for pretraining.\n\nSome important limitations:\n\n- **Task scope:** math reasoning with verifiable rewards is unusually clean.\n- **Data mixture:** our base model is pretrained on a corpus that includes a substantial fraction of math/reasoning content; “RL readiness” may shift with pretraining mix.\n- **Model scale:** results are from a 1B model; larger models may show different transitions.\n- **Algorithm scope:** we used RLVR with GRPO; other RL algorithms or denser rewards (e.g., process reward) could change the picture.\n\nOpen directions we’re excited about:\n\n- **Mixing RL into pretraining:** can we interleave RL and next-token prediction in a stable way?\n- **Curricula for early RL:** can we schedule task difficulty (or reward shaping) so early checkpoints don’t get stuck?\n- **Understanding expansion vs sharpening:** when does RL discover new modes vs collapse onto existing ones?\n- **Generalization beyond math:** what are the right “verifiable rewards” in other domains?\n\n---\n\n\n\n---\n\n## Appendix: additional training curves and ablations\n\nThese plots are useful for readers who want to sanity-check training stability and evaluation choices.\n\n<details>\n<summary><strong>RL training convergence across checkpoints (Figure 6)</strong></summary>\n\n<figure>\n  <img src="../assets/figures/gsm8k_rl_sft_comparison.png" alt="Placeholder: RL train/val reward and GSM8K pass@1 over RL steps for multiple pretraining checkpoints." width="100%"/>\n  <figcaption><strong>Figure 6 (placeholder).</strong> RL reward curves (train/val) and GSM8K pass@1 over RL steps show convergence across checkpoints.</figcaption>\n</figure>\n\n</details>\n\n<details>\n<summary><strong>SFT convergence (Figure 8)</strong></summary>\n\n<figure>\n  <img src="../assets/figures/appx_fixB_easy.png" alt="Placeholder: SFT epoch comparison (5 vs 10 epochs) showing convergence across checkpoints on GSM8K pass@k." width="100%"/>\n  <figcaption><strong>Figure 8 (placeholder).</strong> SFT epoch ablation indicates performance converges by ~5 epochs.</figcaption>\n</figure>\n\n</details>\n\n<details>\n<summary><strong>How we evaluate base checkpoints (Figure 9)</strong></summary>\n\n<figure>\n  <img src="../assets/figures/gsm8k_base_eval_shots.png" alt="Placeholder: n-shot prompting ablation (0/1/8-shot) for evaluating base checkpoints on GSM8K and MATH pass@k." width="100%"/>\n  <figcaption><strong>Figure 9 (placeholder).</strong> Few-shot prompting ablation for base checkpoints: 8-shot yields the strongest evaluation performance.</figcaption>\n</figure>\n\n</details>\n\n## Citation\n\nIf you build on this work, please cite the accompanying paper:\n\n```bibtex\n@article{anonymous2026rlexcursions,\n  title   = {RL Excursions During Pre-Training: How Early Is Too Early for On-Policy Learning?},\n  author  = {Anonymous Authors},\n  journal = {Under review},\n  year    = {2026}\n}\n```\n\n---\n\n*If you want to adapt this markdown for a project page (like a GitHub Pages site), you can:*\n- export your plots from the paper into `assets/`,\n- replace the placeholders,\n- and optionally add interactive plot embeds (Plotly/Observable) for Figures 2–5.\n';
export {
  Markdown as M,
  Seo as S,
  ScrollMeter as a,
  text as t
};
