<script lang="ts">
	import type { Isnad } from '$lib/models/Isnad';
	import { isnads } from '$lib/stores/globalStore';

	export let isnad: Isnad;
</script>

<div class="relative flex flex-row gap-x-1">
	<input
		type="text"
		class="w-full h-fit bg-[#423944] outline-none text-white border-2 border-[#a694aa] rounded-lg p-2 text-right arabic pt-3"
		placeholder="Paste the chain of narrators here"
		dir="rtl"
		bind:value={isnad.text}
	/>

	{#if $isnads.length > 1}
		<button
			on:click={() => {
				isnads.update((isnads) => isnads.filter((i) => i.id !== isnad.id));
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="white"
				class="size-7"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</button>
	{/if}
</div>
