import * as cheerio from 'cheerio';

export const getNumberOfAlert = ($: cheerio.CheerioAPI): number => {
	const stateElement = $('.counterNumber');
	return Number(stateElement.text());
};

export const getPetAlertsDepartementsLinks = (
	$: cheerio.CheerioAPI,
): string[] => {
	const dogLinks = [...$('a.url-link')]
		.map(
			(e: cheerio.Element) =>
				$(e)
					.attr('href')
					?.match(
						/https:\/\/www.petalertfrance.com\/chien-perdu\/pet-alert-[0-9]{2}-[a-z-]+/g,
					)?.[0],
		)
		.filter((link): link is string => !!link);

	const catLinks = dogLinks.map((link) => link.replace('chien', 'chat'));
	const links = [...dogLinks, ...catLinks];

	if (!links) throw new Error('Aucun lien de département trouvé');

	return links;
};
