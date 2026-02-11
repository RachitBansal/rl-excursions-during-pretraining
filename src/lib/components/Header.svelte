<script lang="ts">
  import { page } from "$app/stores";

  const logoMap: Record<string, { src: string; alt: string }> = {
    harvard: { src: "/assets/figures/harvard.svg", alt: "Harvard University" },
  };

  const internshipLine = "Work done during internship at MBZUAI-IFM";
  const affiliationLogoMap: Record<string, { src: string; alt: string }> = {
    "UC San Diego": logoMap.ucsd,
    "MBZUAI-IFM": logoMap.mbzuai,
    "Carnegie Mellon University": logoMap.cmu,
    "Harvard University": logoMap.harvard,
  };

  type AuthorEntry = { name: string; affils?: string[] };

  const isAuthorEntry = (a: unknown): a is AuthorEntry =>
    !!a && typeof a === "object" && "name" in (a as AuthorEntry);

  $: authorData = $page.data.header?.authors;
  $: authorList = Array.isArray(authorData) && authorData.every(isAuthorEntry)
    ? (authorData as AuthorEntry[])
    : null;

  const stripEqualStar = (name: string) => name.replace(/\*+$/, "").trim();
  const hasEqualStar = (name: string) => /\*$/.test(name);
</script>

<header
  class="layout-xl justify-between items-start"
  data-sveltekit-noscroll
  data-sveltekit-preload-code="eager"
>
  <div class="header-inner mb-8">
    <h1 class="title-font font-bold text-black text-3xl mb-4 leading-tight">
      {$page.data.header?.title ??
        "RL Excursions during Pre-training: How early is too early for On-policy Learning?"}
    </h1>

    <div class="meta text-black">
      <div class="authors">
        {#if authorList}
          {#each authorList as author, i (i)}
            <span class="author">
              <span class="author-name">{stripEqualStar(author.name)}</span>
              {#if author.affils}
                <sup class="affil-sup">
                  {#each author.affils as key, j (j)}
                    {#if logoMap[key]}
                      <img
                        src={logoMap[key].src}
                        alt={logoMap[key].alt}
                        title={logoMap[key].alt}
                        class={`affil-logo ${key === "mbzuai" ? "affil-logo--mbzuai" : ""} ${key === "cmu" ? "affil-logo--cmu" : ""} ${key === "harvard" ? "affil-logo--harvard" : ""}`}
                        loading="lazy"
                        decoding="async"
                      />
                    {:else if key === "intern"}
                      <span class="affil-dot" title={internshipLine} aria-label={internshipLine}></span>
                    {:else}
                      <span class="affil-fallback">{key}</span>
                    {/if}
                  {/each}
                  {#if hasEqualStar(author.name)}
                    <span class="affil-sup-text">*</span>
                  {/if}
                </sup>
              {/if}
            </span>
          {/each}
        {:else}
          {$page.data.header?.authors ?? "__AUTHORS__"}
        {/if}
      </div>

      <div class="affiliations">
        {#if Array.isArray($page.data.header?.affiliations)}
          <div class="affiliation-line">
            {#each $page.data.header.affiliations as line, i (i)}
              <span class="affiliation-item">
                {#if line === internshipLine}
                  <span class="affil-dot" aria-hidden="true"></span>
                {:else if affiliationLogoMap[line]}
                  <img
                    src={affiliationLogoMap[line].src}
                    alt={affiliationLogoMap[line].alt}
                    title={affiliationLogoMap[line].alt}
                    class="affil-logo affil-logo--legend"
                    loading="lazy"
                    decoding="async"
                  />
                {/if}
                <span>{line}</span>
              </span>
              {#if i < $page.data.header.affiliations.length - 1}
                <span class="affiliation-sep">, </span>
              {/if}
            {/each}
          </div>
        {:else}
          {$page.data.header?.affiliations ?? "__AFFILIATIONS__"}
        {/if}
      </div>

      <div class="date">
        {$page.data.header?.date ?? "__DATE__"}
      </div>
    </div>
  </div>
</header>

<style lang="postcss">
  /* Keep the header aligned with the same main-text column width used by Markdown.svelte. */
  .header-inner {
    max-width: var(--md-main-col, 760px);
    margin-left: auto;
    margin-right: auto;
  }


  .title-font {
    font-family: "Iowan Old Style BT", "Iowan Old Style", "Palatino Linotype", Palatino, serif;
  }

  .meta {
    font-size: 16px;
    line-height: 1.55;
  }

  .authors {
    font-size: 16px;
    line-height: 2.0;
    text-align: center;
  }

  .author {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    margin-right: 8px;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .author-name {
    line-height: 1.4;
  }

  .affil-sup {
    display: inline-flex;
    align-items: flex-start;
    gap: 0px;
    margin-left: 0px;
    transform: translateY(0px);
  }

  .affil-sup .affil-logo {
    margin-left: 0px;
  }

  .affil-sup-text {
    font-size: 15px;
    line-height: 1;
    margin-left: 0px;
    white-space: nowrap;
    position: relative;
    top: 8px;
  }
  .affil-sup .affil-dot {
    position: relative;
    margin-left: 0px;
    top: 8px;
  }

  .affil-logo {
    height: 16px;
    width: auto;
    vertical-align: middle;
    margin-left: 1px;
  }

  .affil-logo--mbzuai {
    height: 20px;
  }

  .affil-logo--cmu {
    height: 23px;
  }

  .affil-logo--harvard {
    height: 18px;
  }

  .affil-logo--legend {
    height: 22px;
    margin-right: 8px;
  }

  .affil-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    border: 1.5px solid #111827;
    background: transparent;
    display: inline-block;
    vertical-align: middle;
    margin-left: 2px;
    margin-right: 4px;
  }

  .affiliation-line .affil-dot {
    position: relative;
    top: -6px;
  }

  .affil-fallback {
    font-size: 12px;
    color: #6b7280;
    margin-left: 4px;
  }

  .affiliations {
    margin-top: 10px; /* visual separation from authors */
    color: #111827;
    opacity: 0.9;
    text-align: center;
  }

  .affiliation-line {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
    width: 100%;
  }

  .affiliation-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .affiliation-sep {
    margin: 0 4px;
  }

  .affiliation-line {
    margin-top: 2px;
  }

  .date {
    margin-top: 10px;
    color: #111827;
    opacity: 0.9;
  }

  @media (max-width: 580px) {
    .meta {
      font-size: 15px;
    }
  }
</style>
