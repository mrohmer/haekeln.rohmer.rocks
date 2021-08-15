<script lang="ts">
	export let active = false;
</script>

<style lang="scss">
	.tab {
		padding: 5px;
		border: 1px solid #999;
		background: #ddd;
		cursor: pointer;
		&--active {
			text-decoration: underline;
			font-weight: bold;
			border-bottom-color: transparent;
			background: white;
		}
	}
</style>

<div class="tab" class:tab--active={active} on:click>
	<slot />
</div>
