<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithEditorModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	let hadith: Hadith;

	onMount(() => {
		hadith = $selectedHadiths.find((h) => h.id === $hadithEditorModalVisible)!;
	});

	function saveChanges() {
		// Trigger svelte store update
		$selectedHadiths = [...$selectedHadiths];
	}
</script>

{#if hadith}
	<input type="text" class="w-full p-2 border-2 bg-[#2d1d31] rounded-xl" bind:value={hadith.textArabic} placeholder="Arabic text" />

	<button class="mt-3 w-60 mx-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100" on:click={saveChanges}> Save Changes </button>
{/if}
