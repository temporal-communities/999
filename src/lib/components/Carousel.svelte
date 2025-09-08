<script lang="ts">
  import Segment from "$lib/components/Segment.svelte"
  import type { EmblaCarouselType, EmblaPluginType } from "embla-carousel"
  import emblaCarouselSvelte from "embla-carousel-svelte"
  import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures"
  import { onDestroy } from "svelte"

  let {
    index,
    focusPips,
    isRolling = false,
    sequence = $bindable()
  }: {
    index: number
    focusPips: number | null
    isRolling?: boolean
    sequence: number[]
  } = $props()

  let emblaApi: EmblaCarouselType
  let plugins: EmblaPluginType[] = [WheelGesturesPlugin()]
  let scrollInterval: ReturnType<typeof setInterval> | null = null

  function onInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail
    // Initialise position
    handleFocusPips({ jump: true })

    // Attach event listener for slide change
    // settle: Runs when the carousel has settled after scroll has been triggered.
    // use event listener to update sequence if focusPips change in Carousel
    emblaApi.on("settle", () => {
      // focusPips = emblaApi.selectedScrollSnap() + 1
      const newFocusPips = emblaApi.selectedScrollSnap() + 1
      // only update if pips actually changed
      if (focusPips !== newFocusPips) {
        focusPips = newFocusPips

        if (sequence) {
          sequence[index - 1] = newFocusPips
          sequence = [...sequence]
        }
      }
    })
  }

  function handleFocusPips(options = { jump: false }) {
    if (!focusPips || !emblaApi) return
    // @ts-expect-error Third argument not typed. See https://github.com/davidjerleke/embla-carousel/issues/1120#issuecomment-2664709719
    emblaApi.scrollTo(focusPips - 1, options.jump, -1)
  }

  // Start or stop rolling based on isRolling prop
  $effect(() => {
    if (isRolling && emblaApi) {
      const intervalTime = 100 // Adjust for desired speed
      scrollInterval = setInterval(() => {
        emblaApi.scrollNext()
      }, intervalTime)
    } else if (scrollInterval) {
      clearInterval(scrollInterval)
      scrollInterval = null

      // Go to the final position when rolling stops
      if (!isRolling && focusPips && emblaApi) {
        handleFocusPips()
      }
    }
  })

  // Handle focusPips changes when not rolling
  $effect(() => {
    if (!focusPips || !emblaApi || isRolling) return
    emblaApi.scrollTo(focusPips - 1)
  })

  onDestroy(() => {
    if (scrollInterval) {
      clearInterval(scrollInterval)
    }
    emblaApi?.destroy()
  })
</script>

<div
  class="embla rounded-box w-screen max-w-(--breakpoint-2xl) p-4"
  use:emblaCarouselSvelte={{
    plugins,
    options: {
      skipSnaps: isRolling,
      containScroll: "keepSnaps"
    }
  }}
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
