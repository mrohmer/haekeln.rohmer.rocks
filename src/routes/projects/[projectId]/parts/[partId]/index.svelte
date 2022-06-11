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
	import AddRound from '$lib/views/project-parts/AddRound.svelte';
	import { slide } from 'svelte/transition';

	let loading = true;
	let part: Observable<ProjectPart>;
	let rounds: Observable<Rounds>;
	let mounted = false;
	let editRoundId: number;
	let editMode = false;

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
	const handleAddRound = async (index: number) => {
		editRoundId = await db.transaction('rw', db.projectParts, db.rounds, async () => {
			const roundId = await db.rounds.add({
				name: 'new',
				checkboxAmount: 1,
				state: 0,
			});
			await db.projectParts.update($part.id, {
				roundIds: [
					...$part.roundIds.filter((_, i) => i < index),
					roundId,
					...$part.roundIds.filter((_, i) => i >= index),
				]
			});
			return roundId;
		});
	};
	const handleRemoveRound = (id: number) => db.transaction('rw', db.projectParts, db.rounds, async () => {
		await db.rounds.delete(id);
		return db.projectParts.update($part.id, { roundIds: $part.roundIds.filter(i => i !== id) });
	});

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
					.then(rounds => rounds ? rounds.filter(r => !!r) : undefined)
					.then(tap<Rounds>(() => loading = false))
			);

			editMode = editMode || ($rounds && !$rounds.length);
		}
	}
</script>
{#if loading}
	loading...
{:else if $rounds}
	{#if editMode}
		<div transition:slide|local>
			<AddRound on:click={() => handleAddRound(0)} />
		</div>
	{/if}
	{#if $rounds.length}
		{#each $rounds as round, index}
			<Round {round}
						 {index}
						 isFirst={index === 0}
						 isLast={index === $rounds.length - 1}
						 editMode={editMode}
						 focusThis={editRoundId === round.id}
						 on:up={() => handleUp(round.id)}
						 on:down={() => handleDown(round.id)}
						 on:edit={() => editRoundId = round.id}
						 on:endEdit={() => editRoundId = undefined}
						 on:remove={confirmAction(`Do you really want to delete ${round.name}?`, () => handleRemoveRound(round.id))}
			/>
			{#if editMode}
				<div transition:slide|local>
					<AddRound on:click={() => handleAddRound(i + 1)} />
				</div>
			{/if}
		{/each}
	{:else}
		<div class="opacity-60 text-center py-4">
			No rounds added yet 🤷.
		</div>
	{/if}

	<div class="border-t cursor-pointer mt-2 opacity-60 hover:opacity-100 transition-opacity"
			 class:opacity-60={!editMode}
			 class:text-primary={editMode}
			 on:click={() => editMode = !editMode}>
		<div class="text-center py-px leading-10">
			{editMode ? 'save' : 'edit'}
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
