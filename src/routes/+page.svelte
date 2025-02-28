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

  // On change to isRolling, set a new sequence
  $effect(() => {
    if (isRolling) {
      sequence = generateRandomSequence()
    }
  })

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

  // Add function to scroll back to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
</script>

<header class="mx-auto flex w-md flex-col items-center">
  <div class="h-full w-full">
    <div lang="de">
      <h1>Ein Dramenautomat von 1829 digital aufbereitet</h1>
      <p>
        Der 1829 von Georg Nikolaus Bärmann veröffentlichte <em>Würfelalmanach</em> ist ein spielerisches
        System zur Erzeugung von Einaktern per Würfelwurf. Diese kurzen Dramen waren auf der Bühne und
        im privaten Kreis beliebt, und Bärmanns Buch ermöglichte die Erstellung von 4×10¹⁵⁵ Variationen
        aus 1.200 Textfragmenten. Diese Webanwendung bringt den Almanach in digitaler Form zurück und
        lädt dazu ein, eine frühe Form algorithmischen Erzählens interaktiv zu erkunden.
      </p>
    </div>
    <div lang="en">
      <h1>A literary automaton from 1829 reborn online</h1>
      <p>
        The <em>Würfelalmanach</em>, published by Georg Nikolaus Bärmann in 1829, is a playful
        system for generating one-act plays by rolling dice. These short dramas were popular on
        stage and in private gatherings, and Bärmann’s book offered a way to create 4×10¹⁵⁵ possible
        variations from 1,200 text fragments. This web app recreates the experience, letting you
        explore an early example of algorithmic storytelling in an interactive way.
      </p>
    </div>
  </div>
</header>

<main class="p-4">
  <!-- Center column backdrop -->
  <div
    class="absolute inset-0 top-4 bottom-4 left-1/2 z-[-1] w-md -translate-x-1/2 border-4 border-sky-800 bg-amber-50"
  ></div>
  <h2 class="m-4 pt-10 text-center text-2xl font-bold">
    Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
    <br /> <small>durch den Würfel</small>
  </h2>

  <div class="flex justify-center" title="Würfeln">
    <div class="m-5 flex items-center justify-center rounded-full bg-sky-800 p-3" title="Würfeln">
      <Dice3D bind:isRolling />
    </div>
  </div>
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

<!-- Back to top button -->
<button
  onclick={scrollToTop}
  class="fixed right-6 bottom-6 flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-sky-800 text-white shadow-lg transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
  aria-label="Back to top"
  title="Back to top"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
  </svg>
</button>
