<script context="module" lang="ts">
  export type CalloutVariant = "note" | "tip" | "warning" | "info" | "takeaway";
</script>

<script lang="ts">
  export let html: string; // already-marked HTML
  export let title: string = "";
  export let variant: CalloutVariant = "note";

  const styles: Record<CalloutVariant, { wrap: string; badge: string; label: string }> = {
    note: {
      wrap: "bg-slate-50 hover:bg-slate-100/60 border-slate-600",
      badge: "text-slate-700",
      label: "Note",
    },
    info: {
      wrap: "bg-sky-50 hover:bg-sky-100/60 border-sky-700",
      badge: "text-sky-800",
      label: "Takeaways",
    },
    tip: {
      wrap: "bg-emerald-50 hover:bg-emerald-100/60 border-emerald-700",
      badge: "text-emerald-800",
      label: "Tip",
    },
    warning: {
      wrap: "bg-amber-50 hover:bg-amber-100/60 border-amber-700",
      badge: "text-amber-800",
      label: "Warning",
    },
    takeaway: {
      wrap: "bg-slate-50 hover:bg-sky-50/50 border-sky-700",
      badge: "text-sky-700",
      label: "Takeaways",
    },
  };

  $: meta = styles[variant] ?? styles.note;
  // If a custom title is provided, use it; otherwise use the default label
  $: displayLabel = title || meta.label;
</script>

<div class={`my-4 rounded p-4 pb-1 border-l-4 transition ${meta.wrap}`}>
  <div class={`text-xs font-semibold tracking-wide uppercase ${meta.badge}`}>
    {displayLabel}
  </div>
  <div class="prose max-w-none mt-1">
    <div class="md-output">{@html html}</div>
  </div>
</div>

