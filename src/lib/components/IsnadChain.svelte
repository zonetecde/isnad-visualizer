<script lang="ts">
	import type Scholar from '$lib/models/Scholar';
	import { createUnknownScholar } from '$lib/models/Utilities';
	import ScholarPicker from './ScholarPicker.svelte';

	export let transmissionChain: Scholar[];
	export let editable: boolean = false;

	let editedScholarIndex: number = -1;
	let openedScholarPicker: boolean = false;

	function addScholarBefore(i: number): any {
		transmissionChain = [...transmissionChain.slice(0, i), createUnknownScholar(), ...transmissionChain.slice(i)];
	}

	function addScholarAfter(i: number): any {
		transmissionChain = [...transmissionChain.slice(0, i + 1), createUnknownScholar(), ...transmissionChain.slice(i + 1)];
	}
</script>

<p class="mt-3">Isnad chain: {editable ? '(hover over the chain to see the options)' : ''}</p>

<div class={'flex overflow-auto gap-y-2 py-3 ' + (editable ? 'pr-20' : '')}>
	{#each transmissionChain as transmitter, i}
		<div class="flex items-center flex-row group min-w-max">
			{#if editable}
				<button class="bg-green-500 hover:bg-green-600 duration-100 p-0.5 rounded-full mr-1 hidden group-hover:block" on:click={() => addScholarBefore(i)}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			{/if}

			<div class="flex flex-col items-center gap-x-2 bg-[#9cc4d4] border px-3 py-2 rounded-2xl">
				<p class="text-sm arabic">
					{transmitter.nameArabic}
				</p>
				<p class="text-xs">{transmitter.nameEnglish}</p>

				{#if editable}
					<div class="flex gap-x-2">
						<button
							class="bg-yellow-500 hover:bg-yellow-600 duration-100 rounded-full px-1 mt-2 hidden group-hover:block"
							on:click={() => {
								editedScholarIndex = i;
								openedScholarPicker = true;
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
								/>
							</svg>
						</button>
						<button
							class="bg-red-500 hover:bg-red-700 duration-100 rounded-full mt-2 hidden group-hover:block"
							on:click={() => {
								transmissionChain = transmissionChain.filter((_, index) => index !== i);

								if (transmissionChain.length === 0) {
									// Add unknown scholar if the chain is empty
									transmissionChain = [createUnknownScholar()];
								}
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
							</svg>
						</button>
					</div>
				{/if}
			</div>

			{#if editable}
				<button class="bg-green-500 p-0.5 hover:bg-green-600 duration-100 rounded-full ml-1 hidden group-hover:block" on:click={() => addScholarAfter(i)}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
				</button>
			{/if}

			{#if i !== transmissionChain.length - 1}
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 mx-2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			{/if}
		</div>
	{/each}
</div>

{#if openedScholarPicker}
	<ScholarPicker
		bind:scholar={transmissionChain[editedScholarIndex]}
		on:close={() => {
			openedScholarPicker = false;
		}}
	/>
{/if}
