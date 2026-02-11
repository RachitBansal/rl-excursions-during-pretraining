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
  link(href, title2, text) {
    const isInternal = /^(\/|#|[A-Za-z0-9\-_]+(\.html?)?$)/.test(href);
    let out = `<a href="${encodeURI(href)}" class="link"`;
    if (!isInternal)
      out += ` target="_blank" rel="external noopener noreferrer"`;
    if (title2)
      out += ` title="${title2}"`;
    out += `>${text}</a>`;
    return out;
  },
  heading(text, level, raw, slugger) {
    const id = slugger ? slugger.slug(raw) : slugify(raw || text);
    return `<h${level} id="${id}">${text}</h${level}>`;
  },
  blockquote(quote) {
    return `<blockquote class="inline-block bg-neutral-50 border-l-4 border-neutral-600 rounded px-3 py-2 align-middle my-2">${quote}</blockquote>`;
  },
  image(href, title2, text) {
    if (!href || href === "__IMAGE_PLACEHOLDER__" || href.trim() === "") {
      if (text) {
        return `<div class="text-left text-gray-400 italic text-sm my-4">[Image: ${text}]</div>`;
      }
      return "<!-- image placeholder -->";
    }
    const id = text ? `fig-${slugify(text)}` : "";
    let out = `<img src="${href}" alt="${text || ""}" ${id ? `id="${id}" ` : ""}class="block mx-auto unselectable" />`;
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
  const text = (sub.heading.text || "").trim().toLowerCase();
  return /^question\s*\d+/.test(text);
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
        const text = ((_a = h2[1]) !== null && _a !== void 0 ? _a : "").trim();
        const id = slugger.slug(text);
        out.push({ type: "h2", id, text });
        pos = begin_end;
      } else if (h3_idx === min_idx) {
        const begin_idx = h3.index;
        const begin_end = begin_idx + h3[0].length;
        if (begin_idx > pos)
          out.push({
            type: "text",
            content: doc.slice(pos, begin_idx)
          });
        const text = ((_b = h3[1]) !== null && _b !== void 0 ? _b : "").trim();
        const id = slugger.slug(text);
        out.push({ type: "h3", id, text });
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
export {
  Markdown as M,
  Seo as S,
  ScrollMeter as a
};
