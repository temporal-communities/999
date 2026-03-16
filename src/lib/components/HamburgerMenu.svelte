<script lang="ts">
  import { locale, sourceLocale } from "$lib/stores/locale"
  import { onMount } from "svelte"

  interface PlayGenerationOption {
    mode: string
    labelDe: string
    labelEn: string
  }

  interface PipOption {
    mode: string
    label: string
  }

  interface Props {
    playGenerationOptions?: PlayGenerationOption[]
    pipOptions?: PipOption[]
    onSelectMode?: (mode: string) => void
    showSourceToggle?: boolean
  }

  let {
    playGenerationOptions = [],
    pipOptions = [],
    onSelectMode,
    showSourceToggle = true
  }: Props = $props()

  let isMenuOpen = $state(false)

  function toggleLanguage() {
    $locale = $locale === "de" ? "en" : "de"
  }

  function toggleSourceLanguage() {
    $sourceLocale = $sourceLocale === "de" ? "en" : "de"
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen
  }

  function closeMenu() {
    isMenuOpen = false
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu()
    }
  }

  function handleDocumentClick(event: MouseEvent) {
    if (!isMenuOpen) return
    const target = event.target as Element
    const menuElement = document.querySelector('nav[data-menu="true"]')
    const hamburgerButton = document.querySelector('button[data-hamburger="true"]')
    if (menuElement && hamburgerButton) {
      if (!menuElement.contains(target) && !hamburgerButton.contains(target)) {
        closeMenu()
      }
    }
  }

  onMount(() => {
    document.addEventListener("click", handleDocumentClick)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
      document.removeEventListener("keydown", handleEscape)
    }
  })
</script>

<!-- Hamburger Menu Button -->
<button
  class="absolute top-6 left-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg text-sky-800 transition-all focus:ring-2 focus:ring-amber-300 focus:outline-none"
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
        onclick={closeMenu}
        class="relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-4xl font-bold text-amber-50 focus:ring-2 focus:ring-amber-300 focus:outline-none"
        aria-label={$locale === "de" ? "Menü schließen" : "Close menu"}
        type="button"
      >
        ×
      </button>
    </div>

    <div class="space-y-6">
      <!-- Language Toggle -->
      <div class="border-b border-sky-700 pb-4">
        <h3 class="mb-2 text-sm font-semibold text-amber-50 uppercase">
          {$locale === "de" ? "Sprache umschalten" : "Toggle Language"}
        </h3>
        <button
          onclick={toggleLanguage}
          class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
        >
          {$locale === "de" ? "Deutsch" : "English"}
        </button>
      </div>

      <!-- Source Language Toggle -->
      {#if showSourceToggle}
        <div class="border-b border-sky-700 pb-4">
          <h3 class="mb-2 text-sm font-semibold text-amber-50 uppercase">
            {$locale === "de" ? "Quelltext umschalten" : "Toggle Source Text"}
          </h3>
          <button
            onclick={toggleSourceLanguage}
            class="flex w-full cursor-pointer items-center justify-center rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
          >
            {$sourceLocale === "de" ? "Deutsch" : "English"}
          </button>
        </div>
      {/if}

      {#if playGenerationOptions.length > 0}
        <!-- Play Generation Options -->
        <div class="border-b border-sky-700 pb-4">
          <h3 class="mb-2 text-sm font-semibold text-amber-50 uppercase">
            {$locale === "de" ? "Stück generieren" : "Generate Play"}
          </h3>
          <div class="space-y-2">
            {#each playGenerationOptions as option}
              <button
                onclick={() => {
                  onSelectMode?.(option.mode)
                  closeMenu()
                }}
                class="w-full cursor-pointer rounded-lg bg-amber-50 px-4 py-2 text-sky-800 transition-colors hover:bg-amber-100"
              >
                {$locale === "de" ? option.labelDe : option.labelEn}
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if pipOptions.length > 0}
        <!-- Same Pip Options -->
        <div class="border-b border-sky-700 pb-4">
          <h3 class="mb-2 text-sm font-semibold text-amber-50 uppercase">
            {$locale === "de" ? "Gleiche Augenzahl" : "Same Pips"}
          </h3>
          <div class="grid grid-cols-3 gap-2">
            {#each pipOptions as option}
              <button
                onclick={() => {
                  onSelectMode?.(option.mode)
                  closeMenu()
                }}
                class="cursor-pointer rounded-lg bg-white p-1 transition-colors hover:bg-amber-100"
                aria-label={option.label}
              >
                <div class="rounded-lg bg-white">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {#if option.label === "1"}
                      <circle cx="50" cy="50" r="10" fill="#075985" />
                    {:else if option.label === "2"}
                      <circle cx="30" cy="30" r="10" fill="#075985" />
                      <circle cx="70" cy="70" r="10" fill="#075985" />
                    {:else if option.label === "3"}
                      <circle cx="30" cy="30" r="10" fill="#075985" />
                      <circle cx="50" cy="50" r="10" fill="#075985" />
                      <circle cx="70" cy="70" r="10" fill="#075985" />
                    {:else if option.label === "4"}
                      <circle cx="30" cy="30" r="10" fill="#075985" />
                      <circle cx="30" cy="70" r="10" fill="#075985" />
                      <circle cx="70" cy="30" r="10" fill="#075985" />
                      <circle cx="70" cy="70" r="10" fill="#075985" />
                    {:else if option.label === "5"}
                      <circle cx="30" cy="30" r="10" fill="#075985" />
                      <circle cx="30" cy="70" r="10" fill="#075985" />
                      <circle cx="50" cy="50" r="10" fill="#075985" />
                      <circle cx="70" cy="30" r="10" fill="#075985" />
                      <circle cx="70" cy="70" r="10" fill="#075985" />
                    {:else if option.label === "6"}
                      <circle cx="30" cy="20" r="10" fill="#075985" />
                      <circle cx="30" cy="50" r="10" fill="#075985" />
                      <circle cx="30" cy="80" r="10" fill="#075985" />
                      <circle cx="70" cy="20" r="10" fill="#075985" />
                      <circle cx="70" cy="50" r="10" fill="#075985" />
                      <circle cx="70" cy="80" r="10" fill="#075985" />
                    {/if}
                  </svg>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>

<style>
  .hamburger-icon {
    position: relative;
    width: 42px;
    height: 33px;
    padding-inline: 0.5em;
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
