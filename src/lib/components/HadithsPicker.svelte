<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithBooks } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import HadithPicker from './HadithPicker.svelte';

	let addHadithModalOpen = true;
	let selectedHadiths: Hadith[] = [{} as Hadith];

	onMount(async () => {
		if ($hadithBooks.length === 0) {
			const response = await fetch('/api/get-hadith-books');
			const data = await response.json();
			hadithBooks.set(data);
		}
	});

	function handleAddHadith() {
		addHadithModalOpen = true;
	}
</script>

<h3 class="text-xl mt-10 mb-5">
	Please select the hadith(s) for which you wish to generate the flow chart of their chain of
	transmission
</h3>

<button
	class="mt-3 ml-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100"
	on:click={handleAddHadith}
>
	+ Add Hadith
</button>

<div class="absolute inset-0 backdrop-blur-sm">
	{#if addHadithModalOpen}
		<HadithPicker />
	{/if}
</div>
