<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IStep } from '../../models/step';
	import { ballTemplate } from '../../templates';
	import Input from '../elements/Input.svelte';
	import Button from '../elements/Button.svelte';
	import Checkbox from '../elements/Checkbox.svelte';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let template = 'ball';
	export let amount = 3;

	let submited = false;

	const handleSubmit = (e) => {
		e.preventDefault();
		submited = true;
		if (!title.trim().length || (template === 'ball' && amount < 3)) {
			return;
		}

		let steps: IStep[] = [];

		switch (template) {
			case 'ball':
				steps = ballTemplate({ amount });
				break;
		}

		dispatch('save', {
			title,
			steps
		});

		title = '';
		template = null;
		amount = 3;
		submited = false;
	};
</script>

<style lang="scss">
  .form-item {
    margin-bottom: 10px;

		.error {
			color: red;
		}
  }
</style>

<div class="add-project">
	<form on:submit={handleSubmit}>
		<div class="form-item">
			<label for="title">Titel</label>
			<Input type="text" id="title" bind:value={title} minlength="1" required={true} />
			{#if submited && !title.trim().length}
				<div class="error">
					Bitte gib einen Titel an.
				</div>
			{/if}
		</div>
		<div class="form-item">
			<div>Vorlage</div>
			<div>
				<Checkbox id="template-ball" checked={template === 'ball'}
									on:change={({target}) => template = target.checked ? 'ball' : null} />
				<label for="template-ball">Ball</label>
			</div>
		</div>

		{#if template === 'ball'}
			<div class="form-item">
				<label for="ball-amount">Anzahl Runden</label>
				<Input type="number" id="ball-amount" bind:value={amount} min="3" />
				{#if submited && amount < 3}
					<div class="error">
						Gib bitte mindestens 3 Runden an.
					</div>
				{/if}
			</div>
		{/if}

		<Button type="submit" variant="icon">plus</Button>
	</form>
</div>
