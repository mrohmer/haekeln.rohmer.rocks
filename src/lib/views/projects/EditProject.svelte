<script lang="ts">
	import type { Project } from '$lib/models/project';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputError from '$lib/components/InputError.svelte';

	const dispatch = createEventDispatcher();

	export let project: Project = {
		name: ''
	};
	export let buttonText = 'add';

	let submitted = false;
	let nameInputEl: HTMLInputElement;

	const forbiddenNames = ['add', 'duplicate'];

	const handleSubmit = () => {
		submitted = true;

		if (!project.name?.trim() || forbiddenNames.includes(project.name.trim().toLowerCase())) {
			return;
		}

		dispatch('submit', {
			name: project.name.trim(),
		});
	};

	$: nameInputEl?.focus();

</script>

<form on:submit|preventDefault={handleSubmit} class="max-w-sm mx-auto flex h-screen flex-col justify-center">
	<Input bind:this={nameInputEl} bind:value={project.name} id="name">
		Name
		<div slot="error">
			{#if submitted }
				{#if !project.name?.trim()}
					<InputError slot="error">Name cannot be empty.</InputError>
				{/if}
				{#if forbiddenNames.includes(project.name?.trim().toLowerCase())}
					<InputError slot="error">Name is not allowed.</InputError>
				{/if}
			{/if}
		</div>
	</Input>

	<Button type="submit">{buttonText}</Button>

	{#if $$slots.default}
		<hr class="mt-5 mb-6 border-gray-200 dark:border-gray-700"/>
		<slot />
	{/if}
</form>
