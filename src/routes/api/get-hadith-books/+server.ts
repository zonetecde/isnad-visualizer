import Chapter from '$lib/models/Chapter';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	let hadithBooks = await Chapter.findAll();

	// select only the `.source` attribute
	let booksName = hadithBooks.map((book) => book.source);

	// distinct booksName
	let distinctBooksName = booksName.filter((book, index, self) => self.indexOf(book) === index);

	return new Response(JSON.stringify(distinctBooksName), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
