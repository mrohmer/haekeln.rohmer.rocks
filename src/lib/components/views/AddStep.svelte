<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../elements/Button.svelte';
	import Input from '../elements/Input.svelte';

	const dispatch = createEventDispatcher();

	export let checkboxAmount = 1;
	export let text = '';

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!checkboxAmount || !text.trim().length) {
			return;
		}

		dispatch('save', {
			checkboxAmount,
			text
		});

		checkboxAmount = 1;
		text = '';
	};
</script>

<style lang="scss">
  .add-step {
    display: flex;
    justify-content: space-between;

    &__text {
      flex-grow: 1;
    }
		&__spacer {
			width: 5px;
		}

		:global(input) {
			height: 100%;
		}
  }
</style>
<form class="add-step" on:submit={handleSubmit}>
	<div>
		<Input type="number" bind:value={checkboxAmount} min="1" />
	</div>
	<div class="add-step__spacer"></div>
	<div  class="add-step__text">
		<Input type="text" bind:value={text} />
	</div>
	<div class="add-step__spacer"></div>
	<Button type="submit" variant="icon">plus</Button>
</form>
