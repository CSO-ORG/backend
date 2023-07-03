import { WorkerData } from '@interfaces/index';
import { logger } from '@services/logger';
import { mkdirSync, writeFileSync } from 'fs';
import { parentPort, workerData } from 'worker_threads';
import { fetchAlertsByPage } from './task';

const { pageToFetchs, workerName, name, code, animal }: WorkerData = workerData;

for (const page of pageToFetchs) {
	const alerts = await fetchAlertsByPage(page, code, name, animal).catch(
		(err) => {
			if (err.response.status === 504) throw new Error('Gateway Timeout');
			throw err;
		},
	);

	logger.trace(
		`[worker - ${workerName}] on ${name} for ${animal} - page ${page} - ${alerts.length} alerts`,
	);

	mkdirSync(`./data/${animal}/${name}/`, { recursive: true });
	writeFileSync(
		`./data/${animal}/${name}/alerts-${page}.json`,
		JSON.stringify(alerts, null, 2),
	);
}

parentPort?.postMessage(workerName);
