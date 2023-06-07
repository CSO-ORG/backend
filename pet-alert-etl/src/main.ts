import { Worker } from 'worker_threads';
import puppeteer, { Page } from 'puppeteer';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const URL_TO_SCRAPE =
  'https://www.petalertfrance.com/chien-perdu/pet-alert-44-loire-atlantique';
const maxWorkers = 10;
let activeWorkers = maxWorkers;

const getNumberOfAlert = async (page: Page) => {
  const stateElement = await page.$('.counterNumber');
  return await page.evaluate(
    (element) => Number(element.innerText),
    stateElement,
  );
};

const getNumberOfPagesFromAlertNumber = (results: number) => {
  const numberOfPages = Math.ceil(results / 10);
  return numberOfPages;
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--start-maximized'],
  });
  const page = await browser.newPage();
  await page.goto(URL_TO_SCRAPE, { waitUntil: 'networkidle0' });
  page.setDefaultNavigationTimeout(0);

  const numberOfAlerts = await getNumberOfAlert(page);
  const sitePages = getNumberOfPagesFromAlertNumber(numberOfAlerts);

  await browser.close();

  const start = performance.now();
  for (let i = 0; i < maxWorkers; i++) {
    const worker = new Worker(require.resolve(`./worker.js`), {
      execArgv:
        process.env.NODE_ENV === 'development'
          ? ['-r', 'ts-node/register/transpile-only']
          : undefined,
      workerData: {
        pageToFetchs: [
          [...Array(sitePages).keys()].slice(
            (sitePages / maxWorkers) * i,
            (sitePages / maxWorkers) * (i + 1),
          ),
        ],
        workerId: i,
      },
    });
    worker.on('message', (workerId: number) => {
      activeWorkers--;
      console.log(`Worker ${workerId} is done`);
    });
  }

  while (activeWorkers > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const end = performance.now();
  console.log('All workers are done');
  console.log(`Execution time: ${(end - start) / 1000} seconds`);
};

main();
