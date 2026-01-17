<script context="module" lang="ts">
  import { marked } from "marked";
  import katex from "katex";
  import "katex/dist/katex.min.css";

  function normalizeFootnoteId(id: string) {
    // Keep in sync with the renderer/link ids; allow common id chars like '-' and '_'.
    return String(id).replace(/[^a-zA-Z0-9\-_]/g, "");
  }

  function renderMath(tex: string, displayMode: boolean) {
    try {
      return katex.renderToString(tex, { throwOnError: false, displayMode });
    } catch {
      const tag = displayMode ? "pre" : "code";
      return `<${tag} class="katex-error">${tex}</${tag}>`;
    }
  }

  const mathBlock = {
    name: "mathBlock",
    level: "block",
    start: (src: string) => src.match(/\$\$/)?.index,
    tokenizer(src: string) {
      const match = /^\$\$([\s\S]+?)\$\$/.exec(src);
      if (match)
        return { type: "mathBlock", raw: match[0], text: match[1].trim() };
    },
    renderer: (token: any) =>
      `<div class="math math-block">${renderMath(token.text, true)}</div>`,
  };

  const mathInline = {
    name: "mathInline",
    level: "inline",
    start: (src: string) => src.match(/\$/)?.index,
    tokenizer(src: string) {
      const match = /^\$([^\$\n]+?)\$/.exec(src);
      if (match)
        return { type: "mathInline", raw: match[0], text: match[1].trim() };
    },
    renderer: (token: any) =>
      `<span class="math math-inline">${renderMath(token.text, false)}</span>`,
  };

  // Notion color text extension: ::color[text]::
  const colorText = {
    name: "colorText",
    level: "inline",
    start: (src: string) => src.match(/::/)?.index,
    tokenizer(src: string) {
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
    renderer: (token: any) => {
      // Notion's default text colors
      const colors: Record<string, string> = {
        gray: "#9B9A97",
        brown: "#64473A",
        orange: "#D9730D",
        yellow: "#DFAB01",
        green: "#0F7B6C",
        blue: "#0B6E99",
        purple: "#6940A5",
        pink: "#AD1A72",
        red: "#E03E3D",
      };
      const color = colors[token.color] || colors.gray;
      // Parse inner Markdown (bold, italic, etc.)
      const innerHtml = marked.parseInline(token.text);
      return `<span style="color: ${color};">${innerHtml}</span>`;
    },
  };

  const customRenderer = {
    link(href: string, title: string | null, text: string) {
      const isInternal = /^(\/|#|[A-Za-z0-9\-_]+(\.html?)?$)/.test(href);
      let out = `<a href="${encodeURI(href)}" class="link"`;
      if (!isInternal)
        out += ` target="_blank" rel="external noopener noreferrer"`;
      if (title) out += ` title="${title}"`;
      out += `>${text}</a>`;
      return out;
    },
    heading(text: string, level: number, raw: string, slugger: any) {
      const id = slugger ? slugger.slug(raw) : slugify(raw || text);
      // Keep plain heading text; the scroll meter will link to #id
      return `<h${level} id="${id}">${text}</h${level}>`;
    },
    blockquote(quote: string) {
      return `<blockquote class="inline-block bg-neutral-50 border-l-4 border-neutral-600 rounded px-3 py-2 align-middle my-2">${quote}</blockquote>`;
    },
    image(href: string, title: string | null, text: string) {
      // Don't render images with placeholder or empty src (avoid 404s)
      if (!href || href === '__IMAGE_PLACEHOLDER__' || href.trim() === '') {
        if (text) {
          // Render caption only if alt text exists
          return `<div class="text-center text-gray-400 italic text-sm my-4">[Image: ${text}]</div>`;
        }
        return '<!-- image placeholder -->';
      }
      // Normal image rendering
      let out = `<img src="${href}" alt="${text || ''}" class="block mx-auto" `;
      if (title) out += `title="${title}" `;
      out += '/>';
      return out;
    },
  };

  function slugify(s: string) {
    return String(s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const imageAttrExtension = {
    name: "imageAttr",
    level: "inline",
    start: (src: string) => src.indexOf("!["),
    tokenizer(src: string) {
      const re = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)\{([^}]+)\}/;
      const match = re.exec(src);
      if (match) {
        const [raw, alt, srcUrl, title, attrStr] = match;
        const attrs: Record<string, string> = {};
        attrStr.split(/\s+/).forEach((tok) => {
          if (!tok) return;
          const eq = tok.indexOf("=");
          if (eq === -1) {
            attrs[tok] = "";
          } else {
            const k = tok.slice(0, eq);
            const v = tok.slice(eq + 1).replace(/^["']|["']$/g, "");
            if (k) attrs[k] = v;
          }
        });
        return { type: "imageAttr", raw, alt, src: srcUrl, title, attrs };
      }
    },
    renderer(token: any) {
      const isVideoSrc = /\.(mp4|webm|ogg)(\?.*)?$/i.test(token.src);
      const declaresVideo =
        token.attrs["type"] === "video" ||
        Object.prototype.hasOwnProperty.call(token.attrs, "video");
      let out = "";
      if (isVideoSrc || declaresVideo) {
        const lower = token.src.toLowerCase();
        const sourceType =
          token.attrs["source-type"] ||
          (lower.endsWith(".webm")
            ? "video/webm"
            : lower.endsWith(".ogg")
              ? "video/ogg"
              : "video/mp4");

        // read optional freeze ms from markdown: {... freeze=10000}
        const freezeMs = token.attrs["freeze"] || "10000";

        out += `<video class="block mx-auto autoplay-on-fullview md-video unselectable" aria-label="${token.alt || ""}" id="fig-${slugify(token.alt || "")}"`;
        const hasPlaysinline = Object.prototype.hasOwnProperty.call(
          token.attrs,
          "playsinline",
        );

        // forward arbitrary attrs except type/video/source-type/freeze/controls
        for (const k in token.attrs) {
          if (
            k === "type" ||
            k === "video" ||
            k === "source-type" ||
            k === "freeze" ||
            k === "controls"
          )
            continue;
          const val = token.attrs[k];
          out += val === "" ? ` ${k}` : ` ${k}="${val}"`;
        }

        // autoplay reliability
        out += " muted playsinline"; // keep muted for autoplay; playsinline for iOS
        if (!hasPlaysinline) out += " playsinline";

        // carry freeze config for runtime
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
    },
  };

  marked.use({
    gfm: true,
    extensions: [imageAttrExtension, mathBlock, mathInline, colorText],
    renderer: customRenderer,
  });
</script>

<script lang="ts">
  import Jumpbox from "./Jumpbox.svelte";
  import TakeawayBox from "./TakeawayBox.svelte";
  import CalloutBox from "./CalloutBox.svelte";
  import FoldBox from "./FoldBox.svelte";

  export let source: string;

  type Footnote = { id: string; safeId: string; num: number; html: string };

  type Chunk =
    | { type: "text"; content: string }
    | { type: "jumpbox"; id: string; label: string }
    | { type: "takeaway"; content: string }
    | { type: "small"; content: string }
    | { type: "callout"; variant: "note" | "tip" | "warning" | "info"; title: string; content: string }
    | { type: "fold"; title: string; open: boolean; content: string };

  // Regexes (global + multiline). We scan by hand using lastIndex.
  const JUMP_RE = /:::jumpbox\s+id="([^"]+)"(?:\s+label="([^"]+)")?\s*:::/gm;
  const TAKE_BEGIN_RE = /:::takeaway_begin:::/gm;
  const TAKE_END_RE = /:::takeaway_end:::/gm;
  const SMALL_BEGIN_RE = /:::small_begin:::/gm;
  const SMALL_END_RE = /:::small_end:::/gm;
  const CALLOUT_BEGIN_RE =
    /:::callout_begin(?:\s+type="([^"]+)")?(?:\s+title="([^"]+)")?\s*:::/gm;
  const CALLOUT_END_RE = /:::callout_end:::/gm;
  const FOLD_BEGIN_RE =
    /:::fold_begin(?:\s+title="([^"]+)")?(?:\s+(open))?\s*:::/gm;
  const FOLD_END_RE = /:::fold_end:::/gm;

  function extractFootnotes(md: string) {
    const lines = md.split("\n");
    const mainLines: string[] = [];
    const footnotes: { id: string; safeId: string; raw: string[] }[] = [];
    let current: { id: string; safeId: string; raw: string[] } | null = null;

    for (const line of lines) {
      const match = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
      if (match) {
        if (current) footnotes.push(current);
        const id = match[1];
        current = { id, safeId: normalizeFootnoteId(id), raw: [match[2]] };
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

    if (current) footnotes.push(current);

    const cleaned = mainLines.join("\n");
    const notes = footnotes.map((fn) => ({
      id: fn.id,
      safeId: fn.safeId,
      html: marked.parse(fn.raw.join("\n"), { smartypants: true }),
    }));

    return { main: cleaned, notes };
  }

  function computeFootnoteNumbering(main: string, notes: { id: string; safeId: string; html: string }[]) {
    // Number by first appearance in the main text.
    const order: string[] = [];
    const seen = new Set<string>();
    const re = /\[\^([^\]]+)\]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(main)) !== null) {
      const safeId = normalizeFootnoteId(m[1]);
      if (!safeId || seen.has(safeId)) continue;
      seen.add(safeId);
      order.push(safeId);
    }

    const noteBySafeId = new Map(notes.map((n) => [n.safeId, n]));
    const numbered: Footnote[] = [];
    const idToNum = new Map<string, number>();
    let next = 1;

    for (const safeId of order) {
      const n = noteBySafeId.get(safeId);
      if (!n) continue;
      idToNum.set(safeId, next);
      numbered.push({ ...n, num: next });
      next += 1;
    }

    // Append any defined-but-unreferenced notes at the end (rare, but keep deterministic).
    for (const n of notes) {
      if (idToNum.has(n.safeId)) continue;
      idToNum.set(n.safeId, next);
      numbered.push({ ...n, num: next });
      next += 1;
    }

    return { idToNum, numbered };
  }

  function replaceFootnoteRefs(md: string, idToNum: Map<string, number>) {
    return md.replace(/\[\^([^\]]+)\]/g, (_m, id) => {
      const safeId = normalizeFootnoteId(id);
      const num = idToNum.get(safeId);
      const label = num ? String(num) : String(id);
      return `<sup class="footnote-ref"><a href="#fn-${safeId}" data-fn="${safeId}">${label}</a></sup>`;
    });
  }

  let processedSource = source;
  let footnotes: Footnote[] = [];

  $: {
    const { main, notes } = extractFootnotes(source || "");
    const { idToNum, numbered } = computeFootnoteNumbering(main, notes);
    processedSource = replaceFootnoteRefs(main, idToNum);
    footnotes = numbered;
  }

  function toHtml(md: string) {
    return marked.parse(md, { smartypants: true });
  }

  // One-pass tokenizer across the whole document
  $: chunks = (() => {
    const out: Chunk[] = [];
    let pos = 0;

    while (pos < source.length) {
      // Find next possible jumpbox or takeaway-begin after pos
      JUMP_RE.lastIndex = pos;
      TAKE_BEGIN_RE.lastIndex = pos;
      SMALL_BEGIN_RE.lastIndex = pos;
      CALLOUT_BEGIN_RE.lastIndex = pos;
      FOLD_BEGIN_RE.lastIndex = pos;

      const j = JUMP_RE.exec(source);
      const t = TAKE_BEGIN_RE.exec(source);
      const s = SMALL_BEGIN_RE.exec(source);
      const c = CALLOUT_BEGIN_RE.exec(source);
      const f = FOLD_BEGIN_RE.exec(source);

      // No more markers → push rest as text and stop
      if (!j && !t && !s && !c && !f) {
        if (pos < processedSource.length)
          out.push({ type: "text", content: processedSource.slice(pos) });
        break;
      }

      // Choose the earliest marker by index
      const j_idx = j ? j.index : Infinity;
      const t_idx = t ? t.index : Infinity;
      const s_idx = s ? s.index : Infinity;
      const c_idx = c ? c.index : Infinity;
      const f_idx = f ? f.index : Infinity;
      const min_idx = Math.min(j_idx, t_idx, s_idx, c_idx, f_idx);

      if (j_idx === min_idx) {
        // Emit pre-text
        if (j_idx > pos)
          out.push({ type: "text", content: processedSource.slice(pos, j_idx) });

        const id = j![1];
        const label = j![2] ?? id;
        out.push({ type: "jumpbox", id, label });

        // Advance past this jumpbox
        pos = JUMP_RE.lastIndex;
      } else if (t_idx === min_idx) {
        // Takeaway begin comes first
        const begin_idx = t!.index;
        const begin_end = begin_idx + t![0].length;

        // Emit pre-text
        if (begin_idx > pos)
          out.push({ type: "text", content: processedSource.slice(pos, begin_idx) });

        // Find matching end after the begin
        TAKE_END_RE.lastIndex = begin_end;
        const tend = TAKE_END_RE.exec(source);

        if (!tend) {
          // No closing marker → treat the begin marker as plain text (no guessing)
          out.push({
            type: "text",
            content: source.slice(begin_idx, begin_end),
          });
          pos = begin_end;
          continue;
        }

        const inner_md = processedSource.slice(begin_end, tend.index).trim();
        out.push({ type: "takeaway", content: inner_md });

        // Advance past the end marker
        pos = TAKE_END_RE.lastIndex;
      } else if (s_idx === min_idx) {
        // Small begin comes first
        const begin_idx = s!.index;
        const begin_end = begin_idx + s![0].length;

        // Emit pre-text
        if (begin_idx > pos)
          out.push({ type: "text", content: processedSource.slice(pos, begin_idx) });

        // Find matching end after the begin
        SMALL_END_RE.lastIndex = begin_end;
        const send = SMALL_END_RE.exec(source);

        if (!send) {
          // No closing marker → treat the begin marker as plain text
          out.push({
            type: "text",
            content: source.slice(begin_idx, begin_end),
          });
          pos = begin_end;
          continue;
        }

        const inner_md = processedSource.slice(begin_end, send.index).trim();
        out.push({ type: "small", content: inner_md });

        // Advance past the end marker
        pos = SMALL_END_RE.lastIndex;
      } else if (c_idx === min_idx) {
        // Callout block
        const begin_idx = c!.index;
        const begin_end = begin_idx + c![0].length;

        if (begin_idx > pos)
          out.push({ type: "text", content: processedSource.slice(pos, begin_idx) });

        CALLOUT_END_RE.lastIndex = begin_end;
        const cend = CALLOUT_END_RE.exec(source);
        if (!cend) {
          out.push({ type: "text", content: source.slice(begin_idx, begin_end) });
          pos = begin_end;
          continue;
        }

        const variantRaw = (c![1] ?? "note").toLowerCase();
        const variant =
          (["note", "tip", "warning", "info"].includes(variantRaw)
            ? variantRaw
            : "note") as any;
        const title = c![2] ?? "";
        const inner_md = processedSource.slice(begin_end, cend.index).trim();
        out.push({ type: "callout", variant, title, content: inner_md });

        pos = CALLOUT_END_RE.lastIndex;
      } else {
        // Fold block
        const begin_idx = f!.index;
        const begin_end = begin_idx + f![0].length;

        if (begin_idx > pos)
          out.push({ type: "text", content: processedSource.slice(pos, begin_idx) });

        FOLD_END_RE.lastIndex = begin_end;
        const fend = FOLD_END_RE.exec(source);
        if (!fend) {
          out.push({ type: "text", content: source.slice(begin_idx, begin_end) });
          pos = begin_end;
          continue;
        }

        const title = f![1] ?? "Details";
        const open = !!f![2];
        const inner_md = processedSource.slice(begin_end, fend.index).trim();
        out.push({ type: "fold", title, open, content: inner_md });

        pos = FOLD_END_RE.lastIndex;
      }
    }

    return out;
  })();

  import { onMount, afterUpdate, onDestroy } from "svelte";

  let container: HTMLDivElement | null = null;
  let footnoteAside: HTMLElement | null = null;
  let footnoteList: HTMLOListElement | null = null;
  let shellEl: HTMLDivElement | null = null;
  let sideMO: MutationObserver | null = null;
  // Side column visibility is controlled by the TOC (ScrollMeter) via
  // `document.documentElement.dataset.sidecols` + the `sidecolschange` event.

  let alignRaf: number | null = null;
  let alignRO: ResizeObserver | null = null;
  let sideRO: ResizeObserver | null = null;

  function scheduleAlign() {
    if (alignRaf !== null) return;
    alignRaf = requestAnimationFrame(() => {
      alignRaf = null;
      alignFootnotes();
    });
  }

  function updateSideVisibility() {
    if (!shellEl || !container || typeof window === "undefined") return;
    const root = document.documentElement;
    const sideFromToc = root?.dataset?.sidecols;
    if (sideFromToc === "on" || sideFromToc === "off") {
      shellEl.dataset.side = sideFromToc;
      return;
    }
    // If the TOC hasn't published visibility yet, don't override the current state.
    // We'll sync on the next `sidecolschange` event / resize / update.
    return;
  }

  function alignFootnotes() {
    if (!container || !footnoteAside || !footnoteList) return;
    if (shellEl?.dataset.side === "off") return;
    const refs = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(".footnote-ref a[data-fn]"),
    );
    if (!refs.length) return;

    const items = new Map<string, HTMLLIElement>();
    footnoteAside
      .querySelectorAll<HTMLLIElement>("li[id^='fn-']")
      .forEach((li) => items.set(li.id.replace(/^fn-/, ""), li));

    const listRect = footnoteList.getBoundingClientRect();
    const footnoteStyles = getComputedStyle(footnoteAside);
    const fontSize = parseFloat(footnoteStyles.fontSize || "14");
    const lineHeightRaw = footnoteStyles.lineHeight;
    const lineHeight =
      lineHeightRaw === "normal"
        ? fontSize * 1.6
        : parseFloat(lineHeightRaw || String(fontSize * 1.6));
    const used = new Set<string>();

    // Collect desired positions first, then resolve overlaps (citations close together).
    const entries: { id: string; li: HTMLLIElement; desiredTop: number; height: number }[] =
      [];

    // Position each footnote at the same vertical line as its reference
    for (const ref of refs) {
      const id = ref.dataset.fn;
      if (!id || used.has(id)) continue;
      const li = items.get(id);
      if (!li) continue;
      used.add(id);

      // The ref is rendered as a <sup> (see renderer), so its own rect is *not*
      // representative of the containing text line. Use a collapsed Range to
      // obtain the actual line box at the ref position.
      const supEl = ref.closest("sup.footnote-ref") as HTMLElement | null;
      const anchorEl = supEl ?? ref;
      let lineRect: DOMRect | null = null;
      try {
        const range = document.createRange();
        range.setStartBefore(anchorEl);
        range.collapse(true);
        const rects = range.getClientRects();
        if (rects && rects.length) lineRect = rects[rects.length - 1] as DOMRect;
      } catch {
        // ignore; fallback below
      }
      if (!lineRect) lineRect = anchorEl.getBoundingClientRect();

      // `li` is absolutely positioned *inside* the <ol>, so convert viewport Y → <ol>-local Y.
      const lineMidY = lineRect.top + lineRect.height / 2;
      const desiredTop = lineMidY - lineHeight / 2 - listRect.top;

      // Stage for measurement; final placement happens after overlap resolution.
      li.style.position = "absolute";
      li.style.top = `0px`;
      li.style.marginTop = "0px";
      entries.push({ id, li, desiredTop, height: 0 });
    }

    if (entries.length) {
      // Measure heights after we've ensured absolute positioning.
      for (const e of entries) {
        e.height = e.li.getBoundingClientRect().height || lineHeight;
      }

      // Resolve overlaps by pushing down later notes.
      entries.sort((a, b) => a.desiredTop - b.desiredTop);
      const gapVar = getComputedStyle(document.documentElement).getPropertyValue(
        "--footnote-item-gap",
      );
      const gap = Math.max(0, Math.round(parseFloat(gapVar || "28") || 28)); // px between notes
      let prevBottom = -Infinity;
      for (const e of entries) {
        const top = Math.max(e.desiredTop, prevBottom + gap);
        e.li.style.top = `${Math.round(top)}px`;
        prevBottom = top + e.height;
      }

      // Ensure the <ol> is tall enough so pushed-down notes don't get clipped.
      const needed = Math.ceil(prevBottom + 12);
      const current = footnoteList.getBoundingClientRect().height;
      footnoteList.style.minHeight = `${Math.max(needed, Math.ceil(current))}px`;
    }

    // Mark as aligned to avoid initial "jump" while fonts/layout are settling.
    if (shellEl) shellEl.dataset.fnAligned = "1";
  }

  function setupVideos(root: HTMLElement) {
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("video.autoplay-on-fullview"),
    );

    // De-dup if we re-run on updates
    const fresh = videos.filter((v) => !v.dataset._wired);

    if (fresh.length === 0) return;

    // Hover controls (desktop), keep hidden otherwise
    for (const v of fresh) {
      v.controls = false; // hidden by default
      v.dataset._wired = "1";

      let is_touch = false;
      const onFirstTouch = () => {
        is_touch = true;
        window.removeEventListener("touchstart", onFirstTouch);
      };
      window.addEventListener("touchstart", onFirstTouch, {
        passive: true,
        once: true,
      });

      const show = () => {
        if (!is_touch) v.controls = true;
      };
      const hide = () => {
        if (!is_touch) v.controls = false;
      };
      v.addEventListener("mouseenter", show);
      v.addEventListener("mouseleave", hide);
      v.addEventListener("focus", show);
      v.addEventListener("blur", hide);

      // Freeze at end → wait → restart
      let restart_timer: number | null = null;
      const clearTimer = () => {
        if (restart_timer !== null) {
          window.clearTimeout(restart_timer);
          restart_timer = null;
        }
      };

      const onEnded = () => {
        const freeze_ms = parseInt(v.dataset.freezeMs || "10000", 10);
        clearTimer();
        // Last frame remains visible when paused after 'ended'
        restart_timer = window.setTimeout(() => {
          try {
            v.currentTime = 0;
          } catch {}
          const p = v.play();
          if (p && typeof (p as any).catch === "function")
            (p as any).catch(() => {});
        }, freeze_ms);
      };

      const cancelers = ["play", "pause", "seeking", "emptied", "abort"].map(
        (evt) => v.addEventListener(evt, clearTimer),
      );
      v.addEventListener("ended", onEnded);

      // Store cleanup hooks
      (v as any)._cleanupVideo = () => {
        v.removeEventListener("mouseenter", show);
        v.removeEventListener("mouseleave", hide);
        v.removeEventListener("focus", show);
        v.removeEventListener("blur", hide);
        v.removeEventListener("ended", onEnded);
        clearTimer();
      };
    }

    // IntersectionObserver for full-visibility autoplay
    // Create once and stash it; reuse across updates.
    if (!(setupVideos as any)._io) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const v = entry.target as HTMLVideoElement;
            // cancel pending restart if visibility changed
            const clear = (v as any)._clearRestartTimer as
              | (() => void)
              | undefined;
            if (clear) clear();

            if (entry.intersectionRatio >= 1.0) {
              const p = v.play();
              if (p && typeof (p as any).catch === "function")
                (p as any).catch(() => {});
            } else {
              v.pause();
            }
          }
        },
        { threshold: 1.0 },
      );

      (setupVideos as any)._io = io;
    }

    const io: IntersectionObserver = (setupVideos as any)._io;
    fresh.forEach((v) => io.observe(v));
  }

  function makeCodeBlocksCopyable(root: HTMLElement) {
    const blocks = Array.from(root.querySelectorAll('pre > code')) as HTMLElement[];

    for (const code of blocks) {
      const pre = code.parentElement as HTMLElement;
      if (!pre || pre.dataset.copyable) continue; // don’t duplicate

      pre.dataset.copyable = 'true';
      pre.style.position = 'relative';

      // Build button
      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.className = 'copy-btn';
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.textContent = 'Copied!';
          setTimeout(() => (button.textContent = 'Copy'), 1500);
        } catch {
          button.textContent = 'Error';
          setTimeout(() => (button.textContent = 'Copy'), 1500);
        }
      });

      pre.appendChild(button);
    }
  }

  onMount(() => {
    if (container) {
      setupVideos(container);
      makeCodeBlocksCopyable(container);
      updateSideVisibility();
      scheduleAlign();
      // Recompute once after layout settles (grid, fonts, etc.)
      requestAnimationFrame(() => updateSideVisibility());
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", scheduleAlign, { passive: true });
      window.addEventListener("resize", updateSideVisibility, { passive: true });
      // Sync footnotes visibility to TOC visibility changes (dataset updates)
      // even when the change doesn't trigger a resize.
      window.addEventListener("sidecolschange", updateSideVisibility as any, {
        passive: true,
      } as any);

      // Extra safety: observe dataset changes directly, in case an event is missed.
      if ("MutationObserver" in window) {
        const root = document.documentElement;
        sideMO = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === "attributes" && m.attributeName === "data-sidecols") {
              updateSideVisibility();
              break;
            }
          }
        });
        sideMO.observe(root, { attributes: true, attributeFilter: ["data-sidecols"] });
      }
    }

    // Re-align when layout changes (fonts load, images settle, markdown reflows).
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      alignRO = new ResizeObserver(() => scheduleAlign());
      if (container) alignRO.observe(container);
      if (footnoteAside) alignRO.observe(footnoteAside);
    }
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      sideRO = new ResizeObserver(() => updateSideVisibility());
      if (container) sideRO.observe(container);
    }
    // Fonts loading often causes a delayed reflow without a resize event.
    const fonts = (document as any).fonts;
    if (fonts?.ready && typeof fonts.ready.then === "function") {
      fonts.ready.then(() => {
        updateSideVisibility();
        scheduleAlign();
      });
    }
  });

  afterUpdate(() => {
    if (container) {
      setupVideos(container); // handle markdown re-render
      makeCodeBlocksCopyable(container);
      updateSideVisibility();
      scheduleAlign();
    }
  });

  onDestroy(() => {
    if (!(setupVideos as any)._io) return;
    const io: IntersectionObserver = (setupVideos as any)._io;
    if (!container) return;
    container.querySelectorAll("video.autoplay-on-fullview").forEach((v) => {
      io.unobserve(v);
      const cleanup = (v as any)._cleanupVideo;
      if (cleanup) cleanup();
    });
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", scheduleAlign);
      window.removeEventListener("resize", updateSideVisibility);
      window.removeEventListener("sidecolschange", updateSideVisibility as any);
    }
    if (sideMO) {
      sideMO.disconnect();
      sideMO = null;
    }
    if (alignRO) alignRO.disconnect();
    if (sideRO) sideRO.disconnect();
  });
