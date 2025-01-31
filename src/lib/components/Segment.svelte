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
  <div
    id="s{id}"
    class="segment flex size-full flex-col justify-between rounded-md border border-stone-200 bg-amber-50 p-8 shadow-md"
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
  :global([subtype*="manicule-left"] + .number:after) {
    content: " ☚";
  }
  :global([subtype*="manicule-right"] + .number:before) {
    content: "☛ ";
  }
</style>
