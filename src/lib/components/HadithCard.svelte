<script lang="ts">
	import type Hadith from '$lib/models/Hadith';
	import { onMount } from 'svelte';

	export let hadith: Hadith;

	onMount(() => {
		console.log(hadith);
	});
</script>

<div class="bg-[#172736] w-full p-2 rounded-xl flex flex-col">
	{#if hadith.hadithNumber !== -1}
		<p class="text-sm">{hadith.hadithNumber}</p>

		<p class="arabic overflow-hidden line-clamp-3" dir="rtl">{hadith.textArabic}</p>

		<p class="mt-2 text-sm overflow-hidden line-clamp-3">{hadith.textEnglish}</p>

		<button class="ml-auto mt-3 text-sm bg-green-800 text-white px-2 pt-1.5 pb-1 rounded-lg hover:bg-green-900 duration-100">Add</button>
	{/if}
</div>
