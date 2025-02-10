<script lang="ts">
  import { page } from "$app/state"
  import { generateRandomSequence } from "$lib/dice"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import Dice3D from "$lib/components/Dice3D.svelte"

  import Carousel from "$lib/components/Carousel.svelte"

  emblaCarouselSvelte.globalOptions = {
    loop: true,
    skipSnaps: true // Allow the carousel to skip scroll snaps if it's dragged vigorously
  }

  // Wavy path back and forth
  const wavyPath = Array.from({ length: 200 }, (_, i) => 1 + (Math.abs((i % 10) - 5) % 6))

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
  let sequence = $derived(handleSequence(page.url.hash))

  function handleRandomPath() {
    document.location.hash = generateRandomSequence().join("")
  }
</script>

<header>
  <h1 class="m-4 pt-10 text-center text-2xl font-bold">
    Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
    <br /> <small>durch den Würfel</small>
  </h1>

  <div class="flex justify-center" title="Würfeln">
    <Dice3D onClick={handleRandomPath} />
  </div>
</header>

<main class="p-4">
  <!-- Display all six versions side by side -->
  <div class="versions flex flex-col gap-10">
    {#each Array.from(new Array(200), (_x, i) => i + 1) as index}
      <div class="flex flex-col items-center">
        <h2 class="text-center text-xl font-bold" id={index.toString()}>{index}</h2>
        <Carousel {index} focusPips={sequence ? Number(sequence[index - 1]) : null} />
      </div>
    {/each}
  </div>
</main>
