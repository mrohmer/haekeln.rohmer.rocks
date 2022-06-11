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

		await db.projectParts.update(Number($page.params.partId), {roundIds});
	}
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

		await db.projectParts.update(Number($page.params.partId), {roundIds});
	}
	const handleRemoveClick = async () => {
		if (confirm(`Do you really want to delete ${$part.name}?`)) {
			await db.projectParts.delete($part.id);
		}
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
	{#each $rounds as round, i}
		<Round {round}
					 isFirst={i === 0}
					 isLast={i === $rounds.length - 1}
					 on:up={() => handleUp(round.id)}
					 on:down={() => handleDown(round.id)} />
	{/each}


	<div class="mt-20 mb-2">
		<Input value={$part.name} on:input={debounceTime(handleNameChange, 500)}>
			Name
		</Input>
		<Button on:click={handleRemoveClick}>remove</Button>
	</div>
{/if}
