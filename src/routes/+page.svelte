<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData

  import Segment from "$lib/components/Segment.svelte"
</script>

<h1>
  Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
  <br /> <small>durch den Würfel</small>
</h1>

<!-- Display all six versions side by side -->
<div class="versions">
  {#each Array.from(new Array(200), (_x, i) => i + 1) as index}
    <h2 id={index.toString()}>{index}</h2>
    <div class="section">
      {#each Array.from(new Array(6), (_x, i) => i + 1) as pips}
        <div class="roll">
          <h3>{"●".repeat(pips)}</h3>
          <Segment {index} {pips} segments={data.segments} diceChart={data.diceChart} />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .section {
    /* Display side by side */
    flex-direction: row;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 5rem;
  }
  .roll {
    flex: 1;
  }
  h1,
  h2,
  h3 {
    text-align: center;
  }
</style>
