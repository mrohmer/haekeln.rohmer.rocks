<script lang="ts">
	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import type { Observable } from 'dexie';
	import type { Project } from '$lib/models/project';
	import { liveQuery } from 'dexie';
	import { page } from '$app/stores';
	import { tap } from '$lib/utils/tap';
	import type { ProjectParts } from '$lib/models/project-part';
	import { faChevronLeft as homeIcon, faPlus as addIcon } from '@fortawesome/free-solid-svg-icons';
	import Icon from '$lib/components/Icon.svelte';

	let loading = true;

	let project: Observable<Project>;
	let parts: Observable<ProjectParts>;
	onMount(() => {
		project = liveQuery(
			() => db.projects.get(Number($page.params.projectId))
				.then(tap<Project>(() => (loading = false)))
		)
		parts = liveQuery(
			() => db.projectParts.where({projectId: $page.params.projectId}).toArray()
		)
	})
</script>
{#if loading}
	loading...
{:else if $project?.name }
	<nav class="flex py-2">
		<div class="align-middle py-0.5 px-2 -ml-2 mt-px border-b-2 border-transparent">
			<a href="/"><Icon icon={homeIcon}/></a>
		</div>
		<div class="inline-block align-middle py-1 px-2 border-b-2 border-transparent font-light"
				 class:border-secondary={$page.path === `/projects/${$project.id}`}>
			<a href="/projects/{$project.id}">{$project.name}</a>
		</div>
		<div class="flex-1 overflow-x-auto align-middle whitespace-nowrap">
			{#if $parts?.length}
				{#each $parts as part}
					<div class="inline-block align-middle py-1 px-2 border-b-2 border-transparent"
							 class:border-secondary={$page.path === `/projects/${$project.id}/parts/${part.id}`}>
						<a href="/projects/{$project.id}/parts/{part.id}">{part.name}</a>
					</div>
				{/each}
			{/if}
		</div>
		<div class="align-middle py-0.5 px-2 -mr-2 mt-px border-b-2 border-transparent"
				 class:border-secondary={$page.path === `/projects/${$project.id}/parts/add`}>
			<a href="/projects/{$project.id}/parts/add">
				<Icon icon={addIcon}/>
			</a>
		</div>
	</nav>
	<div class="pt-4">
		<slot />
	</div>
{:else}
	Not found.
{/if}
