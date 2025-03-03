<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { locale } from "$lib/stores/locale"

  let {
    isRolling = $bindable()
  }: {
    isRolling?: boolean
  } = $props()

  let buttonLabel = $derived($locale === "de" ? "Würfeln" : "Roll the dice")

  let attractMode = $state(false)
  let currentRotation = $state({ x: 0, y: 0 })
  let hoverInterval: ReturnType<typeof setInterval>

  // Animation variables
  let animationId: number | null = null
  let startRotation = { x: 0, y: 0 }
  let targetRotation = { x: 0, y: 0 }
  let animationStartTime = 0
  let diceElement: HTMLElement

  const faceRotations = [
    { x: 0, y: 0 }, // front (1)
    { x: 0, y: 180 }, // back (2)
    { x: 0, y: 90 }, // right (3)
    { x: 0, y: -90 }, // left (4)
    { x: 90, y: 0 }, // top (5)
    { x: -90, y: 0 } // bottom (6)
  ]

  function triggerHoverAnimation() {
    if (!isRolling) {
      attractMode = true
      setTimeout(() => {
        attractMode = false
      }, 2000) // Hover effect lasts 2 seconds
    }
  }

  // Animation function
  function animateDice(timestamp: number) {
    if (!animationStartTime) animationStartTime = timestamp
    const elapsed = timestamp - animationStartTime
    const duration = 3000

    if (elapsed < duration) {
      const progress = easeOutCubic(elapsed / duration)
      const extraRotation = 2
      const arcEffect = Math.sin(progress * Math.PI) * extraRotation * 90
      const rotationX =
        startRotation.x + progress * (targetRotation.x - startRotation.x) + arcEffect
      const rotationY =
        startRotation.y + progress * (targetRotation.y - startRotation.y) + arcEffect

      if (diceElement) {
        diceElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
      }

      animationId = requestAnimationFrame(animateDice)
    } else {
      // Animation complete
      if (diceElement) {
        diceElement.style.transform = `rotateX(${targetRotation.x}deg) rotateY(${targetRotation.y}deg)`
      }
      currentRotation = { ...targetRotation }
      animationId = null
      isRolling = false
      animationStartTime = 0
    }
  }

  // Simple easing function that provides basic deceleration
  function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3)
  }

  onMount(() => {
    const randomIndex = Math.floor(Math.random() * faceRotations.length)
    currentRotation = faceRotations[randomIndex]

    // Trigger hover animation immediately
    triggerHoverAnimation()

    // Set up interval for repeated hover animation
    hoverInterval = setInterval(triggerHoverAnimation, 15000)
  })

  onDestroy(() => {
    if (hoverInterval) {
      clearInterval(hoverInterval)
    }

    // Cancel any ongoing animation
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })

  function handleMouseEnter() {
    if (!isRolling) attractMode = true
  }

  function handleMouseLeave() {
    attractMode = false
  }

  function handleClick() {
    if (isRolling) return // Prevent multiple clicks during animation

    isRolling = true
    attractMode = false

    // Get a different random face
    let newIndex = Math.floor(Math.random() * faceRotations.length)
    while (
      faceRotations[newIndex].x === currentRotation.x &&
      faceRotations[newIndex].y === currentRotation.y
    ) {
      newIndex = Math.floor(Math.random() * faceRotations.length)
    }

    // Set up animation start and target
    startRotation = { ...currentRotation }
    targetRotation = { ...faceRotations[newIndex] }

    // Start the animation
    animationStartTime = 0
    animationId = requestAnimationFrame(animateDice)
  }

  let diceTransform = $derived(
    isRolling
      ? undefined // Let the animation handle this when rolling
      : attractMode
        ? `rotateX(45deg) rotateY(45deg)`
        : `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`
  )
</script>

<button
  class="dice-container"
  class:rolling={isRolling}
  class:hovering={attractMode}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  disabled={isRolling}
  aria-label={buttonLabel}
  title={buttonLabel}
>
  <div
    class="dice"
    bind:this={diceElement}
    style:--final-x={currentRotation.x}
    style:--final-y={currentRotation.y}
    style:transform={diceTransform}
  >
    <div class="face front">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
    <div class="face back">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="10" fill="#075985" />
          <circle cx="70" cy="70" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
    <div class="face right">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="10" fill="#075985" />
          <circle cx="50" cy="50" r="10" fill="#075985" />
          <circle cx="70" cy="70" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
    <div class="face left">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="10" fill="#075985" />
          <circle cx="30" cy="70" r="10" fill="#075985" />
          <circle cx="70" cy="30" r="10" fill="#075985" />
          <circle cx="70" cy="70" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
    <div class="face top">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="10" fill="#075985" />
          <circle cx="30" cy="70" r="10" fill="#075985" />
          <circle cx="50" cy="50" r="10" fill="#075985" />
          <circle cx="70" cy="30" r="10" fill="#075985" />
          <circle cx="70" cy="70" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
    <div class="face bottom">
      <div class="side">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="20" r="10" fill="#075985" />
          <circle cx="30" cy="50" r="10" fill="#075985" />
          <circle cx="30" cy="80" r="10" fill="#075985" />
          <circle cx="70" cy="20" r="10" fill="#075985" />
          <circle cx="70" cy="50" r="10" fill="#075985" />
          <circle cx="70" cy="80" r="10" fill="#075985" />
        </svg>
      </div>
    </div>
  </div>
</button>

<style>
  .dice-container {
    perspective: 1000px;
    width: 100px;
    height: 100px;
    cursor: pointer;
    transition: transform 0.2s;
    scale: 70%;
  }

  .dice {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .rolling .dice {
    transition: none; /* Disable transition during JavaScript animation */
  }

  .side {
    background: white;
    border: 6px solid #075985;
    outline: 1px solid #075985;
    border-radius: 20px;
  }
  .face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #075985;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .face svg {
    width: 100%;
    height: 100%;
  }

  .front {
    transform: rotateY(0deg) translateZ(50px);
  }
  .back {
    transform: rotateY(180deg) translateZ(50px);
  }
  .right {
    transform: rotateY(90deg) translateZ(50px);
  }
  .left {
    transform: rotateY(-90deg) translateZ(50px);
  }
  .top {
    transform: rotateX(90deg) translateZ(50px);
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(50px);
  }
</style>
