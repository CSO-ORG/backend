import * as cheerio from 'cheerio';

export const getNumberOfAlert = ($: cheerio.CheerioAPI): number => {
	const stateElement = $('.counterNumber');
	return Number(stateElement.text());
};
