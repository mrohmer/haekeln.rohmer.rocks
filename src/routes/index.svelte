<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import BottomSheet from '$lib/components/elements/BottomSheet.svelte';
	import { writable } from 'svelte/store';
	import { writable as localStorageWritable } from '$lib/stores/local-storage';
	import type { IProject, IProjects } from '$lib/models/project';
	import type { IStep } from '$lib/models/step';
	import StepRow from '$lib/components/views/StepRow.svelte';
	import AddStep from '$lib/components/views/AddStep.svelte';
	import NoProjects from '$lib/components/views/NoProjects.svelte';
	import Modal from '$lib/components/elements/Modal.svelte';
	import AddProject from '$lib/components/views/AddProject.svelte';
	import Tabs from '$lib/components/elements/Tabs/Tabs.svelte';
	import Tab from '$lib/components/elements/Tabs/Tab.svelte';

	const data = localStorageWritable<IProjects>('maschenzaehler', {});
	const currentProjectKey = writable<string | undefined>();

	let addProjectsOpen = false;

	const updateSteps = (cb: (steps: IStep[]) => IStep[]) => data.set({
		...(($data ?? {}) as Record<string, IProject>),
		[$currentProjectKey]: {
			...($data[$currentProjectKey] ?? {}),
			steps: cb($data[$currentProjectKey]?.steps),
		}
	});

	const handleChange = (index: number, { state }) => updateSteps(
		steps => {
			const tmp = [...steps];
			tmp[index] = {
				...(tmp[index] ?? {text: '', state: 0, checkboxAmount: 1}),
				state,
			};
			return tmp;
		}
	)
	const handleAddProject = ({ title, steps }) => {
		if (!projects.includes(title)) {
			data.set({
				...(($data ?? {}) as Record<string, IProject>),
				[title]: {
					steps
				} as IProject
			});
		}

		currentProjectKey.set(title);
		addProjectsOpen = false;
	};
	const handleAddStep = ({ checkboxAmount, text }: Partial<IStep>) =>
		updateSteps(steps => [
			...(steps ?? []),
			{
				text,
				checkboxAmount,
				state: 0
			}
		]);

	const getCurrentProject = (lData: IProjects, lCurrentProjectKey: string) => {
		if (!lData || !Object.keys(lData).length) {
			return null;
		}

		if (!lCurrentProjectKey || !(lCurrentProjectKey in lData)) {
			const first = Object.keys(lData)[0];
			currentProjectKey.set(first);
			return lData[first];
		}
		return lData[lCurrentProjectKey];
	};

	$: project = getCurrentProject($data, $currentProjectKey);
	$: projects = $data ? Object.keys($data) : [];
</script>

<svelte:head>
	<title>Maschenzähler</title>
</svelte:head>

<style lang="scss">

</style>

{#if projects.length}
	<Tabs>
		{#each projects as p}
			<Tab active={$currentProjectKey === p} on:click={() => currentProjectKey.set(p)}>{p}</Tab>
		{/each}
		<Tab on:click={() => addProjectsOpen = true}>add</Tab>
	</Tabs>

	{#if project}
		<ul>
			{#each project.steps as step, i}
				<StepRow {step} on:change={e => handleChange(i, e.detail)}/>
			{/each}
		</ul>

		<BottomSheet>
			<AddStep on:save={e => handleAddStep(e.detail)} />
		</BottomSheet>
	{/if}
{:else}
	<NoProjects on:click={() => addProjectsOpen = true} />
{/if}

{#if addProjectsOpen}
	<Modal on:close={() => addProjectsOpen = false}>
		<AddProject on:save={e => handleAddProject(e.detail)} />
	</Modal>
{/if}
