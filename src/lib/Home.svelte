<script lang="ts">
  import { onMount } from 'svelte'
  import Timer from './components/Timer.svelte'

  let duration = $state(90)

  function handleUpdated(data: { duration: number }) {
    console.log('timer was updated', data)
  }

  onMount(() => {
    console.log('Gidget mounted')
  })
</script>

<main class="w-screen h-screen !m-0 !p-0">
  <Timer {duration} onUpdated={handleUpdated} />
</main>
