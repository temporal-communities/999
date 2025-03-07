<script lang="ts">
  import { page } from "$app/state"
  import Carousel from "$lib/components/Carousel.svelte"
  import Dice3D from "$lib/components/Dice3D.svelte"
  import { generateRandomSequence } from "$lib/dice"
  import { locale } from "$lib/stores/locale"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"

  emblaCarouselSvelte.globalOptions = {
    loop: true,
    skipSnaps: true // Allow the carousel to skip scroll snaps if it's dragged vigorously
  }

  let sequence: number[] = $state([])
  let isRolling = $state(false)

  function toggleLanguage() {
    $locale = $locale === "de" ? "en" : "de"
  }

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

  // Track scroll position
  let scrollY = $state(0)
  let innerHeight = $state(0)
  let showBackToTop = $derived(scrollY > innerHeight)

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

  // Reference to the main element
  let mainElement: HTMLElement

  // Add function to scroll to main content
  function scrollToMain() {
    mainElement?.scrollIntoView({
      behavior: "smooth"
    })
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />

<header class="h-screen w-full p-4 md:p-16">
  <div
    class="relative flex h-full w-full flex-col items-center justify-evenly bg-sky-800 px-8 text-center text-amber-50 ring-4 ring-sky-800 ring-offset-4 ring-offset-amber-50"
  >
    <!-- Language toggle button -->
    <button
      class="relative flex h-26 w-26 cursor-pointer items-center justify-center rounded-full bg-amber-50 text-4xl text-sky-800 uppercase hover:bg-amber-100 focus:outline-none"
      onclick={toggleLanguage}
      aria-label={$locale === "de" ? "Sprache umschalten" : "Toggle language"}
    >
      {$locale}
    </button>

    {#if $locale === "de"}
      <div lang="de" class="max-w-[75ch]">
        <h1 class="text-3xl md:text-6xl">Ein Dramenautomat von 1829 digital aufbereitet</h1>
        <p class="pt-8 md:text-xl">
          Der 1829 von Georg Nikolaus Bärmann veröffentlichte <a
            class="underline"
            target="_blank"
            href="https://de.wikisource.org/wiki/Neunhundert_neun_und_neunzig_und_noch_etliche_Almanachs-Lustspiele_durch_den_W%C3%BCrfel"
            ><em>Würfelalmanach</em></a
          >
          ist ein spielerisches System zur Erzeugung von Einaktern per Würfelwurf. Diese kurzen Dramen
          waren auf der Bühne und im privaten Kreis beliebt, und Bärmanns Buch ermöglichte die Erstellung
          von 4×10<sup>155</sup> Variationen aus 1.200 Textfragmenten. Diese Webanwendung bringt den
          Almanach in digitaler Form zurück und lädt dazu ein, eine frühe Form algorithmischen Erzählens
          interaktiv zu erkunden.
        </p>
      </div>
    {:else}
      <div lang="en" class="max-w-[75ch]">
        <h1 class="text-3xl md:text-6xl">A literary automaton from 1829, reborn online</h1>
        <p class="pt-8 md:text-xl">
          The <a
            class="underline"
            target="_blank"
            href="https://de.wikisource.org/wiki/Neunhundert_neun_und_neunzig_und_noch_etliche_Almanachs-Lustspiele_durch_den_W%C3%BCrfel"
            ><em>Würfelalmanach</em></a
          >, published by Georg Nikolaus Bärmann in 1829, is a playful system for generating one-act
          plays by rolling dice. These short dramas were popular on stage and in private gatherings,
          and Bärmann's book offered a way to create 4×10<sup>155</sup> possible variations from 1,200
          text fragments. This web app recreates the experience, letting you explore an early example
          of algorithmic storytelling in an interactive way.
        </p>
      </div>
    {/if}

    <!-- Scroll to main button -->
    <button
      onclick={scrollToMain}
      class="pulse-animation flex h-26 w-26 cursor-pointer items-center justify-center rounded-full bg-amber-50 text-2xl text-sky-800 transition-colors hover:bg-amber-100 focus:outline-none"
      aria-label="Scroll to content"
    >
      START
    </button>
  </div>
</header>

<main class="overflow-x-hidden p-4" bind:this={mainElement}>
  <!-- Center column backdrop -->
  <div
    class="absolute inset-0 bottom-4 left-1/2 z-[-1] w-[430px] -translate-x-1/2 border-4 border-sky-800 bg-amber-50"
    style="top: calc(100vh + 2em);"
  ></div>

  <h2 class="m-4 pt-10 text-center text-2xl font-bold">
    Neunhundert neun und neunzig <br /> <small>und noch etliche</small> <br /> Almanachs-Lustspiele
    <br /> <small>durch den Würfel</small>
  </h2>

  <div class="flex justify-center">
    <div class="m-5 flex items-center justify-center rounded-full bg-sky-800 p-3">
      <Dice3D bind:isRolling />
    </div>
  </div>
  <!-- Display all six versions side by side -->
  <div class="versions flex flex-col gap-10" lang="de">
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

<!-- Back to top button with conditional visibility -->
{#if showBackToTop}
  <button
    onclick={scrollToTop}
    transition:fade={{ duration: 300 }}
    class="fixed right-6 bottom-6 flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-sky-800 text-white shadow-lg transition-all hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
    aria-label={$locale === "de" ? "Zurück nach oben" : "Back to top"}
    title={$locale === "de" ? "Zurück nach oben" : "Back to top"}
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
{/if}

<style>
  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    70% {
      transform: scale(1.11);
    }

    100% {
      transform: scale(1);
    }
  }

  .pulse-animation {
    animation: pulse 2s infinite;
  }
</style>
