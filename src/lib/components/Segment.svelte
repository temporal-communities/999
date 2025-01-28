<script lang="ts">
  interface Props {
    index: number
    pips: number
    segments: Record<string, string>
    diceChart: number[][]
  }

  let { index, pips, segments, diceChart }: Props = $props()

  // Read segmentId from diceChart
  let segmentId = diceChart[index - 1][pips - 1]
</script>

<div class="segment rounded-md border border-stone-200 bg-amber-50 p-4 shadow-md">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <div class="tei">{@html segments[segmentId]}</div>
  <span class="number mt-4 block text-center text-xs">{segmentId}</span>
</div>

<style>
  /* We need to apply this globally, as the elements are generated at runtime */
  :global([subtype*="manicule-left"] + .number:after) {
    content: " ☚";
  }
  :global([subtype*="manicule-right"] + .number:before) {
    content: "☛ ";
  }
</style>
