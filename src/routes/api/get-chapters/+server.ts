import Chapter from '$lib/models/Chapter';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	const book = url.searchParams.get('book')!;
	const chapters = await Chapter.findAll({
		where: { source: book }
	});

	let chaptersName = chapters.map((chapter) => chapter.chapterNumber + '. ' + chapter.chapterTitle);

	return new Response(JSON.stringify(chaptersName), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
