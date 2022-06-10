<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import type { Observable } from 'dexie';
	import EmptyProjects from '$lib/views/index/EmptyProjects.svelte';
	import { onMount } from 'svelte';
	import type { Projects } from '$lib/models/project';
	import { tap } from '$lib/utils/tap';

	let projects: Observable<Projects>;
	let loading = true;

	onMount(() => {
		projects = liveQuery(
			() => db.projects.toArray()
				.then(tap<Projects>(() => (loading = false)))
		);
	});
</script>

{#if loading}
	loading...
{:else if $projects?.length}
	<div class="flex h-screen flex-col text-center justify-center max-w-sm mx-auto py-9">
		{#each $projects as project (project.id)}
			<div class="p-4 border-b border-gray-200 dark:border-gray-700">
				<a href="/projects/{project.id}">{project.name}</a>
			</div>
		{/each}
		<div class="p-4">
			<a href="/projects/add">add project</a>
		</div>
	</div>
{:else }
	<EmptyProjects />
{/if}
