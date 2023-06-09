import { mkdirSync, writeFileSync } from 'fs';
import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
import { URL } from 'url';
import { addSearchParams } from './utils/url.js';
import { CONFIG } from './config.js';

interface WorkerData {
  pageToFetchs: number[];
  workerName: number;
  name: string;
  code: string;
}

const { pageToFetchs, workerName, name, code }: WorkerData = workerData;

const fetchAlertsByPage = async (page: number) => {
  const filters = {
    pageNumber: page,
    dptName: name,
    dptCode: code,
    animalType: 'chien',
    alertType: 'perdu',
  };

  const urlWithFilters = addSearchParams(new URL(CONFIG.URL_TO_FETCH), {
    filters: JSON.stringify(filters),
  }).toString();
  const response = await fetch(urlWithFilters);
  const alerts = await response.json();
  return alerts;
};

(async () => {
  for (const page of pageToFetchs) {
    const alerts = await fetchAlertsByPage(page);
    mkdirSync(`./data/${name}/`, { recursive: true });
    writeFileSync(
      `./data/${name}/alerts-${page}.json`,
      JSON.stringify(alerts, null, 2),
    );
  }
  parentPort.postMessage(workerName);
})();
