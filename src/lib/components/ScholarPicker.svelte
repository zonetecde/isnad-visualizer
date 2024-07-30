<script lang="ts">
	import type Scholar from '$lib/models/Scholar';
	import { createEventDispatcher } from 'svelte';
	import toast from 'svelte-french-toast';
	import { fade } from 'svelte/transition';

	export let scholar: Scholar;

	let dispatch = createEventDispatcher();

	let searchText = ''; // Search text input value
	let searchResults: Scholar[] = []; // Search results

	async function searchScholar() {
		if (!searchText) {
			toast.error('Please enter a search text');
			return;
		}

		const response = await fetch(`/api/search-scholar?search=${searchText}`);

		if (response.ok) {
			const data = await response.json();
			searchResults = data;

			if (searchResults.length === 0) {
				toast.error('No scholars found with the given search text');
			}
		}
	}
</script>

<div class="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-30" transition:fade>
	<div class="flex items-center justify-center w-full h-full">
		<div class="w-9/12 h-[440px] bg-[#c1bdfa] rounded-xl p-3 flex flex-col relative border-4 border-[#d3d3d3] overflow-auto">
			<button
				class="absolute top-2 right-2"
				on:click={() => {
					// Close the modal
					dispatch('close');
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
					<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
				</svg>
			</button>

			<h3 class="text-center text-2xl font-bold mb-5">Scholar Editor</h3>

			<div class="flex items-center relative">
				<p class="w-56">Search in database :</p>
				<input
					type="text"
					class="w-full px-2 py-1 rounded-xl outline-none border-2"
					placeholder="By name in arabic or english"
					bind:value={searchText}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							searchScholar();
						}
					}}
				/>
				<button
					class="absolute right-0 bg-[#86c2e4] rounded-r-lg p-1 border-2"
					on:click={() => {
						searchScholar();
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
					</svg>
				</button>
			</div>

			{#if searchResults.length === 0}
				<p class="mt-8">or manually enter the scholar details :</p>

				<div class="grid grid-cols-2 gap-x-3 mt-7">
					<label class=""
						>English name :
						<input type="text" class="w-full px-2 py-1 border rounded-xl outline-none" bind:value={scholar.nameEnglish} placeholder="English name" />
					</label>
					<label class=""
						>Arabic name :
						<input type="text" dir="rtl" class="w-full px-2 py-1 border rounded-xl outline-none arabic" bind:value={scholar.nameArabic} placeholder="Arabic name" />
					</label>
				</div>

				<label class="mt-4"
					>Grade :
					<input type="text" class="w-full px-2 py-1 border rounded-xl outline-none" bind:value={scholar.grade} placeholder="Grade" />
				</label>
			{:else}
				<div class="flex flex-col gap-2 mt-3 px-2 overflow-auto">
					{#each searchResults as result}
						<div class="flex items-center bg-white gap-2 px-3 py-2 rounded-lg">
							<p class="text-xs">{result.nameEnglish}</p>
							<p class="text-sm arabic ml-auto">{result.nameArabic}</p>
							<button
								class="bg-green-500 hover:bg-green-600 duration-100 rounded-lg px-3 ml-1"
								on:click={() => {
									scholar = result;
									searchResults = [];
									searchText = scholar.nameEnglish;
								}}
							>
								Select
							</button>
						</div>
					{/each}
				</div>
			{/if}

			<button
				class="mt-auto w-60 mx-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100"
				on:click={() => {
					dispatch('close');
				}}>Close</button
			>
		</div>
	</div>
</div>
