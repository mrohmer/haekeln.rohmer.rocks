<script lang="ts">
	export let disabled;
	export let type = 'button';
	export let href: string;
</script>

<style lang="postcss">
	.btn {
		@apply w-full bg-transparent border border-secondary rounded text-secondary transition-colors cursor-pointer py-2.5 px-4 mr-1 mb-1 hover:bg-amber-50 dark:hover:bg-zinc-800 active:bg-secondary active:text-white active:dark:text-zinc-900 text-center;
	}
	.btn[disabled] {
			@apply opacity-30;
	}
</style>
{#if href}
	<a on:click
		 {disabled}
		 {href}
		 class="btn block">
		<slot />
	</a>
{:else}
	<button on:click
					{disabled}
					{type}
					class="btn">
		<slot />
	</button>
{/if}
