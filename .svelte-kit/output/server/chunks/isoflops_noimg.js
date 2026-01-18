import { c as create_ssr_component, i as escape, k as add_attribute, o as onDestroy, h as each, v as validate_component } from "./ssr.js";
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
      wrap: "bg-slate-50 hover:bg-sky-50/50 border-sky-700",
      badge: "text-sky-700",
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
  code: ".foldbox{margin-top:0.5rem;margin-bottom:0.5rem}.foldbox--boxed{border-radius:0.25rem;border-width:1px;--tw-border-opacity:1;border-color:rgb(229 229 229 / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;font-weight:600;--tw-text-opacity:1;color:rgb(23 23 23 / var(--tw-text-opacity));display:flex;align-items:center;gap:0.75rem}.foldbox--boxed > .foldbox__summary{padding-left:1rem;padding-right:1rem;padding-top:0.75rem;padding-bottom:0.75rem}.foldbox--boxed > .foldbox__summary:hover{--tw-bg-opacity:1;background-color:rgb(250 250 250 / var(--tw-bg-opacity))}details.foldbox > summary::-webkit-details-marker{display:none}.foldbox__caret{width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:7px solid currentColor;transform:rotate(0deg);transform-origin:2px 6px;transition:transform 120ms ease;opacity:0.9;flex:0 0 auto}details.foldbox[open] .foldbox__caret{transform:rotate(90deg)}.foldbox--boxed > .foldbox__body{padding-left:1rem;padding-right:1rem;padding-bottom:0.75rem;padding-top:0.5rem}",
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
  code: '.md-output h1{margin-top:1.5rem;margin-bottom:1rem;font-size:1.875rem;line-height:2.25rem;font-weight:700}.md-output h2{margin-top:1.25rem;margin-bottom:0.75rem;font-size:1.5rem;line-height:2rem;font-weight:600}.md-output h3{margin-top:1rem;margin-bottom:0.5rem;font-size:1.3rem;line-height:2rem;font-weight:600}.md-output h4{margin-top:0.75rem;margin-bottom:0.5rem;font-size:1.125rem;line-height:1.75rem;font-weight:600}.md-output p{margin-bottom:1rem}.md-output strong{font-weight:600}.md-output em{font-style:italic}.md-output code{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(245 245 245 / var(--tw-bg-opacity));padding-left:0.25rem;padding-right:0.25rem;font-size:95%}.md-output pre{margin-bottom:1rem;overflow-x:auto;border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(245 245 245 / var(--tw-bg-opacity));padding:1rem}.md-output ul{margin-left:1.25rem;margin-bottom:1rem;list-style-position:outside;list-style-type:disc}.md-output ul>:not([hidden])~.svelte-umi69w.svelte-umi69w:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.25rem * var(--tw-space-y-reverse))}.md-output ul{padding-left:1.25rem}.md-output ol{margin-left:1.25rem;margin-bottom:1rem;list-style-position:outside;list-style-type:decimal}.md-output ol>:not([hidden])~.svelte-umi69w.svelte-umi69w:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(0.25rem * var(--tw-space-y-reverse))}.md-output ol{padding-left:1.25rem}.md-output li{margin-bottom:0.25rem}.math-block{margin-top:1rem;margin-bottom:1rem;text-align:center}.math-inline{vertical-align:baseline}.katex-error{border-radius:0.25rem;--tw-bg-opacity:1;background-color:rgb(254 226 226 / var(--tw-bg-opacity));padding:0.25rem;--tw-text-opacity:1;color:rgb(220 38 38 / var(--tw-text-opacity))}.md-output blockquote{margin-top:0.5rem;margin-bottom:0.5rem;display:inline-block;border-radius:0.25rem;border-left-width:4px;--tw-border-opacity:1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:rgb(250 250 250 / var(--tw-bg-opacity));padding-left:0.75rem;padding-right:0.75rem;padding-top:0.5rem;padding-bottom:0.5rem;vertical-align:middle}.md-output blockquote > :first-child{margin-top:0px}.md-output blockquote > :last-child{margin-bottom:0px}details.foldbox.foldbox--h2{margin-top:1rem;margin-bottom:1rem}details.foldbox.foldbox--h2 > .foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0px;padding-right:0px;padding-top:0.25rem;padding-bottom:0.25rem}details.foldbox.foldbox--h2 > .foldbox__body{padding-left:1.5rem;padding-top:0.5rem}details.foldbox.foldbox--h2 .foldbox__h2 > h2{margin:0}details.foldbox.foldbox--h2 .foldbox__h2{pointer-events:auto}details.foldbox.foldbox--h2 .foldbox__h2 h2,details.foldbox.foldbox--h2 .foldbox__h2 h2 *{pointer-events:none}details.foldbox > summary::-webkit-details-marker{display:none}.foldbox__caret{width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:7px solid currentColor;transform:rotate(0deg);transform-origin:2px 6px;transition:transform 120ms ease;opacity:0.9;flex:0 0 auto}details.foldbox[open] .foldbox__caret{transform:rotate(90deg)}details.foldbox.foldbox--h3{margin-top:0.5rem;margin-bottom:0.5rem}details.foldbox.foldbox--h3 > .foldbox__summary{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding-left:0px;padding-right:0px;padding-top:0.25rem;padding-bottom:0.25rem;padding-left:1rem;font-size:1rem;line-height:1.4rem;font-weight:600;--tw-text-opacity:1;color:rgb(38 38 38 / var(--tw-text-opacity));display:flex;align-items:center;gap:0.5rem}details.foldbox.foldbox--h3 > .foldbox__body{padding-left:2rem;padding-top:0.5rem}details.foldbox.foldbox--h3 .foldbox__h3 > h3{margin:0}details.foldbox.foldbox--h3 .foldbox__h3 h3,details.foldbox.foldbox--h3 .foldbox__h3 h3 *{pointer-events:none}details.foldbox.foldbox--h3 > summary .foldbox__caret{transform:rotate(0deg)}details.foldbox.foldbox--h3[open] > summary .foldbox__caret{transform:rotate(90deg) !important}.sm-block h1{margin-top:1.5rem;margin-bottom:1rem;font-size:1.5rem;line-height:2rem;font-weight:700}.sm-block h2{margin-top:1.25rem;margin-bottom:0.75rem;font-size:1.3rem;line-height:2rem;font-weight:600}.sm-block h3{margin-top:1rem;margin-bottom:0.5rem;font-size:1.125rem;line-height:1.75rem;font-weight:600}.sm-block h4{margin-top:0.75rem;margin-bottom:0.5rem;font-size:1rem;line-height:1.5rem;font-weight:600}.sm-block code{font-size:90%}.md-shell.svelte-umi69w.svelte-umi69w{position:relative}.md-shell.svelte-umi69w:not([data-fn-aligned="1"]) .md-footnotes.svelte-umi69w{opacity:0}.md-grid.svelte-umi69w.svelte-umi69w{display:grid;grid-template-columns:minmax(0, 1fr) minmax(0, 850px) minmax(0, 1fr);-moz-column-gap:var(--toc-gap, var(--side-gap, 32px));column-gap:var(--toc-gap, var(--side-gap, 32px));align-items:start}.md-output.svelte-umi69w.svelte-umi69w{grid-column:2;min-width:0}.md-footnotes.svelte-umi69w.svelte-umi69w{position:relative;grid-column:3;width:260px;justify-self:start;padding-left:calc(var(--footnote-gap, 48px) - var(--toc-gap, var(--side-gap, 32px)));font-size:14px;line-height:1.6;color:#6b7280}.md-footnotes.svelte-umi69w ol.svelte-umi69w{list-style:none;padding:0;margin:0;position:relative;min-height:100%}.md-footnotes.svelte-umi69w li.svelte-umi69w{display:flex;gap:8px;width:100%;margin-bottom:var(--footnote-item-gap, 28px)}.md-footnotes.svelte-umi69w li.svelte-umi69w:last-child{margin-bottom:0}.md-footnotes.svelte-umi69w .fn-label.svelte-umi69w{font-variant-numeric:tabular-nums;color:#6b7280}.md-footnotes.svelte-umi69w .fn-text.svelte-umi69w p{margin:0}.md-footnotes.svelte-umi69w .fn-text.svelte-umi69w a{text-decoration-line:underline;text-decoration-color:#a3a3a3;text-underline-offset:3px}.footnote-ref{font-size:0.75em;vertical-align:super;margin-left:1px}.footnote-ref a{color:#6b7280;text-decoration:none}.footnote-ref a:hover{color:#111827}@media(max-width: 1024px){.md-grid.svelte-umi69w.svelte-umi69w{grid-template-columns:minmax(0, 1fr);row-gap:16px}.md-output.svelte-umi69w.svelte-umi69w{grid-column:1}.md-footnotes.svelte-umi69w.svelte-umi69w{position:static;grid-column:1;width:auto}}pre[data-copyable]{position:relative}pre[data-copyable] .copy-btn{position:absolute;top:0.25rem;right:0.25rem;background:#f3f4f6;font-size:0.75rem;padding:0.1rem 0.4rem;border-radius:0.25rem;cursor:pointer;opacity:1;transition:opacity 0.2s}pre[data-copyable]:hover .copy-btn{opacity:1}',
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
        return `<div class="text-center text-gray-400 italic text-sm my-4">[Image: ${text2}]</div>`;
      }
      return "<!-- image placeholder -->";
    }
    let out = `<img src="${href}" alt="${text2 || ""}" class="block mx-auto" `;
    if (title2)
      out += `title="${title2}" `;
    out += "/>";
    return out;
  }
};
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
      out += `<video class="block mx-auto autoplay-on-fullview md-video unselectable" aria-label="${token.alt || ""}" id="fig-${slugify(token.alt || "")}"`;
      const hasPlaysinline = Object.prototype.hasOwnProperty.call(token.attrs, "playsinline");
      for (const k in token.attrs) {
        if (k === "type" || k === "video" || k === "source-type" || k === "freeze" || k === "controls")
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
      out += `<img src="${token.src}" alt="${token.alt}" id="fig-${slugify(token.alt)}" class="block mx-auto unselectable"`;
      for (const k in token.attrs) {
        out += ` ${k}="${token.attrs[k]}"`;
      }
      out += " />";
    }
    if (token.title) {
      out += `<div class='text-center text-gray-500 mb-4 md:px-8 lg:px-12 text-sm'>${marked.parse(token.title, { smartypants: true })}</div>`;
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
  return `<div class="md-shell svelte-umi69w"${add_attribute("this", shellEl, 0)}><div class="md-grid svelte-umi69w"><div class="md-output space-y-6 svelte-umi69w"${add_attribute("this", container, 0)}>${each(sections, (item, i) => {
    return `${item.type === "chunk" ? `${item.chunk.type === "text" ? `<div class="md-output svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(item.chunk.content)}<!-- HTML_TAG_END --></div>` : `${item.chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: item.chunk.id }, {}, {})}` : `${item.chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(item.chunk.content)}<!-- HTML_TAG_END --></div>` : `${item.chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
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
    )}` : ``}`}`}`}`}` : `${item.type === "section" ? `<details class="foldbox foldbox--h2 svelte-umi69w" data-h2fold="1"><summary class="foldbox__summary foldbox__summary--h2"><span class="foldbox__caret" aria-hidden="true"></span> <span class="foldbox__h2 md-output svelte-umi69w"><!-- HTML_TAG_START -->${item.heading.html}<!-- HTML_TAG_END --> </span></summary> <div class="foldbox__body foldbox__body--h2 svelte-umi69w">${each(buildH3Sections(item.children), (sub, j) => {
      return `${sub.type === "chunk" ? `${sub.chunk.type === "text" ? `<div class="md-output svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(sub.chunk.content)}<!-- HTML_TAG_END --></div>` : `${sub.chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: sub.chunk.id }, {}, {})}` : `${sub.chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(sub.chunk.content)}<!-- HTML_TAG_END --></div>` : `${sub.chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
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
      )}` : ``}`}`}`}`}` : `${sub.type === "subsection" ? `<details class="foldbox foldbox--h3 svelte-umi69w" data-h3fold="1"><summary class="foldbox__summary foldbox__summary--h3"><span class="foldbox__caret" aria-hidden="true"></span> <span class="foldbox__h3 md-output svelte-umi69w"><!-- HTML_TAG_START -->${sub.heading.html}<!-- HTML_TAG_END --> </span></summary> <div class="foldbox__body foldbox__body--h3 svelte-umi69w">${each(sub.children, (chunk, k) => {
        return `${chunk.type === "text" ? `<div class="md-output svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(chunk.content)}<!-- HTML_TAG_END --></div>` : `${chunk.type === "jumpbox" ? `${validate_component(Jumpbox, "Jumpbox").$$render($$result, { id: chunk.id }, {}, {})}` : `${chunk.type === "small" ? `<div class="md-output text-sm sm-block svelte-umi69w"><!-- HTML_TAG_START -->${toHtml(chunk.content)}<!-- HTML_TAG_END --></div>` : `${chunk.type === "callout" ? `${validate_component(CalloutBox, "CalloutBox").$$render(
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
        )}` : ``}`}`}`}`}`;
      })}</div> </details>` : ``}`}`;
    })}</div> </details>` : ``}`}`;
  })}</div> ${footnotes.length ? `<aside class="md-footnotes svelte-umi69w" aria-label="Footnotes"${add_attribute("this", footnoteAside, 0)}><ol class="svelte-umi69w"${add_attribute("this", footnoteList, 0)}>${each(footnotes, (fn) => {
    return `<li${add_attribute("id", `fn-${fn.safeId}`, 0)}${add_attribute("title", fn.id, 0)} class="svelte-umi69w"><span class="fn-label svelte-umi69w">${escape(fn.num)}</span> <span class="fn-text svelte-umi69w"><!-- HTML_TAG_START -->${fn.html}<!-- HTML_TAG_END --></span> </li>`;
  })}</ol></aside>` : ``}</div> </div>`;
});
const css = {
  code: ":root{--toc-max-width:280px;--toc-left:28px;--toc-max-width-cap:220px}.toc.svelte-bsu6pv{position:fixed;left:var(--toc-left, 28px);top:50%;transform:translateY(-50%);width:var(--toc-max-width, 280px);height:calc(100vh - 180px);max-height:calc(100vh - 180px);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;padding-right:0;z-index:50;opacity:0;transition:opacity 400ms ease;text-align:left}.toc.ready.svelte-bsu6pv{opacity:1}.toc.hidden.svelte-bsu6pv{display:none}.toc-item.svelte-bsu6pv{display:block;width:100%;text-align:left;overflow-wrap:anywhere;word-break:break-word;color:#6b7280;font-size:14px;line-height:1.6;text-decoration:none;margin:6px 0}.toc-item.svelte-bsu6pv:hover{color:#111827}.toc-item.active.svelte-bsu6pv{color:#111827;font-weight:600}.toc-item.sub.svelte-bsu6pv{padding-left:14px;color:#9ca3af;font-size:13px}",
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
  return ` <nav class="${["toc svelte-bsu6pv", " "].join(" ").trim()}" aria-hidden="true"${add_attribute("this", meterEl, 0)}>${``} </nav>`;
});
const text = `![teaser](/assets/figures/teaser.gif "Figure 1: We study the compute-optimal RL for LLM along three axis: #parallel rollouts($n$), #problems per batch($B_\\text{problem}$), and #sequential iterations($M$), where total rollout compute $C = n \\times B_\\text{problem} \\times M$. We find that (1) optimal parallel rollouts per problem ($n$) grows with  compute budget ($C$). (2) Easy and hard problems: similar scaling trends, but different mechanisms. (3) under fixed hardware constraints ($B$ = $B$<sub>problem</sub> × $n$), prioritize **large $B$<sub>problem</sub>** (small $n$) at low compute budgets, but shift to **large $n$** (small $B$<sub>problem</sub>) at high compute budgets to maximize performance (3) #problems per batch ($B$<sub>problem</sub>) has marginal impact on performance when kept in a moderate range."){width=900px}

