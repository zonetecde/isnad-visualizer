import Hadith from '$lib/models/Hadith';
import { Op } from '@sequelize/core';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get search text
	const searchText = url.searchParams.get('text')!;

	const hadiths = await Hadith.findAll({
		where: {
			[Op.or]: [{ textArabic: { [Op.like]: `%${searchText}%` } }, { textEnglish: { [Op.like]: `%${searchText}%` } }]
		},
		order: [['hadithNumber', 'ASC']]
	});

	if (hadiths.length < 200) {
		return new Response(JSON.stringify(hadiths), {
			headers: {
				'content-type': 'application/json'
			}
		});
	} else {
		return new Response(JSON.stringify(hadiths.slice(0, 200)), {
			headers: {
				'content-type': 'application/json'
			}
		});
	}
}
