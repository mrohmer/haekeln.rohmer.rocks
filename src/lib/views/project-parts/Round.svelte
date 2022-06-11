<script lang="ts">
	import type { Round } from '$lib/models/round';
	import { db } from '$lib/db';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import { faTrash as removeIcon, faChevronUp as upIcon, faChevronDown as downIcon } from '@fortawesome/free-solid-svg-icons';
	import Icon from '$lib/components/Icon.svelte';
	import { createEventDispatcher } from 'svelte';
	import { debounceTime } from '$lib/utils/debounce-time';

	const dispatch = createEventDispatcher();

	export let round: Round;
	export let isFirst: boolean = false;
	export let isLast: boolean = false;

	const handleStateChange = async (event: Event, shift: -1 | 1) => {
		event.preventDefault();
		await db.rounds.update(round.id, { state: round.state + shift });
	};
	const handleNameChange = ({ target }) => db.rounds.update(round.id, { name: target.value });

	const handleRemoveClick = async () => {
		if (confirm(`Do you really want to delete ${round.name}?`)) {
			await db.rounds.delete(round.id);
		}
	};
</script>

<style lang="postcss">
	.disabled {
			@apply opacity-25 hover:opacity-25 cursor-not-allowed;
	}
</style>

{#if round}
	<div class="flex align-middle p-1">
		<div class="max-w-max">
			{#each Array(round.checkboxAmount) as _, i}
				<div class="inline-block m-1">
					<Checkbox checked={i < round.state}
										disabled
										on:click={(event) => handleStateChange(event, i < round.state ? -1 : 1)} />
				</div>
			{/each}
		</div>
		<input class="flex-1" value={round.name} on:input={debounceTime(handleNameChange, 500)} type="text" />
		<button on:click={() => !isFirst && dispatch('up')} class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity" class:disabled={isFirst}>
			<Icon icon={upIcon}/>
		</button>
		<button on:click={() => !isLast && dispatch('down')} class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity" class:disabled={isLast}>
			<Icon icon={downIcon}/>
		</button>
		<button on:click={handleRemoveClick} class="px-1 mr-px opacity-60 hover:opacity-100 transition-opacity">
			<Icon icon={removeIcon} />
		</button>
	</div>
{/if}
