<script lang="ts">
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { IProject } from '../../models/project';
	import BottomSheet from '../elements/BottomSheet.svelte';
	import StepRow from './StepRow.svelte';
	import AddStep from './AddStep.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../elements/Button.svelte';
	import Icon from '../elements/Icon.svelte';
	import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV.js';
	import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes.js';
	import MediaQuery from '$lib/components/elements/MediaQuery.svelte';

	export let project: IProject;
	let showMenu = false;
	let bsAddStepHeight = 20;

	let hovering: number;
	let dragged: number;

	const dispatch = createEventDispatcher();

	const updateSteps = (start: number, target: number) => {

		if (start === target) {
			return;
		}

		const steps = [...project.steps];

		if (start < target) {
			steps.splice(target + 1, 0, steps[start]);
			steps.splice(start, 1);
		} else {
			steps.splice(target, 0, steps[start]);
			steps.splice(start + 1, 1);
		}
		dispatch('changeOrder', { steps });
	};
	const handleMove = (start: number, {direction}: Record<'direction', 'up'|'down'>) => {
		if (!['up', 'down'].includes(direction)) {
			return;
		}
		const target = start + (direction === 'up' ? -1 : 1);

		updateSteps(start, target);
	};

	const handleDrop = (event, target) => {
		hovering = undefined;
		dragged = undefined;

		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));

		updateSteps(start, target);
	};

	const handleDragStart = (event, i) => {
		dragged = i;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		event.dataTransfer.setData('text/plain', i);
	};
	const handleDragEnd = () => {
		hovering = undefined;
		dragged = undefined;
	};
	const handleDragOver = () => false;
	const handleDragEnter = (index) => hovering = index;

	$: touch = 'ontouchstart' in document.body;
</script>

<style lang="scss">
  li {
    list-style: none;

    &, :global(.step-row__label) {
      cursor: move;
    }

    &.is--hovered {
      background: rgba(0, 0, 0, 0.025);
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
    }
  }

  ul {
    padding: 0;
  }

  .bs {
    display: flex;
    justify-content: space-between;

    &__add-step {
      flex-grow: 1;
    }

    &__burger {
      width: 50px;
      text-align: center;
      cursor: pointer;
      color: #666;
    }
  }

  .bs-menu {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    :global(button) {
      width: 100%;
    }

    &__spacer {
      width: 10px;
    }
  }

  .hidden {
    display: none;
  }
</style>

{#if project}
	<ul>
		{#each project.steps as step, index (index)}
			<li animate:flip
					draggable="true"
					on:dragstart={event => handleDragStart(event, index)}
					on:dragend={() => handleDragEnd()}
					on:drop|preventDefault={event => handleDrop(event, index)}
					on:dragover|preventDefault="{() => handleDragOver()}"
					on:dragenter|preventDefault={() => handleDragEnter(index)}
					on:dragleave|self={() => hovering = undefined}
					class:is--hovered={hovering === index && dragged !== index}
			>
				<MediaQuery query="(max-width: 600px)" let:matches>
					<StepRow
						{step}
						moveDrag={!(matches || touch)}
						moveArrows={matches || touch}
						moveArrowUpDisabled={index <= 0}
						moveArrowDownDisabled={index >= project.steps.length - 1}
						on:change={e => dispatch('changeStep', {...e.detail, index})}
						on:move={({detail}) => handleMove(index, detail)}
					/>
				</MediaQuery>
			</li>
		{/each}
	</ul>

	<slot />

	<BottomSheet>
		<div class="bs">
			<div class="bs__add-step" bind:clientHeight={bsAddStepHeight}>
				<AddStep on:save={e => dispatch('addStep', e.detail)} />
			</div>
			<div class="bs__burger" on:click={() => showMenu = !showMenu} style="line-height: {bsAddStepHeight + 'px'}">
				<div class:hidden={showMenu}>
					<Icon icon="{faEllipsisV}" />
				</div>
				<div class:hidden={!showMenu}>
					<Icon icon="{faTimes}" />
				</div>
			</div>
		</div>
		{#if showMenu}
			<div class="bs-menu" transition:slide|local>
				<Button on:click={() => dispatch('remove')}>Projekt entfernen</Button>
				<div class="bs-menu__spacer"></div>
				<Button on:click={() => dispatch('reset')}>Projekt zurücksetzen</Button>
			</div>
		{/if}

	</BottomSheet>
{/if}
