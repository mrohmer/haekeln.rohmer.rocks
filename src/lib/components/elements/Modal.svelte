<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleCloseClick = () => dispatch('close');
</script>

<style lang="scss" type="text/scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    &__backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
			background: #000;
			opacity: 0.3;
    }

		&__container {
      position: absolute;
			top: 100px;
			left: 100px;
			right: 100px;
			max-height: calc(100vh - 200px);
			border-radius: 10px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
			background: white;
			padding: 20px;
			max-width: 600px;
			margin: auto;
		}
  }
</style>

<div class="modal">
	<div class="modal__backdrop" on:click={handleCloseClick}></div>
	<div class="modal__container">
		<div class="modal__content">
			<slot />
		</div>
	</div>
</div>
