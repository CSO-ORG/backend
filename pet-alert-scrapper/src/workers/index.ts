import { addQueryToUrl } from '@utils/url'
import axios from 'axios'
import { mkdirSync, writeFileSync } from 'fs'
import { parentPort, workerData } from 'worker_threads'

interface WorkerData {
	pageToFetchs: number[]
	workerName: number
	name: string
	code: string
}

const CONFIG = {
	URL_TO_FETCH: 'https://monalerte.petalertfrance.com/api/alerts-page',
	URL_TO_SCRAPE: 'https://www.petalertfrance.com/',
	MAX_WORKERS: 5,
}

const { pageToFetchs, workerName, name, code }: WorkerData = workerData

const fetchAlertsByPage = async (page: number) => {
	const filters = {
		pageNumber: page,
		dptName: name,
		dptCode: code,
		animalType: 'chien',
		alertType: 'perdu',
	}

	const urlWithFilters = addQueryToUrl(new URL(CONFIG.URL_TO_FETCH), {
		filters: JSON.stringify(filters),
	}).toString()
	const response = await axios(urlWithFilters)
	const alerts = await response.data
	return alerts
}
;(async () => {
	for (const page of pageToFetchs) {
		const alerts = await fetchAlertsByPage(page)
		mkdirSync(`./data/${name}/`, { recursive: true })
		writeFileSync(
			`./data/${name}/alerts-${page}.json`,
			JSON.stringify(alerts, null, 2),
		)
	}
	parentPort?.postMessage(workerName)
})()
