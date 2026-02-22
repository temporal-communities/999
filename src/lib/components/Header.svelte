<script lang="ts">
  interface Props {
    children?: import("svelte").Snippet
    screenHeight?: boolean
  }
  let { children, screenHeight }: Props = $props()
</script>

<header class={[screenHeight ? "h-screen" : "h-auto", "w-full p-4 md:p-16"]}>
  <div
    class="relative flex h-full w-full flex-col items-center justify-evenly bg-sky-800 px-8 text-center text-amber-50 ring-4 ring-sky-800 ring-offset-4 ring-offset-amber-50"
  >
    {#if children}
      {@render children()}
    {/if}
  </div>
</header>
