<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import type { ProjectExportData } from '$lib/utils/export.js';
	import { exportDataToProject, exportDataToWorkspace, isValid, isWorkspace } from '$lib/utils/export.js';
	import Button from '$lib/components/Button.svelte';
	import InputError from '$lib/components/InputError.svelte';
	import { db } from '$lib/db';
	import { goto } from '$app/navigation';
	import type { Round } from '$lib/models/round';

	let loading = false;
	let submitted = false;
	let dataStr = '';
	let files: Record<'name' | 'content', string>[] = [];

	let projects: ProjectExportData[];

	const handleSubmit = () => {
		submitted = true;
		if ((!dataStr || !isValid(dataStr)) && !files?.length) {
			return;
		}

		const projectsTwoDim = [
			dataStr,
			...(files?.map(({ content }) => content) ?? [])
		]
			.filter(content => content && isValid(content))
			.map(content => isWorkspace(content) ? exportDataToWorkspace(content) : [exportDataToProject(content)])
			.map(projects => projects.filter(project => !!project))
			.filter(projects => projects.length);

		projects = [].concat(...projectsTwoDim);
	};
	const handleFileChanges = async (event) => {
		const promises = Array.from(event.target.files)
			.map(async (file: File) => {
				const content = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.addEventListener('load', ({ target }) => {
						resolve(target.result);
					});
					reader.readAsText(file);
				});

				return { name: file.name, content };
			});

		const tmp = await Promise.all(promises);
		files = tmp
			.filter(({ content }) => isValid(content));
	};

	const importProjectPart = async (projectId: string, projectPart: ProjectExportData['parts'][number]) => {
		const roundIds = await Promise.all(projectPart.rounds.map((round) => db.rounds.add<Round, number>(round))) as number[];

		await db.projectParts.add({
			name: projectPart.name,
			roundIds,
			projectId: String(projectId),
		})
	};
	const importProject = async (project: ProjectExportData) => {
		const projectId = await db.projects.add({
			name: project.name
		});

		await Promise.all(project.parts.map(part => importProjectPart(projectId, part)));
	};
	const handleImportClick = async () => {
		if (projects.some(({name}) => !name?.trim())) {
			return;
		}

		loading = true;
		await db.transaction('rw', db.projects, db.projectParts, db.rounds, () => Promise.all(projects.map(project => importProject(project))));
		await goto('/');
	};
</script>

<div class="max-w-sm mx-auto flex h-screen flex-col justify-center">
	{#if loading}
		loading...
	{:else if projects?.length}
		<h2 class="mb-4">Project To Be Imported</h2>

		<ul>
			{#each projects as { name }}
				<li>
					<Input bind:value={name}>Name</Input>
				</li>
			{/each}
		</ul>

		<Button on:click={handleImportClick}>Import</Button>
	{:else}
		<form on:submit|preventDefault={handleSubmit}>
			<h2 class="mb-4">Import Project</h2>
			<Input id="import" bind:value={dataStr}>
				Paste Data
				<InputError slot="error">
					{#if submitted}
						{#if dataStr && !isValid(dataStr)}
							Data is invalid
						{/if}
					{/if}
				</InputError>
			</Input>
			<hr class="mt-5 mb-6 border-gray-200 dark:border-gray-700" />
			<Input id="import" type="file" filenames={files?.map(({name}) => name)} on:change={handleFileChanges}>
				Drag File Here / Click to Select
			</Input>
			<Button type="submit">Import</Button>
		</form>
	{/if}
</div>

