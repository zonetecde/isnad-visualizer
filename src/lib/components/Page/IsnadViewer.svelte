<script lang="ts">
	import { Page } from '$lib/models/Page';
	import { currentPage, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	let imgPath: string;
	let orientation: 'LR' | 'RL' | 'TB' | 'BT' = 'TB';
	let arrowHead: boolean = false;
	let splines: 'curved' | 'line' | 'polyline' | 'ortho' | 'spline' = 'ortho';
	let font: string = 'Arial';

	onMount(async () => {
		// Si aucun hadith n'est sélectionné, on vérifie dans le localStorage
		if ($selectedHadiths.length === 0) {
			const selectedHadithsFromLocalStorage = localStorage.getItem('selectedHadiths');
			if (selectedHadithsFromLocalStorage) {
				selectedHadiths.set(JSON.parse(selectedHadithsFromLocalStorage));
			} else {
				history.pushState({}, '', '/');
				currentPage.set(Page.Main);
			}
		}

		// Génère le graphique
		const reponse = await fetch('/api/flowchart-gen', {
			method: 'POST',
			body: JSON.stringify({
				hadiths: $selectedHadiths,
				graphStyle: {
					orientation,
					arrowHead,
					splines,
					font
				}
			})
		});

		if (reponse.ok) {
			imgPath = await reponse.text();
		}
	});
</script>

{#if imgPath}
	<img src={imgPath} alt="Graphique de la chaîne de transmission" class="w-screen h-screen object-contain" />
{/if}
