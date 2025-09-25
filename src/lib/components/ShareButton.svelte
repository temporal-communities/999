<script lang="ts">
  import shareIcon from "$lib/assets/share-icon.svg"
  import { locale } from "$lib/stores/locale"
  import { fade } from "svelte/transition"
  import { downloadTEIDoc } from "$lib/tei"

  let { sequence } = $props<{ sequence: number[] }>()

  // track if url has been copied to clipboard
  let urlCopied: boolean = $state(false)

  let sharingUrl = $derived(
    window.location.origin + window.location.pathname + "#" + sequence.join("")
  )
  // function to copy url including sequence to clipboard
  async function copyUrlToClipboard(event: MouseEvent) {
    try {
      const url = sharingUrl
      await navigator.clipboard.writeText(url)
      urlCopied = true

      setTimeout(() => {
        urlCopied = false
        ;(event.target as HTMLButtonElement).blur() // remove focus ring from the clicked button
      }, 3000)
    } catch (err) {
      console.error("Failed to copy URL to clipboard:", err)
    }
  }

  let showDialogue: boolean = $state(false)
  function toggleDialogue(event: MouseEvent) {
    showDialogue = !showDialogue
    ;(event.target as HTMLButtonElement).blur()
  }
</script>

<!-- Share Button that opens dialogue for copying url with current sequence -->
<div class="fixed right-6 bottom-6 flex items-center space-x-2">
  {#if showDialogue}
    <div
      transition:fade={{ duration: 200 }}
      class="absolute right-20 bottom-0 rounded-lg border border-gray-300 bg-white p-3 shadow-lg"
    >
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onclick={toggleDialogue}
      >
        ✕
      </button>
      <p class="text-gray-700">
        {$locale === "de"
          ? "Teile deinen gewürfelten Einakter:"
          : "Share your randomised one-act play:"}
      </p>
      <div
        class="mt-2 flex flex-col items-center space-y-2 space-x-2 sm:flex-row sm:space-y-0 sm:space-x-2"
      >
        <input type="text" class="rounded border bg-gray-100 p-1" value={sharingUrl} readonly />
        <button
          class="w-32 rounded bg-sky-800 p-1 text-white transition hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          onclick={copyUrlToClipboard}
        >
          {urlCopied
            ? $locale === "de"
              ? "Link kopiert!"
              : "Link copied!"
            : $locale === "de"
              ? "Link kopieren"
              : "Copy link"}
        </button>
      </div>
      <!-- Download TEI file button -->
      <div class="mt-3 flex justify-center">
        <button
          class="w-full rounded bg-sky-800 p-1 text-white transition hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          onclick={() => downloadTEIDoc([...sequence])}
        >
          {$locale === "de" ? "TEI-Datei herunterladen" : "Download TEI file"}
        </button>
      </div>
    </div>
  {/if}

  <!-- Share Button -->
  <button
    onclick={toggleDialogue}
    transition:fade={{ duration: 300 }}
    class="flex h-18 w-18 cursor-pointer items-center justify-center rounded-full bg-sky-800 text-white shadow-lg transition-all hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
    aria-label={$locale === "de" ? "Dialog zum Teilen öffnen" : "Open share dialogue"}
    title={$locale === "de" ? "Dialog zum Teilen öffnen" : "Open share dialogue"}
  >
    <!-- Share Icon -->
    <img src={shareIcon} alt="Share" class="h-5 w-5" />
  </button>
</div>
