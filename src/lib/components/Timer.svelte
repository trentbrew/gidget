<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { writable, derived } from 'svelte/store'
  import Icon from './Icon.svelte'

  // Props
  let { duration, onUpdated } = $props()

  // Timer state
  let timeInSeconds = writable(duration)
  let isRunning = writable(false)
  let initialTime = writable(duration)

  // Prompt state
  let prompt = ''

  // Derived values
  $: formattedTime = $derived(timeInSeconds, ($timeInSeconds) => {
    const minutes = Math.floor($timeInSeconds / 60)
      .toString()
      .padStart(2, '0')
    const seconds = ($timeInSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  $: progress = derived(
    [timeInSeconds, initialTime],
    ([$timeInSeconds, $initialTime]) => ($timeInSeconds / $initialTime) * 100,
  )

  $: timerColor = 'white'
  $: haloStroke = 'white'
  $: haloDasharray = 2 * Math.PI * 140
  $: haloDashoffset = derived(
    [haloDasharray, timeInSeconds, initialTime],
    ([$haloDasharray, $timeInSeconds, $initialTime]) =>
      $haloDasharray * (1 - $timeInSeconds / $initialTime),
  )

  let interval: NodeJS.Timeout | null = null

  // Timer logic
  $: {
    if ($isRunning && $timeInSeconds > 0) {
      interval = setInterval(() => {
        onUpdated({ current: $timeInSeconds })
        timeInSeconds.update((t) => t - 1)

        if ($timeInSeconds <= 0) {
          isRunning.set(false)
          if (interval) clearInterval(interval)
        }
      }, 1000)
    } else if (!$isRunning && interval) {
      clearInterval(interval)
      interval = null
    }
  }

  onMount(() => {
    console.log('Timer mounted')
  })

  onDestroy(() => {
    if (interval) clearInterval(interval)
  })

  // Timer controls
  function toggleTimer() {
    isRunning.update((r) => !r)
  }

  function resetTimer() {
    isRunning.set(false)
    timeInSeconds.set($initialTime)
    onUpdated({ current: $timeInSeconds })
  }

  function handlePreset(preset: number) {
    if (!$isRunning) {
      timeInSeconds.set(preset * 60)
      initialTime.set(preset * 60)
    }
  }
</script>

<template>
  <div class="flex flex-col items-center gap-8 p-0 pb-12 text-white">
    <!-- Timer Display -->
    <div
      class="relative w-72 h-72 flex items-center justify-center rounded-full bg-white/5"
    >
      <!-- Animated Halo -->
      <svg
        class="absolute w-full h-full -rotate-90 duration-300 rounded-full scale-[1.03]"
      >
        <circle
          cx="144"
          cy="144"
          r="140"
          fill="transparent"
          stroke-width="4"
          class="opacity-100 transition-all duration-300"
          style="stroke: {$haloStroke}; stroke-dasharray: {$haloDasharray}; stroke-dashoffset: {$haloDashoffset}; transition: all linear 1000ms !important;"
        />
      </svg>

      <!-- Timer Text -->
      <div class="relative font-light tracking-wider">
        <div
          class="countdown font-mono text-4xl flex items-center"
          style="color: {timerColor}"
        >
          <span style="--value: {Math.floor($timeInSeconds / 3600)}"></span>
          :
          <span
            style="--value: {Math.floor(($timeInSeconds % 3600) / 60)}"
          ></span>
          :
          <span style="--value: {$timeInSeconds % 60}"></span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-4 mb-4">
      <button
        on:click={toggleTimer}
        aria-label={$isRunning ? 'Pause timer' : 'Start timer'}
        class="flex justify-center items-center rounded-full hover:opacity-75 transition-colors duration-200 {$isRunning
          ? 'bg-red-500/50'
          : 'bg-green-500/50'}"
        style="width: 56px; height: 56px"
      >
        <Icon name={$isRunning ? 'pause' : 'play'} />
      </button>

      <!-- Reset Button -->
      <button
        on:click={resetTimer}
        aria-label="Reset timer"
        class="bg-white/5 border-[1px] border-white/25 flex justify-center items-center rounded-full hover:opacity-75 transition-colors duration-200"
        style="width: 56px; height: 56px"
      >
        <Icon name="refresh-ccw" />
      </button>
    </div>

    <!-- Presets -->
    <div class="flex gap-3">
      {#each [5, 15, 30, 60, 120] as preset}
        <button
          on:click={() => handlePreset(preset)}
          class="px-3 py-1 rounded-full text-sm transition-all duration-200 font-medium border-[1.5px] {$initialTime ===
          preset * 60
            ? 'border-white bg-white/10'
            : 'border-white/25 hover:bg-white/10'}"
        >
          {#if preset >= 60}
            {Math.floor(preset / 60)}
            <span class="text-xs opacity-[0.64] ml-[-2px]">h</span>
            {preset % 60 > 0 ? `${preset % 60}m` : ''}
          {:else}
            {preset}
            <span class="text-xs opacity-[0.64] ml-[-2px]">m</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</template>

<style>
  :global(.countdown) {
    line-height: 1em;
    display: inline-flex;
  }

  :global(.countdown > *) {
    height: 1em;
    display: inline-block;
    overflow-y: hidden;
  }

  :global(.countdown > :before) {
    position: relative;
    content: '00\A 01\A 02\A 03\A 04\A 05\A 06\A 07\A 08\A 09\A 10\A 11\A 12\A 13\A 14\A 15\A 16\A 17\A 18\A 19\A 20\A 21\A 22\A 23\A 24\A 25\A 26\A 27\A 28\A 29\A 30\A 31\A 32\A 33\A 34\A 35\A 36\A 37\A 38\A 39\A 40\A 41\A 42\A 43\A 44\A 45\A 46\A 47\A 48\A 49\A 50\A 51\A 52\A 53\A 54\A 55\A 56\A 57\A 58\A 59\A 60\A 61\A 62\A 63\A 64\A 65\A 66\A 67\A 68\A 69\A 70\A 71\A 72\A 73\A 74\A 75\A 76\A 77\A 78\A 79\A 80\A 81\A 82\A 83\A 84\A 85\A 86\A 87\A 88\A 89\A 90\A 91\A 92\A 93\A 94\A 95\A 96\A 97\A 98\A 99\A';
    white-space: pre;
    top: calc(var(--value) * -1em);
    text-align: center;
    transition: all 1s cubic-bezier(1, 0, 0, 1);
  }
</style>
