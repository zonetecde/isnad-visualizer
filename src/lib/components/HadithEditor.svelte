<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import IsnadChain from './IsnadChain.svelte';

	let hadith: Hadith;

	onMount(() => {
		hadith = $selectedHadiths.find((h) => h.id === $hadithEditorModalVisible)!;
	});

	function saveAndClose() {
		// Trigger svelte store update
		$selectedHadiths = [...$selectedHadiths];
		hadithEditorModalVisible.set(-1);
	}
</script>

<div class="flex w-full h-full items-center justify-center bg-black bg-opacity-50">
	<div class="w-8/12 h-[90%] bg-[#c1bdfa] rounded-xl p-3 flex flex-col relative border-4 border-[#d3d3d3] overflow-auto">
		<button class="absolute top-2 right-2" on:click={saveAndClose}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
		</button>

		<h3 class="text-center text-2xl font-bold mb-5">Hadith Editor</h3>

		{#if hadith}
			<label class="mt-3"
				>Arabic text
				<textarea class="w-full h-40 p-2 border-2 bg-[#dfdef5] rounded-r-xl outline-none arabic" dir="rtl" bind:value={hadith.textArabic} placeholder="Arabic text"></textarea>
			</label>

			<label class="mt-4"
				>English text
				<textarea class="w-full h-40 p-2 border-2 bg-[#dfdef5] rounded-l-xl outline-none" bind:value={hadith.textEnglish} placeholder="English text"></textarea>
			</label>

			<IsnadChain bind:transmissionChain={hadith.transmissionChain} editable />

			<br />

			<button class="mt-auto w-60 mx-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100" on:click={saveAndClose}>Close</button>
		{/if}
	</div>
</div>
