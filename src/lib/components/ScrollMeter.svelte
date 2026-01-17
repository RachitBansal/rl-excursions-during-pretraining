<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  /** The element whose scroll progress we track (e.g. "#article .md-output") */
  export let containerSelector = '.md-output';
  /** Which headings become ticks */
  export let headingsSelector = 'h2, h3';

  type Heading = { id: string; level: 2 | 3; top: number; label: string };

  let headings: Heading[] = [];
  let visibleHeadings: Heading[] = [];
  let showAll = true;
  let visibleIdSet: Set<string> | null = null;
  let active_index = -1;
  let container_el: HTMLElement | null = null;
  let ready = false;
  let raf_id: number;
  let hydrated = false;
  let isHovering = false;
  let hideToc = false;
  const SIDE_DATASET_KEY = "sidecols";
  let lastPublishedSide: "on" | "off" | null = null;
  let watchTimer: number | null = null;
  let lastWatchDpr = -1;
  let lastWatchVw = -1;
  let hideByWidth = false;

  function onTocWheel(e: WheelEvent) {
    if (!meterEl) return;
    // If the TOC is scrollable, use the wheel to scroll it and keep the page from scrolling.
    const max = meterEl.scrollHeight - meterEl.clientHeight;
    if (max <= 0) return;

    const prev = meterEl.scrollTop;
    const next = Math.max(0, Math.min(max, prev + e.deltaY));
    if (next === prev) return;

    meterEl.scrollTop = next;
    e.preventDefault();
    e.stopPropagation();
  }

  function publishSideCols(side: "on" | "off") {
    if (!browser) return;
    const root = document.documentElement;
    if (root?.dataset) root.dataset[SIDE_DATASET_KEY] = side;
    if (lastPublishedSide === side) return;
    lastPublishedSide = side;
    window.dispatchEvent(new CustomEvent("sidecolschange", { detail: { side } }));
  }

  function canHorizontallyScrollPage(): boolean {
    if (!browser) return false;
    const se = (document.scrollingElement || document.documentElement) as HTMLElement | null;
    if (!se) return false;
    const prev = se.scrollLeft;
    // Probe: if scrollLeft can change, horizontal scrolling is possible.
    se.scrollLeft = prev + 1;
    const changed = se.scrollLeft !== prev;
    se.scrollLeft = prev;
    return changed;
  }

  function doc_y(el: Element) {
    const r = el.getBoundingClientRect();
    return (browser ? window.scrollY : 0) + r.top;
  }

  function should_include_heading(h: HTMLElement) {
    if (h.hasAttribute('data-skip-meter')) return false;
    if (h.getAttribute('data-meter') === 'false') return false;
    if (h.classList.contains('no-meter')) return false;
    return true;
  }

  function sanitizeHeadingLabel(text: string) {
    let out = text || '';
    // Collapse inline math: $...$ -> ...
    out = out.replace(/\$([^$]+)\$/g, (_m, inner) => inner);
    // Strip remaining math delimiters
    out = out.replace(/\$\$/g, '');
    // Simplify common LaTeX macros for readability
    out = out.replace(/\\text\{([^}]+)\}/g, '$1');
    out = out.replace(/\\mathrm\{([^}]+)\}/g, '$1');
    out = out.replace(/\\mathbf\{([^}]+)\}/g, '$1');
    out = out.replace(/\\mathit\{([^}]+)\}/g, '$1');
    out = out.replace(/\\mathcal\{([^}]+)\}/g, '$1');
    // Simplify subscripts/superscripts with braces: _{x} -> _x, ^{x} -> ^x
    out = out.replace(/_\{([^}]+)\}/g, '_$1');
    out = out.replace(/\^\{([^}]+)\}/g, '^$1');
    // Remove remaining backslashes used for LaTeX commands
    out = out.replace(/\\/g, '');
    // Normalize whitespace
    out = out.replace(/\s+/g, ' ').trim();
    return out;
  }

  function recompute() {
    if (!browser) return;
    container_el = document.querySelector(containerSelector) as HTMLElement | null;

    const nodes = container_el
      ? container_el.querySelectorAll(headingsSelector)
      : document.querySelectorAll(headingsSelector);

    headings = Array.from(nodes)
      .filter((el) => should_include_heading(el as HTMLElement))
      .map((el) => {
        const h = el as HTMLElement;
        if (!h.id) {
          // Fallback: generate a readable id from text content
          h.id = (h.textContent || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }
        return {
          id: h.id,
          level: h.tagName === 'H2' ? 2 : 3,
          top: doc_y(h),
          label: sanitizeHeadingLabel(h.textContent || '')
        };
      });

    visibleHeadings = headings;
    showAll = true;
    visibleIdSet = null;
    updateVisibility();
    updateLabelWidth();
    update_progress();
  }

  function updateVisibility() {
    if (!browser) return;
    if (!container_el) {
      hideToc = false;
      return;
    }
    const root = document.documentElement;
    const vw = root?.clientWidth || window.innerWidth || 0;
    const hasHScroll = canHorizontallyScrollPage();

    // Hide if: (no horizontal scroll AND main text occupies >= 1/2 of viewport).
    // Add hysteresis to prevent flicker when layout fluctuates near the threshold.
    const RATIO_HIDE = 1 / 2;
    const RATIO_SHOW = 0.5; // must be < RATIO_HIDE

    if (hasHScroll || vw <= 0) {
      hideByWidth = false;
    } else {
      const MAIN_MAX_PX = 800; // keep in sync with Markdown main column max
      // Important: use the intended main-column width (not measured width) to avoid
      // a feedback loop where hiding side cols changes the measured width, causing
      // flicker during zoom.
      const ratio = MAIN_MAX_PX / vw;

      if (!hideByWidth) {
        if (ratio >= RATIO_HIDE) hideByWidth = true;
      } else if (ratio <= RATIO_SHOW) {
        hideByWidth = false;
      }
    }

    hideToc = hideByWidth;

    // Publish a single source of truth for "side columns on/off" so footnotes can
    // bind to the TOC visibility.
    publishSideCols(hideToc ? "off" : "on");
  }

  function update_progress() {
    if (!browser) return;
    const y = window.scrollY + 8;
    let idx = -1;
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].top <= y) idx = i;
      else break;
    }
    active_index = idx;

    const h2Indices = headings
      .map((h, i) => (h.level === 2 ? i : -1))
      .filter((i) => i !== -1) as number[];
    const firstH2Top =
      h2Indices.length > 0 ? headings[h2Indices[0]].top : null;
    const beforeFirstH2 =
      firstH2Top === null ? true : y < firstH2Top - 20;

    if (isHovering || beforeFirstH2) {
      showAll = true;
      visibleIdSet = null;
      return;
    }

    showAll = false;
    // Show current H2 and its H3s only
    let currentH2Index = -1;
    for (let i = h2Indices.length - 1; i >= 0; i--) {
      if (headings[h2Indices[i]].top <= y) {
        currentH2Index = h2Indices[i];
        break;
      }
    }

    if (currentH2Index === -1) {
      visibleIdSet = new Set();
      return;
    }

    const nextH2Index =
      h2Indices.find((i) => i > currentH2Index) ?? headings.length;
    const range = headings.slice(currentH2Index, nextH2Index);
    visibleIdSet = new Set(range.map((h) => h.id));
  }

  // list layout uses natural flow; no per-item positioning needed

  function updateLabelWidth() {
    if (!meterEl) return;
    if (!container_el) return;
    const rect = container_el.getBoundingClientRect();
    const leftMargin = Math.max(rect.left, 0);
    const gapVar = getComputedStyle(document.documentElement).getPropertyValue("--toc-gap")
      || getComputedStyle(document.documentElement).getPropertyValue("--side-gap");
    const gap = Math.max(0, Math.round(parseFloat(gapVar || "32") || 32)); // px between toc and main text
    const minLeftVar =
      getComputedStyle(document.documentElement).getPropertyValue("--toc-min-left");
    const minLeft = Math.max(0, Math.round(parseFloat(minLeftVar || "16") || 16));

    const items = meterEl.querySelectorAll<HTMLAnchorElement>(".toc-item:not(.hidden)");
    let contentWidth = 0;
    items.forEach((item) => {
      // Measure the "natural" (unwrapped) label width; `getBoundingClientRect().width`
      // is unreliable here because `.toc-item` is styled as `width: 100%` to keep a
      // consistent clickable area, and zoom/resizes can otherwise lock us into the
      // previous constrained width.
      const prevWidth = item.style.width;
      const prevWS = item.style.whiteSpace;
      item.style.width = "max-content";
      item.style.whiteSpace = "nowrap";
      const w = Math.ceil(item.getBoundingClientRect().width);
      item.style.width = prevWidth;
      item.style.whiteSpace = prevWS;
      contentWidth = Math.max(contentWidth, w);
    });
    if (contentWidth === 0) return;

    const available = Math.max(0, Math.floor(leftMargin - gap));
    const maxWidth = available > 0 ? Math.min(contentWidth, available) : contentWidth;
    meterEl.style.setProperty("--toc-max-width", `${maxWidth}px`);

    // Position the TOC so it "hugs" the main text: place it to the left of the main
    // text column with a small gap.
    const left = Math.max(minLeft, Math.round(rect.left - maxWidth - gap));
    meterEl.style.setProperty("--toc-left", `${left}px`);
  }

  let onScroll: () => void;
  let onResize: () => void;
  let ro: ResizeObserver | null = null;
  let meterEl: HTMLDivElement | null = null;

  onMount(() => {
    hydrated = true;
    raf_id = requestAnimationFrame(() => {
      recompute();
      update_progress();
      ready = true;
    });
    onScroll = () => update_progress();
    onResize = () => recompute();

    if (browser) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      if (containerSelector) {
        const c = document.querySelector(containerSelector);
        if (c) {
          ro = new ResizeObserver(() => recompute());
          ro.observe(c);
        }
      }

      // Initialize label width once layout is ready
      setTimeout(() => {
        updateVisibility();
        updateLabelWidth();
      }, 100);
      requestAnimationFrame(() => updateVisibility());

      // Zoom changes (browser zoom) do not reliably trigger resize events, so we
      // watch viewport width and refresh TOC visibility + placement when it changes.
      watchTimer = window.setInterval(() => {
        const root = document.documentElement;
        const vw = root?.clientWidth || window.innerWidth || 0;
        const dpr = window.devicePixelRatio || 1;
        if (vw === lastWatchVw && dpr === lastWatchDpr) return;
        lastWatchVw = vw;
        lastWatchDpr = dpr;
        updateVisibility();
        updateLabelWidth();
      }, 250);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    }
    if (browser && watchTimer !== null) {
      window.clearInterval(watchTimer);
      watchTimer = null;
    }
    if (browser) {
      const root = document.documentElement;
      if (root?.dataset?.[SIDE_DATASET_KEY]) delete root.dataset[SIDE_DATASET_KEY];
      lastPublishedSide = null;
      window.dispatchEvent(new CustomEvent("sidecolschange", { detail: { side: "on" } }));
    }
    if (ro) ro.disconnect();
    if (raf_id) cancelAnimationFrame(raf_id);
  });
