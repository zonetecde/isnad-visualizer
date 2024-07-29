<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	export let hadith: Hadith;
	export let showChain: boolean = false; // Whether to show the transmission chain of the hadith

	function selectHadith() {
		selectedHadiths.update((h) => [...h, hadith]);

		// Fetch the transmission chain of the hadith
		fetch('/api/get-transmission-chain?hadithId=' + hadith.hadithId)
			.then((response) => response.json())
			.then((data) => {
				hadith.transmissionChain = data;
				// Trigger svelte store update
				$selectedHadiths = [...$selectedHadiths];
			})
			.catch((error) => console.error(error));
	}
</script>

<div class="bg-[#00000044] w-full p-2 rounded-l-xl flex flex-col border-2 border-[#2d1d31]">
	<p class="text-sm mb-1">
		{hadith.source}

		{#if hadith.hadithNumber !== -1}
			<span class="text-sm">: {hadith.hadithNumber}</span>
		{/if}
	</p>

	<p class="arabic overflow-hidden line-clamp-3" dir="rtl">{hadith.textArabic}</p>

	<p class="mt-2 text-sm overflow-hidden line-clamp-3">{hadith.textEnglish}</p>

	{#if showChain && hadith.transmissionChain}
		<div class="flex flex-wrap gap-y-2 mt-4">
			{#each hadith.transmissionChain as transmitter, i}
				<div class="flex items-center">
					<div class="flex flex-col items-center gap-x-2 bg-[#140b13] px-3 py-2 rounded-2xl">
						<p class="text-sm arabic">{transmitter.nameArabic}</p>
						<p class="text-xs">{transmitter.nameEnglish}</p>
					</div>

					{#if i !== hadith.transmissionChain.length - 1}
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mx-2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
						</svg>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex">
		{#if showChain}
			<button
				class={'ml-auto mt-3 text-sm  text-white px-2 pt-1.5 pb-1 rounded-lg  duration-100 bg-yellow-800 hover:bg-yellow-900 '}
				on:click={() => {
					// Open the hadith editor modal
					hadithEditorModalVisible.set(hadith.id);
				}}>Edit Hadith</button
			>
		{/if}
		<button
			class={'mt-3 text-sm  text-white px-2 pt-1.5 pb-1 rounded-lg  duration-100 ' +
				($selectedHadiths.includes(hadith) ? 'bg-red-800 hover:bg-red-900 ' : 'bg-purple-800 hover:bg-purple-900 ') +
				(showChain ? 'ml-2' : 'ml-auto')}
			on:click={() => {
				if ($selectedHadiths.includes(hadith)) selectedHadiths.set($selectedHadiths.filter((h) => h.id !== hadith.id));
				else selectHadith();
			}}>{$selectedHadiths.includes(hadith) ? 'Remove Hadith' : 'Add Hadith'}</button
		>
	</div>
</div>
