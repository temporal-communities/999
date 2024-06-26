<script lang="ts">
  import type { PageData } from "./$types"
  import { page } from "$app/stores"
  import { generateRandomSequence } from "$lib/dice"

  export let data: PageData

  import Segment from "$lib/components/Segment.svelte"

  // Wavy path back and forth
  const wavyPath = Array.from({ length: 200 }, (_, i) => 1 + (Math.abs((i % 10) - 5) % 6))

  $: sequence = handleSequence($page.url.hash)

  function handleSequence(hash: string) {
    const sequence = hash.slice(1)

    function resetSequence() {
      document.location.hash = ""
      return []
    }

    // Check if sequence is valid
    if (sequence.length !== 200) {
      console.warn("Invalid sequence length")
      resetSequence()
    }
    if (!/^[1-6]+$/.test(sequence)) {
      console.warn("Invalid characters in sequence")
      resetSequence()
    }

    return sequence
  }
</script>

<h1>
  Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
  <br /> <small>durch den Würfel</small>
</h1>

<button
  on:click={() => {
    document.location.hash = wavyPath.join("")
  }}>Wavy path</button
>
<button
  on:click={() => {
    document.location.hash = generateRandomSequence().join("")
  }}>Random path</button
>

<!-- Display all six versions side by side -->
<div class="versions">
  {#each Array.from(new Array(200), (_x, i) => i + 1) as index}
    <h2 id={index.toString()}>{index}</h2>
    <div class="section">
      {#each Array.from(new Array(6), (_x, i) => i + 1) as pips}
        <div class="roll">
          <h3 style:background={Number(sequence[index - 1]) === pips ? "goldenrod" : ""}>
            {"●".repeat(pips)}
          </h3>
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
