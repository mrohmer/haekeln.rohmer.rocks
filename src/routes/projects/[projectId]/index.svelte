<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import type { Observable } from 'dexie';
	import type { Project } from '$lib/models/project';
	import { liveQuery } from 'dexie';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	let project: Observable<Project>;

	const handleNameChange = ({ target }) => db.projects.update($project.id, { name: target.value });
	const handleResetClick = async () => {
		const parts = await db.projectParts.where({ projectId: $page.params.projectId }).toArray();

		const roundIds = parts.map(part => part.roundIds).flat().filter(i => !!i);

		if (!roundIds.length) {
			return;
		}

		await db.transaction('rw', db.rounds, () => Promise.all(
			roundIds.map(id => db.rounds.update(id, { state: 0 }))
		));
	};
	const handleRemoveClick = async () => {
		if (confirm(`Do you really want to delete ${$project.name}?`)) {
			await db.transaction('rw', db.projects, db.projectParts, db.rounds, async () => {
				const parts = await db.projectParts.where({ projectId: $page.params.projectId }).toArray();

				const roundIds = parts.map(part => part.roundIds).flat().filter(i => !!i);

				return Promise.all([
					db.projects.delete($project.id),
					...parts.map(part => db.projectParts.delete(part.id)),
					...roundIds.map(roundId => db.rounds.delete(roundId))
				]);
			});
			await goto('/');
		}
	};

	onMount(() => {
		project = liveQuery(
			() => db.projects.get(Number($page.params.projectId))
		);
	});
</script>

{#if $project?.name}
	<Input value={$project.name} on:input={handleNameChange}>
		Name
	</Input>

	<div class="flex py-2">
		<Button on:click={handleResetClick}>
			reset
		</Button>
		<Button on:click={handleRemoveClick}>
			remove
		</Button>
	</div>
{/if}
