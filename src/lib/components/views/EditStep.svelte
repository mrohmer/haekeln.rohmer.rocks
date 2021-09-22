<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';
	import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus.js';
	import Icon from '../elements/Icon.svelte';
	import type { IStep } from '$lib/models/step';

	const dispatch = createEventDispatcher();

	export let step: IStep;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!step.checkboxAmount || !step.text.trim().length) {
			return;
		}

		dispatch('save', {
			checkboxAmount: step.checkboxAmount,
			text: step.text
		});
	};
</script>

<style lang="scss">
	.edit-step {
		&__spacer {
			height: 10px;
		}
	}
</style>
{#if step}
	<form class="edit-step" on:submit={handleSubmit}>
		<div>
			<label for="repititions">Anzahl</label>
			<Input id="repititions" type="number" bind:value={step.checkboxAmount} min="1" />
		</div>
		<div class="edit-step__spacer"></div>
		<div class="edit-step__text">
			<label for="title">Titel</label>
			<Input id="title" type="text" bind:value={step.text} />
		</div>
		<div class="edit-step__spacer"></div>
		<div class="edit-step__buttons">
			<Button type="submit">Speichern</Button>
			<Button type="button" variant="plain" on:click={() => dispatch('cancel')}>Abbrechen</Button>
		</div>
	</form>
{/if}
