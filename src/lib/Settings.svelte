<script lang="ts">
  import { onMount } from 'svelte'
  import { theme } from './stores/theme'

  let autoScroll = $state(true)
  let fontSize = $state(14)
  let notifications = $state(true)

  function saveSettings() {
    chrome.storage.local.set({
      settings: {
        autoScroll,
        fontSize,
        notifications,
      },
    })
  }

  onMount(async () => {
    const data = await chrome.storage.local.get('settings')
    if (data.settings) {
      autoScroll = data.settings.autoScroll ?? true
      fontSize = data.settings.fontSize ?? 14
      notifications = data.settings.notifications ?? true
    }
  })
</script>

<div class="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg">
  <h2 class="text-2xl font-bold mb-6">Settings</h2>

  <div class="space-y-6">
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Auto-scroll chat</span>
        <input
          type="checkbox"
          class="toggle"
          bind:checked={autoScroll}
          onchange={saveSettings}
        />
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Font size</span>
      </label>
      <input
        type="range"
        min="12"
        max="24"
        class="range"
        bind:value={fontSize}
        onchange={saveSettings}
      />
      <div class="text-sm text-center mt-1">{fontSize}px</div>
    </div>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Enable notifications</span>
        <input
          type="checkbox"
          class="toggle"
          bind:checked={notifications}
          onchange={saveSettings}
        />
      </label>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Theme</span>
      </label>
      <select class="select select-bordered w-full" bind:value={$theme}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="cupcake">Cupcake</option>
        <option value="cyberpunk">Cyberpunk</option>
        <option value="synthwave">Synthwave</option>
      </select>
    </div>
  </div>
</div>
