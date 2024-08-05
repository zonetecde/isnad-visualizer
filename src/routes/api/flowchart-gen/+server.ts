import graphviz from 'graphviz';
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
	graph.set('rankdir', 'TB');
	graph.set('splines', 'ortho');

	// Create a map to store nodes
	const nodes = new Map();

	// Function to get or create a node
	function getOrCreateNode(scholar: Scholar, chainIndex: number, position: number) {
		const key = `${scholar.id}_${chainIndex}_${position}`;
		if (!nodes.has(key)) {
			const node = graph.addNode(key, {
				label: `${scholar.nameArabic}\n${scholar.nameEnglish}`,
				shape: 'box'
			});
			nodes.set(key, node);
		}
		return key;
	}

	// Function to check if a scholar is common at the end of multiple chains
	function isCommonEndScholar(scholar: Scholar) {
		return isnads.filter((chain: any) => chain[chain.length - 1].id === scholar.id || chain[chain.length - 2].id === scholar.id).length > 1;
	}

	// Process each isnad chain
	isnads.forEach((chain: Scholar[], chainIndex: number) => {
		for (let i = 0; i < chain.length; i++) {
			const scholar = chain[i];
			const isLast = i === chain.length - 1;
			const isSecondLast = i === chain.length - 2;

			// Use a common ID for scholars at the end or second to last of multiple chains, unique ID otherwise
			const nodeId = isCommonEndScholar(scholar) && (isLast || isSecondLast) ? scholar.id.toString() : getOrCreateNode(scholar, chainIndex, i);

			if (i > 0) {
				const prevNodeId = isCommonEndScholar(chain[i - 1]) && (isLast || i === chain.length - 1) ? chain[i - 1].id.toString() : getOrCreateNode(chain[i - 1], chainIndex, i - 1);
				graph.addEdge(prevNodeId, nodeId);
			}
		}
	});

	// Generate a random name for the image
	const randomName = generateRandomId();

	graph.setGraphVizPath('C:/Program Files/Graphviz/bin');
	graph.output('png', './static/flowchart/' + randomName + '.png');

	// Wait for the file to be created
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
