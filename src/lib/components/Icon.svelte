<script>
  let { name, size = 24 } = $props()

  let svg = $state('')

  fetch(`https://www.iconic.rest/api/icons/${name}?size=${size}`).then(
    (res) => {
      res.json().then((data) => {
        svg = data.svg
      })
    },
  )
</script>

<div style={`width: ${size}px`}>
  {#if svg}{@html svg}{/if}
</div>

<style>
  svg {
    margin: 0px;
    padding: 0px;
  }
</style>
