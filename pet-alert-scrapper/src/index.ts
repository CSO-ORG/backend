import {
	getCodeAndNameFromDepartement,
	getNumberOfAlert,
	getNumberOfPagesFromAlertNumber,
	getPetAlertsDepartementsLinks,
	invokeWorker,
	mergeFiles,
	sendFilesToGateway,
} from '@services/index';
import { delay } from '@utils/index';
import { CONFIG, WORKERS_NAME } from '@workers/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { performance } from 'perf_hooks';
import 'reflect-metadata';

const activeWorkers = new Set<string>();

console.log('Start scraping');

const $ = cheerio.load(
	await axios(CONFIG.URL_TO_SCRAPE).then((res) => res.data),
);

const petAlertsDepartementsLinks = getPetAlertsDepartementsLinks($);

const start = performance.now();
const petAlertsLinksUnvisited = petAlertsDepartementsLinks;

while (petAlertsLinksUnvisited.length > 0) {
	if (activeWorkers.size >= CONFIG.MAX_WORKERS) {
		await delay(1000);
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

		if (!currentWorker) continue;

		console.log(`[START] - [worker - ${currentWorker}]`);

		const url = petAlertsDepartementsLinks[petAlertsLinksUnvisited.length - 1];
		petAlertsLinksUnvisited.pop();

		if (!url) continue;

		const $ = cheerio.load(await axios(url).then((res) => res.data));
		const numberOfAlerts = getNumberOfAlert($);
		const sitePages = getNumberOfPagesFromAlertNumber(numberOfAlerts);

		const { code, name } = getCodeAndNameFromDepartement(url);

		const worker = invokeWorker(code, name, sitePages, currentWorker, i);

		worker.on('error', (err: unknown) => {
			if (err instanceof Error && err.message === 'Gateway Timeout') {
				petAlertsLinksUnvisited.push(url);
				activeWorkers.delete(currentWorker as string);
				console.log(
					`[STOP] [worker - ${currentWorker}] is done. Gateway Timeout ! Retry incoming...`,
				);
			}
			console.log(err);
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
	console.log(`Waiting for ${activeWorkers.size} workers to finish their job`);
	await delay(1000);
}

console.log('All workers are done');

const end = performance.now();
console.log(`Execution time: ${((end - start) / 1000).toFixed(2)} seconds`);

console.log('Start merging files');
mergeFiles();

console.log('All files are merged');
sendFilesToGateway();

console.log('All files are sent to gateway');
