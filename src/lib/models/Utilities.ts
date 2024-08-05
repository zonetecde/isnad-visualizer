import type Hadith from './Hadith';
import type Scholar from './Scholar';

const unknownScholars = new Map<Scholar, number>();

export function createUnknownScholar(): Scholar {
	return {
		id: new Date().getTime(),
		nameArabic: 'مجهول',
		nameEnglish: 'Unknown',
		scholarId: -1,
		grade: ''
	} as Scholar;
}

export function createBlankHadith(id: number) {
	return {
		id: id,
		hadithId: -1,
		hadithNumber: -1,
		source: '',
		textArabic: 'أدخل النص العربي هنا (اختياري)',
		textEnglish: 'Enter the English text here (optional)',
		transmissionChain: [createUnknownScholar()]
	} as Hadith;
}
