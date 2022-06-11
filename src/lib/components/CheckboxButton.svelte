<script lang="ts">
	export let type: '+'|'-';
	export let disabled;
</script>

<style lang="postcss">
    .checkbox {
        @apply w-5 h-5 rounded mr-1 inline-block align-middle bg-primary;
        border: 1px solid var(--color-primary);
    }

    .checkbox:before, .checkbox:after {
        @apply absolute bg-white dark:bg-zinc-900 h-0.5 w-0 transform origin-center;
        content: '';
    }

    .checkbox:before {
				@apply left-1 top-2 w-2.5;
    }

    .checkbox.plus:after {
				@apply top-1 left-2 h-2.5 w-0.5;
    }
</style>

<label class="cursor-pointer select-none transition-opacity"
			 class:opacity-50={disabled}
			 on:click>
	<div class="checkbox"
			 class:plus={type === '+'}
			 class:minus={type === '-'}></div>
</label>
