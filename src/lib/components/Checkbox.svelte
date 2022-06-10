<script lang="ts">
	export let checked = false;
	export let disabled;
	export let id = (Math.random() * 1000).toFixed(0);
</script>

<style lang="postcss">
    .checkbox {
        @apply w-5 h-5 rounded mr-1 mb-1 inline-block align-middle;
        border: 1px solid var(--color-secondary);
    }

    .checkbox:before, .checkbox:after {
        @apply absolute bg-white dark:bg-zinc-900 h-0.5 w-0 transform origin-center;
        content: '';
    }

    .checkbox:before {
				@apply left-1 top-2.5 rotate-45;
    }

    .checkbox:after {
				@apply left-1.5 top-2 -rotate-45;
    }

    .checkbox.checked {
				@apply bg-secondary;
    }

    .checkbox.checked:before {
        width: 5px;
    }

    .checkbox.checked:after {
        @apply w-2.5;
    }
</style>
<label for={id} class="cursor-pointer select-none" on:click>
	<input type="checkbox" class="hidden select-none" bind:checked {disabled} {id} on:change>
	<div class="checkbox" class:checked></div>
	<div class="inline-block align-middle"><slot /></div>
</label>
