<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { hadithBooks, hadithEditorModalVisible, hadithPickerModalVisible, isFetching, selectedHadiths } from '$lib/stores/globalStore';
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

	$: if (selectedHadithBook) {
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
									element.innerHTML = text.replace(regex, `<b class='text-green-800'>${searchText}</b>`);
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
		if (selectedHadithBook && hadithNumberInBook) {
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

	$: if (selectedHadithChapter) {
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

		selectedHadiths.update((h) => [...h, newHadith]);

		setTimeout(() => {
			hadithEditorModalVisible.set(hadithId);
		}, 0);
	}
</script>

<div class="flex w-full h-full items-center justify-center">
	<div class="w-9/12 h-[95%] bg-[#22131c] rounded-xl p-3 overflow-hidden flex flex-col relative border-4 border-[#180a13]">
		<button
			class="absolute top-2 right-2"
			on:click={() => {
				hadithPickerModalVisible.set(false);
			}}
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
		</button>

		<h3 class="text-center text-2xl font-bold mb-5">Hadith(s) selector</h3>

		<div class="flex flex-row gap-x-1.5">
			<input
				type="text"
				class="bg-[#463a42] h-full py-1.5 px-1 rounded-lg w-full outline-none"
				placeholder="Search by text"
				bind:value={searchText}
				on:keydown={(e) => {
					if (e.key === 'Enter') {
						searchHadithByText();
					}
				}}
			/>

			<button class="bg-[#523047] rounded-lg px-1" on:click={searchHadithByText}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
				</svg>
			</button>
		</div>

		<p class="my-1.5 mb-1">or</p>

		<div class="grid grid-cols-2 gap-x-2">
			<select class="bg-[#463a42] h-full py-1.5 px-1 rounded-lg w-full outline-none" bind:value={selectedHadithBook}>
				<option value="">Select a hadith book</option>
				{#each $hadithBooks as book}
					<option value={book}>{book}</option>
				{/each}
			</select>

			{#if selectedHadithBookChapters.length > 0 && selectedHadithBook !== ''}
				<div class="flex flex-col gap-y-1.5">
					<select class="bg-[#463a42] h-full py-1.5 px-1 rounded-lg w-full outline-none" bind:value={selectedHadithChapter}>
						<option value="">Select a chapter</option>
						{#each selectedHadithBookChapters as chapter}
							<option value={chapter}>{chapter}</option>
						{/each}
					</select>

					<div class="flex flex-row gap-x-1">
						<input
							type="number"
							class="bg-[#463a42] h-full py-1.5 px-1 rounded-lg w-full outline-none"
							placeholder="Or enter the hadith number"
							bind:value={hadithNumberInBook}
							on:keydown={(e) => {
								if (e.key === 'Enter') searchHadithByNumber();
							}}
						/>

						<button class="bg-[#523047] rounded-lg px-1" on:click={searchHadithByNumber}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>

		{#if $isFetching}
			<div class="flex items-center justify-center my-auto scale-150 pb-10">
				<div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		{/if}

		{#if selectedHadithChapterHadiths.length > 0}
			<div class="flex flex-col mt-6 w-full gap-y-3 overflow-auto">
				{#each selectedHadithChapterHadiths as hadith}
					<HadithCard {hadith} />
				{/each}
			</div>
		{/if}

		{#if noHadithsFound && !$isFetching && (selectedHadithBook || searchText)}
			<p class="text-center text-lg mt-5">No hadiths found</p>
		{/if}

		<button class="mt-auto text-center underline cursor-pointer" on:click={createCustomHadith}>Cannot find the hadith you are looking for?</button>
	</div>
</div>
