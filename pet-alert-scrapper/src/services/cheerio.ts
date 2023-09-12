import * as cheerio from 'cheerio';

/**
 * Return the number of alerts on pet alert website.
 * @param $ - The cheerio instance.
 * @returns The number of alerts.
 */
export const getNumberOfAlert = ($: cheerio.CheerioAPI): number => {
	const stateElement = $('.counterNumber');
	return Number(stateElement.text());
};

/**
 * Return the links of the departements on pet alert website, for both dogs and cats.
 * @param $ - The cheerio instance.
 * @returns The links of the departements.
 */
export const getPetAlertsDepartementsLinks = ($: cheerio.CheerioAPI): string[] => {
	const dogLinks = [...$('a.url-link')]
		.map(
			(e: cheerio.Element) => $(e).attr('href')?.match(/https:\/\/www.petalertfrance.com\/chien-perdu\/pet-alert-[0-9]{2}-[a-z-]+/g)?.[0],
		)
		.filter((link): link is string => !!link);

	const catLinks = dogLinks.map((link) => link.replace('chien', 'chat'));
	const links = [...dogLinks, ...catLinks];

	if (!links) throw new Error('Aucun lien de département trouvé');

	return links;
};
