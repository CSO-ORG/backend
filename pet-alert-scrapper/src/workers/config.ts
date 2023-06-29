import {
	adjectives,
	animals,
	colors,
	uniqueNamesGenerator,
} from 'unique-names-generator';

export const CONFIG = {
	URL_TO_FETCH: 'https://monalerte.petalertfrance.com/api/alerts-page',
	URL_TO_SCRAPE: 'https://www.petalertfrance.com/',
	MAX_WORKERS: 5,
};

export const WORKERS_NAME = [...Array(CONFIG.MAX_WORKERS).keys()].map(() =>
	uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
	}),
);