</script>

<!--
  Fixed, full-height bar on the extreme left (fills viewport regardless of layout).
  The gradient is fixed over the full bar; we reveal it via clip-path based on `progress`.
  Ticks are horizontal lines that start at the very left edge and extend into the page,
  and on hover they show the heading label to the right.
-->
<nav
  class="toc"
  bind:this={meterEl}
  aria-hidden="true"
  class:ready={ready}
  class:in-body={!showAll}
  class:hidden={hideToc}
  on:wheel={onTocWheel}
  on:mouseenter={() => {
    isHovering = true;
    update_progress();
  }}
  on:mouseleave={() => {
    isHovering = false;
    update_progress();
  }}
>
  {#if hydrated}
    {#each visibleHeadings as h, i}
      <a
        href={`#${h.id}`}
        class={`toc-item ${h.level === 3 ? 'sub' : ''} ${i === active_index ? 'active' : ''} ${!showAll && visibleIdSet && !visibleIdSet.has(h.id) ? 'hidden' : ''}`}
        title={h.label}
      >
        {h.label}
      </a>
    {/each}
  {/if}
</nav>

<style>
  :root {
    --toc-max-width: 280px;
    --toc-left: 28px;
  }

  .toc {
    position: fixed;
    left: var(--toc-left, 28px);
    top: 50%;
    transform: translateY(-50%);
    width: var(--toc-max-width, 280px);
    height: calc(100vh - 180px);
    max-height: calc(100vh - 180px);
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 0;
    z-index: 50;
    opacity: 0;
    transition: opacity 400ms ease;
    text-align: left;
  }

  .toc.ready {
    opacity: 1;
  }

  .toc.hidden {
    display: none;
  }

  .toc-item {
    display: block;
    width: 100%;
    text-align: left;
    overflow-wrap: anywhere;
    word-break: break-word;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
    text-decoration: none;
    margin: 6px 0; /* fixed spacing between all items */
  }

  .toc-item:hover {
    color: #111827;
  }

  .toc-item.active {
    color: #111827;
    font-weight: 600;
  }

  /* In body view, keep active items the same color (no black) */
  .toc.in-body .toc-item.active {
    color: #6b7280;
  }

  .toc.in-body .toc-item.active.sub {
    color: #9ca3af;
  }

  .toc-item.sub {
    padding-left: 14px;
    color: #9ca3af;
    font-size: 13px;
  }

  .toc-item.hidden {
    visibility: hidden; /* keep spacing but hide text */
    pointer-events: none;
  }

  /* Do NOT hide the TOC via media queries; visibility is controlled by `hideToc`
     so we can keep TOC and footnotes bound to the same state. */
</style>
