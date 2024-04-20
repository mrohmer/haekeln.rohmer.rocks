<script lang="ts">
	import type { Observable } from 'dexie';
	import { liveQuery } from 'dexie';
	import type { Project } from '$lib/models/project';
	import { onMount } from 'svelte';
	import { db } from '$lib/db';
	import { page } from '$app/stores';
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ProjectExportData } from '$lib/utils/export';
	import { projectToExportData } from '$lib/utils/export';


	let loading = true;
	let data: Observable<ProjectExportData>;

	const download = (name: string, d: string) => {
		const element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d));
		element.setAttribute('download', `${name}.project.txt`);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	onMount(() => {
		data = liveQuery(
			async () => {
				try {
					const project = await db.projects.get(Number($page.params.projectId));
					const parts = await db.projectParts.where({ projectId: $page.params.projectId }).toArray();

					const partPromises = parts.map(async (part) => ({
						...part,
						rounds: await Promise.all(part.roundIds.map(id => db.rounds.get(id)))
					}));

					return {
						...project,
						parts: await Promise.all(partPromises),
					}
				} catch (e) {
					console.log(e);
				} finally {
					loading = false;
				}
			}
		);
	});

	$: exportData = data && $data ? projectToExportData($data) : undefined;
</script>


{#if loading}
	loading...
{:else if data && $data}
	<h2 class="mb-4 text-lg">Export Data</h2>

	<Input value={exportData} copyBtn={true}>Data</Input>

	<Button on:click={() => download($data.name, exportData)}>Download</Button>
{:else}
	not found
{/if}
