<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let checkboxAmount = 1;
	export let text = '';

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!checkboxAmount || !text.trim().length) {
			return;
		}

		dispatch('save', {
			checkboxAmount,
			text,
		});

		checkboxAmount = 1;
		text = '';
	};
</script>

<style lang="scss">
	.add-step {
		display: flex;
		justify-content: space-between;

		&__text {
			flex-grow: 1;
		}
	}
</style>

<form class="add-step" on:submit={handleSubmit}>
	<input type="number" bind:value={checkboxAmount} min="1">
	<input type="text" class="add-step__text" bind:value={text}>
	<button type="submit">add</button>
</form>
