<script lang="ts">
	import Icon from './Icon.svelte';

	export let disabled = false;
	export let type = 'button';
	export let variant: 'button'|'plain' = 'button';
</script>

<style type="text/scss">
  @use 'src/styles/variables' as var;

  button {
    background: transparent;
		border: none;
    color: var.$primary;
    border-radius: 3px;
    padding: 10px 15px;
    transition: 0.2s background ease;
    cursor: pointer;
		&.button {
      border: 1px solid var.$primary;
		}
		&.plain {
			color: #bbbbbb;
      padding: 5px;
		}

		&[disabled] {
			opacity: 0.3;
		}
    &:hover {
      background: rgb(0, 0, 0, 0.05);
    }
  }
</style>

<button on:click class:button={variant==='button'} class:plain={variant==='plain'} {disabled} {type}>
	<slot />
</button>
