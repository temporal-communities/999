<script lang="ts">
  import { Almanac } from "$lib/almanac"

  let {
    index,
    pips
  }: {
    index: number
    pips: number
  } = $props()

  // Read segmentId from diceChart
  let segmentPromise = Almanac.getSegment(index, pips)
</script>

{#await segmentPromise}
  <p>Loading...</p>
{:then { id, html }}
  <div class="relative flex justify-center">
    <div
      class="relative mb-4 h-14 w-14 rounded-xl border-4 border-sky-800 bg-amber-50 p-2 pb-4 text-center after:absolute after:bottom-[-4] after:h-14 after:border-red-100 after:content-['']"
    >
      {"●".repeat(pips)}
    </div>
  </div>
  <div
    id="s{id}"
    class="segment flex size-full flex-col justify-between border-4 border-sky-800 bg-amber-50 p-8"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <div class="tei">{@html html}</div>
    <span class="number mt-2 block text-center text-xs">{id}</span>
  </div>
{:catch error}
  <p>Error: {error.message}</p>
{/await}

<style>
  /* We need to apply this globally, as the elements are generated at runtime */
  :global {
    .tei:has([subtype*="manicule-left"]) + .number:after {
      content: " ☚";
    }
    .tei:has([subtype*="manicule-right"]) + .number:before {
      content: "☛ ";
    }
  }
</style>
