<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IStep } from '../../models/step';
	import { ballTemplate } from '../../templates';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let template = 'ball';
	export let amount = 3;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!title.trim().length || (template === 'ball' && amount < 3)) {
			return;
		}

		let steps: IStep[] = [];

		switch (template) {
			case 'ball':
				steps = ballTemplate({amount});
				break;
		}

		dispatch('save', {
			title,
			steps,
		});

		title = '';
		template = null;
		amount = 3;
	};
</script>

<div class="add-project">
	<form on:submit={handleSubmit}>
		<div>
			<label for="title">Titel</label>
			<input type="text" id="title" bind:value={title} minlength="1"/>
		</div>
		<div>
			<label>Vorlage</label>
			<div>
				<input type="checkbox" id="template-ball" checked={template === 'ball'} on:change={({target}) => template = target.checked ? 'ball' : null}>
				<label for="template-ball">Ball</label>
			</div>
		</div>

		{#if template === 'ball'}
			<div>
				<label for="ball-amount">Anzahl Runden</label>
				<input type="number" id="ball-amount" bind:value={amount} min="3"/>
			</div>
		{/if}

		<button type="submit">add</button>
	</form>
</div>

{template} {amount}
