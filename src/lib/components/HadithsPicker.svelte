<script lang="ts">
	import { hadithBooks, hadithEditorModalVisible, hadithPickerModalVisible, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import HadithPicker from './HadithPicker.svelte';
	import { fade } from 'svelte/transition';
	import HadithCard from './HadithCard.svelte';
	import HadithEditor from './HadithEditor.svelte';

	onMount(async () => {
		if ($hadithBooks.length === 0) {
			const response = await fetch('/api/get-hadith-books');
			const data = await response.json();
			hadithBooks.set(data);
		}
	});

	function handleAddHadith() {
		hadithPickerModalVisible.set(true);
	}
</script>

<h3 class="text-xl mt-10 mb-5">Please select the hadith(s) for which you wish to generate the flow chart of their chain of transmission</h3>

<button class="mt-3 w-60 mx-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100" on:click={handleAddHadith}> Open Hadith Picker </button>

<div class="mt-5 flex flex-col gap-y-3 overflow-auto">
	{#each $selectedHadiths as hadith (hadith.id)}
		<HadithCard {hadith} showChain />
	{/each}
</div>

{#if $hadithPickerModalVisible}
	<div class="absolute inset-0 backdrop-blur-sm" transition:fade>
		<HadithPicker />
	</div>
{/if}

{#if $hadithEditorModalVisible !== -1}
	<div class="absolute inset-0 backdrop-blur-sm" transition:fade>
		<HadithEditor />
	</div>
{/if}
