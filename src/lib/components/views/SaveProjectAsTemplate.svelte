<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IStep } from '$lib/models/step';
	import Input from '../elements/Input.svelte';
	import Button from '../elements/Button.svelte';
	import { faSave } from '@fortawesome/free-solid-svg-icons/faSave.js';
	import Icon from '../elements/Icon.svelte';
	import type { IProjects } from '$lib/models/project';

	const dispatch = createEventDispatcher();

	export let title = '';
	export let templates: IProjects;

	let submited = false;

	const handleSubmit = (e) => {
		e.preventDefault();
		submited = true;
		if (!title.trim().length) {
			return;
		}

		let steps: IStep[] = [];

		dispatch('save', {
			title,
			steps
		});

		title = '';
		submited = false;
	};
</script>

<style lang="scss">
  .form-item {
    margin-bottom: 10px;

		.error {
			color: red;
		}
		.warning {
			color: orange;
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
			{:else if `custom-${title}` in templates}
				<div class="warning">
					Es existiert bereits ein Template mit diesem Titel. Überschreiben?
				</div>
			{/if}
		</div>

		<Button type="submit"><Icon icon="{faSave}" /></Button>
	</form>
</div>
