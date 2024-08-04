import graphviz, { type Node } from 'graphviz';
import fs from 'fs';
import type Hadith from '$lib/models/Hadith';
import type Scholar from '$lib/models/Scholar';
import { generateRandomId } from '$lib';

/** @type {import('./types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const body = await request.json();

	const isnads = body.hadiths.map((hadith: Hadith) => hadith.transmissionChain);

	// Create a graph
	const graph = graphviz.digraph('G');

	// Set the graph properties
	graph.set('dpi', 200);
	graph.set('rankdir', body.graphStyle.orientation);
	graph.set('splines', body.graphStyle.splines);

	// Ajoute les transmetteurs en tant que noeuds
	// D'abord regarde quelles transmetteurs mettre une seul fois
	let reversed_isnads: Scholar[][] = isnads.map((isnad: Scholar[]) => isnad.slice().reverse());

	let smallestLength = 999;
	reversed_isnads.forEach((isnad: Scholar[]) => {
		if (isnad.length < smallestLength) {
			smallestLength = isnad.length;
		}
	});

	// Les transmetteurs qui doivent êtres ajoutés une seul fois sont ceux qui ont le meme index au debut sans interruption
	let uniqueTransmitters: Scholar[] = [];
	for (let z = 0; z < smallestLength; z++) {
		const scholars = reversed_isnads.map((isnad: Scholar[]) => {
			return isnad[z];
		});

		const atLeastTwoEqual = (arr: Scholar[]) => {
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					if (arr[i].id === arr[j].id) {
						return true;
					}
				}
			}
			return false;
		};

		if (atLeastTwoEqual(scholars)) {
			// Vérifie que les scholars d'avant dans la chaine sont aussi dans la liste

			uniqueTransmitters.push(scholars[0]);
			console.log('Adding ' + scholars[0].nameEnglish + ' to uniqueTransmitters');
		} else {
			break;
		}
	}

	// Ajoute les nodes
	// D'abord les transmetteurs qui doivent être ajoutés une seul fois
	uniqueTransmitters.forEach((scholar: Scholar) => {
		scholar.graphNodeId = generateRandomId();
		graph.addNode(scholar.graphNodeId, { shape: 'box', color: 'blue', fontname: body.graphStyle.font, label: scholar.nameArabic + '\n' + scholar.nameEnglish });
	});

	// Ensuite tout les autres
	isnads.forEach((isnad: Scholar[]) => {
		isnad.forEach((scholar: Scholar) => {
			if (!uniqueTransmitters.includes(scholar)) {
				scholar.graphNodeId = generateRandomId();
				graph.addNode(scholar.graphNodeId, { shape: 'box', color: 'blue', fontname: body.graphStyle.font, label: scholar.nameArabic + '\n' + scholar.nameEnglish });
			}
		});
	});

	// Ajoute les edges
	isnads.forEach((isnad: Scholar[]) => {
		for (let i = 0; i < isnad.length - 1; i++) {
			const from = isnad[i];
			const to = isnad[i + 1];
			graph.addEdge(from.graphNodeId, to.graphNodeId, { fontname: body.graphStyle.font, fontsize: body.graphStyle.fontSize });
		}
	});

	// Generate a random name for the image
	const randomName = generateRandomId();

	graph.setGraphVizPath('C:/Program Files/Graphviz/bin');
	graph.output('png', './static/flowchart/' + randomName + '.png');

	// Tant que le fichier n'est pas créé, on attend
	while (!fs.existsSync('./static/flowchart/' + randomName + '.png')) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	await new Promise((resolve) => setTimeout(resolve, 300));

	// return the image path
	return new Response('/flowchart/' + randomName + '.png', {
		headers: {
			'content-type': 'text/plain'
		}
	});
}
