<script lang="ts">
	import type { IStep } from '../../models/step';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let step: IStep;

	$: checkboxAmount = step?.checkboxAmount ?? 0;
	$: text = step?.text;
	$: state = step?.state ?? 0;

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
		} else if (index < state ) {
			target.checked = !target.checked;
		}
	};

</script>

<li>
	{#each { length: checkboxAmount } as _, i}
		<input type="checkbox" id="checkbox_{(Math.random() * 1000).toFixed(2)}-{i}"
					 checked={i < state}
					 on:change={e => handleCheckedChange(i, e.target)} />
	{/each} {text}
</li>
