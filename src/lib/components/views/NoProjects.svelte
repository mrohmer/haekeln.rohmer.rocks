<script lang="ts">
	import Button from '../elements/Button.svelte';
</script>
<style lang="scss">
	.no-project {
		text-align: center;
		padding: 50px 0;

		&__btn {
			margin-top: 10px;
		}
	}
</style>
<div class="no-project">
	Noch wurde kein Projekt erstellt.
	<div class="no-project__btn">
		<Button on:click>Neues Projekt erstellen</Button>
	</div>
</div>
