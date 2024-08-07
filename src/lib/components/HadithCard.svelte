<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import IsnadChain from './IsnadChain.svelte';
	import toast from 'svelte-french-toast';

	export let hadith: Hadith;
	export let showChain: boolean = false; // Whether to show the transmission chain of the hadith

	$: isSelected = $selectedHadiths.find((x) => x.id === hadith.id);

	function addHadith() {
		selectedHadiths.update((h) => [hadith, ...h]);

		// Fetch the transmission chain of the hadith
		fetch('/api/get-transmission-chain?hadithId=' + hadith.hadithId)
			.then((response) => response.json())
			.then((data) => {
				hadith.transmissionChain = data;
				// Trigger svelte store update
				$selectedHadiths = [...$selectedHadiths];
			})
			.catch((error) => console.error(error));

		toast('Please check the chain of transmission of the hadith in the "Selected Hadiths" section.', {
			icon: '❕'
		});
	}
</script>

<div class="bg-[#ffffff] w-full p-2 flex flex-col border-2">
	<p class="text-sm mb-1">
		{hadith.source}

		{#if hadith.hadithNumber !== -1}
			<span class="text-sm">: {hadith.hadithNumber}</span>
		{/if}
	</p>

	<p class="arabic overflow-hidden hadith-card-text md:line-clamp-none line-clamp-3" dir="rtl">{hadith.textArabic}</p>

	<p class="mt-2 text-sm overflow-hidden hadith-card-text md:line-clamp-none line-clamp-3">{hadith.textEnglish}</p>

	{#if showChain && hadith.transmissionChain}
		<div class="mt-4">
			<IsnadChain transmissionChain={hadith.transmissionChain} />
		</div>
	{/if}

	<div class={'flex ' + (showChain ? 'mt-2' : '')}>
		{#if showChain}
			<button
				class={'ml-auto text-sm  text-white px-2 pt-1.5 pb-1 rounded-lg duration-100 bg-yellow-600 hover:bg-yellow-700 '}
				on:click={() => {
					// Open the hadith editor modal
					hadithEditorModalVisible.set(hadith.id);
				}}>Edit</button
			>
		{/if}
		<button
			class={'text-sm text-white px-2 pt-1.5 pb-1 rounded-lg duration-100 ' + (isSelected ? 'bg-red-600 hover:bg-red-800 ' : 'bg-[#203e64] hover:bg-[#122f55] ') + (showChain ? 'ml-2' : 'ml-auto')}
			on:click={() => {
				if (isSelected) selectedHadiths.set($selectedHadiths.filter((h) => h.id !== hadith.id));
				else addHadith();
			}}>{isSelected ? 'Remove' : 'Add'}</button
		>
	</div>
</div>
