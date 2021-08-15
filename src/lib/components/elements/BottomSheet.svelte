<script lang="ts">
	import { slide } from 'svelte/transition';
</script>

<div class="bottom-sheet" transition:slide|local>
	<slot />
</div>

<style lang="scss">
  .bottom-sheet {
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
</style>
