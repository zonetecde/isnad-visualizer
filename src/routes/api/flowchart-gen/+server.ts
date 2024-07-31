import graphviz from 'graphviz';
import fs from 'fs';

/** @type {import('./types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const graphNode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	const graphEdge = [
		['A', 'B'],
		['A', 'C'],
		['A', 'D'],
		['B', 'E'],
		['B', 'F'],
		['C', 'G'],
		['C', 'H'],
		['D', 'I'],
		['D', 'J']
	];

	var g = graphviz.digraph('G');
	g.set('dpi', 300);
	//g.set('rankdir', 'LR');
	g.set('rankdir', 'TB');
	g.set('splines', 'ortho');

	graphNode.forEach((node) => {
		g.addNode(node, { shape: 'box', color: 'blue' });
	});

	graphEdge.forEach((edge) => {
		g.addEdge(edge[0], edge[1], { arrowhead: 'none' });
	});

	const randomName = Math.random().toString(36).substring(7);

	g.setGraphVizPath('C:/Program Files/Graphviz/bin');
	g.output('png', './static/flowchart/' + randomName + '.png');

	// Tant que le fichier n'est pas créé, on attend
	while (!fs.existsSync('./static/flowchart/' + randomName + '.png')) {
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	await new Promise((resolve) => setTimeout(resolve, 100));

	// return the image path
	return new Response('/flowchart/' + randomName + '.png', {
		headers: {
			'content-type': 'text/plain'
		}
	});
}
