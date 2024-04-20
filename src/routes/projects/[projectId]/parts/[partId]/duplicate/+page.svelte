<script lang="ts">
	import EditProjectPart from '$lib/views/project-parts/EditProjectPart.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Round } from '$lib/models/round';
	import { ballTemplate } from '$lib/templates';
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import type { ProjectPart } from '$lib/models/project-part';
	import { clone } from '$lib/db/clone';

	let loading = true;
	let originalPart: ProjectPart;
	let part: ProjectPart;
	const handleSubmit = async ({ detail: { part } }) => {
		const id = await db.transaction('rw', db.projectParts, db.rounds, async () =>
			clone.projectPart({
				...part,
				projectId: $page.params.projectId,
				roundIds: originalPart.roundIds,
			})
		);

		await goto(`/projects/${$page.params.projectId}/parts/${id}`);
	};

	onMount(async () => {
		try {
			originalPart = await db.projectParts.get(Number($page.params.partId));
			if (originalPart) {
				part = {
					projectId: originalPart.projectId,
					name: `${originalPart.name} copy`,
					roundIds: []
				};
			}
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	loading...
{:else if part}
	<EditProjectPart on:submit={handleSubmit} {part} buttonText="duplicate" hasTemplates={false}  />
{:else}
	not found
{/if}
