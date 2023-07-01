import * as cheerio from 'cheerio';

export const getNumberOfAlert = ($: cheerio.CheerioAPI): number => {
	const stateElement = $('.counterNumber');
	return Number(stateElement.text());
};

export const getPetAlertsDepartementsLinks = (
	$: cheerio.CheerioAPI,
): string[] => {
	const links = [...$('a.url-link')]
		.map(
			(e: cheerio.Element) =>
				$(e)
					.attr('href')
					?.match(
						/https:\/\/www.petalertfrance.com\/chien-perdu\/pet-alert-[0-9]{2}-[a-z-]+/g,
					)?.[0],
		)
		.filter((link): link is string => !!link);

	if (!links) throw new Error('Aucun lien de département trouvé');

	return links;
};
