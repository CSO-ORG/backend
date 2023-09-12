import { WorkerData } from '@interfaces/index';
import { CONFIG } from '@workers/config';
import { Worker } from 'worker_threads';

/**
 * Get the number of pages to fetch from the number of alerts (10 alerts per page)
 * @param results number of alerts
 * @returns number of pages to fetch
 */
export const getNumberOfPagesFromAlertNumber = (results: number) => {
	const numberOfPages = Math.ceil(results / 10);
	return numberOfPages;
};

/**
 * Get basic information from the departement link (code, name, animal)
 * @param departement url link of the departement
 * @returns basic information from the departement link
 */
export const getInfoFromDepartementLink = (departement: string) => {
	const targetStringSplitted = departement.split('/');
	const targetString = targetStringSplitted[targetStringSplitted.length - 1].replace('pet-alert-', '');
	const code = targetString.split(/-(.*)/s)[0];
	const name = targetString.split(/-(.*)/s)[1];
	const animal = departement.includes('chien') ? 'chien' : 'chat';
	return { code, name, animal: animal as 'chien' | 'chat' };
};

/**
 * Invoke a worker to fetch alerts from a departement link
 * @param code departement code
 * @param name departement name
 * @param sitePages number of pages to fetch
 * @param currentWorker current worker name
 * @param indexRefence index reference of the worker
 * @param animal animal type
 * @returns the worker
 */
export const invokeWorker = (
	code: string,
	name: string,
	sitePages: number,
	currentWorker: string,
	indexRefence: number,
	animal: 'chien' | 'chat',
) => {
	return new Worker('./dist/workers/index.js', {
		execArgv: process.env.NODE_ENV === 'development' ? ['-r', 'tsup/register'] : undefined,
		workerData: {
			pageToFetchs: [...Array(sitePages).keys()].slice(
				(sitePages / CONFIG.MAX_WORKERS) * indexRefence,
				(sitePages / CONFIG.MAX_WORKERS) * (indexRefence + 1),
			),
			workerName: currentWorker,
			name,
			code,
			animal,
		} satisfies WorkerData,
	});
};
