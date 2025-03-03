<script lang="ts">
  import { onMount } from "svelte"
  import "../app.css"
  interface Props {
    children?: import("svelte").Snippet
  }
  import { browser } from "$app/environment"
  import { locale } from "$lib/stores/locale"

  let { children }: Props = $props()

  onMount(() => {
    if (browser) {
      const detectedLang = navigator.language.startsWith("de") ? "de" : "en"
      locale.set(detectedLang)
    }
  })
</script>

<svelte:head>
  <title>Neunhundert neun und neunzig und noch etliche Almanachs-Lustspiele durch den Würfel</title>
</svelte:head>

<div class="contents" lang={$locale}>
  {@render children?.()}
</div>
