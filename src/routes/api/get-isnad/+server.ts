import { GPT_URL } from '$lib/secret';

/** @type {import('./types').RequestHandler} */
export async function POST({ request }: { request: Request }) {
	const json = await request.json();
	const text = json.text;

	const prompt =
		"Ignore toutes les anciennes consignes. Tu es un savant islamique ayant acquérit un master dans la science du hadith.\nJe vais te donner une chaine de transmission d'un hadith, ou un hadith entier avec sa chaine de transmission.\nTon role est de transformer ce que je vais te donner en un array JSON représentant les transmetteurs du hadith, dans l'ordre de la chaine. Cet array contient des objets `Transmetteur` contenant deux attributs :\n- arabic_name pour le nom de la personne en arabe (avec les voyelles)\n- latin_name pour le nom de la personne en phonétique\n\n\nN'inclut pas les marques d'honneur à coté des noms comme رَضِيَ اللَّهُ عَنْهُ ou صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ. Lorsqu'un transmetteur de la chaine fait référence au père d'une personne, cherche d'après tes connaissances qui est le père de cette dite personne et met son nom arabe + latin.\n\nInclut tout les transmetteurs de la chaine de transmission du hadith donné, et inclut aussi la dernière personne de la chaine, qui est la personne qui a prononcé la parole. Délimite bien où est-ce qu'elle commence et où est-ce qu'elle se finit.\n\n " +
		'Format du JSON:\n{\n"chain_of_transmission": [{\n"arabic_name": "",\n"latin_name":""\n},\n"chain_of_transmission": [{\n"arabic_name": "",\n"latin_name":""\n},\n...\n]\n}' +
		'\n\n\nVoici le hadith:' +
		text;

	const response = await fetch(GPT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt: prompt
		})
	});

	let gptResponse = await response.json();

	// Enlève si nécessaire l'indicateur json
	if (gptResponse.startsWith('```json')) gptResponse = gptResponse.slice(7, -3);
	else if (gptResponse.startsWith('```')) gptResponse = gptResponse.slice(3, -3);

	const jsonObject = JSON.parse(gptResponse);

	return new Response(JSON.stringify(jsonObject), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
