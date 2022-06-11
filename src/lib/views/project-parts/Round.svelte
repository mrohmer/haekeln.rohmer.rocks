<script lang="ts">
	import type { Round } from '$lib/models/round';
	import { db } from '$lib/db';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import {
		faTrash as removeIcon,
		faChevronUp as upIcon,
		faChevronDown as downIcon,
		faPen as editIcon,
		faTimes as endEditIcon
	} from '@fortawesome/free-solid-svg-icons';
	import Icon from '$lib/components/Icon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { debounceTime } from '$lib/utils/debounce-time';
	import { setCursorPosition } from '$lib/utils/set-cursor';
	import CheckboxButton from '$lib/components/CheckboxButton.svelte';

	const dispatch = createEventDispatcher();

	export let round: Round;
	export let isFirst: boolean = false;
	export let isLast: boolean = false;
	export let editMode = false;
	export let focusThis = false;

	let mounted = false;
	let rootEl: HTMLDivElement;
	let nameEl: HTMLDivElement;

	const handleStateChange = async (event: Event, shift: -1 | 1) => {
		event.preventDefault();
		if (!editMode) {
			await db.rounds.update(round.id, { state: round.state + shift });
		}
	};
	const handleNameChange = ({ target }) =>
		db.rounds.update(round.id, { name: target.textContent });
	const handleCheckboxAmountChange = async (shift: number) => {
		const checkboxAmount = Math.max(round.checkboxAmount + shift, 1);
		if (round.checkboxAmount !== checkboxAmount) {
			await db.rounds.update(round.id, { checkboxAmount });
		}
	};

	onMount(() => mounted = true);

	$: {
		if (focusThis) {
			setTimeout(() => {
				nameEl.focus();
				setCursorPosition(nameEl, nameEl.textContent.length);
			}, 100);
		}
	}
</script>

<style lang="postcss">
    .disabled {
        @apply opacity-25 hover:opacity-25 cursor-not-allowed;
    }
</style>

<div bind:this={rootEl} class="flex align-middle p-1" class:pointer-events-none={!round}>
	<div class="max-w-max">
		{#if editMode}
			<div class="inline-block m-1">
				<CheckboxButton type="-" on:click={() => handleCheckboxAmountChange(-1)}
												disabled={round?.checkboxAmount <= 1} />
			</div>
			<div class="inline-block m-1">
				<CheckboxButton type="+" on:click={() => handleCheckboxAmountChange(1)} />
			</div>
		{/if}
		{#each Array(round?.checkboxAmount ?? 1) as _, i}
			<div class="inline-block m-1">
				<Checkbox checked={i < round?.state}
									disabled
									on:click={(event) => handleStateChange(event, i < round.state ? -1 : 1)} />
			</div>
		{/each}
	</div>
	<div class="flex-1 flex flex-col justify-center pr-2">
		<div bind:this={nameEl} on:input={debounceTime(handleNameChange, 500)} contenteditable={editMode}>
			{round?.name ?? ''}
		</div>
	</div>

	{#if editMode}
		<button on:click={() => !isFirst && dispatch('up')}
						class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity"
						class:disabled={isFirst || !round}
						disabled={!round}>
			<Icon icon={upIcon} />
		</button>
		<button on:click={() => !isLast && dispatch('down')}
						class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity"
						class:disabled={isLast || !round}
						disabled={!round}>
			<Icon icon={downIcon} />
		</button>
		<button on:click={() => dispatch('remove')}
						class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity"
						class:disabled={!round}
						disabled={!round}>
			<Icon icon={removeIcon} />
		</button>
	{/if}
</div>

