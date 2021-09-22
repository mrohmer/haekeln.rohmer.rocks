<script lang="ts">
	import type { IStep } from '../../models/step';
	import { createEventDispatcher } from 'svelte';
	import Checkbox from '../elements/Checkbox.svelte';
	import Icon from '$lib/components/elements/Icon.svelte';
	import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp.js';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown.js';
	import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines.js';
	import Button from '$lib/components/elements/Button.svelte';

	const dispatch = createEventDispatcher();

	export let step: IStep;
	export let moveDrag = false;
	export let moveArrows = false;
	export let moveArrowUpDisabled = false;
	export let moveArrowDownDisabled = false;

	$: checkboxAmount = step?.checkboxAmount ?? 0;
	$: text = step?.text;
	$: state = step?.state ?? 0;

	const randomId = (Math.random() * 1000).toFixed(2);

	const handleCheckedChange = (index, target: HTMLInputElement) => {
		const tmp = Math.min(Math.max(state + (target.checked ? 1 : -1), 0), checkboxAmount);

		if (tmp === state) {
			return;
		}

		state = tmp;

		dispatch('change', {
			state
		});

		if (index >= state) {
			target.checked = !target.checked;
		} else if (index < state) {
			target.checked = !target.checked;
		}
	};

</script>
<style lang="scss">
  .step-row {
    padding: 0;
    margin: 0 0 10px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
		display: flex;
		align-items: center;

		&__move-indicators {
      margin-left: auto;
			display: flex;
		}
  }
</style>

<div class="step-row">
	{#each { length: checkboxAmount } as _, i}
		<Checkbox id="checkbox_{randomId}-{i}"
							checked={i < state}
							on:change={e => handleCheckedChange(i, e.target)} />
	{/each}
	<label class="step-row__label" for="checkbox_{randomId}-{checkboxAmount - 1}">{text}</label>
	{#if moveDrag || moveArrows}
		<div class="step-row__move-indicators">
			{#if moveArrows}
				<Button variant="plain" disabled={moveArrowUpDisabled} on:click={() => dispatch('move', {direction: 'up'})}>
					<Icon icon={faChevronUp} />
				</Button>
				<Button variant="plain" disabled={moveArrowDownDisabled} on:click={() => dispatch('move', {direction: 'down'})}>
					<Icon icon={faChevronDown} />
				</Button>
			{/if}
			{#if moveDrag}
				<Button variant="plain">
					<Icon icon={faGripLines} />
				</Button>
			{/if}
		</div>
	{/if}
</div>
