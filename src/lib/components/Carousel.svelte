<script lang="ts">
  import Segment from "$lib/components/Segment.svelte"
  import type { EmblaCarouselType, EmblaPluginType } from "embla-carousel"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
  import { onDestroy } from "svelte"

  let {
    index,
    focusPips
  }: {
    index: number
    focusPips: number | null
  } = $props()

  let emblaApi: EmblaCarouselType
  let plugins: EmblaPluginType[] = [WheelGesturesPlugin()]

  function onInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail
    // Initialise position
    handleFocusPips({ jump: true })

    // Attach event listener for slide change
    // settle: Runs when the carousel has settled after scroll has been triggered.
    emblaApi.on("settle", () => {
      focusPips = emblaApi.selectedScrollSnap() + 1
    })
  }

  function handleFocusPips(options = { jump: false }) {
    if (!focusPips || !emblaApi) return
    emblaApi.scrollTo(focusPips - 1, options.jump)
  }

  // When the focusPips value changes, scroll to it
  $effect(() => {
    if (!focusPips || !emblaApi) return
    emblaApi.scrollTo(focusPips - 1)
  })

  onDestroy(() => {
    emblaApi?.destroy()
  })
</script>

<div
  class="embla rounded-box w-screen max-w-(--breakpoint-2xl) p-4"
  use:emblaCarouselSvelte={{ plugins, options: {} }}
  onemblaInit={onInit}
>
  <div class="flex">
    {#each Array.from({ length: 6 }, (_, i) => i + 1) as pips}
      <div class="roll me-10 select-none *:w-sm">
        <Segment {index} {pips} />
      </div>
    {/each}
  </div>
</div>
