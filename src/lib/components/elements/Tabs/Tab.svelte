<script lang="ts">
	export let active = false;
	export let light = false;
</script>

<style lang="scss">
	@use 'src/styles/_variables' as var;
	.tab {
		padding: 10px 20px;
		cursor: pointer;
		position: relative;
		color: #666;

		&--active {
			color: #000;

			&:after {
				content: '';
				position: absolute;
				left: 5px;
				right: 5px;
				bottom: 0;
				height: 2px;
				border-radius: 1px;
				background: var.$primary;
			}
		}
		&--light {
			color: #bbb;
		}
	}
</style>

<div class="tab" class:tab--active={active} class:tab--light={light} on:click>
	<slot />
</div>
