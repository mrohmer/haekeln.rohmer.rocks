<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import { writable as localStorageWritable } from '$lib/stores/local-storage';
	import type { IProject, IProjects } from '$lib/models/project';
	import type { IStep } from '$lib/models/step';
	import NoProjects from '$lib/components/views/NoProjects.svelte';
	import Modal from '$lib/components/elements/Modal.svelte';
	import AddProject from '$lib/components/views/AddProject.svelte';
	import Tabs from '$lib/components/elements/Tabs/Tabs.svelte';
	import Tab from '$lib/components/elements/Tabs/Tab.svelte';
	import Project from '../lib/components/views/Project.svelte';
	import { PoweredBy } from '@rohmer/svelte-base';
	import Icon from '../lib/components/elements/Icon.svelte';
	import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus.js';

	const data = localStorageWritable<IProjects>('maschenzaehler', {});
	const currentProjectKey = writable<string | undefined>();

	const name = 'Matthias Rohmer';
	const url = 'https://matthias.rohmer.rocks';
	const technologies = ['svelte', 'netlify'];
	const sourceCodeUrl = 'https://github.com/mrohmer/haekeln.rohmer.rocks';

	let addProjectsOpen = false;

	const updateSteps = (cb: (steps: IStep[]) => IStep[]) => data.set({
		...(($data ?? {}) as Record<string, IProject>),
		[$currentProjectKey]: {
			...($data[$currentProjectKey] ?? {}),
			steps: cb($data[$currentProjectKey]?.steps)
		}
	});

	const handleChange = ({ state, index }) => updateSteps(
		steps => {
			const tmp = [...steps];
			tmp[index] = {
				...(tmp[index] ?? { text: '', state: 0, checkboxAmount: 1 }),
				state
			};
			return tmp;
		}
	);
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
	const handleResetProject = () => updateSteps(
		steps => steps
			.map(step => ({
				...step,
				state: 0
			}))
	);
	const handleRemoveProject = () => {
		const tmp = Object.entries($data)
			.filter(([key]) => key !== $currentProjectKey)
			.reduce(
				(prev, [key, value]) => ({
					...prev,
					[key]: value
				}),
				{} as IProjects
			);

		data.set(tmp);
	};

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
	const handleChangeOrder = ({steps}) => updateSteps(() => steps);

	$: project = getCurrentProject($data, $currentProjectKey);
	$: projects = $data ? Object.keys($data) : [];
</script>

<svelte:head>
	<title>Maschenzähler</title>
	<meta name="description" content="Digitaler Maschenzähler.">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta name="theme-color" content="#AA2F67" />
	<link rel="manifest" href="manifest.json" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Maschenzähler" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
</svelte:head>

<style lang="scss">
  @use "src/styles/_variables" as var;

	:global(*) {
		box-sizing: border-box;
		position: relative;
	}
  :global(html, body) {
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background-color: var.$background;
  }
	:global(a) {
		color: var.$primary;
	}

	.container {
		width: 100%;
		padding: 0 20px;
		max-width: 1000px;
		margin: auto;
	}
</style>

<main>
	<div class="container">
		{#if projects.length}
			<Tabs>
				{#each projects as p}
					<Tab active={$currentProjectKey === p} on:click={() => currentProjectKey.set(p)}>{p}</Tab>
				{/each}
				<Tab on:click={() => addProjectsOpen = true} light={true}>
					<Icon icon="{faPlus}" />
				</Tab>
			</Tabs>

			{#if project}
				<Project project={project}
								 on:changeStep={({detail}) => handleChange(detail)}
								 on:addStep={({detail}) => handleAddStep(detail)}
								 on:reset={() => handleResetProject()}
								 on:remove={() => handleRemoveProject()}
								 on:changeOrder={({detail}) => handleChangeOrder(detail)}
				>
					<PoweredBy {name} {url} {technologies} {sourceCodeUrl} />
				</Project>

			{/if}
		{:else}
			<NoProjects on:click={() => addProjectsOpen = true} />
			<PoweredBy {name} {url} {technologies} {sourceCodeUrl} />
		{/if}

		{#if addProjectsOpen}
			<Modal on:close={() => addProjectsOpen = false}>
				<AddProject on:save={e => handleAddProject(e.detail)} />
			</Modal>
		{/if}
	</div>
</main>
