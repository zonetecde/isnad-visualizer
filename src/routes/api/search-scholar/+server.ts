import Hadith from '$lib/models/Hadith';
import Scholar from '$lib/models/Scholar';
import { Op } from '@sequelize/core';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get search text
	const searchText = url.searchParams.get('search')!;

	const searchWords = searchText.split(' ');

	const searchConditions = searchWords.map((word) => ({
		nameEnglish: { [Op.iLike]: `%${word}%` }
	}));

	const searchConditionsArabic = searchWords.map((word) => ({
		nameArabic: { [Op.iLike]: `%${word}%` }
	}));

	const scholars = await Scholar.findAll({
		where: {
			[Op.or]: [{ [Op.and]: searchConditions }, { [Op.and]: searchConditionsArabic }]
		},
		limit: 200,
		order: [['scholarId', 'ASC']]
	});

	return new Response(JSON.stringify(scholars), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
