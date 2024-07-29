<script lang="ts">
	import HadithsPicker from '$lib/components/HadithsPicker.svelte';
	import { Page } from '$lib/models/Page';
	import { currentPage } from '$lib/stores/globalStore';
	import toast from 'svelte-french-toast';
</script>

<div class="w-screen h-screen flex items-center justify-center">
	<div class="w-7/12 h-5/6 bg-[#423944] shadow-lg rounded-lg p-10 flex flex-col relative">
		<h1 class="text-4xl font-bold text-center">Isnad Visualizer</h1>

		{#if $currentPage === Page.HadithPicker}
			<HadithsPicker />
		{/if}
	</div>
</div>
