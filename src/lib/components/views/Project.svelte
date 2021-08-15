<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { IProject } from '../../models/project';
	import BottomSheet from '../elements/BottomSheet.svelte';
	import StepRow from './StepRow.svelte';
	import AddStep from './AddStep.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '../elements/Button.svelte';
	import Icon from '../elements/Icon.svelte';

	export let project: IProject;
	let showMenu = false;
	let bsAddStepHeight = 20;

	const dispatch = createEventDispatcher();
</script>

<style lang="scss">
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
		{#each project.steps as step, index}
			<StepRow {step} on:change={e => dispatch('changeStep', {...e.detail, index})} />
		{/each}
	</ul>

	<slot />

	<BottomSheet>
		<div class="bs">
			<div class="bs__add-step" bind:clientHeight={bsAddStepHeight}>
				<AddStep on:save={e => dispatch('addStep', e.detail)} />
			</div>
			<div class="bs__burger" on:click={() => showMenu = !showMenu} style="line-height: {bsAddStepHeight + 'px'}">
				<div class:hidden={showMenu}><Icon>ellipsis-v</Icon></div>
				<div class:hidden={!showMenu}><Icon>times</Icon></div>
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
