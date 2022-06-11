<script lang="ts">
	export let value: any;
	export let id = (Math.random() * 1000).toFixed(0);
	export let name = id;
	export let type = 'text';
	export let min;
	export let max;
	export let required;

	let inputEl: HTMLInputElement;

	export const focus = (...args) => inputEl?.focus(...args);

	let klass: string
	export {klass as class};
</script>
<div class="border rounded border-secondary flex overflow-hidden py-1 mb-3 {klass}">
	<label for={id} class="px-4 block h-10 leading-10 w-fit opacity-80">
		<slot />
	</label>
	{#if type === 'text'}
		<input bind:this={inputEl} type="text" {name} {id} {min} {max} {required} class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input />
	{:else if type === 'number'}
		<input bind:this={inputEl} type="number" {name} {id} {min} {max} {required} class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input />
	{/if}
		</div>
<slot name="error" />
