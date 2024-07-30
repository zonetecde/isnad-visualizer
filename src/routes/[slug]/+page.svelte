<script lang="ts">
	import HadithsSelector from '$lib/components/Page/HadithsSelector.svelte';
	import { Page } from '$lib/models/Page';
	import { pageName } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	let currentPage: string;

	onMount(() => {
		// Récupère la page actuel depuis l'url
		currentPage = window.location.pathname.split('/').pop()!;
	});
</script>

<div class="w-screen h-screen flex flex-col relative">
	{#if currentPage === pageName[Page.HadithSelector]}
		<HadithsSelector />
	{/if}
</div>
