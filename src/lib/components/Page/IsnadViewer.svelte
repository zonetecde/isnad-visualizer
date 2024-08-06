<script lang="ts">
	import { Page } from '$lib/models/Page';
	import { currentPage, selectedHadiths } from '$lib/stores/globalStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let imgPath: string | undefined = undefined;
	let imageFormat: 'svg' | 'png' = 'svg';
	let direction: 'LR' | 'RL' | 'TB' | 'BT' = 'TB';
	let arrowHead:
		| 'normal'
		| 'none'
		| 'inv'
		| 'dot'
		| 'odot'
		| 'vee'
		| 'invdot'
		| 'invodot'
		| 'tee'
		| 'empty'
		| 'invempty'
		| 'diamond'
		| 'odiamond'
		| 'ediamond'
		| 'crow'
		| 'box'
		| 'obox'
		| 'open'
		| 'halfopen'
		| 'vee'
		| 'inv' = 'normal';
	let shape:
		| 'box'
		| 'ellipse'
		| 'diamond'
		| 'trapezium'
		| 'parallelogram'
		| 'hexagon'
		| 'octagon'
		| 'trapezoid'
		| 'parallelogram'
		| 'house'
		| 'pentagon'
		| 'doublecircle'
		| 'doubleoctagon'
		| 'tripleoctagon'
		| 'invtriangle'
		| 'invtrapezium'
		| 'invhouse'
		| 'Mdiamond'
		| 'Msquare'
		| 'Mcircle'
		| 'rect'
		| 'rectangle'
		| 'square'
		| 'circle'
		| 'point'
		| 'egg'
		| 'triangle'
		| 'plaintext'
		| 'none' = 'box';
	let splines: 'curved' | 'line' | 'polyline' | 'ortho' | 'spline' = 'ortho';
	let fontName: string = 'Arial';
	let label: 'arabic' | 'transliteration' | 'both' = 'both';
	let borderWidth: number = 1;

	let bgColor: string = 'transparent';
	let borderColor: string = 'black';
	let textColor: string = 'black';

	let isMounted = false;

	onMount(async () => {
		const floatingChat = document.querySelector('.floatingchat-container-wrap');
		if (floatingChat) {
			floatingChat.remove();
		}

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

		// Récupère les paramètres de customisation du graphique depuis le localStorage
		const settings = localStorage.getItem('flowchart-settings');
		if (settings) {
			const parsedSettings = JSON.parse(settings);
			direction = parsedSettings.direction;
			arrowHead = parsedSettings.arrowHead;
			splines = parsedSettings.splines;
			fontName = parsedSettings.fontName;
			bgColor = parsedSettings.bgColor;
			label = parsedSettings.label;
			shape = parsedSettings.shape;
			borderColor = parsedSettings.borderColor;
			textColor = parsedSettings.textColor;
			borderWidth = parsedSettings.borderWidth;
			imageFormat = parsedSettings.imageFormat || 'png';
		}

		isMounted = true;
		generateFlowchart();
	});

	$: if (direction || arrowHead || splines || fontName || bgColor || label || shape || borderColor || textColor || borderWidth) {
		if (isMounted) {
			if ($selectedHadiths.length > 0) generateFlowchart();

			// save settings in local storage
			localStorage.setItem('flowchart-settings', JSON.stringify({ direction, arrowHead, splines, fontName, bgColor, label, shape, borderColor, textColor, borderWidth }));
		}
	}

	async function generateFlowchart() {
		imgPath = undefined;

		// Génère le graphique
		const reponse = await fetch('/api/flowchart-gen', {
			method: 'POST',
			body: JSON.stringify({
				hadiths: $selectedHadiths,
				graphStyle: {
					direction: direction,
					arrowHead,
					splines,
					font: fontName,
					bgColor,
					fontName: fontName,
					label,
					shape: shape,
					borderColor,
					textColor,
					borderWidth
				}
			})
		});

		if (reponse.ok) {
			imgPath = await reponse.text();
		}
	}

	async function downloadImg(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (imageFormat === 'svg') {
			const button = event.currentTarget;
			const oldText = button.innerText;
			button.innerText = 'Downloading...';

			const a = document.createElement('a');
			a.href = imgPath!;
			a.download = 'isnads flowchart.svg';
			a.click();

			button.innerText = oldText;
		} else {
			// Convert SVG to PNG
			const response = await fetch('/api/svg-to-png', {
				method: 'POST',
				body: JSON.stringify({
					svgFilePath: imgPath
				})
			});

			if (response.ok) {
				const newImgPath = await response.text();

				const a = document.createElement('a');
				a.href = newImgPath;
				a.download = 'isnads flowchart.png';
				a.click();
			}
		}

		// save settings in local storage
		localStorage.setItem('flowchart-settings', JSON.stringify({ direction, arrowHead, splines, fontName, bgColor, label, shape, borderColor, textColor, borderWidth, imageFormat }));
	}