A persistent blocker to scaling up reinforcement learning (RL) for LLMs is the absence of a ***concrete workflow*** : **a recipe that tells practitioners *what* to scale in the RL, *how* to scale it, and *what outcomes of scaling one should expect*.** In many areas of modern-day AI, such workflows emerge from empirical scaling laws[^kaplan-2001][^chinchilla-2203]: small-scale experiments reveal how performance should grow with compute, data, or model size. These laws inform compute allocation, models to use, and hyperparameter settings.

For RL, scaling laws remain far less understood compared to pre-training or supervised learning due to the interplay between data collection (***exploration***) and optimization (***learning from data***). Recent works have begun to sketch what these laws might look like in classical deep RL settings[^deep-rl-2104][^value-scaling][^deep-rl-2301]. But in the LLM setting, this line of work is still in its infancy. The most relevant prior results in the LLM-RL setting[^rl-sigmoid-2510] show that, under **specific conditions** (a particular problem mixture), reward curves in RL follow a clean sigmoidal shape when run for longer. Another prior work[^cite-2509] shows that RL training exhibits similar scaling behavior as pre-training in the model size, but ignores other hyperparameters. Simply fitting the shape of a learning curve or showing gains with larger models however does not answer one major question scaling laws intend to address: ***resource allocation** to set up an RL run under the conditions that a downstream user faces*. Given a base model, a problem set, and a total budget on compute, how should one spend this compute? If we had 10x more compute, how should that be spent? Which hyperparameters affect this resource allocation question the most and why? How does resource allocation change when the base model changes?

We have been working toward answering these questions. This article aims to frame the core scaling issues and provide practical guidance for allocating compute in on-policy RL for LLMs, with a particular focus on compute spent on **online sampling (rollouts)**. The picture that emerges is nuanced: ***scaling behavior depends not only on the total compute budget, but also on the interaction between the base model and the prompt distribution.*** Nevertheless, we find that **predictable allocation rules for key hyperparameters emerge as sampling compute increases**. Concretely, as we discuss in detail, for on-policy RL algorithms that optimize policies using multiple parallel rollouts per sequential gradient step, we observe the following:

