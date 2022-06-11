<script lang="ts">
	import type { ProjectPart } from '$lib/models/project-part';
	import { createEventDispatcher } from 'svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import InputError from '$lib/components/InputError.svelte';

	const dispatch = createEventDispatcher();

	export let part: Pick<ProjectPart, 'name'> = {
		name: ''
	};

	export let hasTemplates = true;
	export let buttonText = 'add';

	let templateBall = false;

	let templateArgs = {};

	let submitted = false;

	const forbiddenNames = ['add', 'duplicate'];

	const handleSubmit = () => {
		submitted = true;

		if (!part.name?.trim() || forbiddenNames.includes(part.name.trim().toLowerCase())) {
			return;
		}

		dispatch('submit', {
			part: {
				name: part.name.trim()
			},
			template: {
				name: templateBall ? 'ball' : undefined,
				args: templateArgs
			}
		});
	};

</script>

<form on:submit|preventDefault={handleSubmit}>
	<Input id="name" bind:value={part.name}>
		Name
		<div slot="error">
			{#if submitted }
				{#if !part.name?.trim()}
					<InputError>Name cannot be empty.</InputError>
				{/if}
				{#if forbiddenNames.includes(part.name?.trim().toLowerCase())}
					<InputError>Name is not allowed.</InputError>
				{/if}
			{/if}
		</div>
	</Input>

	{#if hasTemplates}
		<div class="my-6">
			<h3>Templates</h3>
			<div class="my-2">
				<Checkbox id="template-ball"
									name="template-ball"
									checked={templateBall}
									on:change={({target}) => (templateBall = target.checked) && target.checked && (templateArgs = {amount: 6})}>
					Ball
				</Checkbox>
			</div>

			{#if templateBall}
				<Input type="number"
							 id="templtate-arg__ball-amount"
							 step="1"
							 min="1"
							 max="100"
							 bind:value={templateArgs.amount}>
					Amount
				</Input>
			{/if}
		</div>
	{/if}

	<Button type="submit">{buttonText}</Button>
</form>
