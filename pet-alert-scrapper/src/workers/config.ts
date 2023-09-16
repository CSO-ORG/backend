import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

export const CONFIG = {
	URL_TO_FETCH: 'https://xqpk-avnn-vtji.f2.xano.io/api:HXeZJ6Xd/',
	URL_TO_SCRAPE: 'https://www.petalertfrance.com/',
	MAX_WORKERS: 5,
};

export const WORKERS_NAME = [...Array(CONFIG.MAX_WORKERS).keys()].map(() =>
	uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
	}),
);
