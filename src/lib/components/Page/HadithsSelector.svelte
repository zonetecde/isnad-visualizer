<script lang="ts">
	import { currentPage, hadithBooks, hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Page } from '$lib/models/Page';
	import HadithCard from '../HadithCard.svelte';
	import HadithPicker from '../HadithPicker.svelte';
	import HadithEditor from '../HadithEditor.svelte';
	import toast from 'svelte-french-toast';

	onMount(async () => {
		const floatingChat = document.querySelector('.floatingchat-container-wrap');
		if (floatingChat) {
			floatingChat.remove();
		}

		if ($selectedHadiths.length === 0) {
			if (localStorage.getItem('selectedHadiths')) {
				selectedHadiths.set(JSON.parse(localStorage.getItem('selectedHadiths')!));
			}
		}

		if ($hadithBooks.length === 0) {
			const response = await fetch('/api/get-hadith-books');
			const data = await response.json();
			hadithBooks.set(data);
		}
	});
</script>

<div class="w-screen h-screen flex justify-center items-center">
	<a
		class="absolute top-2 left-2 bg-[#6a9ec9] rounded-full"
		href="/"
		on:click={() => {
			currentPage.set(Page.Main);
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
		</svg>
	</a>

	<div class="md:w-10/12 md:h-5/6 w-screen h-screen border-4 rounded-xl bg-[#99b0e2] flex flex-col overflow-auto">
		<div class="grid md:grid-rows-1 md:grid-cols-2 w-full h-full">
			<div class="flex flex-col md:p-2 p-1 overflow-hidden min-h-[300px]">
				<h3 class="text-center text-2xl font-bold mb-5">Hadiths Database</h3>
				<HadithPicker />
			</div>

			<div class="flex flex-col md:p-2 p-1 overflow-hidden min-h-[300px]">
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

		<button
			class="md:absolute my-2 md:my-0 mx-auto bottom-6 left-1/2 md:-translate-x-1/2 text-xl font-bold bg-[#203e64] text-white px-4 py-1.5 rounded-lg hover:bg-[#122f55] duration-100"
			on:click={() => {
				if ($selectedHadiths.length === 0) {
					toast.error('Please select at least one hadith to visualize the isnad.');
					return;
				}

				localStorage.setItem('selectedHadiths', JSON.stringify($selectedHadiths));
				currentPage.set(Page.IsnadViewer);
			}}
		>
			Visualize Isnad
		</button>

		{#if $hadithEditorModalVisible !== -1}
			<div class="absolute inset-0 backdrop-blur-sm" transition:fade>
				<HadithEditor />
			</div>
		{/if}
	</div>
</div>
