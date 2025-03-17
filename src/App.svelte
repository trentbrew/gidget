<script lang="ts">
  import { onMount } from 'svelte'
  import { theme, initializeTheme } from './lib/stores/theme'
  import { writable } from 'svelte/store'

  import Home from './lib/Home.svelte'
  import Settings from './lib/Settings.svelte'
  import Records from './lib/Records.svelte'
  import Alert from './lib/components/Alert.svelte'

  const components = {
    Home,
    Settings,
    Records,
  }

  const currentComponent = writable('Home')

  onMount(() => {
    console.log('mounted App.svelte')
    initializeTheme()
  })

  function setComponent(component: string) {
    currentComponent.set(component)
  }
</script>

<!-- <div class="h-full bg-base-100" data-theme={$theme}>
  <div class="flex justify-center items-center h-full">
    {#if $currentComponent === 'Home'}
      <Home />
    {:else if $currentComponent === 'Settings'}
      <Settings />
    {:else if $currentComponent === 'Records'}
      <Records />
    {/if}
    <nav
      class="flex justify-around p-4 bg-black fixed bottom-0 w-full text-white"
    >
      <button onclick={() => setComponent('Home')}>Home</button>
      <button onclick={() => setComponent('Settings')}>Settings</button>
      <button onclick={() => setComponent('Records')}>Records</button>
    </nav>
  </div>
</div> -->

<!-- TODO: Add alerts -->
<!-- <div class="fixed bottom-0 w-full z-99">
  <Alert type="info" message="How's it going?" />
  <Alert type="warning" message="Half way done!" />
  <Alert type="success" message="You got this!" />
</div> -->
