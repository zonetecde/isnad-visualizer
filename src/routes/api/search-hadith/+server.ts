import Hadith from '$lib/models/Hadith';
import { Op } from '@sequelize/core';

/** @type {import('./types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get search text
	const searchText = url.searchParams.get('text')!;

	const searchWords = searchText.split(' ');

	const searchConditions = searchWords.map((word) => ({
		textEnglish: { [Op.iLike]: `%${word}%` }
	}));

	const searchConditionsArabic = searchWords.map((word) => ({
		textArabic: { [Op.iLike]: `%${word}%` }
	}));

	const hadiths = await Hadith.findAll({
		where: {
			[Op.or]: [{ [Op.and]: searchConditions }, { [Op.and]: searchConditionsArabic }]
		},
		limit: 200,
		order: [['hadithNumber', 'ASC']]
	});

	return new Response(JSON.stringify(hadiths), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