</script>

<div class="md-shell" bind:this={shellEl}>
  <div class="md-grid">
    <div class="md-output space-y-6" bind:this={container}>
      {#each chunks as chunk, i (i)}
        {#if chunk.type === "text"}
          <div class="md-output">{@html toHtml(chunk.content)}</div>
        {:else if chunk.type === "jumpbox"}
          <Jumpbox id={chunk.id} label={chunk.label} />
        {:else if chunk.type === "takeaway"}
          <TakeawayBox html={toHtml(chunk.content)} />
        {:else if chunk.type === "small"}
          <div class="md-output text-sm sm-block">{@html toHtml(chunk.content)}</div>
        {:else if chunk.type === "callout"}
          <CalloutBox
            variant={chunk.variant}
            title={chunk.title}
            html={toHtml(chunk.content)}
          />
        {:else if chunk.type === "fold"}
          <FoldBox title={chunk.title} open={chunk.open} html={toHtml(chunk.content)} />
        {/if}
      {/each}
    </div>

    {#if footnotes.length}
      <aside class="md-footnotes" bind:this={footnoteAside} aria-label="Footnotes">
        <ol bind:this={footnoteList}>
          {#each footnotes as fn}
            <li id={`fn-${fn.safeId}`} title={fn.id}>
              <span class="fn-label">{fn.num}</span>
              <span class="fn-text">{@html fn.html}</span>
            </li>
          {/each}
        </ol>
      </aside>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(.md-output h1) {
    @apply text-3xl font-bold mt-6 mb-4;
  }
  :global(.md-output h2) {
    @apply text-2xl font-semibold mt-5 mb-3;
  }
  :global(.md-output h3) {
    @apply text-xl font-semibold mt-4 mb-2;
  }
  :global(.md-output h4) {
    @apply text-lg font-semibold mt-3 mb-2;
  }

  :global(.md-output p) {
    @apply mb-4;
  }
  :global(.md-output strong) {
    @apply font-semibold;
  }
  :global(.md-output em) {
    @apply italic;
  }
  :global(.md-output code) {
    @apply text-[95%] bg-neutral-100 px-1 rounded;
  }

  :global(.md-output pre) {
    @apply bg-neutral-100 p-4 rounded overflow-x-auto mb-4;
  }

  :global(.md-output ul) {
    @apply list-disc list-outside ml-5 pl-5 mb-4 space-y-1;
  }
  :global(.md-output ol) {
    @apply list-decimal list-outside ml-5 pl-5 mb-4 space-y-1;
  }

  :global(.md-output li) {
    @apply mb-1;
  }

  :global(.math-block) {
    @apply my-4 text-center;
  }
  :global(.math-inline) {
    @apply align-baseline;
  }
  :global(.katex-error) {
    @apply text-red-600 bg-red-100 p-1 rounded;
  }
  :global(.md-output blockquote) {
    @apply inline-block align-middle bg-neutral-50 rounded px-3 py-2 my-2 border-l-4 border-neutral-600;
  }
  :global(.md-output blockquote > :first-child) {
    @apply mt-0;
  }
  :global(.md-output blockquote > :last-child) {
    @apply mb-0;
  }
  /* Small-section overrides: drop each heading one step inside .sm-block */
  /* :global(.sm-block) { font-size: 0.875rem; } */
  :global(.sm-block h1) { @apply text-2xl font-bold mt-6 mb-4; }
  :global(.sm-block h2) { @apply text-xl font-semibold mt-5 mb-3; }
  :global(.sm-block h3) { @apply text-lg font-semibold mt-4 mb-2; }
  :global(.sm-block h4) { @apply text-base font-semibold mt-3 mb-2; }
  /* Make inline code a touch smaller relative to the smaller text size */
  :global(.sm-block code) { @apply text-[90%]; }
  /* Optional: tighten paragraphs slightly in small blocks */
  /* :global(.sm-block p) { @apply mb-3; } */

  .md-shell {
    position: relative;
  }

  /* Hide footnotes until we've aligned them once to avoid initial flash at top. */
  .md-shell:not([data-fn-aligned="1"]) .md-footnotes {
    opacity: 0;
  }
  .md-shell[data-fn-aligned="1"] .md-footnotes {
    opacity: 1;
    transition: opacity 120ms ease;
  }

  .md-grid {
    display: grid;
    /* 3 columns: left margin | main text | right margin (footnotes live in the right margin) */
    grid-template-columns: minmax(0, 1fr) minmax(0, 850px) minmax(0, 1fr);
    column-gap: var(--toc-gap, var(--side-gap, 32px));
    align-items: start;
  }

  /* If the main column becomes > 1/2 of the viewport, hide side columns and collapse layout. */
  .md-shell[data-side="off"] .md-grid {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 16px;
  }
  .md-shell[data-side="off"] .md-output {
    grid-column: 1;
  }
  .md-shell[data-side="off"] .md-footnotes {
    display: none;
  }

  /* Keep main text centered and at a readable width, regardless of footnotes. */
  .md-output {
    grid-column: 2;
    min-width: 0;
  }

  .md-footnotes {
    position: relative;
    grid-column: 3;
    width: 260px;
    justify-self: start;
    padding-left: calc(var(--footnote-gap, 48px) - var(--toc-gap, var(--side-gap, 32px)));
    font-size: 14px;
    line-height: 1.6;
    color: #6b7280;
  }

  .md-footnotes ol {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    min-height: 100%;
  }

  .md-footnotes li {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-bottom: var(--footnote-item-gap, 28px);
  }
  .md-footnotes li:last-child {
    margin-bottom: 0;
  }

  .md-footnotes .fn-label {
    font-variant-numeric: tabular-nums;
    color: #6b7280;
  }

  .md-footnotes .fn-text :global(p) {
    margin: 0;
  }

  .md-footnotes .fn-text :global(a) {
    @apply underline underline-offset-[3px] decoration-neutral-400;
  }

  :global(.footnote-ref) {
    font-size: 0.75em;
    vertical-align: super;
    margin-left: 1px;
  }

  :global(.footnote-ref a) {
    color: #6b7280;
    text-decoration: none;
  }

  :global(.footnote-ref a:hover) {
    color: #111827;
  }

  @media (max-width: 1024px) {
    .md-grid {
      grid-template-columns: minmax(0, 1fr);
      row-gap: 16px;
    }
    .md-output {
      grid-column: 1;
    }
    .md-footnotes {
      position: static;
      grid-column: 1;
      width: auto;
    }
  }

  :global(pre[data-copyable]) {
    position: relative;
  }

  :global(pre[data-copyable] .copy-btn) {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    background: #f3f4f6; /* neutral-100 */
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    border-radius: 0.25rem;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.2s;
  }

  :global(pre[data-copyable]:hover .copy-btn) {
    opacity: 1;
  }

</style>
