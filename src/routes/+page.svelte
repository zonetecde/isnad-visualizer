<script lang="ts">
	import HadithsSelector from '$lib/components/Page/HadithsSelector.svelte';
	import Main from '$lib/components/Page/Main.svelte';
	import { Page } from '$lib/models/Page';
	import { currentPage } from '$lib/stores/globalStore';
	import toast from 'svelte-french-toast';
</script>

<div class="w-screen h-screen flex flex-col relative">
	{#if $currentPage === Page.Main}
		<Main />
	{:else if $currentPage === Page.HadithSelector}
		<HadithsSelector />
	{/if}
</div>
