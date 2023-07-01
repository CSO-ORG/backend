import { CONFIG } from '@workers/config';
import { Worker } from 'worker_threads';

export const getNumberOfPagesFromAlertNumber = (results: number) => {
	const numberOfPages = Math.ceil(results / 10);
	return numberOfPages;
};

export const getCodeAndNameFromDepartement = (departement: string) => {
	const targetStringSplitted = departement.split('/');
	const targetString = targetStringSplitted[
		targetStringSplitted.length - 1
	].replace('pet-alert-', '');
	const code = targetString.split(/-(.*)/s)[0];
	const name = targetString.split(/-(.*)/s)[1];
	return { code, name };
};

export const invokeWorker = (
	code: string,
	name: string,
	sitePages: number,
	currentWorker: string,
	indexRefence: number,
) => {
	return new Worker('./dist/workers/index.js', {
		execArgv:
			process.env.NODE_ENV === 'development'
				? ['-r', 'tsup/register']
				: undefined,
		workerData: {
			pageToFetchs: [...Array(sitePages).keys()].slice(
				(sitePages / CONFIG.MAX_WORKERS) * indexRefence,
				(sitePages / CONFIG.MAX_WORKERS) * (indexRefence + 1),
			),
			workerName: currentWorker,
			name,
			code,
		},
	});
};
