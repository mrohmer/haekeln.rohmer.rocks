<script lang="ts">
	import EditProject from '$lib/views/projects/EditProject.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { generateName } from '$lib/utils/generate-name';
	import type { Project } from '$lib/models/project';
	import Button from '$lib/components/Button.svelte';

	let project: Project;

	const handleSubmit = async ({ detail: project }) => {
		const id = await db.projects.add(project);

		await goto(`/projects/${id}`);
	};

	onMount(() => {
		project = {
			name: generateName(),
		}
	})
</script>

<EditProject {project} on:submit={handleSubmit}>

	<a href="/projects/import">
		<Button>import</Button>
	</a>

</EditProject>
