import sharp from 'sharp';

/** @type {import('./types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const body = await request.json();
	const imgPath = body.svgFilePath;

	const pngPath = imgPath.replace('.svg', '.png');

	// Convert SVG to PNG
	try {
		await sharp('./static/' + imgPath, { density: 300 })
			.png({
				quality: 100, // Set quality to maximum (100)
				compressionLevel: 9, // Set compression level to maximum (9)
				adaptiveFiltering: true, // Enable adaptive filtering
				force: true // Force PNG format
			})
			.toFile('./static/' + pngPath);
	} catch (error) {
		console.error('Error converting SVG to PNG:', error);
		return {
			status: 500,
			body: {
				error: 'Failed to convert SVG to PNG'
			}
		};
	}

	// return the image path
	return new Response(pngPath, {
		headers: {
			'content-type': 'text/plain'
		}
	});
}
