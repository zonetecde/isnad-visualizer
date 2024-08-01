import graphviz, { type Node } from 'graphviz';
import fs from 'fs';
import type Hadith from '$lib/models/Hadith';
import type Scholar from '$lib/models/Scholar';
import { generateRandomId } from '$lib';

/** @type {import('./types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const body = await request.json();

	const hadiths = body.hadiths;
	const isnads = body.hadiths.map((hadith: Hadith) => hadith.transmissionChain);

	// Create a graph
	const graph = graphviz.digraph('G');

	// Set the graph properties
	graph.set('dpi', 200);
	graph.set('rankdir', body.graphStyle.orientation);
	graph.set('splines', body.graphStyle.splines);

	// dictionary to store the nodes
	const nodes: { [key: string]: Node } = {};

	// Create the nodes
	isnads.forEach((isnad: Scholar[]) => {
		isnad.forEach((node: Scholar) => {
			node.graphNodeId = generateRandomId();
			node.graphNodeLabel = node.nameArabic + '\n' + node.nameEnglish;

			nodes[node.graphNodeId] = graph.addNode(node.graphNodeId, { shape: 'box', color: 'blue', fontname: body.graphStyle.font, label: node.graphNodeLabel });
		});
	});

	// Create the edges

	isnads.forEach((isnad: Scholar[]) => {
		// loop through the isnad chain
		for (let i = 1; i < isnad.length; i++) {
			graph.addEdge(nodes[isnad[i - 1].graphNodeId], nodes[isnad[i].graphNodeId], {
				color: 'black',
				fontname: body.graphStyle.font,
				fontsize: 10
			});
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
