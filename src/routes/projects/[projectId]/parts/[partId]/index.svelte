<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { db } from '$lib/db';
	import { onMount } from 'svelte';
	import type { Observable } from 'dexie';
	import { liveQuery } from 'dexie';
	import { page } from '$app/stores';
	import { tap } from '$lib/utils/tap';
	import type { Rounds } from '$lib/models/round';
	import Round from '$lib/views/project-parts/Round.svelte';
	import Button from '$lib/components/Button.svelte';
	import type { ProjectPart } from '$lib/models/project-part';
	import Input from '$lib/components/Input.svelte';
	import { debounceTime } from '$lib/utils/debounce-time';
	import { confirmAction } from '$lib/utils/confirm-action';
	import Icon from '$lib/components/Icon.svelte';
	import {faPlus as addIcon} from '@fortawesome/free-solid-svg-icons';

	let loading = true;
	let part: Observable<ProjectPart>;
	let rounds: Observable<Rounds>;
	let mounted = false;

	const handleNameChange = ({ target }) => db.projectParts.update($part.id, { name: target.value });
	const handleUp = async (roundId: number) => {
		const roundIds = $rounds.filter(i => !!i).map(item => item.id).map((item, index, array) => {
			if (array[index + 1] === roundId) {
				return roundId;
			}
			if (item === roundId) {
				return array[index - 1];
			}
			return item;
		});

		await db.projectParts.update(Number($page.params.partId), { roundIds });
	};
	const handleDown = async (roundId: number) => {
		const roundIds = $rounds.filter(i => !!i).map(item => item.id).map((item, index, array) => {
			if (array[index - 1] === roundId) {
				return roundId;
			}
			if (item === roundId) {
				return array[index + 1];
			}
			return item;
		});

		await db.projectParts.update(Number($page.params.partId), { roundIds });
	};
	const handleResetClick = async () => {
		const roundIds = $rounds.map(round => round.id);

		if (!roundIds.length) {
			return;
		}

		await db.transaction('rw', db.rounds, () => Promise.all(
			roundIds.map(id => db.rounds.update(id, { state: 0 }))
		));
	};
	const handleRemoveClick = () => db.projectParts.delete($part.id);
	const handleAddRound = async () => {
		await db.transaction('rw', db.projectParts, db.rounds, async () => {
			const roundId = await db.rounds.add({
				name: 'new',
				checkboxAmount: 1,
				state: 0,
			});
			return db.projectParts.update($part.id, {roundIds: [...$part.roundIds, roundId]})
		});
	}

	onMount(() => {
		mounted = true;
	});

	$: {
		if (mounted) {
			part = liveQuery(
				() => db.projectParts.get(Number($page.params.partId))
			);
			rounds = liveQuery(
				() => db.projectParts.get(Number($page.params.partId))
					.then(part => part && Promise.all(part.roundIds.map(id => db.rounds.get(id))))
					.then(tap<Rounds>(() => loading = false))
			);
		}
	}
</script>
{#if loading}
	loading...
{:else if $rounds}
	{#if $rounds.length}
		{#each $rounds as round, i}
			<Round {round}
						 isFirst={i === 0}
						 isLast={i === $rounds.length - 1}
						 on:up={() => handleUp(round.id)}
						 on:down={() => handleDown(round.id)} />
		{/each}
	{:else}
		<div class="opacity-60 text-center py-4">
			No rounds added yet 🤷.
		</div>
	{/if}

	<div class="border-t cursor-pointer mt-2 opacity-60 hover:opacity-100 transition-opacity" on:click={handleAddRound}>
		<div class="absolute inset-0 opacity-50">
			<Round />
		</div>
		<div class="text-center py-px leading-10">
			add round
		</div>
	</div>


	<div class="mt-20 mb-2">
		<Input value={$part.name} on:input={debounceTime(handleNameChange, 500)}>
			Name
		</Input>
		<div class="sm:flex">
			<Button href="./{$part.id}/duplicate">duplicate</Button>
			<Button on:click={confirmAction(`Do you really want to reset ${$part.name}?`, handleResetClick)}>reset</Button>
			<Button on:click={confirmAction(`Do you really want to delete ${$part.name}?`, handleRemoveClick)}>
				remove
			</Button>
		</div>
	</div>
{/if}
