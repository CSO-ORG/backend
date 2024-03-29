import { logger } from './logger'
import { Alert } from '@interfaces/alert'
import axios from 'axios'
import { readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

const rootDataFolder = './data'
const subsFolders = ['chien', 'chat']

/**
 * Merge all JSON files in ./data folder into one file
 * The file will be named merge.json and will be located in ./data/{chien|chat}/{dptCode}
 */
export const mergeFiles = () => {
  subsFolders.forEach((subfolder) => {
    const dptFolders = readdirSync(`${rootDataFolder}/${subfolder}`).filter(
      (e) => e !== '.keep',
    )
    for (const dptFolder of dptFolders) {
      const files = readdirSync(
        `${rootDataFolder}/${subfolder}/${dptFolder}`,
      ).filter((e) => e !== 'merge.json')

      const output = files.reduce((acc: Alert[], file) => {
        const fileContent: Alert[] = JSON.parse(
          readFileSync(
            `${rootDataFolder}/${subfolder}/${dptFolder}/${file}`,
            'utf8',
          ),
        )

        return [...acc, ...fileContent]
      }, [])

      writeFileSync(
        `${rootDataFolder}/${subfolder}/${dptFolder}/merge.json`,
        JSON.stringify(output),
      )
    }
  })
}

/**
 * Send all JSON files to the gateway
 * We send it by chunk of 500 alerts, then we delete the file
 */
export const sendFilesToGateway = async () => {
  subsFolders.forEach(async (subfolder) => {
    const dptFolders = readdirSync(`${rootDataFolder}/${subfolder}`).filter(
      (e) => e !== '.keep',
    )
    for (const dptFolder of dptFolders) {
      const fileContent = JSON.parse(
        readFileSync(
          `${rootDataFolder}/${subfolder}/${dptFolder}/merge.json`,
          'utf8',
        ),
      )

      while (fileContent.length > 0) {
        const chunk: Alert[] = fileContent.splice(0, 500)
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000))
        await axios
          .post(`${process.env.GATEWAY_URL}`, { alerts: chunk })
          .catch((e: any) => {
            logger.error(e?.message)
          })
      }
    }
    deleteFiles()
  })
}

/**
 * Delete all files in ./data folder
 */
const deleteFiles = () => {
  const folders = readdirSync(rootDataFolder).filter((e) => e !== '.keep')
  folders.forEach((dir) => rmSync(dir, { recursive: true, force: true }))
}
