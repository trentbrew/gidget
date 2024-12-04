<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  let records = writable<string[]>([])

  onMount(() => {
    // Placeholder records
    records.set([
      'Record 1: Placeholder data',
      'Record 2: Placeholder data',
      'Record 3: Placeholder data',
      'Record 4: Placeholder data',
      'Record 5: Placeholder data',
    ])
  })
</script>

<div class="max-w-2xl mx-auto p-6">
  <h2 class="text-2xl font-bold mb-6">Past Records</h2>

  <div class="space-y-4">
    {#each $records as record}
      <div class="bg-base-200 p-4 rounded-lg">
        {record}
      </div>
    {/each}
  </div>
</div>
