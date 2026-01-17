<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import Markdown from "$lib/components/Markdown.svelte";
  import ScrollMeter from "$lib/components/ScrollMeter.svelte";

  import text from "../../maintext/isoflops_noimg.md?raw";
</script>

<Seo
  title="IsoCompute Playbook: Optimally Scaling Sampling Computes for RL Training of LLMs"
  description="IsoFLOPs Playbook: Optimally Scaling Sampling Computes for RL Training of LLMs (image URLs replaced with placeholders)."
/>

<div>
  <ScrollMeter containerSelector=".md-output" />

  <div class="layout-xl text-lg space-y-12">
    <Markdown source={text} />
  </div>
</div>

