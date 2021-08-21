<script lang="ts">
	import Icon from './Icon.svelte';

	export let disabled = false;
	export let type = 'button';
</script>

<style type="text/scss">
  @use 'src/styles/variables' as var;

  button {
    background: transparent;
    border: 1px solid var.$primary;
    color: var.$primary;
    border-radius: 3px;
    padding: 10px 15px;
    transition: 0.2s background ease;
    cursor: pointer;

    &:hover {
      background: rgb(0, 0, 0, 0.05);
    }
  }
</style>

<button on:click {disabled} {type}>
	<slot />
</button>
