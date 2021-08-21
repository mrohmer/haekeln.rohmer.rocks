<script lang="ts">
	import type { IStep } from '../../models/step';
	import { createEventDispatcher } from 'svelte';
	import Checkbox from '../elements/Checkbox.svelte';

	const dispatch = createEventDispatcher();

	export let step: IStep;

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

    &__checkbox, &__label {
      vertical-align: middle;
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
</div>
