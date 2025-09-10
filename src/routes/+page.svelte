<script lang="ts">
  import { replaceState } from "$app/navigation"
  import { page } from "$app/state"
  import Carousel from "$lib/components/Carousel.svelte"
  import Dice3D from "$lib/components/Dice3D.svelte"
  import ShareButton from "$lib/components/ShareButton.svelte"
  import { generateRandomSequence } from "$lib/dice"
  import { locale } from "$lib/stores/locale"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"
  import { downloadTEIDoc, generateRandomPlays } from "$lib/tei"
  import {
    getRandomShortestPlay,
    getRandomLongestPlay,
    getRandomLongestAndShortestPlay,
    generateAllSamePipsSequence
  } from "$lib/analysis"
  import { compileModule } from "svelte/compiler"

  emblaCarouselSvelte.globalOptions = {
    loop: true,
    skipSnaps: true // Allow the carousel to skip scroll snaps if it's dragged vigorously
  }

  let playMode:
    | "dice"
    | "shortestWords"
    | "longestWords"
    | "shortestLetters"
    | "longestLetters"
    | "allOne"
    | "allTwo"
    | "allThree"
    | "allFour"
    | "allFive"
    | "allSix" = $state("dice") // to switch between: generate random with dice or random shortest or longest play

  let sequence: number[] = $state([])
  let isRolling = $state(false)

  function toggleLanguage() {
    $locale = $locale === "de" ? "en" : "de"
  }

  const sequenceLength = 200
  const sequenceRegex = new RegExp(`^[1-6]{${sequenceLength}}$`)

  // Mount gate
  let mounted = $state(false)
  onMount(() => {
    mounted = true
  })

  // Deferred scroll flag
  let wantsScroll = $state(false)

  // Whenever the url hash changes, derive sequence
  $effect(() => {
    const hash = page.url.hash.slice(1)

    if (hash && sequenceRegex.test(hash)) {
      sequence = hash.split("").map(Number)

      // Reset hash
      requestAnimationFrame(() => {
        const url = new URL(page.url)
        url.hash = ""
        replaceState(url, page.state)
      })

      wantsScroll = true
    } else if (sequence.length === 0) {
      // Only set once on init
      sequence = generateRandomSequence()
    }
  })

  // Perform the scroll once everything exists
  $effect(() => {
    if (!mounted || !wantsScroll || !mainElement) return
    // Wait for the next frame to ensure the DOM is ready
    requestAnimationFrame(() => {
      scrollToMain()
      wantsScroll = false
    })
  })

  // Reference to the main element
  let mainElement: HTMLElement
  function scrollToMain() {
    mainElement?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // On change to isRolling, set a new sequence
  // update sequence according to playMode
  $effect(() => {
    if (isRolling) {
      if (playMode === "dice") {
        sequence = generateRandomSequence()
      } else if (playMode === "shortestWords") {
        sequence = getRandomShortestPlay().sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "longestWords") {
        sequence = getRandomLongestPlay().sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "shortestLetters") {
        sequence = getRandomShortestPlay({ countLetters: true }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "longestLetters") {
        sequence = getRandomLongestPlay({ countLetters: true }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allOne") {
        sequence = generateAllSamePipsSequence({ pips: 1 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allTwo") {
        sequence = generateAllSamePipsSequence({ pips: 2 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allThree") {
        sequence = generateAllSamePipsSequence({ pips: 3 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allFour") {
        sequence = generateAllSamePipsSequence({ pips: 4 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allFive") {
        sequence = generateAllSamePipsSequence({ pips: 5 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      } else if (playMode === "allSix") {
        sequence = generateAllSamePipsSequence({ pips: 6 }).sequence
        setTimeout(() => {
          isRolling = false
        }, 1000)
      }
    }
  })

  // Track scroll position
  let scrollY = $state(0)
  let innerHeight = $state(0)
  let showBackToTop = $derived(scrollY > innerHeight)
  let showShareButton = $derived(scrollY > innerHeight * 0.1)

  // Add function to scroll back to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  // for button group of play generating buttons
  let showButtons = $state(false)
  let showPipButtons = $state(false)

  // hamburger menu state
  let isMenuOpen = $state(false)

  function toggleMenu() {
    isMenuOpen = !isMenuOpen
  }

  function closeMenu() {
    isMenuOpen = false
  }

  function handleCloseButtonClick() {
    closeMenu()
  }

  // Simple escape key handler
  function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMenu()
    }
  }

  // Handle clicks outside the menu
  function handleDocumentClick(event: MouseEvent) {
    if (!isMenuOpen) return
    
    const target = event.target as Element
    const menuElement = document.querySelector('nav[data-menu="true"]')
    const hamburgerButton = document.querySelector('button[data-hamburger="true"]')
    
    // Check if click is outside menu and hamburger button
    if (menuElement && hamburgerButton) {
      if (!menuElement.contains(target) && !hamburgerButton.contains(target)) {
        closeMenu()
      }
    }
  }

  // Add document click listener when component mounts
  $effect(() => {
    if (mounted) {
      document.addEventListener('click', handleDocumentClick)
      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  })
</script>

<svelte:window bind:scrollY bind:innerHeight onkeydown={handleEscape} />

<header class="h-screen w-full p-4 md:p-16">
  <div
    class="relative flex h-full w-full flex-col items-center justify-evenly bg-sky-800 px-8 text-center text-amber-50 ring-4 ring-sky-800 ring-offset-4 ring-offset-amber-50"
  >
    <!-- Hamburger Menu Button -->
    <button
      class="absolute top-6 left-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg text-sky-800 transition-all focus:outline-none focus:ring-2 focus:ring-amber-300"
      onclick={toggleMenu}
      data-hamburger="true"
      aria-label={$locale === "de" ? "Menü öffnen" : "Open menu"}
    >
      <div class="hamburger-icon">
        <span class="hamburger-line" class:open={isMenuOpen}></span>
        <span class="hamburger-line" class:open={isMenuOpen}></span>
        <span class="hamburger-line" class:open={isMenuOpen}></span>
      </div>
    </button>

    <!-- Slide-out Menu -->
    <nav
      class="fixed top-0 left-0 z-50 h-full w-80 bg-sky-900 text-amber-50 shadow-lg transition-transform duration-300 ease-in-out"
      style="transform: translateX({isMenuOpen ? '0px' : '-320px'})"
      data-menu="true"
    >
      <div class="p-6">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-xl font-bold">
            {$locale === "de" ? "Menü" : "Menu"}
          </h2>
          <button
            onclick={handleCloseButtonClick}
            class="flex h-8 w-8 items-center justify-center rounded-full text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer relative z-10 text-4xl font-bold"
            aria-label={$locale === "de" ? "Menü schließen" : "Close menu"}
            type="button"
          >
            ×
          </button>
        </div>

        <div class="space-y-6">
          <!-- Language Toggle -->
          <div class="border-b border-sky-700 pb-4">
            <h3 class="mb-2 text-sm font-semibold uppercase text-amber-50">
              {$locale === "de" ? "Sprache umschalten" : "Toggle Language"}
            </h3>
            <button
              onclick={() => { toggleLanguage(); closeMenu(); }}
              class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
            >
              {$locale === "de" ? "English" : "Deutsch"}
            </button>
          </div>

          <!-- Play Generation Options -->
          <div class="border-b border-sky-700 pb-4">
            <h3 class="mb-2 text-sm font-semibold uppercase text-amber-50">
              {$locale === "de" ? "Stück generieren" : "Generate Play"}
            </h3>
            <div class="space-y-2">
              <button
                onclick={() => { playMode = "shortestWords"; isRolling = true; closeMenu(); }}
                class="w-full cursor-pointer rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
              >
                {$locale === "de" ? "Kürzestes (Wörter)" : "Shortest (words)"}
              </button>
              <button
                onclick={() => { playMode = "longestWords"; isRolling = true; closeMenu(); }}
                class="w-full cursor-pointer rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
              >
                {$locale === "de" ? "Längstes (Wörter)" : "Longest (words)"}
              </button>
              <button
                onclick={() => { playMode = "shortestLetters"; isRolling = true; closeMenu(); }}
                class="w-full cursor-pointer rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
              >
                {$locale === "de" ? "Kürzestes (Buchstaben)" : "Shortest (letters)"}
              </button>
              <button
                onclick={() => { playMode = "longestLetters"; isRolling = true; closeMenu(); }}
                class="w-full cursor-pointer rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
              >
                {$locale === "de" ? "Längstes (Buchstaben)" : "Longest (letters)"}
              </button>
            </div>
          </div>

          <!-- Same Pip Options -->
          <div class="border-b border-sky-700 pb-4">
            <h3 class="mb-2 text-sm font-semibold uppercase text-amber-50">
              {$locale === "de" ? "Gleiche Augenzahl" : "Same Pips"}
            </h3>
            <div class="grid grid-cols-3 gap-2">
              <button
                onclick={() => { playMode = "allOne"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="1"
              >
                <div class="bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
              <button
                onclick={() => { playMode = "allTwo"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="2"
              >
                <div class="bg-white rounded-lg">
                 <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="10" fill="#075985" />
                    <circle cx="70" cy="70" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
              <button
                onclick={() => { playMode = "allThree"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="3"
              >
                <div class="bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="10" fill="#075985" />
                    <circle cx="50" cy="50" r="10" fill="#075985" />
                    <circle cx="70" cy="70" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
              <button
                onclick={() => { playMode = "allFour"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="4"
              >
                <div class="bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="10" fill="#075985" />
                    <circle cx="30" cy="70" r="10" fill="#075985" />
                    <circle cx="70" cy="30" r="10" fill="#075985" />
                    <circle cx="70" cy="70" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
              <button
                onclick={() => { playMode = "allFive"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="5"
              >
                <div class="bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="10" fill="#075985" />
                    <circle cx="30" cy="70" r="10" fill="#075985" />
                    <circle cx="50" cy="50" r="10" fill="#075985" />
                    <circle cx="70" cy="30" r="10" fill="#075985" />
                    <circle cx="70" cy="70" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
              <button
                onclick={() => { playMode = "allSix"; isRolling = true; closeMenu(); }}
                class="rounded-lg cursor-pointer bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label="6"
              >
                <div class="bg-white rounded-lg">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="20" r="10" fill="#075985" />
                    <circle cx="30" cy="50" r="10" fill="#075985" />
                    <circle cx="30" cy="80" r="10" fill="#075985" />
                    <circle cx="70" cy="20" r="10" fill="#075985" />
                    <circle cx="70" cy="50" r="10" fill="#075985" />
                    <circle cx="70" cy="80" r="10" fill="#075985" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Additional Actions -->
          <div>
            <h3 class="mb-2 text-sm font-semibold uppercase text-amber-50">
              {$locale === "de" ? "Exportieren" : "Export"}
            </h3>
            <div class="space-y-2">
              <button
                onclick={() => { downloadTEIDoc([...sequence]); closeMenu(); }}
                class="w-full cursor-pointer rounded-lg bg-amber-600 px-4 py-10 text-white transition-colors hover:bg-amber-500"
              >
                {$locale === "de" ? "TEI-Dokument herunterladen" : "Download TEI document"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

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
      <Dice3D bind:isRolling bind:playMode />
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
          bind:sequence
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
    class="fixed right-6 bottom-25 flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-sky-800 text-white shadow-lg transition-all hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
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
<div>
  {#if showShareButton}
    <!-- Share Button Component -->
    <ShareButton {sequence} />
  {/if}
</div>

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

  /* Hamburger menu styles */
  .hamburger-icon {
    position: relative;
    width: 42px;
    height: 33px;
    padding-inline: .5em;
  }

  .hamburger-line {
    display: block;
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: var(--color-amber-50);
    border-radius: 1px;
    transition: all 0.3s ease-in-out;
  }

  .hamburger-line:nth-child(1) {
    top: 0;
  }

  .hamburger-line:nth-child(2) {
    top: 50%;
    transform: translateY(-50%);
  }

  .hamburger-line:nth-child(3) {
    bottom: 0;
  }
</style>
