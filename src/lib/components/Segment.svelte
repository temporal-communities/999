<script lang="ts">
  export let index: number
  export let pips: number
  export let segments: Record<string, string>
  export let diceChart: number[][]

  // Read segmentId from diceChart
  let segmentId = diceChart[index - 1][pips - 1]
</script>

<div class="segment">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html segments[segmentId]}
  <span class="number">{segmentId}</span>
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

  .number {
    display: block;
    text-align: center;
    opacity: 0.5;
    font-size: small;
    font-weight: normal;
    margin-top: 1rem;
  }

  :global([subtype*="manicule-left"] + .number:after) {
    content: " ☚";
  }
  :global([subtype*="manicule-right"] + .number:before) {
    content: "☛ ";
  }

  /* TEI styles */
  :global(.tei-speaker) {
    font-weight: bold;
    /* Sperrsatz */
    letter-spacing: 0.1em;
  }
  :global(.tei-stage) {
    font-style: italic;
  }
  :global(.tei-sp) {
    --indent: 1.5em;
    text-indent: calc(var(--indent) * -1);
    padding-inline-start: var(--indent);
  }
  :global(ul.tei-castList) {
    list-style: none;
    padding: 0;
    margin-top: 0;
  }
</style>
