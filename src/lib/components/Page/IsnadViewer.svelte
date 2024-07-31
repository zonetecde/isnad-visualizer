<script lang="ts">
	import { selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';

	let imgPath: string;

	onMount(async () => {
		// Génère le graphique
		const reponse = await fetch('/api/flowchart-gen', {
			method: 'POST'
		});

		if (reponse.ok) {
			// Image du graphique
			// Affiche le graphique
			console.log('Graphique généré');
			imgPath = await reponse.text();
		}
	});
</script>

{#if imgPath}
	<img src={imgPath} alt="Graphique de la chaîne de transmission" />
{/if}
