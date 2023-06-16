import { rmSync, writeFileSync } from 'fs';
import { Worker } from 'worker_threads';
import { createRequire } from 'module';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { CONFIG } from './config.js';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';
import 'reflect-metadata';
import { performance } from 'perf_hooks';
import { readdirSync, readFileSync } from 'fs';

const require = createRequire(import.meta.url);

const WORKERS_NAME = [...Array(CONFIG.MAX_WORKERS).keys()].map(() =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
  }),
);

const activeWorkers = new Set<string>();

const getNumberOfAlert = ($: cheerio.CheerioAPI): number => {
  const stateElement = $('.counterNumber');
  return Number(stateElement.text());
};

const getNumberOfPagesFromAlertNumber = (results: number) => {
  const numberOfPages = Math.ceil(results / 10);
  return numberOfPages;
};

const getCodeAndNameFromDepartement = (departement: string) => {
  const targetStringSplitted = departement.split('/');
  const targetString = targetStringSplitted[
    targetStringSplitted.length - 1
  ].replace('pet-alert-', '');
  const code = targetString.split(/-(.*)/s)[0];
  const name = targetString.split(/-(.*)/s)[1];
  return { code, name };
};

const mergeFiles = () => {
  const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
  for (const dptFolder of dptFolders) {
    const files = readdirSync(`./data/${dptFolder}`).filter(
      (e) => e !== 'merge.json' && e !== 'output.json',
      //temp
    );
    const output = files.reduce((acc, file) => {
      const fileContent = JSON.parse(
        readFileSync(`./data/${dptFolder}/${file}`, 'utf8'),
      );
      return [...acc, ...fileContent];
    }, []);

    writeFileSync(`./data/${dptFolder}/merge.json`, JSON.stringify(output));
  }
};

const sendFilesToGateway = () => {
  const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
  for (const dptFolder of dptFolders) {
    const fileContent = JSON.parse(
      readFileSync(`./data/${dptFolder}/merge.json`, 'utf8'),
    );

    while (fileContent.length > 0) {
      const chunk = fileContent.splice(0, 500);
      fetch(`https:gergre.free.beeceptor.com/alerts?dpt=${dptFolder}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      }).catch((e) => {
        console.log(e);
      });
    }
  }
  deleteFiles();
};

const deleteFiles = () => {
  const dptFolders = readdirSync('./data').filter((e) => e !== '.keep');
  dptFolders.forEach((dir) => rmSync(dir, { recursive: true, force: true }));
};

const main = async () => {
  console.log('Start scraping');
  const bodyHTML = await fetch(CONFIG.URL_TO_SCRAPE).then((res) => res.text());
  const $ = cheerio.load(bodyHTML);

  const petAlertsDepartementsLinks = [...$('a.url-link')]
    .map(
      (e: cheerio.Element) =>
        $(e)
          .attr('href')
          .match(
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
      let currentWorker: string;
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
      const bodyDepartementHTML = await fetch(url).then((res) => res.text());
      const $ = cheerio.load(bodyDepartementHTML);
      const numberOfAlerts = getNumberOfAlert($);
      const sitePages = getNumberOfPagesFromAlertNumber(numberOfAlerts);

      const { code, name } = getCodeAndNameFromDepartement(url);
      const worker = new Worker(require.resolve(`./worker.js`), {
        execArgv:
          process.env.NODE_ENV === 'development'
            ? ['-r', 'ts-node/register/transpile-only']
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
