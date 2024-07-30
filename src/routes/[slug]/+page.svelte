<script lang="ts">
	import HadithsSelector from '$lib/components/Page/HadithsSelector.svelte';
	import IsnadViewer from '$lib/components/Page/IsnadViewer.svelte';
	import { Page } from '$lib/models/Page';
	import { currentPage, pageName } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	let currentPageUrl: string;

	$: if ($currentPage) {
		currentPageUrl = pageName[$currentPage];
	}

	onMount(() => {
		// Récupère la page actuel depuis l'url
		currentPageUrl = window.location.pathname.split('/').pop()!;
	});
</script>

<div class="w-screen h-screen flex flex-col relative">
	{#if currentPageUrl === pageName[Page.HadithSelector]}
		<HadithsSelector />
	{:else if currentPageUrl === pageName[Page.IsnadViewer]}
		<IsnadViewer />
	{/if}
</div>
