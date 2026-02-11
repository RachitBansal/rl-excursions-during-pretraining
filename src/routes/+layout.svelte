<script lang="ts">
  import "../app.css";
  import { math, display } from "mathlifier";
  
  import { browser, dev } from "$app/environment";

  // import { inject } from '@vercel/analytics';
  // import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
  // inject({ mode: dev ? 'development' : 'production' });
  // injectSpeedInsights();

  import { fly } from "svelte/transition";

  import { base } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  const isMobile = browser && /Android|iPhone/i.test(navigator.userAgent);
  const reducedMotion =
    browser && matchMedia("(prefers-reduced-motion: reduce)").matches;

  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  const MEASUREMENT_ID = 'G-Z1XRQ6ZG3X';

  function send_pageview(loc: Location) {
    if (!window.gtag) return;
    window.gtag('config', MEASUREMENT_ID, {
      page_path: loc.pathname + loc.search + loc.hash
    });
  }

  onMount(() => {
    send_pageview(window.location);              // initial load
    afterNavigate(() => send_pageview(window.location));  // on route changes
  });
</script>

<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-Z1XRQ6ZG3X"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-Z1XRQ6ZG3X", { send_page_view: false });
  </script>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <!-- {#if !dev}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-156644599-1"
    ></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "UA-156644599-1");
    </script>
  {/if} -->
</svelte:head>

<div class="page-upper-right-inline">
  <img
    src={base + "/assets/figures/upper_right_final.png"}
    alt="Institution logos"
    class="page-upper-right"
    loading="lazy"
    decoding="async"
  />
</div>

<Header />

{#if isMobile || reducedMotion}
  <!--
    Disable page transitions on mobile due to a browser engine bug.
    Also disable them for reduced-motion users.
  -->
  <main>
    <slot />
  </main>
{:else}
  {#key data.pathname}
    <main
      in:fly={{ x: -10, duration: 350, delay: 350 }}
      out:fly={{ y: 5, duration: 350 }}
    >
      <slot />
    </main>
  {/key}
{/if}

<!-- <Footer /> -->

<style lang="postcss">
  .page-upper-right-inline {
    position: absolute;
    top: 3px;
    right: 16px;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
  }

  .page-upper-right {
    width: clamp(220px, 18vw, 320px);
    height: auto;
    pointer-events: none;
  }

  @media (max-width: 720px) {
    .page-upper-right-inline {
      top: 4px;
      right: 4px;
    }

    .page-upper-right {
      width: clamp(140px, 30vw, 220px);
    }
  }
</style>
