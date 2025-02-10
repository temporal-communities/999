<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  export let onClick: () => void

  let isRolling = false
  let isHovering = false
  let currentRotation = { x: 0, y: 0 }
  let hoverInterval: ReturnType<typeof setInterval>

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
      isHovering = true
      setTimeout(() => {
        isHovering = false
      }, 2000) // Hover effect lasts 2 seconds
    }
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
  })

  function handleMouseEnter() {
    if (!isRolling) isHovering = true
  }

  function handleMouseLeave() {
    isHovering = false
  }

  function handleClick() {
    if (isRolling) return // Prevent multiple clicks during animation

    isRolling = true
    isHovering = false

    // Trigger the onClick handler immediately
    onClick()

    // Get a different random face
    let newIndex = Math.floor(Math.random() * faceRotations.length)
    while (
      faceRotations[newIndex].x === currentRotation.x &&
      faceRotations[newIndex].y === currentRotation.y
    ) {
      newIndex = Math.floor(Math.random() * faceRotations.length)
    }
    currentRotation = faceRotations[newIndex]

    // Reset rolling state after animation
    setTimeout(() => {
      isRolling = false
    }, 2000)
  }

  $: diceTransform = isRolling
    ? undefined
    : isHovering
      ? `rotateX(45deg) rotateY(45deg)`
      : `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`
</script>

<button
  class="dice-container"
  class:rolling={isRolling}
  class:hovering={isHovering}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={handleClick}
  disabled={isRolling}
  aria-label="Roll dice"
>
  <div
    class="dice"
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
    transition: none; /* Disable transition during roll animation */
    animation: roll 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .side {
    background: white;
    border: 6px solid #075985;
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

  @keyframes roll {
    0% {
      transform: rotateX(0) rotateY(0);
    }
    80% {
      transform: rotateX(720deg) rotateY(360deg);
    }
    100% {
      transform: rotateX(var(--final-x)) rotateY(var(--final-y));
    }
  }
</style>
