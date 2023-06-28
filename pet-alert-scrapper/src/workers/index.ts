import { fetchAlertsByPage } from './task';
import { WorkerData } from '@interfaces/index';
import { mkdirSync, writeFileSync } from 'fs';
import { parentPort, workerData } from 'worker_threads';

const { pageToFetchs, workerName, name, code }: WorkerData = workerData;

(async () => {
	for (const page of pageToFetchs) {
		const alerts = await fetchAlertsByPage(page, code, name);
		mkdirSync(`./data/${name}/`, { recursive: true });
		writeFileSync(
			`./data/${name}/alerts-${page}.json`,
			JSON.stringify(alerts, null, 2),
		);
	}
	parentPort?.postMessage(workerName);
})();
