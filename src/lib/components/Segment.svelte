<script lang="ts">
  export let index: number
  export let pips: number
  export let segments: Record<string, string>
  export let diceChart: number[][]

  // Read segmentId from diceChart
  let segmentId = diceChart[index - 1][pips - 1]
</script>

<div class="segment">
  <h4>{segmentId}</h4>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html segments[segmentId]}
</div>

<style>
  /* Border */
  .segment {
    background: #fffbeb;
    border: 1px solid #e7e5e4;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
</style>
