<script lang="ts">
	export let value = '';
	export let type = 'text';
	export let id = null;
	export let min = null;
	export let minlength = null;
	export let required = false;
</script>

<style lang="scss">
  @use 'src/styles/_variables' as var;
  input {
		box-sizing: border-box;
    padding: 10px;
    outline: none;
		width: 100%;

    border: 1px solid #333;
    border-radius: 3px;

    &:focus {
      border-color: var.$primary;
    }
  }
</style>

{#if type === 'text'}
	<input type="text" {id} bind:value {min} {minlength} {required}/>
{:else if type === 'number'}
	<input type="number" {id} bind:value {min} {minlength} {required}/>
{/if}
