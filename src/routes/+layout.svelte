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
