<script lang="ts">
  import "../app.css"
  interface Props {
    children?: import("svelte").Snippet
  }

  let { children }: Props = $props()
</script>

<svelte:head>
  <title>Neunhundert neun und neunzig und noch etliche Almanachs-Lustspiele durch den Würfel</title>
</svelte:head>

{@render children?.()}

<style>
  @reference "../app.css";
  :global {
    body {
      @apply relative overflow-x-hidden bg-[url($lib/assets/wallpaper.svg)] font-classical-humanist text-sky-800 before:absolute before:inset-0 before:z-[-2] before:bg-sky-800 before:opacity-50 before:content-[''];
    }
  }
</style>
