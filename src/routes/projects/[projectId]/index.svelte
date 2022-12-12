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
	import { debounceTime } from '$lib/utils/debounce-time';
	import { confirmAction } from '$lib/utils/confirm-action';

	let project: Observable<Project>;
	let name: string;

	const handleNameChange = async ({ target }) => {
		const name = target.value?.trim();

		if (!name) {
			return;
		}

		await db.projects.update($project.id, { name });
	}
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
	};

	onMount(() => {
		project = liveQuery(
			() => db.projects.get(Number($page.params.projectId))
		);
	});

	$: name = $project?.name;
</script>

{#if $project}
	<Input value={name} on:input={debounceTime(handleNameChange, 500)}>
		Name
	</Input>

	<div class="sm:flex py-2">
		<Button on:click={confirmAction(`Do you really want to reset all parts in ${$project.name}?`, handleResetClick)}>
			reset project
		</Button>
		<Button href="./{$project.id}/export">
			export project
		</Button>
		<Button href="./{$project.id}/duplicate">
			duplicate project
		</Button>
		<Button on:click={confirmAction(`Do you really want to delete ${$project.name}?`, handleRemoveClick)}>
			delete project
		</Button>
	</div>
{/if}
