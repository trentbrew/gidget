<script lang="ts">
  import { MENU_ITEMS } from '../constants/menu'

  let { onNavigate } = $props<{ onNavigate: (component: string) => void }>()

  function navigateTo(component: string) {
    onNavigate(component)
  }
</script>

<div class="w-full h-16 fixed bottom-0 z-100 bg-base-200 p-2">
  <nav class="flex gap-4 justify-center items-center">
    {#each MENU_ITEMS as item}
      <button
        class="btn btn-ghost btn-square"
        onclick={() => navigateTo(item.component)}
      >
        <span class="text-xl" title={item.label}>{item.icon}</span>
      </button>
    {/each}
  </nav>
</div>
