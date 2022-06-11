<script lang="ts">
	export let disabled = false;
	export let type = 'button';
</script>

<button on:click
				{disabled}
				{type}
				class="w-full bg-transparent border border-secondary rounded text-secondary transition-colors cursor-pointer py-2.5 px-4 mr-1 mb-1 hover:bg-amber-50 dark:hover:bg-zinc-800 active:bg-secondary active:text-white active:dark:text-zinc-900"
				class:opacity-30={disabled}>
	<slot />
</button>
