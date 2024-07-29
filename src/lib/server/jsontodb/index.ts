import Chapter from '$lib/models/Chapter';
import Hadith from '$lib/models/Hadith';
import Scholar from '$lib/models/Scholar';
import fs from 'fs';

async function addHadithsToDb() {
	// Lis le fichier /data/hadiths.json
	const json = fs.readFileSync('./src/lib/server/jsontodb/data/hadiths.json', 'utf8');
	const hadiths = JSON.parse(json);

	// Ajoute à la db les hadiths
	const hadithList = hadiths.map((hadith: any) => ({
		hadithId: hadith.hadith_id || -1,
		source: hadith.source || '',
		chapterNumber: hadith.chapter_no || -1,
		hadithNumber: hadith.hadith_no || -1,
		chain: (hadith.chain_indx || '').split(',').map(Number),
		textArabic: hadith.text_ar || '',
		textEnglish: hadith.text_en || ''
	}));

	try {
		await Hadith.bulkCreate(hadithList);
		console.log('Hadiths added to db');
	} catch (error) {
		console.log(error);
	}

	let chapterList = hadiths.map((hadith: any) => ({
		source: hadith.source || '',
		chapterNumber: hadith.chapter_no || -1,
		chapterTitle: hadith.chapter || ''
	}));

	// distinct chapterList by source and chapterNumber
	chapterList = chapterList.filter(
		(chapter: any, index: any, self: any) =>
			index ===
			self.findIndex(
				(t: any) => t.source === chapter.source && t.chapterNumber === chapter.chapterNumber
			)
	);

	try {
		await Chapter.bulkCreate(chapterList);
		console.log('Chapters added to db');
	} catch (error) {
		console.log(error);
	}
}

async function addNarratorsToDb() {
	// Lis le fichier /data/narrators.json
	const json = fs.readFileSync('./src/lib/server/jsontodb/data/narrators.json', 'utf8');
	let narrators = JSON.parse(json);

	console.log(narrators[0]);

	let narratorsList: any[] = [];

	// Pour chaque narateur, enlève ce qu'il y a entre parenthèse.
	narrators.forEach((narrator: any) => {
		narrator.name = narrator.name.replace(/\(.*\)/, '');

		if (countCharInString(narrator.name, '(') > 1) {
			narrator.name = getStringBeforeLatestChar(narrator.name, '(');

			const data = narrator.name.split('(');
			narrator.arabicName = data[1].trim();
			narrator.englishName = data[0].trim();
		} else {
			// Enlève tout les caractères arabes et laisse les espaces
			narrator.englishName = narrator.name.replace(/[ء-ي]/g, '').trim();
			// Enlève tout les caractères qui ne sont pas des lettres arabes
			narrator.arabicName = narrator.name.replace(/[^ء-ي ]/g, '').trim();
		}

		narratorsList.push({
			nameArabic: narrator.arabicName,
			nameEnglish: narrator.englishName,
			grade: narrator.grade,
			scholarId: narrator.scholar_indx
		});
	});

	await Scholar.bulkCreate(narratorsList);

	console.log('Narrators added to db');
}

function getStringBeforeLatestChar(str: string, char: string) {
	const index = str.lastIndexOf(char);
	return str.substring(0, index);
}

function countCharInString(str: string, char: string) {
	const regex = new RegExp(`\\${char}`, 'g');
	return (str.match(regex) || []).length;
}

//addHadithsToDb();
//addNarratorsToDb();
