<script lang="ts">
  import { onMount } from "svelte"
  import "../app.css"
  interface Props {
    children?: import("svelte").Snippet
  }
  import { browser } from "$app/environment"
  import { locale, sourceLocale } from "$lib/stores/locale"

  let { children }: Props = $props()

  // Example: titles per locale
  const titles = {
    de: "Neunhundert neun und neunzig und noch etliche Almanachs-Lustspiele durch den Würfel",
    en: "Rolling the Dice for 999 and Many More Almanac Comedies"
  }

  // Derive title based on locale
  let title = $derived(titles[$sourceLocale] || titles.en)

  onMount(() => {
    if (browser) {
      const detectedLang = navigator.language.startsWith("de") ? "de" : "en"
      locale.set(detectedLang)
    }
  })
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="contents" lang={$locale}>
  {@render children?.()}
</div>
