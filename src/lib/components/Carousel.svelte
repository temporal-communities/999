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
  class="embla rounded-box max-w-screen p-4"
  use:emblaCarouselSvelte={{ plugins, options: {} }}
  onemblaInit={onInit}
>
  <div class="flex">
    <!-- Generate two rounds -->
    {#each Array.from({ length: 6 * 2 }, (_, i) => (i % 6) + 1) as pips}
      <div class="roll me-10 select-none *:w-sm">
        <Segment {index} {pips} />
      </div>
    {/each}
  </div>
</div>
