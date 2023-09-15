import { PetAlertApiFilters } from '@interfaces/api';
import { PetAlertJSON } from '@interfaces/worker';
import {
	getInfoFromDepartementLink,
	getPetAlertsDepartementsLinks,
	invokeWorker,
	logger,
	mergeFiles,
	sendFilesToGateway,
} from '@services/index';
import { addQueryToUrl, delay, sendResponseToRequest } from '@utils/index';
import { CONFIG, WORKERS_NAME } from '@workers/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import http from 'http';
import { performance } from 'perf_hooks';
import 'reflect-metadata';

let isRunning = false;
const server = http.createServer(launchScrap);
server.listen(process.env.PORT || 3000);

logger.info(`Server is running on ${process.env.PORT || 3000}`);

async function launchScrap(req: http.IncomingMessage, res: http.ServerResponse) {
	if (req.url !== '/start-scraping' || req.method !== 'GET') {
		sendResponseToRequest(res, 404, 'Route not found');
		return;
	}

	try {
		if (isRunning) {
			sendResponseToRequest(res, 400, 'Scrapping already running. Wait for it.');
			return;
		}

		isRunning = true;
		sendResponseToRequest(res, 200, 'Scrapping initiated !');

		const activeWorkers = new Set<string>();

		logger.info('Start scraping');

		const $ = cheerio.load(await axios(CONFIG.URL_TO_SCRAPE).then((res) => res.data));

		// INCLUDE DOG AND CAT
		const petAlertsDepartementsLinks = getPetAlertsDepartementsLinks($);

		const start = performance.now();
		const petAlertsLinksUnvisited = petAlertsDepartementsLinks;

		while (petAlertsLinksUnvisited.length || activeWorkers.size > 0) {
			if (activeWorkers.size >= CONFIG.MAX_WORKERS) {
				await delay(1000);
				continue;
			}

			logger.info(`Remaining ${CONFIG.MAX_WORKERS - activeWorkers.size} workers available(s)`);

			for (let i = 0; i < CONFIG.MAX_WORKERS - activeWorkers.size; i++) {
				const url = petAlertsDepartementsLinks[petAlertsLinksUnvisited.length - 1];
				petAlertsLinksUnvisited.pop();

				if (!url) {
					logger.info('[STOP] No more links to visit. Waiting for workers to finish...');
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
				const { code, name, animal } = getInfoFromDepartementLink(url);

				const targetSpecificAnimalTypeUrl = `${animal}-perdu/pet-alert-${code}-${name}`;
				const filters: PetAlertApiFilters = {
					page: 1,
					type: 'lost',
				};
				const urlWithFilters = addQueryToUrl(new URL(CONFIG.URL_TO_FETCH + targetSpecificAnimalTypeUrl), {
					filters: JSON.stringify(filters),
				}).toString();
				const response = await axios(urlWithFilters);
				const alerts: PetAlertJSON = response.data;

				const sitePages = alerts.results.pageTotal;
				const totalAlerts = alerts.results.itemsTotal;

				logger.info(`[START] - [worker - ${currentWorker}] on ${name} for ${animal}`);

				const worker = invokeWorker(code, name, sitePages, currentWorker as string, animal);

				worker.on('error', (err: unknown) => {
					if (err instanceof Error && err.message === 'Gateway Timeout') {
						activeWorkers.delete(currentWorker as string);
						petAlertsLinksUnvisited.push(url);
						logger.error(`[STOP] [worker - ${currentWorker} on ${url.split('/').pop()}] KO. Gateway Timeout ! Retry incoming...`);
					}

					activeWorkers.delete(currentWorker as string);
					logger.error(err);
				});

				worker.on('message', (workerName: string) => {
					activeWorkers.delete(workerName);
					logger.info(
						`[STOP] [worker - ${workerName} on ${name} for ${animal}] is done. Get ${sitePages} pages with ${totalAlerts} alerts.`,
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
}
