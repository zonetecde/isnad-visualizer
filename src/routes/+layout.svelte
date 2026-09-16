<script lang="ts">
	import { browser } from '$app/environment';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { currentPage, pageName } from '$lib/stores/globalStore';
	import { Page } from '$lib/models/Page';

	$: if (browser && $currentPage) {
		// Add to the url without reloading the page
		if (pageName[$currentPage]) history.pushState(null, '', `/${pageName[$currentPage]}`);
	}
</script>

<Toaster />
<slot />
