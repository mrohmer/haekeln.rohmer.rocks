<script lang="ts">
	import { slide } from 'svelte/transition';

	let height = 0;
</script>

<div class="bottom-sheet" transition:slide|local>
	<div class="bottom-sheet__placeholder" style="height: {height}px"></div>
	<div class="bottom-sheet__container" bind:clientHeight={height}>
		<slot />
	</div>
</div>

<style lang="scss">
  .bottom-sheet {
		&__container {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 10px 20px;
      background: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25);
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      max-width: 1000px;
      margin: auto;
		}
  }
</style>
