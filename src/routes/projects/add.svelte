<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import EditProject from '$lib/views/projects/EditProject.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';

	const handleSubmit = async ({ detail: project }) => {
		const id = await db.projects.add(project);

		await goto(`/projects/${id}`);
	};
</script>

<EditProject on:submit={handleSubmit} />
