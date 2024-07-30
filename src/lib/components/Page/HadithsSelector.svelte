<script lang="ts">
	import { currentPage, hadithBooks, hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Page } from '$lib/models/Page';
	import HadithCard from '../HadithCard.svelte';
	import HadithPicker from '../HadithPicker.svelte';
	import HadithEditor from '../HadithEditor.svelte';

	onMount(async () => {
		if ($hadithBooks.length === 0) {
			const response = await fetch('/api/get-hadith-books');
			const data = await response.json();
			hadithBooks.set(data);
		}
	});
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<div class="w-10/12 h-5/6 border-4 rounded-xl bg-[#99b0e2]">
		<!-- <div class="mt-5 flex flex-col gap-y-3 overflow-auto">

	</div> -->

		<!-- {#if $selectedHadiths.length === 0}
		<p class="text-center mt-5">No hadith selected</p>
	{:else}
		<button class="mt-5 w-60 mx-auto text-xl font-bold bg-[#203e64] text-white px-2 py-1.5 rounded-lg hover:bg-[#122f55] duration-100" on:click={() => currentPage.set(Page.IsnadViewer)}>
			Visualize Isnad
		</button>
	{/if} -->

		<div class="grid grid-cols-2 w-full h-full">
			<div class="flex flex-col p-2 overflow-hidden">
				<h3 class="text-center text-2xl font-bold mb-5">Hadiths Database</h3>
				<HadithPicker />
			</div>

			<div class="flex flex-col p-2 overflow-hidden">
				<h3 class="text-center text-2xl font-bold mb-5">Selected Hadith{$selectedHadiths.length > 1 ? 's' : ''}</h3>

				{#if $selectedHadiths.length === 0}
					<p class="text-center mt-5">No hadith selected</p>
				{/if}

				<div class="gap-y-2 px-2 flex flex-col overflow-auto">
					{#each $selectedHadiths as hadith (hadith.id)}
						<HadithCard {hadith} showChain />
					{/each}
				</div>
			</div>
		</div>

		{#if $hadithEditorModalVisible !== -1}
			<div class="absolute inset-0 backdrop-blur-sm" transition:fade>
				<HadithEditor />
			</div>
		{/if}
	</div>

	<button class="absolute bottom-6 text-xl font-bold bg-[#203e64] text-white px-4 py-1.5 rounded-lg hover:bg-[#122f55] duration-100" on:click={() => currentPage.set(Page.IsnadViewer)}>
		Visualize Isnad
	</button>
</div>
