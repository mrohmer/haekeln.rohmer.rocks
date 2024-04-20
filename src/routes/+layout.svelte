<script lang="ts">
	import '../app.css';
	import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
</script>

<svelte:head>
	<title>Maschenzähler</title>
	<meta name="description" content="Digitaler Maschenzähler.">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<meta name="theme-color" content="#AA2F67" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content="Maschenzähler" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
</svelte:head>

<div class="w-full max-w-5xl mx-auto px-5">
	<slot />

	<div class="mt-4">
		<PoweredBy name="Matthias Rohmer"
							 url="https://matthias.rohmer.rocks"
							 technologies={['svelte', 'netlify']}
							 sourceCodeUrl="https://github.com/mrohmer/haekeln.rohmer.rocks" />
	</div>
</div>
