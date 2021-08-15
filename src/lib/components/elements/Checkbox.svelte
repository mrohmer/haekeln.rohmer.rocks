<script lang="ts">
	export let checked = false;
	export let id = (Math.random() * 1000).toFixed(0);
</script>

<style lang="scss">
	@use 'src/styles/_variables' as var;
	label {
		width: 20px;
		height: 20px;
		border: 1px solid var.$primary;
		border-radius: 3px;
		margin: 3px;
		display: inline-block;
		vertical-align: middle;

		&:before, &:after {
			content: '';
			position: absolute;
			background: var.$background;
			height: 2px;
			width: 0;
			transform-origin: center;
		}
		&:before {
			left: 4px;
			top: 10px;
			transform: rotate(45deg);
		}
		&:after {
			left: 6px;
			top: 8px;
      transform: rotate(-45deg);
		}

		&.checked {
			background: var.$primary;

			&:before {
				width: 5px;
			}
			&:after {
				width: 10px;
			}
		}
		input {
			visibility: hidden;
		}
	}
</style>
<label for="{id}" class:checked>
	<input type="checkbox" bind:checked {id} on:change>
</label>
