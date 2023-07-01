import { fetchAlertsByPage } from './task';
import { WorkerData } from '@interfaces/index';
import { mkdirSync, writeFileSync } from 'fs';
import { parentPort, workerData } from 'worker_threads';

const { pageToFetchs, workerName, name, code }: WorkerData = workerData;

for (const page of pageToFetchs) {
	const alerts = await fetchAlertsByPage(page, code, name).catch((err) => {
		if (err.response.status === 504) throw new Error('Gateway Timeout');
		throw err;
	});

	mkdirSync(`./data/${name}/`, { recursive: true });
	writeFileSync(
		`./data/${name}/alerts-${page}.json`,
		JSON.stringify(alerts, null, 2),
	);
}

parentPort?.postMessage(workerName);
