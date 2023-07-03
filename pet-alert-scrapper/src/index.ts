import {
	getInfoFromDepartementLink,
	getNumberOfAlert,
	getNumberOfPagesFromAlertNumber,
	getPetAlertsDepartementsLinks,
	invokeWorker,
	logger,
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

try {
	logger.info('Start scraping');

	const $ = cheerio.load(
		await axios(CONFIG.URL_TO_SCRAPE).then((res) => res.data),
	);

	// INCLUDE DOG AND CAT
	const petAlertsDepartementsLinks = getPetAlertsDepartementsLinks($);

	const start = performance.now();
	const petAlertsLinksUnvisited = petAlertsDepartementsLinks;

	while (petAlertsLinksUnvisited.length || activeWorkers.size > 0) {
		if (activeWorkers.size >= CONFIG.MAX_WORKERS) {
			await delay(1000);
			continue;
		}

		logger.info(
			`Remaining ${
				CONFIG.MAX_WORKERS - activeWorkers.size
			} workers available(s)`,
		);

		for (let i = 0; i < CONFIG.MAX_WORKERS - activeWorkers.size; i++) {
			const url =
				petAlertsDepartementsLinks[petAlertsLinksUnvisited.length - 1];
			petAlertsLinksUnvisited.pop();

			if (!url) {
				logger.info(
					'[STOP] No more links to visit. Waiting for workers to finish...',
				);
				await delay(5000);
				continue;
			}

			let currentWorker: string | undefined;

			for (const workerName of WORKERS_NAME) {
				if (!activeWorkers.has(workerName)) {
					currentWorker = workerName;
					activeWorkers.add(workerName);
					break;
				}
			}

			const $ = cheerio.load(await axios(url).then((res) => res.data));
			const numberOfAlerts = getNumberOfAlert($);
			const sitePages = getNumberOfPagesFromAlertNumber(numberOfAlerts);

			const { code, name, animal } = getInfoFromDepartementLink(url);

			logger.info(
				`[START] - [worker - ${currentWorker}] on ${name} for ${animal}`,
			);

			const worker = invokeWorker(
				code,
				name,
				sitePages,
				currentWorker as string,
				i,
				animal,
			);

			worker.on('error', (err: unknown) => {
				if (err instanceof Error && err.message === 'Gateway Timeout') {
					activeWorkers.delete(currentWorker as string);
					petAlertsLinksUnvisited.push(url);
					logger.error(
						`[STOP] [worker - ${currentWorker} on ${url
							.split('/')
							.pop()}] KO. Gateway Timeout ! Retry incoming...`,
					);
				}
			});

			worker.on('message', (workerName: string) => {
				activeWorkers.delete(workerName);
				logger.info(
					`[STOP] [worker - ${workerName} on ${name} for ${animal}] is done. Get ${sitePages} pages with ${numberOfAlerts} alerts.`,
				);
			});
		}
	}

	logger.info('All workers are done');

	const end = performance.now();
	logger.info(`Execution time: ${((end - start) / 1000).toFixed(2)} seconds`);

	logger.info('Start merging files');
	mergeFiles();
	logger.info('All files are merged');

	logger.info('Start sending files to gateway');
	sendFilesToGateway();
	logger.info('All files are sent to gateway');
} catch (err) {
	logger.error(err);
}
