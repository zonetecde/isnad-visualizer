<script lang="ts">
	import IsnadInput from '$lib/components/isnadInput.svelte';
	import { isnads } from '$lib/stores/globalStore';
	import toast from 'svelte-french-toast';

	export let currentStep;

	async function fetchIsnads() {
		// Fetch the isnad
		for (const isnad of $isnads) {
			const res = await fetch('/api/get-isnad', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ text: isnad.text })
			});
			const data = await res.json();
			isnad.transmitters = data.chain_of_transmission;

			// If one of the transmitter's arabic text is `رَسُولَ اللَّهِ`, or `النَّبِيِّ` then replace it with `Prophet Muhammad` for the latin name
			isnad.transmitters.map((transmitter) => {
				if (
					transmitter.arabic_name === 'رَسُولَ اللَّهِ' ||
					transmitter.arabic_name === 'النَّبِيِّ' ||
					transmitter.arabic_name === 'رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ' ||
					transmitter.arabic_name === 'النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'
				) {
					transmitter.latin_name = 'Prophet Muhammad';
					transmitter.arabic_name = 'رَسُولَ اللَّهِ';
				}
				return transmitter;
			});

			$isnads = [...$isnads];

			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
</script>

<h3 class="text-2xl font-bold mt-5">Step 1</h3>
<p class="text-lg mt-2">
	Paste the chain of narrators from the hadith you want to visualize in the text area below. You can
	add multiple chains by clicking the <span class="bg-green-800 px-1.5 pb-0.5 rounded-full">+</span>
	button. The hadith text itself is not necessary, but you can include it if you want. The chains can
	be in Arabic or any other language. You can find hadiths on the
	<a href="https://sunnah.com/" target="_blank" class="text-blue-300">Sunnah.com</a> website or any other
	source.
</p>

<section class="mt-5 flex flex-col relative max-h-full overflow-auto mb-6">
	<div class="flex flex-col gap-y-2">
		{#each $isnads as isnad}
			<IsnadInput bind:isnad />
		{/each}
	</div>

	<button
		class="mt-3 ml-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100"
		on:click={() =>
			isnads.update((isnads) => [...isnads, { id: Date.now(), text: '', transmitters: [] }])}
	>
		+ Add Chain
	</button>
</section>

<button
	class="mt-auto bg-[#471839] py-2 rounded-lg hover:bg-[#38132d] duration-100"
	on:click={async () => {
		if ($isnads.some((isnad) => !isnad.text.trim())) {
			toast.error('Please fill in all the chains of narrators.');
			return;
		}

		currentStep = 2;

		fetchIsnads();
	}}>Click here to confirm the isnads</button
>
