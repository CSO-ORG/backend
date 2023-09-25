import { fetchAlertsByPage } from './task'
import { WorkerData } from '@interfaces/index'
import { logger } from '@services/logger'
import { convertPetAlertToAlert } from '@services/scrapper'
import { mkdirSync, writeFileSync } from 'fs'
import { parentPort, workerData } from 'worker_threads'

const { pageToFetchs, workerName, name, code, animal, date }: WorkerData =
  workerData

for (const page of pageToFetchs) {
  const petAlerts = await fetchAlertsByPage(page, code, name, animal).catch(
    (err) => {
      if (err.response.status === 504) throw new Error('Gateway Timeout')
      throw err
    },
  )

  const alerts = await Promise.all(
    petAlerts.map(async (alert) => await convertPetAlertToAlert(alert)),
  )

  let alertsToKeep = alerts
  if (date) {
    const dateToCompare = new Date(Number(date)).getTime()
    alertsToKeep = alerts.filter((alert) => {
      if (!alert.date) return false
      const alertDate = new Date(alert.date).getTime()
      return alertDate >= dateToCompare
    })
  }

  console.log('🚀 ~ file: index.ts:24 ~ alertsToKeep:', alertsToKeep)

  logger.trace(
    `[worker - ${workerName}] on ${name} for ${animal} - page ${page} - ${alertsToKeep.length} alerts`,
  )

  mkdirSync(`./data/${animal}/${name}/`, { recursive: true })
  writeFileSync(
    `./data/${animal}/${name}/alerts-${page}.json`,
    JSON.stringify(alertsToKeep, null, 2),
  )

  if (alertsToKeep.length === 0) {
    logger.info(
      `[STOP] [worker - ${workerName}] on ${name} for ${animal} - page ${page} - ${alertsToKeep.length} alerts`,
    )
    break
  }
}

parentPort?.postMessage(workerName)
