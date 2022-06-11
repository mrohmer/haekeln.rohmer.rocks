<script>
	import Round from '$lib/views/project-parts/Round.svelte';

	export let count = 0;
</script>

<div class="border-y cursor-pointer opacity-60 hover:opacity-100 transition-opacity" on:click>
	<div class="absolute inset-0 opacity-50">
		<Round {count} />
	</div>
	<div class="text-center py-px leading-10">
		add round
	</div>
</div>
