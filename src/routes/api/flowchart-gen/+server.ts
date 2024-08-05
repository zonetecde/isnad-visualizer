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
			const node = graph.addNode(key);
			node.set('label', `${scholar.nameArabic}\n${scholar.nameEnglish}`);
			node.set('shape', 'box');
			nodes.set(key, node);
		}
		return key;
	}

	// Function to find common suffix length between two arrays
	function commonSuffixLength(arr1: Scholar[], arr2: Scholar[]) {
		let i = arr1.length - 1;
		let j = arr2.length - 1;
		let count = 0;
		while (i >= 0 && j >= 0 && arr1[i].id === arr2[j].id) {
			count++;
			i--;
			j--;
		}
		return count;
	}

	// Find the maximum common suffix length across all chains
	let maxCommonSuffixLength = 0;
	for (let i = 0; i < isnads.length; i++) {
		for (let j = i + 1; j < isnads.length; j++) {
			maxCommonSuffixLength = Math.max(maxCommonSuffixLength, commonSuffixLength(isnads[i], isnads[j]));
		}
	}

	// Process each isnad chain
	isnads.forEach((chain: Scholar[], chainIndex: number) => {
		for (let i = 0; i < chain.length; i++) {
			const scholar = chain[i];
			const positionFromEnd = chain.length - 1 - i;

			// Use a common ID for scholars in the common suffix, unique ID otherwise
			const nodeId = positionFromEnd < maxCommonSuffixLength ? scholar.id.toString() : getOrCreateNode(scholar, chainIndex, i);

			if (i > 0) {
				const prevPositionFromEnd = chain.length - i;
				const prevNodeId = prevPositionFromEnd < maxCommonSuffixLength ? chain[i - 1].id.toString() : getOrCreateNode(chain[i - 1], chainIndex, i - 1);

				// if node does not exists
				if (!nodes.has(nodeId)) {
					const node = graph.addNode(nodeId);
					node.set('label', `${scholar.nameArabic}\n${scholar.nameEnglish}`);
					node.set('shape', 'box');
					nodes.set(nodeId, node);
				}
				if (!nodes.has(prevNodeId)) {
					const node = graph.addNode(prevNodeId);
					node.set('label', `${scholar.nameArabic}\n${scholar.nameEnglish}`);
					node.set('shape', 'box');
					nodes.set(prevNodeId, node);
				}

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
