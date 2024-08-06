<script>
	import { Page } from '$lib/models/Page';
	import { currentPage } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	onMount(() => {
		//@ts-ignore
		kofiWidgetOverlay.draw('zonetecde', {
			type: 'floating-chat',
			'floating-chat.donateButton.text': 'Support me',
			'floating-chat.donateButton.background-color': '#00b9fe',
			'floating-chat.donateButton.text-color': '#fff'
		});
	});
</script>

<div class="items-center justify-center flex flex-col h-full px-3">
	<h1 class="text-4xl font-bold text-center">Isnad Visualizer</h1>

	<p class="text-xl my-8 text-center">An online tool to visualize the chain of transmission of hadiths in a flowchart.</p>

	<button class="px-4 mx-auto text-xl font-bold bg-[#203e64] hover:bg-[#122f55] text-white py-1.5 rounded-lg duration-100" on:click={() => currentPage.set(Page.HadithSelector)}
		>Create a new flowchart
	</button>
</div>
