<script lang="ts">
  export let onClick: () => void

  let isRolling = false
  let isHovering = false

  function handleMouseEnter() {
    isHovering = true
  }

  function handleMouseLeave() {
    isHovering = false
  }

  function handleClick() {
    isRolling = true
    setTimeout(() => {
      isRolling = false
      onClick()
    }, 1000)
  }
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
  <div class="dice">
    <div class="face front">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="10" fill="#075985" />
      </svg>
    </div>
    <div class="face back">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="10" fill="#075985" />
        <circle cx="70" cy="70" r="10" fill="#075985" />
      </svg>
    </div>
    <div class="face right">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="10" fill="#075985" />
        <circle cx="50" cy="50" r="10" fill="#075985" />
        <circle cx="70" cy="70" r="10" fill="#075985" />
      </svg>
    </div>
    <div class="face left">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="10" fill="#075985" />
        <circle cx="30" cy="70" r="10" fill="#075985" />
        <circle cx="70" cy="30" r="10" fill="#075985" />
        <circle cx="70" cy="70" r="10" fill="#075985" />
      </svg>
    </div>
    <div class="face top">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="10" fill="#075985" />
        <circle cx="30" cy="70" r="10" fill="#075985" />
        <circle cx="50" cy="50" r="10" fill="#075985" />
        <circle cx="70" cy="30" r="10" fill="#075985" />
        <circle cx="70" cy="70" r="10" fill="#075985" />
      </svg>
    </div>
    <div class="face bottom">
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
    transition: transform 1s;
  }

  .hovering .dice {
    transform: rotateX(45deg) rotateY(45deg);
  }

  .rolling .dice {
    animation: roll 2s ease-in-out;
  }

  .face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: white;
    border: 6px solid #075985;
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
    100% {
      transform: rotateX(720deg) rotateY(360deg);
    }
  }
</style>