- **Optimal parallel rollouts per problem ($n$) grows with sampling compute budget ($C$)**. As the total sampling budget increases, the optimal $n$ grows following *a predictable sigmoid curve*. This indicates to maximize performance, practitioners should configure $n$ based on their the compute budget regime: allocating larger $n$ when given higher compute budgets; smaller $n$ when the compute budget is small.
- **Easy and hard problems: similar scaling trends, but different mechanisms.** While both easy and hard problem sets benefit from scaling $n$, the underlying mechanisms are different. On easy problems, larger number of rollouts ($n$) primarily acts to sharpen the policy on already solvable problems, indicated by the improvements in the worst@k metric. In contrast, on hard problem sets, scaling $n$ is essential for expanding coverage (discovering rare successful trajectories), directly improving the best@k metric.
- **The number of unique problems per batch ($B$<sub>problem</sub>) has marginal impact**. We find that varying the number of unique problems per batch ($B$<sub>problem</sub>) yields negligible changes in validation reward, provided it remains neither too small or too large. Thus, under fixed hardware constraints ($B$ = $B$<sub>problem</sub> × $n$), this insensitivity dictates a dynamic allocation strategy: prioritize **large $B$<sub>problem</sub>** (small $n$) at low compute budgets, but shift to **large $n$** (small $B$<sub>problem</sub>) at high compute budgets to maximize performance, though the trade-off on hard problems where reward is hard to obtain is more nuanced.
- **The saturation point of compute-optimal number of rollouts ($n$) is determined by problem set size, difficulty, and the interaction between the base model and the prompt set**. The value at which $n$ saturates is governed by three specific interactions: a) **problem set size:** Smaller datasets lower the saturation point due to early overfitting: validation reward degrades despite training reward gains, making large $n$ values simply infeasible; b) **problem difficulty:** Harder problems saturate at a smaller compute-optimal $n$ values because they require a critical mass of sequential updates to make progress otherwise find it hard to balance optimization and exploration with too large $n$. Moreover, skewed dataset compositions also skew $n$ values due to interference between easy and hard prompts; and **c) base model**, which dictates learnability and transfer across prompts being trained upon.

---

## Where RL Scaling Laws Come From (When They Exist), Conceptually

