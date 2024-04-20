<script lang="ts">
	import EditProject from '$lib/views/projects/EditProject.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Round } from '$lib/models/round';
	import { onMount } from 'svelte';
	import type { Project } from '$lib/models/project';
	import { clone } from '$lib/db/clone';

	let loading = true;
	let originalProject: Project;
	let project: Project;
	const handleSubmit = async ({ detail: project }) => {
		const id = await db.transaction('rw', db.projects, db.projectParts, db.rounds, async () => {
			const projectId = String(await db.projects.add(project));

			const originalParts = await db.projectParts.where({projectId: String(originalProject.id)}).toArray();
			await clone.projectParts(originalParts.map(part => ({
				...part,
				projectId,
			})));

			return projectId;
		});

		await goto(`/projects/${id}`);
	};

	onMount(async () => {
		try {
			originalProject = await db.projects.get(Number($page.params.projectId));
			if (originalProject) {
				project = {
					name: `${originalProject.name} copy`,
				};
			}
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	loading...
{:else if project}
	<EditProject on:submit={handleSubmit} {project} buttonText="duplicate" />
{:else}
	not found
{/if}
