<!-- Legacy route: IsoCompute post. Not linked from main nav. Remove when no longer needed. -->
<script lang="ts">
  import Seo from "$lib/components/Seo.svelte";
  import Markdown from "$lib/components/Markdown.svelte";
  import ScrollMeter from "$lib/components/ScrollMeter.svelte";
  import text from "../../maintext/iso_compute_final0.md?raw";
</script>

<Seo
  title="IsoCompute Playbook (legacy) | RL Excursions"
  description="IsoFLOPs Playbook: Optimally Scaling Sampling Compute for RL Training of LLMs."
/>

<div>
  <ScrollMeter containerSelector=".md-output" />

  <div class="layout-xl text-base space-y-12">
    <Markdown source={text} />
  </div>
</div>

