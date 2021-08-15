<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title = '';

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim().length) {
			return;
		}

		dispatch('save', {
			title,
		});

		title = '';
	};
</script>

<div class="add-step">
	<form on:submit={handleSubmit}>
		<input type="text" bind:value={title}>
		<button type="submit">add</button>
	</form>
</div>
