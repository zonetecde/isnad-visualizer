import Hadith from '$lib/models/Hadith';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get book and chapter parameter
	const book = url.searchParams.get('book')!;
	const chapter = parseInt(url.searchParams.get('chapter')!);

	const hadiths = await Hadith.findAll({
		where: { source: book, chapterNumber: chapter },
		order: [['hadithNumber', 'ASC']]
	});

	return new Response(JSON.stringify(hadiths), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
