import { writeFileSync } from 'fs';
import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
import { URL } from 'url';

const pageToFetchs = workerData.pageToFetchs[0];
const workerId = workerData.workerId;
const URL_TO_FETCH = 'https://monalerte.petalertfrance.com/api/alerts-page';

const addSearchParams = (url: URL, params: Record<any, any>) =>
  new URL(
    `${url.origin}${url.pathname}?${new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...(Object.entries(params).map(([key, value]) => [
        key,
        value.toString(),
      ]) as any),
    ])}`,
  );

const fetchAlertsByPage = async (page) => {
  const filters = {
    pageNumber: page,
    dptName: 'loire-atlantique',
    dptCode: '44',
    animalType: 'chien',
    alertType: 'perdu',
  };

  const URL_WITH_FILTERS = addSearchParams(new URL(URL_TO_FETCH), {
    filters: JSON.stringify(filters),
  }).toString();

  const response = await fetch(URL_WITH_FILTERS);
  const alerts = await response.json();
  return alerts;
};

(async () => {
  for (const page of pageToFetchs) {
    const alerts = await fetchAlertsByPage(page);
    writeFileSync(
      `./data/alerts-${page}.json`,
      JSON.stringify(alerts, null, 2),
    );
  }
  parentPort.postMessage(workerId);
})();
