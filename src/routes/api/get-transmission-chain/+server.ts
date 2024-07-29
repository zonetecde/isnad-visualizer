import Hadith from '$lib/models/Hadith';
import Scholar from '$lib/models/Scholar';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	const hadithId = parseInt(url.searchParams.get('hadithId')!);

	const hadith = await Hadith.findOne({
		where: { hadithId: hadithId }
	});

	let transmissionChain: Scholar[] = [];

	if (hadith) {
		await Promise.all(
			hadith.chain.map(async (scholarId) => {
				const scholar = await Scholar.findOne({
					where: { scholarId: scholarId }
				});

				if (scholar) {
					transmissionChain.push(scholar);
				}
			})
		);
	}

	return new Response(JSON.stringify(transmissionChain), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
