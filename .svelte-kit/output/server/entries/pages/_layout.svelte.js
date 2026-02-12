import { c as create_ssr_component, b as subscribe, e as escape, d as each, f as add_attribute, g as null_to_empty, v as validate_component } from "../../chunks/ssr.js";
import { b as base } from "../../chunks/paths.js";
import { p as page } from "../../chunks/stores.js";
const css$1 = {
  code: '.header-inner.svelte-1j41yyi.svelte-1j41yyi{max-width:var(--md-main-col, 760px);margin-left:auto;margin-right:auto}.title-font.svelte-1j41yyi.svelte-1j41yyi{font-family:"Iowan Old Style BT", "Iowan Old Style", "Palatino Linotype", Palatino, serif}.meta.svelte-1j41yyi.svelte-1j41yyi{font-size:16px;line-height:1.55}.authors.svelte-1j41yyi.svelte-1j41yyi{font-size:16px;line-height:2.0;text-align:center}.author.svelte-1j41yyi.svelte-1j41yyi{display:inline-flex;align-items:baseline;gap:1px;margin-right:8px;margin-bottom:4px;white-space:nowrap}.author-name.svelte-1j41yyi.svelte-1j41yyi{line-height:1.4}.affil-sup.svelte-1j41yyi.svelte-1j41yyi{display:inline-flex;align-items:flex-start;gap:0px;margin-left:0px;transform:translateY(0px)}.affil-sup.svelte-1j41yyi .affil-logo.svelte-1j41yyi{margin-left:0px}.affil-sup-text.svelte-1j41yyi.svelte-1j41yyi{font-size:15px;line-height:1;margin-left:0px;white-space:nowrap;position:relative;top:8px}.affil-sup.svelte-1j41yyi .affil-dot.svelte-1j41yyi{position:relative;margin-left:0px;top:8px}.affil-logo.svelte-1j41yyi.svelte-1j41yyi{height:16px;width:auto;vertical-align:middle;margin-left:1px}.affil-logo--mbzuai.svelte-1j41yyi.svelte-1j41yyi{height:20px}.affil-logo--cmu.svelte-1j41yyi.svelte-1j41yyi{height:23px}.affil-logo--harvard.svelte-1j41yyi.svelte-1j41yyi{height:18px}.affil-logo--legend.svelte-1j41yyi.svelte-1j41yyi{height:22px;margin-right:8px}.affil-dot.svelte-1j41yyi.svelte-1j41yyi{width:7px;height:7px;border-radius:999px;border:1.5px solid #111827;background:transparent;display:inline-block;vertical-align:middle;margin-left:2px;margin-right:4px}.affiliation-line.svelte-1j41yyi .affil-dot.svelte-1j41yyi{position:relative;top:-6px}.affil-fallback.svelte-1j41yyi.svelte-1j41yyi{font-size:12px;color:#6b7280;margin-left:4px}.affiliations.svelte-1j41yyi.svelte-1j41yyi{margin-top:10px;color:#111827;opacity:0.9;text-align:center}.affiliation-line.svelte-1j41yyi.svelte-1j41yyi{display:inline-flex;align-items:center;gap:4px;justify-content:center;width:100%}.affiliation-item.svelte-1j41yyi.svelte-1j41yyi{display:inline-flex;align-items:center;gap:4px}.affiliation-sep.svelte-1j41yyi.svelte-1j41yyi{margin:0 4px}.affiliation-line.svelte-1j41yyi.svelte-1j41yyi{margin-top:2px}.date.svelte-1j41yyi.svelte-1j41yyi{margin-top:10px;color:#111827;opacity:0.9}@media(max-width: 580px){.meta.svelte-1j41yyi.svelte-1j41yyi{font-size:15px}}',
  map: null
};
const internshipLine = "Work done during internship at MBZUAI-IFM";
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let authorData;
  let authorList;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  var _a;
  const logoMap = {
    ucsd: {
      src: "/assets/figures/ucsd.png",
      alt: "UC San Diego"
    },
    mbzuai: {
      src: "/assets/figures/mbzuai.png",
      alt: "MBZUAI-IFM"
    },
    cmu: {
      src: "/assets/figures/cmu.png",
      alt: "Carnegie Mellon University"
    },
    harvard: {
      src: "/assets/figures/harvard.svg",
      alt: "Harvard University"
    }
  };
  const affiliationLogoMap = {
    "UC San Diego": logoMap.ucsd,
    "MBZUAI-IFM": logoMap.mbzuai,
    "Carnegie Mellon University": logoMap.cmu,
    "Harvard University": logoMap.harvard
  };
  const isAuthorEntry = (a) => !!a && typeof a === "object" && "name" in a;
  const stripEqualStar = (name) => name.replace(/\*+$/, "").trim();
  const hasEqualStar = (name) => /\*$/.test(name);
  $$result.css.add(css$1);
  authorData = (_a = $page.data.header) === null || _a === void 0 ? void 0 : _a.authors;
  authorList = Array.isArray(authorData) && authorData.every(isAuthorEntry) ? authorData : null;
  $$unsubscribe_page();
  return `<header class="layout-xl justify-between items-start" data-sveltekit-noscroll data-sveltekit-preload-code="eager"><div class="header-inner mb-8 svelte-1j41yyi"><h1 class="title-font font-bold text-black text-3xl mb-4 leading-tight svelte-1j41yyi">${escape($page.data.header?.title ?? "RL Excursions during Pre-training: How early is too early for On-policy Learning?")}</h1> <div class="meta text-black svelte-1j41yyi"><div class="authors svelte-1j41yyi">${authorList ? `${each(authorList, (author, i) => {
    return `<span class="author svelte-1j41yyi"><span class="author-name svelte-1j41yyi">${escape(stripEqualStar(author.name))}</span> ${author.affils ? (() => {
      let nonHarvardAffils = author.affils.filter((a) => a !== "harvard");
      return ` ${nonHarvardAffils.length > 0 || hasEqualStar(author.name) ? `<sup class="affil-sup svelte-1j41yyi">${each(nonHarvardAffils, (key, j) => {
        return `${logoMap[key] ? `<img${add_attribute("src", base + logoMap[key].src, 0)}${add_attribute("alt", logoMap[key].alt, 0)}${add_attribute("title", logoMap[key].alt, 0)} class="${escape(null_to_empty(`affil-logo ${key === "mbzuai" ? "affil-logo--mbzuai" : ""} ${key === "cmu" ? "affil-logo--cmu" : ""} ${key === "harvard" ? "affil-logo--harvard" : ""}`), true) + " svelte-1j41yyi"}" loading="lazy" decoding="async">` : `${key === "intern" ? `<span class="affil-dot svelte-1j41yyi"${add_attribute("title", internshipLine, 0)}${add_attribute("aria-label", internshipLine, 0)}></span>` : `<span class="affil-fallback svelte-1j41yyi">${escape(key)}</span>`}`}`;
      })} ${hasEqualStar(author.name) ? `<span class="affil-sup-text svelte-1j41yyi" data-svelte-h="svelte-17ywuv4">*</span>` : ``} </sup>` : ``}`;
    })() : ``} </span>`;
  })}` : `${escape($page.data.header?.authors ?? "__AUTHORS__")}`}</div> <div class="affiliations svelte-1j41yyi">${Array.isArray($page.data.header?.affiliations) ? `<div class="affiliation-line svelte-1j41yyi">${each($page.data.header.affiliations, (line, i) => {
    return `<span class="affiliation-item svelte-1j41yyi">${line === internshipLine ? `<span class="affil-dot svelte-1j41yyi" aria-hidden="true"></span>` : `${affiliationLogoMap[line] ? `<img${add_attribute("src", base + affiliationLogoMap[line].src, 0)}${add_attribute("alt", affiliationLogoMap[line].alt, 0)}${add_attribute("title", affiliationLogoMap[line].alt, 0)} class="affil-logo affil-logo--legend svelte-1j41yyi" loading="lazy" decoding="async">` : ``}`} <span>${escape(line)}</span></span> ${i < $page.data.header.affiliations.length - 1 ? `<span class="affiliation-sep svelte-1j41yyi" data-svelte-h="svelte-djw72">, </span>` : ``}`;
  })}</div>` : `${escape($page.data.header?.affiliations ?? "__AFFILIATIONS__")}`}</div> <div class="date svelte-1j41yyi">${escape($page.data.header?.date ?? "__DATE__")}</div></div></div> </header>`;
});
const css = {
  code: ".page-upper-right-inline.svelte-pbnrg0{position:absolute;top:3px;right:16px;display:flex;justify-content:flex-end;pointer-events:none}.page-upper-right.svelte-pbnrg0{width:clamp(220px, 18vw, 320px);height:auto;pointer-events:none}@media(max-width: 720px){.page-upper-right-inline.svelte-pbnrg0{top:4px;right:4px}.page-upper-right.svelte-pbnrg0{width:clamp(140px, 30vw, 220px)}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-yrkxwy_START --><script async src="https://www.googletagmanager.com/gtag/js?id=G-Z1XRQ6ZG3X" data-svelte-h="svelte-1mc97wv"><\/script><script data-svelte-h="svelte-woggic">window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-Z1XRQ6ZG3X", { send_page_view: false });
  <\/script><!-- HEAD_svelte-yrkxwy_END -->`, ""} <div class="page-upper-right-inline svelte-pbnrg0" data-svelte-h="svelte-6nno4e"><img${add_attribute("src", base + "/assets/figures/upper_right_final.png", 0)} alt="Institution logos" class="page-upper-right svelte-pbnrg0" loading="lazy" decoding="async"></div> ${validate_component(Header, "Header").$$render($$result, {}, {}, {})} ${`<main>${slots.default ? slots.default({}) : ``}</main>`} `;
});
export {
  Layout as default
};
