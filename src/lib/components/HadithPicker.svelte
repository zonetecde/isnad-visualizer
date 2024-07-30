<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithBooks, hadithEditorModalVisible, isFetching, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import HadithCard from './HadithCard.svelte';
	import toast from 'svelte-french-toast';
	import { createBlankHadith } from '$lib/models/Utilities';

	let selectedHadithBook: string = '';
	let selectedHadithBookChapters: string[] = [];

	let selectedHadithChapter: string = '';
	let selectedHadithChapterHadiths: Hadith[] = [];

	let hadithNumberInBook: number;
	let noHadithsFound: boolean = false;

	let searchText: string = '';

	$: if (selectedHadithBook.trim()) {
		selectedHadithBookChapters = [];
		selectedHadithChapter = '';
		selectedHadithChapterHadiths = [];
		noHadithsFound = false;

		// Fetch the chapters of the selected hadith book
		fetch('/api/get-chapters?book=' + selectedHadithBook)
			.then((response) => response.json())
			.then((data) => {
				selectedHadithBookChapters = data;
			})
			.catch((error) => console.error(error));
	}

	function searchHadithByText() {
		if (searchText) {
			noHadithsFound = false;
			selectedHadithChapterHadiths = [];

			isFetching.set(true);

			// Fetch the hadith by text
			fetch('/api/search-hadith?text=' + searchText)
				.then((response) => response.json())
				.then((data) => {
					selectedHadithChapterHadiths = data;

					if (data.length === 0) noHadithsFound = true;
					else {
						// wait for svelte to render the hadith cards
						setTimeout(() => {
							// Put in bold the searched text
							const elements = document.querySelectorAll('.hadith-card-text');
							elements.forEach((element) => {
								searchText.split(' ').forEach((searchText) => {
									const text = element.innerHTML;
									const regex = new RegExp(searchText, 'gi');
									element.innerHTML = text.replace(regex, `<b class='text-red-800'>${searchText}</b>`);
								});
							});
						}, 0);
					}
				})
				.catch((error) => console.error(error))
				.finally(() => isFetching.set(false));
		} else {
			toast.error('Please enter a search text');
		}
	}

	function searchHadithByNumber() {
		if (selectedHadithBook.trim() && hadithNumberInBook) {
			selectedHadithChapterHadiths = [];
			noHadithsFound = false;

			isFetching.set(true);

			// Fetch the hadith by number
			fetch('/api/get-hadith-by-number?book=' + selectedHadithBook + '&number=' + hadithNumberInBook)
				.then((response) => response.json())
				.then((data) => {
					selectedHadithChapterHadiths = data;

					if (data.length === 0) noHadithsFound = true;
				})
				.catch((error) => console.error(error))
				.finally(() => isFetching.set(false));
		}
	}

	$: if (selectedHadithChapter.trim()) {
		selectedHadithChapterHadiths = [];
		noHadithsFound = false;

		isFetching.set(true);

		// Fetch the hadiths of the selected hadith chapter
		fetch('/api/get-hadiths?book=' + selectedHadithBook + '&chapter=' + selectedHadithChapter.split('.')[0]) // .split('.')[0] is used to get the chapter number
			.then((response) => response.json())
			.then((data) => {
				selectedHadithChapterHadiths = data;

				if (data.length === 0) noHadithsFound = true;
			})
			.catch((error) => console.error(error))
			.finally(() => isFetching.set(false));
	}

	function createCustomHadith() {
		const hadithId = new Date().getTime();

		const newHadith = createBlankHadith(hadithId);

		selectedHadiths.update((h) => [newHadith, ...h]);

		setTimeout(() => {
			hadithEditorModalVisible.set(hadithId);
		}, 0);
	}
</script>

<div class="flex flex-row">
	<input
		type="text"
		class="h-full py-1.5 px-2 rounded-l-lg w-full outline-none border"
		placeholder="Search by text"
		bind:value={searchText}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				searchHadithByText();
			}
		}}
	/>

	<button class="bg-[#86c2e4] rounded-r-lg px-2 border" on:click={searchHadithByText}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
		</svg>
	</button>
</div>

<p class="my-1.5 mb-1">or</p>

<div class="grid grid-cols-2 gap-x-2">
	<select
		class={'h-full py-1.5 px-1 rounded-lg w-full outline-none border ' + (selectedHadithBook === '' ? 'text-gray-400' : '')}
		on:mousedown={(e) => {
			// Pour enlever le placeholder
			selectedHadithBook = ' ';
		}}
		bind:value={selectedHadithBook}
	>
		<option value="" disabled>Select a hadith book</option>

		{#each $hadithBooks as book}
			<option value={book}>{book}</option>
		{/each}
	</select>

	{#if selectedHadithBookChapters.length > 0 && selectedHadithBook !== ''}
		<div class="flex flex-col gap-y-1.5">
			<select
				class={'h-full py-1.5 px-1 rounded-lg w-full outline-none border ' + (selectedHadithChapter === '' ? 'text-gray-400' : '')}
				bind:value={selectedHadithChapter}
				on:mousedown={(e) => {
					// Pour enlever le placeholder
					selectedHadithChapter = ' ';
				}}
			>
				<option value="" disabled>Select a chapter</option>
				{#each selectedHadithBookChapters as chapter}
					<option value={chapter}>{chapter}</option>
				{/each}
			</select>

			<div class="flex flex-row">
				<input
					type="number"
					class="h-full py-1.5 px-1 rounded-l-lg w-full outline-none border"
					placeholder="Or enter the hadith number"
					bind:value={hadithNumberInBook}
					on:keydown={(e) => {
						if (e.key === 'Enter') searchHadithByNumber();
					}}
				/>

				<button class="bg-[#86c2e4] border rounded-r-lg px-2" on:click={searchHadithByNumber}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
					</svg>
				</button>
			</div>
		</div>
	{/if}
</div>

<p class="mt-2">or <button class="text-center underline cursor-pointer" on:click={createCustomHadith}>manually add a hadith</button></p>

{#if $isFetching}
	<div class="flex items-center justify-center my-auto scale-150 pb-10">
		<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
	</div>
{/if}

{#if selectedHadithChapterHadiths.length > 0}
	<div class="flex flex-col mt-3 px-3 w-full gap-y-3 overflow-auto">
		{#each selectedHadithChapterHadiths as hadith}
			<HadithCard {hadith} />
		{/each}
	</div>
{/if}

{#if noHadithsFound && !$isFetching && (selectedHadithBook || searchText)}
	<p class="text-center text-lg mt-5">No hadith found</p>
{/if}
