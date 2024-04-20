<script lang="ts">
	import ClipboardJS from 'clipboard';
	import { onDestroy } from 'svelte';
	import Icon from './Icon.svelte';
	import { faCopy as copyIcon } from '@fortawesome/free-solid-svg-icons/faCopy.js';
	import { browser } from '$app/environment';

	export let value: any;
	export let id = `id${(Math.random() * 1000).toFixed(0)}`;
	export let name = id;
	export let type = 'text';
	export let min;
	export let max;
	export let required;
	export let copyBtn = false;

	let inputEl: HTMLInputElement;
	let copyBtnEl: HTMLButtonElement;
	let copy: ClipboardJS;

	export let filenames = [];

	export const focus = (...args) => inputEl?.focus(...args);

	const updateCopyEl = (el: HTMLButtonElement) => {
		copy?.destroy();

		if (!el) {
			return;
		}

		copy = new ClipboardJS(el);
		copy.on('success', ({ clearSelection }) => clearSelection());
	}

	onDestroy(() => copy?.destroy());

	let klass: string
	export {klass as class};

 $: updateCopyEl(copyBtnEl);
 $: copySupported = browser && ClipboardJS.isSupported();
</script>
<div class="border rounded border-secondary overflow-hidden py-1 mb-3 flex items-center {klass}" class:flex-col={type === 'file'}>
	{#if type === 'file'}
		<label for={id} class="px-4 block h-10 leading-10 opacity-80 text-center w-full">
			<slot />
		</label>
		{#if filenames?.length}
			<ul class="text-secondary">
				{#each filenames as name}
					<li>{name}</li>
				{/each}
			</ul>
		{/if}
		<input type="file" {id} class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" on:change multiple />
	{:else}
		<label for={id} class="px-4 block h-10 leading-10 w-fit opacity-80">
			<slot />
		</label>
		{#if type === 'text'}
			<input bind:this={inputEl} type="text" {name} {id} {min} {max} {required} class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input />
		{:else if type === 'number'}
			<input bind:this={inputEl} type="number" {name} {id} {min} {max} {required} class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input />
		{:else if type === 'textarea'}
			<textarea bind:this={inputEl} {id} {required} class="flex-1 min-h-[5rem] max-h-[25rem] leading-10 text-left bg-transparent" bind:value on:change on:input></textarea>
		{/if}

		{#if copyBtn && copySupported}
			<button bind:this={copyBtnEl} class="px-4 opacity-50 hover:opacity-100 transition-opacity bg-zinc-900" data-clipboard-target={`#${id}`}>
				<Icon icon={copyIcon} />
			</button>
		{/if}
	{/if}
</div>
<slot name="error" />
