<script lang="ts">
  import { onMount } from 'svelte'
  import Timer from './components/Timer.svelte'

  let duration = $state(900)

  function handleUpdated(data: { duration: number }) {
    console.log('timer was updated', data)
  }

  onMount(() => {
    console.log('Gidget mounted')
  })
</script>

<main
  class="w-full h-[calc(100vh-4rem)] !m-0 !p-0 flex justify-center items-center"
>
  <Timer {duration} onUpdated={handleUpdated} />
</main>
