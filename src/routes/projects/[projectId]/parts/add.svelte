<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import EditProjectPart from '$lib/views/project-parts/EditProjectPart.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { Round } from '$lib/models/round';
	import { ballTemplate } from '$lib/templates';

	const handleSubmit = async ({ detail: { part, template } }) => {
		const id = await db.transaction('rw', db.projectParts, db.rounds, async () => {

			let rounds: Round[] = [];
			switch (template.name) {
				case 'ball':
					rounds = ballTemplate(template.args);
					break;
			}

			const roundIds = await db.rounds.bulkAdd(rounds, {allKeys: true});
			return db.projectParts.add({
				...part,
				projectId: $page.params.projectId,
				roundIds,
			});
		});

		await goto(`/projects/${$page.params.projectId}/parts/${id}`);
	};
</script>

<EditProjectPart on:submit={handleSubmit} />
