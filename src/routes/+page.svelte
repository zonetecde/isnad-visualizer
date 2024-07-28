<script lang="ts">
	import { inputIsnads } from '$lib/stores/globalStore';
</script>

<div class="w-screen h-screen flex items-center justify-center">
	<div class="w-7/12 h-5/6 bg-[#423944] shadow-lg rounded-lg p-10">
		<h1 class="text-4xl font-bold text-center">Isnad Visualizer</h1>

		<h3 class="text-2xl font-bold mt-5">Step 1</h3>
		<p class="text-lg mt-2">
			Paste the chain of narrators from the hadith you want to visualize in the text area below. You
			can add multiple chains by clicking the <span class="bg-green-800 px-1.5 pb-0.5 rounded-full"
				>+</span
			>
			button. The hadith text itself is not necessary, but you can include it if you want. The chains
			can be in Arabic or any other language. You can find hadiths on the
			<a href="https://sunnah.com/" target="_blank" class="text-blue-500">Sunnah.com</a> website or any
			other source.
		</p>

		<section class="mt-5 flex flex-col">
			<div class="flex flex-col gap-y-2">
				{#each $inputIsnads as isnad}
					<div class="relative group">
						<input
							type="text"
							class="w-full h-fit bg-[#423944] outline-none text-white border-2 border-[#a694aa] rounded-lg p-2"
							placeholder="Paste the chain of narrators here"
							bind:value={isnad}
						/>

						<button
							class="group-hover:block hidden absolute right-2 top-1/2 -translate-y-1/2"
							on:click={() => inputIsnads.update((isnads) => isnads.filter((i) => i !== isnad))}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="orange"
								class="size-7"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</button>
					</div>
				{/each}
			</div>

			<button
				class="mt-3 ml-auto text-xl font-bold bg-green-800 text-white px-2 py-1.5 rounded-lg hover:bg-green-900 duration-100"
				on:click={() => inputIsnads.update((isnads) => [...isnads, ''])}
			>
				+ Add Chain
			</button>
		</section>
	</div>
</div>
