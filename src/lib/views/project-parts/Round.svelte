<script lang="ts">
	import type { Round } from '$lib/models/round';
	import { db } from '$lib/db';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { faTrash as removeIcon } from '@fortawesome/free-solid-svg-icons/faTrash.js';
	import { faChevronUp as upIcon } from '@fortawesome/free-solid-svg-icons/faChevronUp.js';
	import { faChevronDown as downIcon } from '@fortawesome/free-solid-svg-icons/faChevronDown.js';
	import Icon from '$lib/components/Icon.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { debounceTime } from '$lib/utils/debounce-time';
	import { setCursorPosition } from '$lib/utils/set-cursor';
	import CheckboxButton from '$lib/components/CheckboxButton.svelte';
	import { fade } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	export let round: Round;
	export let index: number;
	export let isFirst: boolean = false;
	export let isLast: boolean = false;
	export let editMode = false;
	export let focusThis = false;

	export let count = 0;

	let mounted = false;
	let rootEl: HTMLDivElement;
	let nameEl: HTMLDivElement;

	const handleStateChange = async (event: Event, shift: -1 | 1) => {
		event.preventDefault();
		if (!editMode) {
			await db.rounds.update(round.id, { state: round.state + shift });
		}
	};
	const handleNameChange = async ({ target }) => {
		const name = target.textContent?.trim();

		if (!name) {
			return;
		}

		await db.rounds.update(round.id, { name });
	}
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
	<div class="flex flex-col justify-center pr-1 text-right"
			 class:min-w-[23px]={count >= 10 && count < 100}
			 class:min-w-[35px]={count >= 100}
	>
		<div>
			{index >= 0 ? index + 1 : 'x'}.
		</div>
	</div>
	<div class="max-w-[75%] sm:max-w-[50%]">
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
						disabled={!round}
						transition:fade|local
		>
			<Icon icon={upIcon} />
		</button>
		<button on:click={() => !isLast && dispatch('down')}
						class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity"
						class:disabled={isLast || !round}
						disabled={!round}
						transition:fade|local
		>
			<Icon icon={downIcon} />
		</button>
		<button on:click={() => dispatch('remove')}
						class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity"
						class:disabled={!round}
						disabled={!round}
						transition:fade|local
		>
			<Icon icon={removeIcon} />
		</button>
	{/if}
</div>

