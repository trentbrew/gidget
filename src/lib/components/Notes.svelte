<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  let noteInput = $state('')
  let notes = writable<string[]>([])

  function addNote() {
    if (noteInput.trim()) {
      notes.update((n) => [...n, noteInput.trim()])
      noteInput = ''
    }
  }

  function deleteNote(index: number) {
    notes.update((n) => {
      n.splice(index, 1)
      return n
    })
  }

  onMount(async () => {
    const data = await chrome.storage.local.get('notes')
    if (data.notes) {
      notes.set(data.notes)
    }
  })

  $effect(() => {
    chrome.storage.local.set({ notes: $notes })
  })
</script>

<div class="max-w-2xl mx-auto p-6">
  <h2 class="text-2xl font-bold mb-6">Notes</h2>

  <div class="mb-4">
    <input
      type="text"
      class="input input-bordered w-full"
      placeholder="Enter a new note"
      bind:value={noteInput}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          addNote()
        }
      }}
    />
  </div>

  <div class="space-y-4">
    {#each $notes as note, i}
      <div class="bg-base-200 p-4 rounded-lg flex justify-between items-center">
        <div>{note}</div>
        <button class="btn btn-sm btn-error" on:click={() => deleteNote(i)}>
          Delete
        </button>
      </div>
    {/each}
  </div>
</div>
