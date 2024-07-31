import graphviz from 'graphviz';
import fs from 'fs';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
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

	graphNode.forEach((node) => {
		g.addNode(node, { shape: 'box', color: 'blue' });
	});

	graphEdge.forEach((edge) => {
		g.addEdge(edge[0], edge[1]);
	});

	g.setGraphVizPath('C:/Program Files/Graphviz/bin');
	g.output('png', './static/flowchart/test01.png');

	// return the image path
	return new Response('/flowchart/test01.png', {
		headers: {
			'content-type': 'text/plain'
		}
	});
}
