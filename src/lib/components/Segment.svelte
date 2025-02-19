<script lang="ts">
  import { Almanac } from "$lib/almanac"

  // Object containing dice asset URLs: { "1": <url>, "2": <url> } etc.
  const DiceAssets = Object.entries(
    import.meta.glob("$lib/assets/dice-*.svg", { eager: true, import: "default" })
  ).reduce((acc: { [key: string]: string }, [key, value]) => {
    const match = key.match(/dice-(\d)/)
    if (!match) throw Error("Error loading dice assets")
    const diceNumber = match[1]
    acc[diceNumber] = value as string
    return acc
  }, {})

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
  <div class="flex size-full flex-col justify-between">
    <div class="relative flex justify-center">
      <div
        class="relative mb-4 h-14 w-14 overflow-hidden rounded-xl border-4 border-sky-800 text-center"
      >
        <img src={DiceAssets[pips]} alt="dice" class="h-full w-full" />
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
