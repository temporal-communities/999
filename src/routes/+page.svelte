<script lang="ts">
  import { page } from "$app/state"
  import { generateRandomSequence } from "$lib/dice"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import Dice3D from "$lib/components/Dice3D.svelte"

  import Carousel from "$lib/components/Carousel.svelte"
  import { onMount } from "svelte"

  emblaCarouselSvelte.globalOptions = {
    loop: true,
    skipSnaps: true // Allow the carousel to skip scroll snaps if it's dragged vigorously
  }

  let sequence: number[] = $state([])
  let isRolling = $state(false)

  function roll() {
    isRolling = true
    setTimeout(() => {
      isRolling = false
    }, 1000)
  }

  function initialiseSequence() {
    // On load, check if there's a sequence in the URL hash
    const hashString = page.url.hash.slice(1)
    if (!hashString) return generateRandomSequence()

    // Check if it’s a valid sequence
    const sequenceLength = 200
    const sequenceRegex = new RegExp(`^[1-6]{${sequenceLength}}$`)
    if (!sequenceRegex.test(hashString)) {
      return generateRandomSequence()
    }

    // Valid, apply
    const hashSequence = hashString.split("").map(Number)
    // Reset hash
    history.pushState("", document.title, window.location.pathname + window.location.search)
    return hashSequence
  }
  onMount(() => {
    sequence = initialiseSequence()
  })
</script>

<!-- Center column backdrop -->
<div
  class="absolute inset-0 top-4 bottom-4 left-1/2 z-[-1] w-md -translate-x-1/2 border-4 border-sky-800 bg-amber-50"
></div>

<header class="mx-auto flex w-md flex-col items-center">
  <h1 class="m-4 pt-10 text-center text-2xl font-bold">
    Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
    <br /> <small>durch den Würfel</small>
  </h1>

  <div class="flex justify-center" title="Würfeln">
    <div class="flex items-center justify-center rounded-full bg-sky-800 p-3" title="Würfeln">
      <Dice3D
        onClick={() => {
          if (!isRolling) {
            roll()
            sequence = generateRandomSequence()
          }
        }}
      />
    </div>
  </div>
</header>

<main class="p-4">
  <!-- Display all six versions side by side -->
  <div class="versions flex flex-col gap-10">
    {#each Array.from(new Array(200), (_x, i) => i + 1) as index}
      <div class="flex flex-col items-center">
        <h2 class="text-center text-xl font-bold" id={index.toString()}>{index}</h2>
        <!-- Only apply the rolling effect to the first ten carousels -->
        <Carousel
          {index}
          focusPips={sequence ? sequence[index - 1] : null}
          isRolling={index <= 10 ? isRolling : false}
        />
      </div>
    {/each}
  </div>
</main>
