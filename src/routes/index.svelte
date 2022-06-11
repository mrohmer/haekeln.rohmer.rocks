<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import type { Observable } from 'dexie';
	import { onMount } from 'svelte';
	import type { Projects } from '$lib/models/project';
	import { tap } from '$lib/utils/tap';
	import { migrateFromLocalStorage } from '$lib/db/migrate-from-local-storage';

	let projects: Observable<Projects>;
	let loading = true;

	const migrate = async () => {
		const localStorageValue = JSON.parse(localStorage.getItem('maschenzaehler') ?? '');
		if (localStorageValue) {
			await db.transaction('rw', db.projects, db.projectParts, db.rounds, () => migrateFromLocalStorage(localStorageValue));

			localStorage.removeItem('maschenzaehler');
			localStorage.setItem('_maschenzaehler', JSON.stringify(localStorageValue));
		}
	};

	onMount(() => {
		projects = liveQuery(
			() => db.projects.toArray()
				.then(tap<Projects>(() => (loading = false)))
		);

		migrate();
	});
</script>

<style lang="postcss">
    .content {
        @apply flex flex-col text-center justify-center max-w-sm mx-auto -mb-12;

        min-height: calc(100vh - 12rem);
    }
</style>

<div
	class="flex justify-center items-center align-middle py-1 opacity-50 hover:opacity-60 transition-opacity cursor-default">
	<img src="/icons/icon_150.png" alt="Ball of wool" class="max-w-[100px] -mr-4 pointer-events-none dark:invert" />
	<div class="text-3xl font-light">
		Maschenzähler
	</div>
</div>

{#if loading}
	loading...
{:else if $projects}
	<div class="content">
		{#if $projects.length}
			{#each $projects as project (project.id)}
				<a href="/projects/{project.id}"
					 class="p-4 border-b border-gray-200 dark:border-gray-700"
				>
					{project.name}
				</a>
			{/each}
		{:else}
			<div
				 class="p-4 border-b border-gray-200 dark:border-gray-700"
			>
				no projects found 🤷
			</div>
		{/if}
		<a href="/projects/add"
			 class="p-4 hover:opacity-100 transition-opacity"
			 class:text-primary={!$projects.length}
			 class:opacity-30={!!$projects.length}
		>
			add project
		</a>
	</div>
{/if}
