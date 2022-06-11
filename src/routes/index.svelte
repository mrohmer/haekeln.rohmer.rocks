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

<style lang="postcss">
	.content {
			@apply flex flex-col text-center justify-center max-w-sm mx-auto pt-20 -mb-12;

			min-height: calc(100vh - 5rem);
	}
</style>

{#if loading}
	loading...
{:else if $projects?.length}
	<div class="content">
		{#each $projects as project (project.id)}
				<a href="/projects/{project.id}"
					 class="p-4 border-b border-gray-200 dark:border-gray-700"
				>
					{project.name}
				</a>
		{/each}
		<a href="/projects/add" class="p-4 opacity-30 hover:opacity-100 transition-opacity">add project</a>
	</div>
{:else }
	<EmptyProjects />
{/if}