</script>

<div class="flex md:flex-row flex-col-reverse h-full relative">
	<section class="md:w-1/6 h-2/5 md:h-full min-w-[250px] border-r-2 bg-[#9399d3] border-[#767bad] py-3 px-2 overflow-y-auto">
		<div class="flex flex-col h-full">
			<button
				class="absolute top-2 left-2 bg-[#c7d3dd] rounded-full"
				on:click={() => {
					currentPage.set(Page.HadithSelector);
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
				</svg>
			</button>

			<h2 class="text-center font-bold text-2xl mb-2">Customisation</h2>

			<h4 class="text-lg font-bold underline underline-offset-1">General</h4>

			<div class="flex flex-col gap-y-2">
				<div class="flex flex-col space-y-0.5">
					<label for="orientation">Orientation</label>
					<select bind:value={direction} id="orientation" class="w-full">
						<option value="LR">Left to Right</option>
						<option value="RL">Right to Left</option>
						<option value="TB">Top to Bottom</option>
						<option value="BT">Bottom to Top</option>
					</select>
				</div>

				<div class="flex flex-col space-y-0.5">
					<label for="splines">Lines</label>
					<select bind:value={splines} id="splines" class="w-full">
						<option value="curved">Curved</option>
						<option value="line">Straight Lines</option>
						<option value="polyline">Polyline</option>
						<option value="ortho">Orthogonal</option>
						<option value="spline">Spline</option>
					</select>
				</div>

				<div class="flex flex-col space-y-0.5">
					<label for="font">Font</label>
					<select bind:value={fontName} id="font" class="w-full">
						<option value="Arial">Arial</option>
						<option value="Courier">Courier</option>
						<option value="Helvetica">Helvetica</option>
						<option value="Times">Times</option>
						<option value="Verdana">Verdana</option>
						<option value="Georgia">Georgia</option>
						<option value="Impact">Impact</option>
						<option value="Comic Sans MS">Comic Sans MS</option>
						<option value="Consolas">Consolas</option>
					</select>
				</div>

				<div class="flex flex-col space-y-0.5">
					<label for="font">Arrow Head</label>
					<select bind:value={arrowHead} id="arrowHead" class="w-full">
						<option value="normal">Normal</option>
						<option value="none">None</option>
						<option value="inv">Inverse</option>
						<option value="dot">Dot</option>
						<option value="odot">Open Dot</option>
						<option value="vee">Vee</option>
						<option value="invdot">Inverse Dot</option>
						<option value="invodot">Inverse Open Dot</option>
						<option value="tee">Tee</option>
						<option value="empty">Empty</option>
						<option value="invempty">Inverse Empty</option>
						<option value="diamond">Diamond</option>
						<option value="odiamond">Open Diamond</option>
						<option value="ediamond">Empty Diamond</option>
						<option value="crow">Crow</option>
						<option value="box">Box</option>
						<option value="obox">Open Box</option>
						<option value="open">Open</option>
						<option value="halfopen">Half Open</option>
					</select>
				</div>

				<div class="flex flex-col space-y-0.5">
					<label for="shape">Shape</label>
					<select bind:value={shape} id="shape" class="w-full">
						<option value="box">Box</option>
						<option value="ellipse">Ellipse</option>
						<option value="diamond">Diamond</option>
						<option value="trapezium">Trapezium</option>
						<option value="parallelogram">Parallelogram</option>
						<option value="hexagon">Hexagon</option>
						<option value="octagon">Octagon</option>
						<option value="trapezoid">Trapezoid</option>
						<option value="house">House</option>
						<option value="pentagon">Pentagon</option>
						<option value="doublecircle">Double Circle</option>
						<option value="doubleoctagon">Double Octagon</option>
						<option value="tripleoctagon">Triple Octagon</option>
						<option value="invtriangle">Inverse Triangle</option>
						<option value="invtrapezium">Inverse Trapezium</option>
						<option value="invhouse">Inverse House</option>
						<option value="Mdiamond">Medium Diamond</option>
						<option value="Msquare">Medium Square</option>
						<option value="Mcircle">Medium Circle</option>
						<option value="rect">Rectangle</option>
						<option value="rectangle">Rectangle</option>
						<option value="square">Square</option>
						<option value="circle">Circle</option>
						<option value="point">Point</option>
						<option value="egg">Egg</option>
						<option value="triangle">Triangle</option>
						<option value="plaintext">Plaintext</option>
						<option value="none">None</option>
					</select>

					<div class="flex flex-col space-y-0.5">
						<label for="borderWidth">Border Width</label>
						<input type="number" bind:value={borderWidth} min="0" step="0.5" max="10" id="borderWidth" class="w-full py-1.5 px-2 rounded-lg outline-none border" />
					</div>

					<h4 class="text-lg font-bold underline underline-offset-1 mt-5">Label</h4>

					<div class="flex flex-col gap-y-2">
						<div class="child:flex child:items-center child:gap-x-1 child:min-w-20">
							<div>
								<input type="radio" bind:group={label} value="both" id="labelBoth" />
								<label for="labelBoth">Arabic and Transliteration</label>
							</div>

							<div>
								<input type="radio" bind:group={label} value="arabic" id="labelArabic" />
								<label for="labelArabic">Arabic only</label>
							</div>

							<div>
								<input type="radio" bind:group={label} value="transliteration" id="labelTransliteration" />
								<label for="labelTransliteration">Transliteration only</label>
							</div>
						</div>
					</div>

					<h4 class="text-lg font-bold underline underline-offset-1 mt-5">Colors</h4>

					<div class="flex flex-col gap-y-2">
						<div class="flex flex-col space-y-0.5">
							<label for="bgColor">Background Color :</label>
							<div class="flex gap-x-2 items-center">
								<button class="w-1/2 bg-[#767bad] text-white rounded-lg px-1 py-1" on:click={() => (bgColor = 'transparent')}>Set to Transparent </button>
								<input
									type="color"
									id="bgColorPicker"
									class="w-1/2"
									on:change={(e) => {
										// @ts-ignore
										bgColor = e.target.value;
									}}
								/>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-y-2">
						<div class="flex gap-x-2 items-center">
							<label for="borderColor" class="w-1/2">Border Color :</label>
							<input
								type="color"
								id="borderColorPicker"
								class="w-1/2"
								on:change={(e) => {
									// @ts-ignore
									borderColor = e.target.value;
								}}
							/>
						</div>

						<div class="flex gap-x-2 items-center">
							<label for="textColor" class="w-1/2">Text Color :</label>
							<input
								type="color"
								id="textColorPicker"
								class="w-1/2"
								on:change={(e) => {
									// @ts-ignore
									textColor = e.target.value;
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<br />
			<div class="flex flex-col gap-y-1 mt-auto">
				<label for="format">Format</label>
				<select bind:value={imageFormat} id="format" class="w-full">
					<option value="svg">SVG</option>
					<option value="png">PNG</option>
				</select>
			</div>

			<button class="bg-[#203e64] text-white px-4 py-1.5 rounded-lg hover:bg-[#122f55] duration-100 mt-3" on:click={downloadImg}> Download Flowchart </button>
		</div>
	</section>
	<div class="md:w-5/6 w-full h-3/5 md:h-full flex items-center justify-center py-10">
		{#if imgPath}
			<img src={imgPath} alt="Graphique de la chaîne de transmission" class="object-contain w-full h-full" transition:fade />
		{/if}
	</div>
</div>
