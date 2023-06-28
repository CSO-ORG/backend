import {
	getCodeAndNameFromDepartement,
	getNumberOfAlert,
	getNumberOfPagesFromAlertNumber,
	mergeFiles,
	sendFilesToGateway,
} from '@services/index';
import { CONFIG } from '@workers/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { performance } from 'perf_hooks';
import 'reflect-metadata';
import {
	adjectives,
	animals,
	colors,
	uniqueNamesGenerator,
} from 'unique-names-generator';
import { Worker } from 'worker_threads';

const WORKERS_NAME = [...Array(CONFIG.MAX_WORKERS).keys()].map(() =>
	uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
	}),
);

const activeWorkers = new Set<string>();

const main = async () => {
	console.log('Start scraping');
	const $ = cheerio.load(
		await axios(CONFIG.URL_TO_SCRAPE).then((res) => res.data),
	);

	const petAlertsDepartementsLinks = [...$('a.url-link')]
		.map(
			(e: cheerio.Element) =>
				$(e)
					.attr('href')
					?.match(
						/https:\/\/www.petalertfrance.com\/chien-perdu\/pet-alert-[0-9]{2}-[a-z-]+/g,
					)?.[0],
		)
		.filter((e) => e);

	const start = performance.now();
	const petAlertsLinksUnvisited = petAlertsDepartementsLinks;

	while (petAlertsLinksUnvisited.length > 0) {
		if (activeWorkers.size >= CONFIG.MAX_WORKERS) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			continue;
		}

		console.log(
			`Remaining ${CONFIG.MAX_WORKERS - activeWorkers.size} workers available`,
		);

		for (let i = 0; i < CONFIG.MAX_WORKERS - activeWorkers.size; i++) {
			let currentWorker: string | undefined;
			for (const workerName of WORKERS_NAME) {
				if (!activeWorkers.has(workerName)) {
					currentWorker = workerName;
					activeWorkers.add(workerName);
					break;
				}
			}
			console.log(`[START] - [worker - ${currentWorker}]`);

			const url =
				petAlertsDepartementsLinks[petAlertsLinksUnvisited.length - 1];
			petAlertsLinksUnvisited.pop();

			if (!url) return;
			const $ = cheerio.load(await axios(url).then((res) => res.data));
			const numberOfAlerts = getNumberOfAlert($);
			const sitePages = getNumberOfPagesFromAlertNumber(numberOfAlerts);

			const { code, name } = getCodeAndNameFromDepartement(url);
			const worker = new Worker('./dist/workers/index.js', {
				execArgv:
					process.env.NODE_ENV === 'development'
						? ['-r', 'tsup/register']
						: undefined,
				workerData: {
					pageToFetchs: [...Array(sitePages).keys()].slice(
						(sitePages / CONFIG.MAX_WORKERS) * i,
						(sitePages / CONFIG.MAX_WORKERS) * (i + 1),
					),
					workerName: currentWorker,
					name,
					code,
				},
			});
			worker.on('message', (workerName: string) => {
				activeWorkers.delete(workerName);
				console.log(
					`[STOP] [worker - ${workerName}] is done. Get ${sitePages} pages with ${numberOfAlerts} alerts.`,
				);
			});
		}
	}

	while (activeWorkers.size > 0) {
		console.log(
			`Waiting for ${activeWorkers.size} workers to finish their job`,
		);
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	const end = performance.now();
	console.log('All workers are done');
	console.log(`Execution time: ${((end - start) / 1000).toFixed(2)} seconds`);
	console.log('Start merging files');
	mergeFiles();
	console.log('All files are merged');
	sendFilesToGateway();
	console.log('All files are sent to gateway');
};

main();