To begin, it helps to recall why scaling laws can be derived in supervised learning or pre-training, and what makes learning dynamics predictable in these settings. In supervised learning, the objective is typically cross entropy, which is smooth and optimized over a fixed data distribution. This results in relatively well-behaved optimization dynamics, where small parameter updates lead to small and predictable changes in the loss. Consequently, under well-chosen hyperparameters, which can often be identified through small-scale experiments, the training dynamics of supervised learning become predictable, allowing the loss to be modeled as a function of compute or data. The **statistical structure of the data**, such as the covariance spectrum, remains constant through training. A simple mental model is that the [decay of this spectrum](https://arxiv.org/abs/2102.06701) governs the power law scaling behavior observed in practice. We emphasize that this perspective is an approximation rather than a formal proof, but it provides useful intuition for why scaling laws emerge in supervised learning. In RL, the challenge of deriving any scaling law is two fold: 

1. ::blue[ ***the objective given by the  expected reward (unlike cross-entropy) behaves non-smoothly across training iterations which make small perturbations to the parameters*** ]::
2. ::blue[ ***the data distribution itself depends on the policy being optimized.*** ]:: 

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

- **$C$:** sampling compute, measured as the **number of rollouts**. We use rollouts instead of tokens because the number of tokens generated per rollout is hard to predict ahead of time.
- **$M$**: the total number of **gradient update iterations** in training (often called “*steps”* in common open LLM-RL frameworks).
- **$B$**: the **rollout batch size** per iteration, i.e., the total number of rollouts collected in one iteration.

The total rollout compute scales as:

$$
C \\propto B \\times M
$$

$B$ can be further broken down into two components:

- **$B$<sub>problem</sub>**: the number of **unique problems** in the rollout batch of each gradient step.
- **$n$:** the number of rollouts sampled **per problem** (also referred to as the *group size* in [GRPO](https://arxiv.org/pdf/2402.03300)).

To sum up, rollout compute $C$ can be decomposed into three resources, that we can allocate:

$$
C \\propto B_{\\text{problem}} \\times n \\times M
$$

### Problem Statement

Our central scaling question, put informally is:

:::callout_begin type="tip" title=" ":::
**Given a base model and a problem set, how should we spend a fixed amount of sampling compute to achieve the highest possible post-training performance?**
:::callout_end:::

This simple question abstracts all of the complexity of modern LLM RL. We make a simplifying assumption and assume that response length, on an average, is captured in the constants, we are now left to allocate sampling compute into $B$<sub>problem</sub>, $n$, and $M$. In principle, we could carry out our analysis accounting for the compute spent in terms of the total tokens sampled instead of the total rollouts. However, in our experiments we observed that although response length might vary across settings, these variations manifest primarily as a constant offset in log-log space, leaving the fundamental scaling trends intact. Hence, our conclusions would be similar whether or not we accounted for the sequence length, and we chose to ignore it for simplicity. Our scaling study is based on one model and a problem set, so we do not count them as resources. Hence, our formal resource allocation question is given by:

:::callout_begin type="tip" title=" ":::
**Given a base model, a problem set, and a sampling budget $C$ ≤ $C$<sub>max</sub>, find the configurations of $n$, $M$, $B$<sub>problem</sub> that attain the best possible performance as measured by a target performance metric.**
:::callout_end:::

Ideally, as more sampling compute is provided, the optimal values of $n$, $M$, $B$<sub>problem</sub> should be such that more compute translates to better performance. This means that the underlying recipe for which we prescribe values of $n$, $M$, $B$<sub>problem</sub> should be such that it ***scales in an healthy manner*** as more sampling compute is allocated. RL runs with LLMs often destabilize or collapse with many optimization steps, and this means that we must first prescribe a scalable/healthy RL recipe before studying the above resource allocation question.  We anchor our main experiments on [Qwen2.5-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) and leverage [Qwen3-4B-Instruct](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507) and [Llama3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) for expanding our observations later.

---

## What Constitutes a Healthy RL Recipe for a Given Base Model?

Now, we discuss several characteristics of optimization and exploration mechanisms that support stable and healthy RL. From our experiments, we identify a few key factors that consistently govern whether optimization and exploration remain stable and scalable: (1) the difficulty distribution of the dataset, (2) the behavior of token entropy, and (3) the learning rate. These are not the only factors, in fact, we also observe that “staleness” (or how off-policy the generated rollouts are) also affects scaling and performance, but leave a discussion of it from the current blog post to focus on fully on-policy recipes. We study each of the remaining factors in this section.

### Factor 1: Dataset Difficulty Distribution

The first factor that informs the health of an RL run is the composition of the problem set. Easy problems, where the base model can already sample multiple correct traces, tend to produce [rapid entropy collapse](https://arxiv.org/abs/2505.22617) of the model’s next token distribution. In contrast, making progress on [very hard problems](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/), where the base model can hardly sample ***any*** correct trace, requires careful optimization that actively couples with exploration. In fact, as we will show later, RL training behaves rather unpredictably when the problem set is too hard, as the model must balance between **exploration on unsolvable problems** and **exploitation of reachable ones** (i.e., those with at least one successful pass). Recent works show training on such problems requires algorithmic modifications to make very hard problems “appear” easy first (see [our blog post](https://blog.ml.cmu.edu/2025/11/26/how-to-explore-to-scale-rl-training-of-llms-on-hard-problems/) and [RL grokking](https://rdi.berkeley.edu/blog/rl-grokking-recipe)). This means that the difficulty of the problem set relative to the base model often very directly determines  the knobs behind a healthy RL recipe. 

**A practical way to quantify this difficulty is to evaluate the base model’s performance on the problem set prior to training.** In this blog, we use the [Guru-Math](https://arxiv.org/abs/2506.14965) dataset for its sizable, carefully curated math problem collection with verified answers, which allows us to perform controlled sampling. We first measure the problem difficulty by *avg@16* (average accuracy over 16 trials obtained for a given problem) with the base model we use for RL training and then construct training problem sets by difficulty: 

- ***Easy*** problem set: **avg@16 in [0.3, 0.6]** (6k samples), with a 300-sample in-domain validation set.
- ***Hard*** problem set: **avg@16 in [0.0, 0.0625]** (5k samples), with a 300-sample in-domain validation set.

![Figure2](/assets/figures/sec2_data_dist.png "Figure 2: Distributions of problem difficulty for the Easy and Hard problem sets. Difficulty is quantified using avg@16, the average pass rate over 16 generations per problem."){width=500px}

Beyond these primary Easy and Hard sets for our experiments, we also curate a **Heterogeneous** set (mixing easy and hard set in different proportions) and an **Extremely Hard** (pass@128 = 0) for extending our observations. We default to utilizing the recipe for the Hard set on these problem sets as well. We discuss results on this set later in this post (see the section titled "The Bigger Picture").

### Factor 2: Entropy Control

The interaction between the problem distribution and the base model is clearly reflected in token-level entropy and, somewhat correlatedly, the KL divergence to the base model. While neither directly measures task performance, both serve as sensitive indicators of optimization health. When entropy or KL becomes too large or too small, learning can stall or become unstable. Intuitively, entropy controls how broadly the policy explores at the token level, while the KL divergence anchors the policy to the base model and limits excessive drift. The behavior of these quantities depends on problem difficulty. It is often a common practice to add an entropy regularizer for training. On easy problems, running RL without a sufficiently large entropy regularizer often leads to premature entropy collapse. However, on hard problems, running RL with an entropy regularizer alone often leads to an explosion in entropy and response length. A KL constraint by itself typically over-constrains exploration and is unnecessary in most regimes, indeed RL runs can work just as well without a KL constraint. However, on hard problems, where entropy can explode early in training, a KL anchor is effective at delaying or totally avoiding instability. For this reason, ***whenever we use an entropy loss, we pair it with a KL loss to provide a stabilizing anchor.***

[Prior work](https://arxiv.org/abs/2510.13786) often employs a **zero variance filtering** (”zero-var filter” in Figure 3 below) mechanism when using rollout-based policy gradient methods such as GRPO, removing training prompts where all rollouts are either all incorrect or all correct. This filtering typically serves two purposes. First, it increases the effective batch size by keeping prompts that produce a non-zero policy gradient. Second, when entropy and KL regularizers are used, it prevents these regularizers from being applied on rollouts that do not contribute to an active policy gradient. The second mechanism is particularly important on hard problems, where RL optimization naturally pushes the policy toward higher entropy in order to discover rare positive trajectories that are unlikely to be produced by the base model but succeed. This [increase in entropy is driven by the policy gradient](https://arxiv.org/abs/2506.09026) itself and is often necessary for effective exploration. 

Even with zero-variance filtering applied, problems in which rare positives are sampled can still experience entropy explosions, since the resulting entropy or KL regularizers remain active. More concretely, our experiments (Figure 3) show that applying zero-variance filtering to the KL and entropy terms mitigates some of the most severe instabilities on hard problems. However, we find that it does not fully eliminate instability in all cases. **Removing KL and entropy regularization entirely yields the most stable training dynamics**. Thus, we adopt **KL+entropy regularization on the Easy set**, where entropy otherwise tends to collapse, and **no KL or entropy regularization on the Hard set**, to avoid instability.

**Experiment setup.** We use Qwen2.5-7B-Instruct as the base model with a max output length of 8,192 tokens and employ the [GRPO](https://arxiv.org/abs/2402.03300) algorithm. We fix $B$<sub>problem</sub> = 256 and $n$ = 16. On both the Easy and Hard sets, we perform ablations over (1) the presence of KL and entropy regularization and (2) the application of the zero-variance filter, including variants where the filter is applied only to the KL and entropy loss terms.

![Figure 3](/assets/figures/sec2_kl_ent_ablation.png "Figure 3: Ablations of KL+entropy and zero-var filter across the Easy and Hard problem set. On the Easy set, all configurations improve steadily, with standard "KL+entropy" achieving the highest reward (left). On the Hard set, while applying zero-variance filtering to the KL and entropy terms helps mitigate instability, disabling these regularizers entirely results in significantly more stable training (right)."){width=900px}

### Factor 3: Learning-Rate Scaling

Building on the perspective of stable entropy and KL dynamics, the **learning rate (LR)**, denoted as *η*, governs the magnitude of policy updates per unit of advantage. It is well-established that different model scales exhibit varying sensitivities to the learning rate ([Kaplan et al. 2020](https://arxiv.org/abs/2001.08361); [Hoffman et al. 2022](https://arxiv.org/abs/2203.15556)), and additionally the best learning rate depends on the batch size in supervised learning ([Krizhevsky 2014](https://arxiv.org/abs/1404.5997); [Goyal et al. 2017](https://arxiv.org/abs/1706.02677); [McCandlish et al. 2018](https://arxiv.org/abs/2505.23971)). Since we vary the batch size $B$ in our experiments, establishing a robust baseline LR and a systematic scaling strategy is essential. To formalize this choice, we first identify a **base learning rate anchor**. We then study how different scaling rules perform as the batch size increases. Based on our experiments *(Figure 4)*, we adopt *η*<sub>base</sub> = 10<sup>-6</sup> as the anchor for a batch size of $B$ = 1,024 and utilize the **square-root scaling** rule with respect to $B$.

**Experiment setup.** We conduct these experiments on the Easy set using the [AdamW](https://arxiv.org/abs/1711.05101) optimizer. The learning rate is linearly warmed up for 10 steps and then held constant for the remainder of training. We fix a baseline configuration with $B$<sub>problem</sub> = 128, $n$ = 8, $B$ = 128 × 8 = 1,024 and run a grid search for a good base LR anchor. We then increase $n$ to 64 and $B$ to 128 × 64 = 8,192 and compare three scaling strategies:

- **Constant LR:** *η* remains fixed regardless of changes in $B$.
- **Linear scaling:** *η* scales linearly with $B$.
- **Square-root scaling:** *η* scales proportionally to √$B$.

As shown in Figure 4 below, we observe that ***square-root scaling enables faster convergence while avoiding the instability seen in linear scaling.*** Although we ran this experiment on the easy problem set, we expect the same learning rate scaling strategy to apply across problem sets of varying difficulty. Conceptually, the way the learning rate should scale with batch size is governed by gradient variance and noise. While problem difficulty may change the optimal *absolute* learning rate, it should not fundamentally change the underlying scaling relationship as batch size increases.

:::callout_begin type="info":::

**Key Takeaways**:

1. RL training exhibits distinct training behaviors depending on problem difficulty. We therefore explicitly **curate and control for both Easy and Hard datasets** to ensure the recipe is robust to different saturation points and exploration requirements. On heterogeneous datasets that we discuss later, we simply use the recipe corresponding to the Hard dataset to avoid instability.
2. The necessity of regularization changes based on the difficulty level. **Easy tasks** benefit from KL divergence and entropy constraints to prevent premature collapse, whereas **Hard tasks** achieve peak performance when these constraints are removed to allow unconstrained exploration. Training on mixed datasets is most stable when no KL divergence or entropy are used.
3. Learning rate should not be fixed as the total batch size $B$ changes. Of the schemes we compared, the **square-root learning rate scaling** strategy is the best.

:::callout_end:::

---

## Results: Compute-Optimal Allocation of Sampling FLOPs in LLM RL

We now turn to our central question: ***given a fixed sampling compute budget, how should we allocate it across the RL sampling knobs to maximize performance?*** Recall that the rollout compute $C$ scales ∝ $B$<sub>problem</sub> × $n$ × $M$. Our goal is ***not*** to tune a single best configuration for training, but to identify **allocation workflows** for distributing a fixed sampling budget across problems per batch $B$<sub>problem</sub> and rollouts $n$ sampled for each problem in the batch. Across all experiments in this section, we sweep ($n$, $B$<sub>problem</sub>, $M$) across a range of compute budgets $C$. For a fixed compute budget $C$ = $C$<sub>0</sub>, we evaluate multiple allocations and define the ***compute-optimal frontier*** as the highest IID validation set reward achievable using total compute $C$<sub>0</sub>. We get different plots on the frontier as we increase and sweep over values of $C$<sub>0</sub>.

**Data analysis workflow.** To make our scaling law prescriptions, we subsample the data from runs to only a smaller set of ***record-breaking*** points on a learning curve of reward (or any other performance metric) as a function of increasing compute. A record-breaking point is defined as the first point in a run that attains a higher validation reward relative to all previous points. For computing this higher reward, we first bucketize the reward into discrete bins and then pick the first points where the bucket increments. See this footnote[^record-breaking] for a detailed explanation on why utilizing record-breaking points for deriving the fit is sufficient. We then fit a monotonic function to the record-breaking points to obtain prescriptions for compute-optimal values of $n$, $B$<sub>problem</sub>, and $M$. Because this pre-processing is order-preserving, this procedure does not introduce spurious non-monotonicity and yields the same frontier in practice as fitting over all points.

Unless otherwise stated, we use Qwen2.5-7B-Instruct as the base model with the max output length 8,192 and the healthy *RL* recipe from above. We use on-policy updates with an Adam optimizer, scaling the learning rate proportionally to √$B$, where the rollout batch size $B$ = $B$<sub>problem</sub> × $n$ (base LR = 1e-6 at $B$=1024); KL and entropy regularization are enabled on the Easy set and disabled on the Hard set (as discussed above); we fix the sampling temperature to 0.6 and top_p to 1.0 for training and evaluation; we use GRPO to estimate advantages and truncated importance sampling ([TIS](https://fengyao.notion.site/flash-rl)) to mitigate training-inference logit mismatch. 

**Experimental setup.** We sweep over valid configurations ($B$<sub>problem</sub>, $n$) from the Cartesian product {32 (2<sup>5</sup>), ..., 1024 (2<sup>10</sup>)} × {8 (2<sup>3</sup>), ..., 2048 (2<sup>11</sup>)}, subject to the hardware constraint $B$<sub>problem</sub> × $n$ ≤ $B$<sub>max</sub>. We set $B$<sub>max</sub> = 65,536 for the Easy set and 16,384 for the Hard set. The value of $B$<sub>max</sub> is smaller for the hard set to allow for more sequential iterations, within our allowed computational budget. The total compute cost for these experiments was approximately 120,000 NVIDIA H200 GPU hours.

We concretely study compute-optimal allocation rules in three settings that allocate a subset of resources: 

1. $n$ vs $M$ (parallel rollouts vs sequential iterations)
2. $n$ vs $B$<sub>problem</sub> (parallel rollouts vs the number of problems in a batch)
3. allocation across all resources.

### Question 1:  Trading Off Parallel Sampling $n$ with Sequential Iterations $M$

$$
C \\propto \\underbrace{B_{\\text{problem}}}_{\\text{fixed}}
\\times \\color{blue}\\underbrace{{n \\times M}}_{\\color{blue}{\\text{user allocated}}}

$$

We now examine compute allocation with the number of problems $B$<sub>problem</sub> held constant, focusing on **the trade-off between parallel samples $n$ and sequential iterations $M$** under a fixed compute budget.

**Fitting workflow.** We plot reward vs compute $C$ curves for each fixed $n$ and fit a **monotonic sigmoid** to summarize how the validation set reward (avg@4) scales with compute for that $n$. As mentioned above, we then define the **compute-optimal frontier** as the upper envelope of these fitted curves (see Figure 5). Then, to indicate which $n$ lies on the frontier at each compute level, we color the frontier in Figure 5 by *n*\\*($C$), which is the value of $n$ whose fitted compute–reward curve achieves the compute-optimal frontier at $C$. Finally, in Figure 6, we fit a log-log plot to show  *n*\\*($C$) as a function of  $C$ to summarize the empirical scaling behavior. We make four important observations in this setting.

**1) The value of $n$ that lies on the compute-optimal frontier shifts systematically higher as the sampling compute** $C$ **increases (Figure 5).** It is natural to expect larger values of $n$ to be generally favorable at higher compute budgets, since increasing $n$ reduces noise in advantage estimates and lowers policy-gradient variance but eats up more sampling compute. Consistent with this, the frontier-attaining *n*\\*($C$) shifts to larger values as $C$ grows, and we observe the same trend in both the Easy and Hard problem sets. Smaller values of $n$ exhibit rapid initial gains but plateau at a relatively lower compute regime, whereas larger $n$ sustain improvement over a broader compute range (*Figure 5*). This behavior also suggests that parallel and sequential compute are not exactly interchangeable. Choosing $n$ so that we are able to perform a sufficient number of sequential updates $M$ is necessary to achieve strong performance. 

![Figure 5. Reward frontier a function of compute ($B$<sub>problem</sub> = 32)](/assets/figures/sec3_q1_fixBprob_frontier.png "Figure 5. Reward frontier a function of compute ($B$<sub>problem</sub> = 32), where the frontier is computed by maximizing over values of $n$. The compute-optimal frontier shifts to larger $n$ with more $C$, showing that more parallelism becomes optimal at higher budgets. For easy problems **(left)**, **small** $n$ improves fast but plateaus; larger **$n$ sustains gains and dominates at high compute. For the hard ones****(right)**,  the same trend holds, but rewards are lower and saturate earlier, with the frontier reaching a smaller value than $n$ on the easy problems."){width=900px}

**2) Compute-optimal values of $n$ are well-approximated by a sigmoid function of** $C$  **(Figure 6).**  We next seek to fit a functional relationship for the compute optimal value *n*\\*($C$) as a function of the available compute $C$. A natural first step is to hypothesize an appropriate functional form. As shown in Figure 5, increasing $C$ admits larger compute optimal values of $n$, and over a substantial range this relationship appears approximately linear on a log-log scale. The key question is whether this growth continues indefinitely or eventually saturates. Empirically, we observe a clear saturation in Figure 6. Even when evaluating rollout widths up to $n$ = 2,048, values significantly larger than the saturation point, they fail to extend the frontier, with $n$ = 512 continuing to dominate.

We argue that this behavior is expected for a fixed base model and a fixed problem set. To build intuition, it is helpful to view increasing $n$ as analogous to spending more compute per gradient step. In empirical risk minimization, increasing capacity alone does not reduce validation error beyond a certain point unless additional training data is available or the train-test gap is reduced. This principle also underlies pre-training scaling rules from [Chinchilla](https://arxiv.org/abs/2203.15556) that prescribe scaling both pre-training data and model capacity together. Perhaps most closely related to our RL training setup, [our prior work](https://arxiv.org/abs/2406.14532) on rejection fine-tuning shows that the optimal value of $n$ on the training set is often capped by an upper bound. Increasing $n$ alone cannot overcome limitations imposed by a fixed problem set for training or base model. As a result, the compute optimal value of $n$ must eventually saturate even for RL, which is precisely what we observe empirically. We empirically validate this hypothesis regarding model-data interaction in the later analysis section, where we demonstrate how the saturation point shifts given *a different base model, problem set size, and distribution*.

![Figure 6: Compute-optimal scaling of the parallel compute $n$ ($B$<sub>problem</sub> = 32)](/assets/figures/sec3_q1_fixBprob_sigmoid.png "Figure 6: Compute-optimal scaling of the parallel compute $n$ ($B$<sub>problem</sub> = 32). The optimal value of rollouts $n$ **shifts systematically higher** as the total sampling compute increases. Points show a running-average estimate of the frontier-attaining *n*\\*($C$) at each compute budget (colored by reward), and the red curves fit a sigmoid parameterizing log $n$ as a function of log $C$. For both the easy set **(left)** and hard set **(right)**, *n*\\*($C$) rises from small to very large values as compute increases. On the hard set, the final  value converges significantly below the maximal value of $n$ (2^10), and this value is lower than the easy set."){width=900px}

**3) Next**, **we find that the compute-optimal allocation *trend* remains consistent across difficulty levels, although we find harder sets prefer smaller values of** $n$ **(Figure 6)**. We find that the qualitative compute optimal allocation trend remains consistent across problem difficulty. On both easy and hard problem sets, the compute optimal value of $n$ increases with total compute $C$ before eventually plateauing. However, the plateau occurs at markedly ***smaller*** values of $n$ on harder problems. In particular, very large values of $n$, such as $n$ = 512, yield lower final performance on the hard set and do not lie on the compute optimal frontier. ***This suggests that task difficulty imposes an upper bound on how large $n$ can be used effectively**. **While it may seem intuitive that harder problems should benefit from larger $n$ due to increased sampling, we observe the opposite behavior in practice.*** On sufficiently hard problem sets, increasing $n$ allocates substantial compute to problems where the model receives little or no learning signal. In contrast, smaller values of $n$ focus optimization on the subset of prompts where nonzero signal is already present and meaningful improvement is possible. **Therefore, if compute is bounded**, it is better to use a smaller value of $n$ to increase the frequency of parameter updates (small $n$, large $M$, more epochs on the same prompt set) that exploits reachable gains, rather than large parallel compute on problems that are persistently unsolved (large $n$, small $M$, fewer training epochs).

**4) Implications on optimization dynamics on the easy and hard sets and the role of various performance metrics (Figure 7).** We saw in point 3 above that a smaller value of $n$ was more preferable for optimizing validation *average reward* (avg@4 per problem), and we attributed this behavior to the underlying optimization dynamics (i.e., solving more problems vs producing more correct rollouts on the same problem). In this point, we aim to better **understand this optimization dynamics and evaluate how *n*\\*($C$) changes if we were to change the target performance metric we study.**

In particular, we consider two performance metrics: ***best@k** (or pass@k)* and ***worst@k*:** Recall the definitions:

- **best@k:** the proportion of problems where *at least one* generated response out of *k* is correct. This measures the model's **coverage** over the validation problem set.
- ***worst@k*:** the proportion of problems where all *k* generated responses are correct, also referred to as *perfect solvability.* This measures the robustness of the training procedure (i.e., the degree to which it can “**sharpen**” around the right solution).

Modulo compute-optimality, a larger value of $n$ coupled with as many sequential update steps as needed, should in principle, result in higher values for both best@k and worst@k on a training dataset. However, this is not quite the case when compute is bounded. We empirically identify the optimal values of *n*\\*($C$) for obtaining the highest best@k and worst@k scores on the validation set, across different $B$<sub>problem</sub> values for the largest value of $C$, and show this number in Figure 7 below. We choose *k*=4, much smaller than any value of $n$ we study ($n$ ≫ *k*), so that none of the trends in Figure 7 are “edge” cases or artifacts of empirical/fitting/workflow/statistical error. Perhaps surprisingly, we now see an interesting divergence in trends of compute-optimal $n$ that impacts the Easy and Hard sets differently. 

1. On the easy set, **a larger $n$ is compute-optimal for worst@4 (sharpening) performance, whereas relatively smaller values of $n$ are compute-optimal for the best@4 performance.** This means that a larger $n$ primarily improves by sharpening more on easy problems, while a smaller $n$ suffices to sample one correct rollout (expected since the set is easy).
2. Conversely, for hard problems, **a larger $n$ is more critical for pushing the best@4 (coverage) boundary, while a relatively smaller $n$ is compute-optimal for improving worst@4 (sharpening).** However, there is a limit beyond which a larger $n$ does not improve coverage on new problems in a compute-optimal manner, as indicated by Figure 7 that optimal values here remain generally lower than on the easy set. On the *Extremely Hard* set consisting of all pass@128=0 problems (shown in the later analysis section), we see a clearer tradeoff of coverage and sharpening: while larger $n$ improves best@k, excessive $n$ degrades worst@k and lowers the average reward. Thus, if targeting average reward, the optimal $n$ on hard problems is the value that balances coverage and sharpening well. 

The net effect of these distinct optimization dynamics is a similar trend of compute-optimal $n$ on the validation average reward (Figures 5 & 6), but these results imply that the target performance metric itself dictates the landscape of compute-optimal $n$. 

![Figure 7: Values of $n$ that optimize the best@4 and worst@4 performance for different $B_\\text{problem}$ values](/assets/figures/sec3_q1_fixBprob_bestworstk.png "Figure 7: Values of $n$ that optimize the best@4 and worst@4 performance for different $B_\\text{problem}$ values, when evaluated at the largest allowed compute budget. On the Easy set ***(left)***, the compute-optimal $n$ is smaller for best@4 (blue) than for worst@4 (red), indicating that improving robustness (worst@4) requires substantially more parallel rollouts than improving coverage. In contrast, this trend reverses on the Hard set ***(right)***: a larger $n$ is needed to improve best@4 compute-optimally, while worst@4 saturates at smaller $n$."){width=900px}

:::callout_begin type="info" title="Key Result Takeaways":::

1. The compute-optimal $n$ frontier **shifts systematically higher** as the total sampling compute increases. The trend remains consistent **across training dataset difficulties.**
2. The source of gain from large $n$ **shifts based on the training data difficulty**: scaling $n$ improves **sharpening** (worst@4) on the Easy set, but expands **coverage** (best@4) on the Hard set. 
:::callout_end:::


:::callout_begin type="info" title="Workflow Takeaways":::

- Depending upon the composition of the problem set, and how effectively can the base model learn on this set, we might see different underlying mechanisms for performance improvement. It is advisable to evaluate the mode of performance improvement for your base model on your prompt set, and accordingly use it to set $n$ as a function of the available $C$.
:::callout_end:::

### Question 2: Bounded Parallel Compute: Trading off $B$<sub>problem</sub> with $n$

$$
C \\propto \\underbrace{B}_{\\text{fixed}} \\times M = {\\color{blue}\\underbrace{B_{\\text{problem}} \\times n}_{\\text{user allocated}}} \\times M
$$

Next, we study a different scaling question, where wish to allocate a fixed total batch size $B$ into the number of prompts used and the number of rollouts per prompt used. This question is important in practical settings where hardware parallelism (e.g., number of GPUs / data-parallel workers) is fixed, and a practitioner needs to make this compute allocation. In such cases, $B$ is often chosen as the largest rollout batch size that saturates sampling throughput (”system batch size”). 

We specify the number of sequential iterations $M$ ***a priori*** and seek allocations of $B$<sub>problem</sub> and $n$ under a fixed total batch budget $B$<sub>problem</sub> × $n$ ≤ $B$ that maximize performance. We observe the following:

**1) On the easy problems, allocate more parallel compute $n$ when sequential steps $M$ is large.** In this regime, we examine the compute-optimal value of $n$ under a fixed total batch size (illustrated with $B$ = 8,192 for brevity), as $M$ varies. As shown in Figure 8, the optimal choice *n*\\*($M$) exhibits a sigmoidal dependence on $M$. This behavior suggests that when more sequential update steps are available, it is generally preferable to allocate additional compute toward increasing $n$, rather than increasing $B$<sub>problem</sub>. In contrast, when $M$ is small, allocating batch size toward a larger $B$<sub>problem</sub> is more effective, as it enables many more epochs of training on the same problems within a limited number of sequential updates. 

On the Hard set, however, the scaling behavior is less consistent. The compute-optimal value *n*\\*($M$) exhibits a non-monotonic dependence on $M$ (see Appendix A, Figure x), which implies a similarly irregular trend for the optimal $B$<sub>problem</sub>.

![Figure 8.  Compute-optimal allocation shifts from $B_{\\text{problem}}$ to $n$ under a fixed total batch size constraint ($B=8,192$) on easy problems](/assets/figures/sec3_q2_fixB_sigmoid.png "Figure 8.  Compute-optimal allocation shifts from $B_{\\text{problem}}$ to $n$ under a fixed total batch size constraint ($B=8,192$) on easy problems. We fix the total rollout budget per step ($B = B_{\\text{problem}} \\times n$) and sweep the number of sequential iterations ($M$). A sigmoid curve can explain the frontier of optimal $n$ per problem. This curve indicates that $n^*(M)$ increases with $M$, a proxy of total compute $C$ given a fixed $B$ ***(left).*** The corresponding compute-optimal number of prompts $B_{\\text{problem}}^*(M)$ decreases with the available sampling compute according to an (inverse) sigmoid ***(right)***. These indicate the strategic shift toward higher per-problem sampling at larger compute budgets."){width=900px}

**2) The *transition point* to a larger $n$ value on the compute-optimal consistently happens when that larger $n$ run reaches approximately one epoch (Figure 9).** An epoch is defined as the problem set size *D* divided by the batch size $B$<sub>problem</sub>. This offers an explanation for the finding “small $n$ for small $C$; larger $n$ for larger $C$”, consistent across Question1 (fix $B$<sub>problem</sub>) and Question2 (fix $B$): in a small $C$ regime, the larger $n$ underperforms because it hasn't yet seen the full problem set. However, once the larger $n$ completes a full pass (i.e., one epoch), the smaller $n$, which is now iterating over seen data, begins to yield diminishing returns. Thus, the larger $n$ overtakes the small $n$ at large $C$ regime.

![Figure 9](/assets/figures/sec3_q2_fixB_frontierepoch.png "Figure 9. Compute-optimal frontiers (under a fixed $B=8,192$) and analysis of training epochs at transition points. Larger $n$ outperforms smaller $n$ as compute increases. Vertical drop-lines mark the transition points where switching to a larger $n$ becomes optimal ***(left).*** These transitions consistently occur at about one epoch ***(right)***. This indicates that larger $n$ overtakes smaller $n$ after a full pass over the training problems, offering one perspective to explain the scaling behavior: small $n$ for small $C$; large $n$ for large $C$."){width=900px}

A natural follow-up question is: what role does $B$<sub>problem</sub> play? So far, we have shown larger $n$ is preferred for larger $C$. However, given the constraint $B$ = $B$<sub>problem</sub> × $n$, we do not expect the trend to be monotonic due to the confounding effect of $B$<sub>problem</sub>. To disentangle this, we analyze the sensitivity of performance to $B$<sub>problem</sub> while holding $n$ fixed.

$$
C \\propto {\\color{blue}\\underbrace{B_{\\text{problem}}}_{\\text{user allocated}}} \\times \\underbrace{n}_{\\text{fixed}} \\times {\\color{blue}\\underbrace{M}_{\\text{user allocated}}}
$$

**3) $B$<sub>problem</sub> has a marginal effect on validation performance when fixing $n$ on easy problems.**  As shown in Figure 10, when fixing $n$, varying $B$<sub>problem</sub> provides little variance on validation reward. In contrast, increasing $n$ (fixing $B$<sub>problem</sub>) shows a strong correlation with improved validation scores, up to the saturation point discussed in Question 1. This explains the sigmoidal trend in Figure 9: since $n$ is the primary driver of performance and $B$<sub>problem</sub> yields little difference, increasing $n$ is preferred for large $C$ and $B$<sub>problem</sub> decreases in return ($B$<sub>problem</sub> = $B$/$n$). 

Overall, we find that setting a large $n$ (up to the saturation point), combined with a moderate $B$<sub>problem</sub> is the most robust strategy. For example, in our experiments, we observed no significant threshold effects for $B$<sub>problem</sub> between 32 and 1024 on the Easy set. However, on the Hard set or a skewed problem distribution, we speculate they may require a higher minimum $B$<sub>problem</sub> for effective training. This behavior is intuitive. On a uniformly constructed Easy set (Figure 2), a relatively small but representative subset of problems already provides a good estimate of the underlying expectation. In contrast, for hard problems to the base model, training on a larger set of problems is necessary, since a small subset of problems that receive early learning signal can otherwise dominate the training distribution. At the same time, the value of $n$ remains important. The resulting trade-off between problem coverage and per-problem $n$ leads to less predictable behavior on the Hard set.

![Figure 10: Differences in validation reward  attained when varying $B_\\text{problem}$ (fixed $n=16$; *left*) vs. varying $n$ (fixed $B_\\text{problem}=32$; *right*).](/assets/figures/sec3_q2_fixn_varyBprob.png "Figure 10: Differences in validation reward  attained when varying $B_\\text{problem}$ (fixed $n=16$; *left*) vs. varying $n$ (fixed $B_\\text{problem}=32$; *right*). We observe that even in the setting where $B_\\text{problem} \\times n$ is fixed, modifying the value of $n$ has a substantially larger influence on the validation reward compared to a much smaller variation in results when varying the number of problems during training."){width=900px}

---

:::callout_begin type="info" title="Key Result Takeaways":::

1. With a fixed total batch size $B$, increasing compute favors allocating more rollouts ($n$) per problem and fewer problems per batch ($B$<sub>problem</sub>). On the Easy set, this trend is especially clean, since large $B$<sub>problem</sub> leads to rapid overfitting (as a result of multi-epoch training).
2. On the Easy set, the compute-optimal value of $n$ increases with the allowed number of sequential iterations $M$ and eventually saturates, following a sigmoidal scaling pattern.
3. For the Hard dataset, $B$<sub>problem</sub> must exceed a minimum threshold when sequential compute is unconstrained. Here, incomplete optimization of training reward, rather than overfitting, limits validation performance, making overly small $B$<sub>problem</sub> suboptimal. However, $n$ is still the more critical resource to allocate, and it generally increases as total $B$ is scaled up.
:::callout_end:::

:::callout_begin type="info" title="Workflow Takeaways:":::

- It is preferable to train on fewer problems with a sampling large budget $n$ if we are allowed training for multiple epochs on the same problem set. On the other hand, if multi-epoch training is not possible, then it might be preferable to include on more problems in a batch.
:::callout_end:::

### Question 3: Putting It All Together

$$
C \\propto \\color{blue}\\underbrace{{B_{\\text{problem}} \\cdot n \\cdot M}}_{\\color{blue}{\\text{varying}}}

$$

Finally, we relax all constraints and optimize ($B$<sub>problem</sub>, $n$, $M$) jointly under a fixed compute budget. Consistent with our previous findings, **the compute-optimal strategy is primarily defined by scaling $n$**. As shown in Figure 12, the optimal *n*\\*($C$) follows a clean sigmoidal trajectory as compute increases, regardless of problem difficulty. In this regime, $B$<sub>problem</sub> acts as a stability constraint rather than a performance driver. We find that $B$<sub>problem</sub> fluctuates within a moderate range (e.g., maintaining $B$<sub>problem</sub> ≥ 32 for Hard tasks) but does not exhibit a distinct scaling law. Thus, the practical recipe is simple: **scale $n$ with compute** according to the sigmoidal fit, while keeping $B$<sub>problem</sub> large enough to stabilize training.

![Figure 11. The frontier reward curve as a function of compute](/assets/figures/sec3_q3_frontier.png "Figure 11. The frontier reward curve as a function of compute , where the frontier is computed by maximizing over values of $n$, $B_\\text{problem}$, $M$. Curves are monotonic sigmoid fits; colors mark $n$. The compute-optimal frontier still shifts to larger $n$ as compute increases, showing that higher-rollout parallelism becomes optimal at higher budgets for both the easy and hard problem sets. On the other, the value of $B_\\text{problem}$ for each segment is either constant (e.g., 64 on the hard set) or varies substantially (on the easy set), but this variation results in only little fluctuation in performance (see Figure 11 for sensitivity of this choice)."){width=900px}

![Figure 12. Compute-optimal parallel rollouts $n^*$ as a function of total compute $C$ (Joint Optimization).](/assets/figures/sec3_q3_sigmoid.png "Figure 12. Compute-optimal parallel rollouts $n^*$ as a function of total compute $C$ (Joint Optimization). We sweep all hyperparameters ($n, B_{\\text{problem}}, M$) to find the global optimal configuration at each compute budget. Left (Easy) & Right (Hard): The optimal $n$ increases monotonically with compute, well-fitted by a sigmoid function (dashed black lines). Note that despite the freedom to vary $B_{\\text{problem}}$, the scaling behavior is dominated by $n$, which saturates at a lower value on the Hard set compared to the Easy set."){width=900px}

:::callout_begin type="info":::

1. When jointly optimizing across all hyperparameters ($n$, $B$<sub>problem</sub>, $M$), the compute-optimal value of $n$ still increases with $C$, similar to the findings from Questions 1 & 2.
2. Note the best total rollout size $B$ must generally increase as $C$ increases, though the compute-optimal value of $B$<sub>problem</sub> can be roughly chosen to be a constant at all compute budgets.
3. Our prescribed workflow suggests tuning $n$ first for a new model or new run, followed by allocating $B$<sub>problem</sub> to a reasonable value and setting $M$ accordingly to the remaining compute. This provides the practical recommendation for users.
:::callout_end:::

---

## The Bigger Picture: Role of the Base Model and the Prompt Set

The recurring takeaway from the analyses above is that **the compute-optimal number of rollouts, $n$, increases with available sampling compute $C$** and eventually saturates as training becomes bottlenecked by other factors. While this conclusion is straightforward, a more interesting observation is that the same qualitative trend appears on both easy and hard datasets. This naturally raises several questions: why does this behavior persist across problem difficulty? Does it extend beyond the single base model considered so far? More broadly, under what interactions between a base model and a prompt distribution should we expect this trend to generalize? In the remainder of this section, we address these questions using a combination of conceptual arguments and empirical evidence. We begin by studying an “idealized” setting of training on a single problem, examine when predictions from the one-prompt case break down, and finally analyze how interactions of the base model and prompt set deviations from this ideal behavior.

### Base Case: Only One Training Problem

To build a conceptual model, let us study the simplest setting where we are provided with *one single problem* in the training set. We model this setting as a simple multi-armed bandit problem, where each arm represents one possible response to the problem. We assume training of a tabular softmax policy (i.e., softmax on independently represented logits denoting the response). Please see this for [setup](https://arxiv.org/abs/2402.17235).

Now let’s say that the base model attains an average pass@1 rate of *p* on this prompt and say $n$ i.i.d.  response samples drawn from the policy are used for training at one gradient step. First note that $n$ independent samples change pass@*n* exponentially: pass@*n* = 1-(1-*p*)*<sup>n</sup>*. Does $n$ change the policy gradient update on the problem in one update? Averaging over $n$ samples does **not** change the expected policy gradient direction: the expected update is identical to that obtained from a single sample. What it does change is the **variance** of the gradient estimate, which decreases by a factor $n$. Prior work shows that, when using a single sample per update, tabular (stochastic) softmax policy gradient enjoys an *O*(1/*t*) rate on the policy suboptimality (i.e., bound on optimal performance - attained performance) after *t* update steps. When $n$ independent samples are used by averaging over the policy gradient update, repeating the same analysis yields E [ suboptimality at step *t* ]  =  *O* (1 / ($n$ · *t*)), as the convergence rate is still linear in *t*, but the constant (that depends on $n$) now improves. Since the number of update steps *t* corresponds to the number of sequential iterations $M$, while the total sampling compute is $C$ = $n$ × $M$, this implies that in this single-prompt, tabular setting the error depends primarily on the total compute budget $C$. 

In short, in the one-problem setting, ***any allocation of compute between parallel sampling ($n$) and sequential updates ($M$) achieves comparable performance***, when their product is fixed.

### Extending to Multiple Training Problems with Different Base Models

While the theoretical argument above paints a simple picture for resource allocation, several nuances arise when extending this tabular analysis to a base model trained on a problem set of multiple problems. We discuss these nuances next.

**1) Training on multiple problems.** The guarantee above that $n$ (rollouts per problem) and $M$ (sequential iterations) are interchangeable for a single problem relies on a tabular setting in which updates on one problem do not affect any others. In this regime, learning rates can be adjusted to account for batch size $B$<sub>problem</sub>, and training on the smallest $B$<sub>problem</sub> to maximize $n$ is the most beneficial. However, this is clearly not the case in practice. While scaling $n$ takes precedence in Questions 2 & 3, we do observe that on hard datasets, there is a minimal value of $B$<sub>problem</sub> that is needed to make progress on the validation score. Empirically, this leads to an optimal value of $B$<sub>problem</sub> that is not too large (and of course, not too small).

We attribute this effect to [interference](https://www.notion.so/IsoFLOPs-Playbook-Workflows-for-Scaling-Sampling-FLOPs-for-RL-Training-of-LLMs-29f1951bd76780c58c96f3c07103e974?pvs=21) across problems. When multiple problems are trained jointly, updates interfere, meaning that different problems are learned at different rates. This causes overall progress to slow relative to the single problem setting. In this regime, allocating compute to larger values of $n$ is preferable to increasing $M$, since higher rollout counts enable more uniform updates across problems within each iteration. This shifts the balance toward parallel sampling rather than sequential iterations, mitigating interference and improving overall learning efficiency.

**2) Incorporating a base model.** We now incorporate the role of a base model. The tabular analysis above ignores representation learning and treats the base model only through its initial success rate on a problem. In the single-problem setting, the only relevant statistic is the base model’s pass@1. As long as this pass rate is non-zero, the *O*(1/*t*) convergence guarantee applies. If the pass rate is zero, exploration must be explicitly addressed to ensure that at least one correct rollout can be sampled. This raises a question for the multi-problem setting: what statistic sufficiently captures the role of the base model when training with RL? 

**A mental model of interference.** A natural choice is the distribution of pass@1 across prompts. This statistic is sufficient in the tabular regime and also underlies [inference-time scaling laws](https://arxiv.org/abs/2502.17578) that relate pass@*n* at a population level to the pass@1 distribution. However, in RL the model also learns from the $n$ rollouts it produces, and this static statistic no longer fully characterizes training dynamics. This is because updates across multiple problems introduce interference, which inference-only scaling does not face. A useful mental model is that interference is minimized and updates are closed to tabular when learning happens in a fashion that is roughly distributed uniformly across prompts. From this perspective, changes in the pass@1 distribution over training can act as a diagnostic for interference. When the distribution improves approximately uniformly, then interference is relatively controlled; when improvements are highly uneven, stronger interference effects are present and we might observe a rich-gets-richer phenomenon. In our early experiments, we observe roughly uniform improvements in pass@1 across problems with the base model we study (Qwen2.5-Instruct). On the Hard set, we observed uniform improvement on a narrow subset of hard problems, and no improvement on the others. As a result, any difference in performance are primarily driven by absolute pass@*n* values, leading to distinct underlying trends (coverage vs sharpening) on Hard and Easy sets in Question 1. Despite these differences, both problem sets ultimately exhibit the same scaling law. 

**We also evaluate whether our scaling conclusions extend to other datasets.** To understand if interference makes prediction infeasible on some datasets, we train on several Heterogeneous mixtures of Easy and Hard problems (Figure 13), as well as on an “extra hard” set consisting of problems on which the base model attains an empirical pass@128 of 0. These mixtures induce different degrees of dataset skew, which we expect to affect the rate at which pass@1 improves during training (a smaller $n$ is likely to now improve pass@1 more on easier problems in the subset resulting in more interference, while a larger $n$ should somewhat alleviate this issue). Despite this variation, Figure 13 reveals a **consistent crossover trend:** beyond a dataset-dependent compute threshold, larger values of $n$ outperform smaller ones across most validation sets. On particularly hard validation sets, larger $n$ often dominates almost entirely, or the range of compute over which smaller $n$ is optimal shrinks substantially. This behavior aligns with our findings from Question 1 and suggests that the rate of pass@1 improvement controls both the width of the compute range over which a given $n$ is optimal and the minimum compute-optimal value of $n$. **Crucially, our central takeaway remains unchanged:** larger compute budgets $C$ consistently support larger compute-optimal values of $n$, even across diverse and highly skewed dataset mixtures.

![Figure 13.](/assets/figures/sec4_skewed_data_dist.png "Figure 13: Results across difficulty levels for small ($n$ = 8) and large ($n$ = 64) budgets under different training data distributions (each with 5K total samples) using Qwen2.5-7B-Instruct. Data Definitions: Hard (pass@128=0), Easy (pass@128 ∈ [0.3, 0.6]), and Very Easy (pass@128 ∈ [0.6, 0.9]). Training Settings: Row 1: Hard Only (100% Hard); Row 2: Dual Mix (50% Hard, 50% Easy); Row 3: Tri Mix (50% Hard, 25% Easy, 25% Very Easy, i.e., the J-shaped distribution recommended in [Polaris](https://www.notion.so/1dfa954ff7c38094923ec7772bf447a1?pvs=21)). On each data distribution, we observe a consistent trend that larger $n$ performs better at higher compute in in-domain evaluations, except for the very easy eval (Column 3). This task is likely so easy that added sequential or parallel compute does not make much difference in learning. Putting it all together, we see that training on all hard problems causes significant catastrophic forgetting on (very) easy problems, where the model could have decent pass rates, likely due to large distribution shift. When mixing easy problems in training, the catastrophic forgetting is largely mitigated on both easy and very easy problems, in exchange for a slight drop (~2%) on hard problems. A notable phenomenon is that mixing very easy problems (Row 3) doesn’t even help the in-domain very easy evaluation set, and degrades both easy and hard performance (compare with Row 2). These indicate: (1) if the focus is only on improving hard problem performance, it helps to train on all hard data; (2) otherwise, mixing easy data largely helps maintain the model’s capability, but very easy data are not useful."){width=900px}

Of course, interference does depend on the choice of the base model, and indeed we see that ***different base models may respond to interference in qualitatively different ways.*** While we did observe that some models, such as Qwen2.5-7B-Instruct, made roughly uniform progress across problems on the easy set (or on a subset of problems in the hard set), we found that other models such as Llama3.1-8B-Instruct did not. This heterogeneity affects how increasing $n$ influences per-prompt optimization dynamics and, in turn, shifts the range of $n$ values that appear compute-optimal in practice. For instance, as shown in Figure 14, although a larger $n$ = 16 outperforms $n$ = 8 at higher compute budgets, the compute-optimal $n$ for Llama3.1-8B-Instruct is substantially smaller than that of Qwen2.5-7B-Instruct. Notably, the training reward for Llama3.1 plateaus at $n$ = 128, suggesting the model struggles to effectively optimize for a high degree of parallel rollouts. We further experiment on Qwen3-4B-Instruct (Figure 15) and observe larger $n$ = 64 yields better results than $n$ = 8. While the validation reward ceases to rise at $n$ = 128, the training reward continues to rise at high compute. Thus, the degradation on the validation set is likely attributable to a train-test gap, which we investigate in the subsequent section.

![Figure 14: Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set](/assets/figures/sec4_llama_easy.png "Figure 14: Compute-optimal frontiers for Llama3.1-8B-Instruct on the Easy set (initial pass rate 0.3–0.6) for different values of $n$. While $n = 16$ outperforms $n = 8$ at higher compute budgets, further increasing $n$ to $128$ degrades both training and validation performance, indicating optimization difficulties at large $n$."){width=900px}

![Figure 15: Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set](/assets/figures/sec4_qwen3_easy.png "Figure 15: Compute-optimal frontiers for Qwen3-4B-Instruct on the Easy set (initial pass rate 0.3–0.6) for different values of $n$. Larger $n$ values, such as $n = 64$, outperform smaller ones (e.g., $n = 8$) at higher compute. Notably, training rewards for $n = 128$ remain high and in fact, $n=128$ appears on the compute-optimal frontier after a considerable amount of compute has been spent (right), but it falls below the compute-optimal frontier on the validation set (left). This is due to early overfitting before the benefits of larger $n$ can be realized and highlights a clear train–test gap."){width=900px}

**3) Train-test gap.** Finally, our scaling results are reported on validation metrics, even though optimization dynamics are primarily driven by the training set composition. As a result, the emergence of scaling laws on the validation set depends on sustained transfer of performance from the training to the test set, which is not guaranteed. For instance, when the prompt set is too small, training may overfit prematurely within a fixed number of gradient steps. In such cases, larger values of $n$ may no longer appear compute-optimal at higher compute budgets, simply because additional training beyond some number of training steps fails to improve test-set performance (see Figure 13 as an example, where $n$ = 128 is never compute-optimal). 

When overfitting dominates, scaling laws may only hold for certain ranges of hyperparameters that avoid the overfitting regime, but naively plotting scaling trends using our workflow above will result in incorrect conclusions. To illustrate this, we run training with different prompt set sizes, including sets substantially smaller than the default size of 6,000 problems used above. We observe that the compute-optimal values of $n$ cap out at much smaller levels when the prompt set is smaller. This behavior is expected, as validation performance begins to degrade with additional training compute in the small-prompt regime due to overfitting, meaning that there is no way for larger $n$ values to achieve the frontier. As discussed above, this also justifies the sigmoid shape of the hypothesized relationship between *n*\\*($C$) and $C$ in Figure 6. 

Technically, we can also plot compute-optimal scaling laws for training performance instead of validation in the hope that compute-optimal hyperparameter configurations for best training rewards also results in best validation performance. We find evidence to the contrary as in many cases  training runs with smaller values of $n$ (keeping $B$<sub>problem</sub> fixed) result in better training rewards for the same amount of total training compute spent (see Figure 16). While this result appears contradictory at first, ***it is perhaps expected as training reward (in our logging scheme) logs rewards on samples that were used for training: hence, logging statistics on this set results in a natural bias.*** More mechanistically, on the training set: 1) RL runs with smaller values of $n$ are able to epoch faster on the training problems for the same amount of sampling compute as runs with larger values of $n$; and 2) when we run RL with small values of $n$  then we are able to improve training performance quickly on easy problems without making any progress on the hard ones, which means that the total training performance is dominated by only one set of the data (easy problems), which rightly does not reflect in good validation performance. 

![Figure 16: Impact of data size ($D$) on compute-optimal frontiers for Qwen2.5-7B-Instruct (easy set).](/assets/figures/sec3_varyD.png "Figure 16: Impact of data size ($D$) on compute-optimal frontiers for Qwen2.5-7B-Instruct (easy set). With a larger dataset ($D$=6k), we continues to improve with more parallel rollouts ($n$ = 512; ***left***). With a smaller dataset ($D$=500), performance peaks at $n$ = 256, and a larger $n$ leads to degradation ($n$ = 256)."){width=900px}

:::callout_begin type="info" title="Key Takeaways:":::

1. While sequential and parallel computation are perfectly interchangeable in a tabular setting, interference across problems prevents a perfect exchange in practical LLM training. As a result, allocating compute toward parallel sampling to achieve a roughly uniform rate of improvement across training problems is often preferable to more sequential training iterations.
2. Although different base models exhibit different levels of interference on different problem sets, we observe similar scaling rules for how compute should be allocated to the number of parallel rollouts across different prompt set combinations and base models, although the underlying causes of those scaling trends are different. 
3. The size of the training problem set manifests as a train–test gap: when the training set is small, validation performance saturates early. This leads to lower saturation values for $n$ and $M$, and correspondingly higher optimal values of $B$<sub>problem</sub>.
:::callout_end:::

---

## Discussion, Summary, and Future Work

A central takeaway from this work is that **healthy RL recipes are inherently dependent on the prompt distribution and the behavior of RL training depends on the interaction between the base model and the prompt set**, and that this dependence manifests directly in how optimal hyperparameters scale with compute. The same algorithm can exhibit qualitatively different scaling behavior on easy versus hard problem sets. On easier problems, increasing parallel rollout compute primarily improves sharpening and robustness, whereas on harder problems the dominant effect is expanded coverage. While trends in compute-optimal hyperparameters are often consistent when measured using average reward, they can diverge substantially under alternative metrics such as best@k and worst@k. This sensitivity to both data difficulty and evaluation metric highlights a key departure from supervised learning, where scaling behavior is typically more uniform once the model size is fixed. In RL, scaling laws are therefore inherently more nuanced and conditional, reflecting the coupled effects of optimization dynamics, exploration, task structure, and evaluation criteria. This study provides a concrete framework for identifying and reasoning about these trends in specific base-model and prompt-set settings, and empirically illustrates them across several representative regimes.

Our analysis also surfaces an important open challenge for future work: **interference across problems**. In an idealized single-problem setting, one might expect clean exponential improvements with increasing sampling compute. In practice, however, RL is performed over mixtures of problems, where progress on some tasks can interfere with learning on others. This population-level interference alters both the coefficients and effective hyperparameter values in observed scaling laws.

A promising direction is to identify sufficient statistics early in training that capture the degree of interference across problems, enabling more accurate predictions of how additional compute will translate into subsequent learning progress. We believe that tracking changes in the pass@1 distribution over the course of training provides a natural starting point for studying interference. Developing such models would be a critical step toward predictive scaling laws for RL on heterogeneous data mixtures. Mathematically, this points toward approximate closed-form rules for compute-optimal hyperparameters that generalize across base models and prompt distributions by estimating a small number of statistics that summarize the pass@1 landscape and incorporating them into scaling-law fits. This remains an interesting direction for future work.

[^cite-2509]: Prior work on RL scaling behavior vs pre-training model size. https://arxiv.org/abs/2509.25300
[^kaplan-2001]: Kaplan et al., "Scaling Laws for Neural Language Models." https://arxiv.org/abs/2001.08361
[^chinchilla-2203]: Hoffmann et al., "Training Compute-Optimal Large Language Models" (Chinchilla). https://arxiv.org/abs/2203.15556
[^deep-rl-2104]: Deep RL scaling-law style analyses in classical RL settings. https://arxiv.org/abs/2104.03113
[^value-scaling]: "Value Scaling" (collection of scaling-law results/notes for RL). https://value-scaling.github.io/
[^deep-rl-2301]: Additional work on scaling behavior in (deep) RL settings. https://arxiv.org/abs/2301.13442
[^rl-sigmoid-2510]: Prior results showing sigmoidal reward curves in LLM-RL under a fixed problem mixture. https://arxiv.org/abs/2510.13786
[^record-breaking]: Why record-breaking points are enough: if we assume the learning curve is (approximately) monotone in compute but noisy, then only *new maxima* constrain any monotone fit—the intermediate points below the running maximum are redundant for determining the upper envelope/frontier. Bucketizing reward into coarse bins further reduces sensitivity to tiny fluctuations and logging noise; selecting the first point where the bucket increases is a stable way to pick representative “frontier updates” along the run. Fitting on these record-breaking points therefore preserves the same practical frontier as fitting on all points, while greatly reducing sample count and making the monotone regression numerically more stable.
`;
export {
  Markdown as M,
  Seo as S,
  ScrollMeter as a,
  text as t
};
