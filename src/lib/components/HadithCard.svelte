<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import IsnadChain from './IsnadChain.svelte';

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

	<p class="arabic overflow-hidden hadith-card-text" dir="rtl">{hadith.textArabic}</p>

	<p class="mt-2 text-sm overflow-hidden hadith-card-text">{hadith.textEnglish}</p>

	{#if showChain && hadith.transmissionChain}
		<div class="mt-4">
			<IsnadChain transmissionChain={hadith.transmissionChain} />
		</div>
	{/if}

	<div class="flex">
		{#if showChain}
			<button
				class={'ml-auto mt-3 text-sm  text-white px-2 pt-1.5 pb-1 rounded-lg  duration-100 bg-yellow-800 hover:bg-yellow-900 '}
				on:click={() => {
					// Open the hadith editor modal
					hadithEditorModalVisible.set(hadith.id);
				}}>Edit</button
			>
		{/if}
		<button
			class={'mt-3 text-sm  text-white px-2 pt-1.5 pb-1 rounded-lg  duration-100 ' +
				($selectedHadiths.includes(hadith) ? 'bg-red-800 hover:bg-red-900 ' : 'bg-purple-800 hover:bg-purple-900 ') +
				(showChain ? 'ml-2' : 'ml-auto')}
			on:click={() => {
				if ($selectedHadiths.includes(hadith)) selectedHadiths.set($selectedHadiths.filter((h) => h.id !== hadith.id));
				else selectHadith();
			}}>{$selectedHadiths.includes(hadith) ? 'Remove' : 'Add Hadith'}</button
		>
	</div>
</div>
