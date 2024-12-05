<script lang="ts">
  import Icon from './Icon.svelte'

  const DEFAULT_DURATION = 90
  const AI = chrome?.aiOriginTrial?.languageModel

  // Props
  let { duration, onUpdated } = $props()

  // Timer state
  let timeInSeconds = $state(duration)
  let isRunning = $state(false)
  let initialTime = $state(DEFAULT_DURATION)

  // Prompt state
  let prompt = $state('')

  // Format time to MM:SS
  let formattedTime = $derived(
    `${Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0')}:${(timeInSeconds % 60).toString().padStart(2, '0')}`,
  )

  // Calculate progress percentage
  let progress = $derived((timeInSeconds / initialTime) * 100)

  // Calculate dynamic color based on remaining time
  let timerColor = $derived(
    `hsl(${(timeInSeconds / initialTime) * 120}, 80%, 45%)`,
  )

  let haloStroke = $derived(
    `hsl(${(timeInSeconds / initialTime) * 120}, 80%, 45%)`,
  )

  let haloDasharray = $derived(2 * Math.PI * 140)

  let haloDashoffset = $derived(
    haloDasharray * (1 - timeInSeconds / initialTime),
  )

  // Timer logic
  $effect(() => {
    let interval: any

    if (isRunning && timeInSeconds > 0) {
      interval = setInterval(() => {
        onUpdated({ current: timeInSeconds })
        timeInSeconds--
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  })

  // Timer controls
  function toggleTimer() {
    isRunning = !isRunning
  }

  function resetTimer() {
    isRunning = false
    timeInSeconds = initialTime
  }

  // Time adjustment
  function adjustTime(minutes: number) {
    if (!isRunning) {
      timeInSeconds = Math.max(0, timeInSeconds + minutes * 60)
      initialTime = timeInSeconds
    }
  }
</script>

<div
  class="flex flex-col items-center gap-8 p-0"
  style="background-color: {true ? 'transparent' : timerColor}"
>
  <!-- Timer Display with Halo -->
  <div class="relative w-72 h-72 flex items-center justify-center rounded-full">
    <!-- Animated Halo -->
    <svg class="absolute w-full h-full -rotate-90 duration-300 rounded-full scale-[0.88]">
      <circle
        cx="144"
        cy="144"
        r="140"
        fill="none"
        stroke-width="10"
        class="opacity-60 transition-all duration-300"
        style="stroke: {haloStroke}; stroke-dasharray: {haloDasharray}; stroke-dashoffset: {haloDashoffset}; transition: all linear 1000ms !important;"
      />
    </svg>

    <!-- Timer Circle -->
    <div
      class="relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-300"
    >
      <div class="absolute inset-0 rounded-full"></div>
      <div class="absolute inset-2 bg-black/[0.05] rounded-full"></div>
      <div class="relative text-5xl font-light tracking-wider">
        <div
          class="countdown font-mono text-3xl flex items-center"
          style={`color: ${timerColor}`}
        >
          <span style={`--value: ${Math.floor(timeInSeconds / 3600)}`}></span>
          :
          <span
            style="--value: {Math.floor((timeInSeconds % 3600) / 60)};"
          ></span>
          :
          <span style={`--value: ${timeInSeconds % 60}`}></span>
        </div>
      </div>
    </div>
  </div>

  <!-- Controls -->
  <div class="flex items-center gap-4">
    <button
      onclick={toggleTimer}
      aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      class="p-3 rounded-full hover:bg-slate-100 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        {#if isRunning}
          <!-- Pause icon -->
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        {:else}
          <!-- Play icon -->
          <polygon points="5 3 19 12 5 21 5 3" />
        {/if}
      </svg>
    </button>

    <button
      onclick={resetTimer}
      aria-label="Reset timer"
      class="p-3 rounded-full hover:bg-slate-100 transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  </div>

  <!-- Time Adjustment -->
  <div class="flex gap-3">
    {#each [-5, -1, 1, 5] as minutes}
      <button
        onclick={() => adjustTime(minutes)}
        class="px-3 py-1 rounded-full text-sm transition-all duration-200 font-medium"
        style="border: 1.5px solid"
      >
        {minutes > 0 ? '+' : ''}{minutes}m
      </button>
    {/each}
  </div>

  <!-- Prompt -->
  <!-- <label for="prompt-input" class="form-control w-full">
    <div class="join w-full">
      <input
        id="prompt-input"
        bind:value={prompt}
        class="input input-bordered join-item text-xs"
        placeholder="What are you working on?"
      />
      <button class="btn join-item bg-base-content text-base-100">
        <Icon name="send" />
      </button>
    </div>
  </label> -->
</div>
