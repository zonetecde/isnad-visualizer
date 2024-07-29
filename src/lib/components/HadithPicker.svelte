<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithBooks } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import HadithCard from './HadithCard.svelte';

	let selectedHadithBook: string = '';
	let selectedHadithBookChapters: string[] = [];

	let selectedHadithChapter: string = '';
	let selectedHadithChapterHadiths: Hadith[] = [];

	$: if (selectedHadithBook) {
		// Fetch the chapters of the selected hadith book
		fetch('/api/get-chapters?book=' + selectedHadithBook)
			.then((response) => response.json())
			.then((data) => {
				selectedHadithBookChapters = data;
			})
			.catch((error) => console.error(error));
	}

	$: if (selectedHadithChapter) {
		// Fetch the hadiths of the selected hadith chapter
		fetch('/api/get-hadiths?book=' + selectedHadithBook + '&chapter=' + selectedHadithChapter.split('.')[0]) // .split('.')[0] is used to get the chapter number
			.then((response) => response.json())
			.then((data) => {
				selectedHadithChapterHadiths = data;
				console.log(data);
			})
			.catch((error) => console.error(error));
	}
</script>

<div class="flex w-full h-full items-center justify-center">
	<div class="w-7/12 h-4/5 bg-[#211c2e] rounded-xl p-3 overflow-hidden flex flex-col">
		<h3 class="text-center text-2xl font-bold mb-5">Find a hadith</h3>

		<div class="grid grid-cols-2 gap-x-2">
			<select class="bg-[#544c75] h-full py-1.5 px-1 rounded-lg w-full outline-none" bind:value={selectedHadithBook}>
				<option value="">Select a hadith book</option>
				{#each $hadithBooks as book}
					<option value={book}>{book}</option>
				{/each}
			</select>

			{#if selectedHadithBookChapters.length > 0}
				<select class="bg-[#544c75] h-full py-1.5 px-1 rounded-lg w-full outline-none" bind:value={selectedHadithChapter}>
					<option value="">Select a chapter</option>
					{#each selectedHadithBookChapters as chapter}
						<option value={chapter}>{chapter}</option>
					{/each}
				</select>
			{/if}
		</div>

		{#if selectedHadithChapterHadiths.length > 0}
			<div class="flex flex-col mt-6 w-full gap-y-3 overflow-auto">
				{#each selectedHadithChapterHadiths as hadith}
					<HadithCard {hadith} />
				{/each}
			</div>
		{/if}
	</div>
</div>
