import { Alert, PetAlertData, WorkerData } from '@interfaces/index'
import { isString, isUrl } from '@utils/type-guards'
import { Worker } from 'worker_threads'
import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()
/**
 * Get the number of pages to fetch from the number of alerts (10 alerts per page)
 * @param results number of alerts
 * @returns number of pages to fetch
 */
export const getNumberOfPagesFromAlertNumber = (results: number) => {
  const numberOfPages = Math.ceil(results / 10)
  return numberOfPages
}

/**
 * Get basic information from the departement link (code, name, animal)
 * @param departement url link of the departement
 * @returns basic information from the departement link
 */
export const getInfoFromDepartementLink = (departement: string) => {
  const targetStringSplitted = departement.split('/')
  const targetString = targetStringSplitted[
    targetStringSplitted.length - 1
  ].replace('pet-alert-', '')
  const code = targetString.split(/-(.*)/s)[0]
  const name = targetString.split(/-(.*)/s)[1]
  const animal = departement.includes('chien') ? 'chien' : 'chat'
  return { code, name, animal: animal as 'chien' | 'chat' }
}

/**
 * Invoke a worker to fetch alerts from a departement link
 * @param code departement code
 * @param name departement name
 * @param sitePages number of pages to fetch
 * @param currentWorker current worker name
 * @param indexRefence index reference of the worker
 * @param animal animal type
 * @returns the worker
 */
export const invokeWorker = (
  code: string,
  name: string,
  sitePages: number,
  currentWorker: string,
  animal: 'chien' | 'chat',
  date?: string,
) => {
  return new Worker('./dist/workers/index.js', {
    execArgv:
      process.env.NODE_ENV === 'development'
        ? ['-r', 'tsup/register']
        : undefined,
    workerData: {
      pageToFetchs: [...Array(sitePages).keys()],
      workerName: currentWorker,
      name,
      code,
      animal,
      date,
    } satisfies WorkerData,
  })
}

export const convertPetAlertToAlert = async (
  petAlert: PetAlertData,
): Promise<Alert> => {
  if (!petAlert?.coords_lat && !petAlert?.coords_lng) {
    const coords = await geocodeAddress(
      `${petAlert?.address_street} ${petAlert?.address_city_nom} ${petAlert?.address_city_CP} ${petAlert?.address_country}`,
    )

    petAlert.coords_lat = coords?.latitude
    petAlert.coords_lng = coords?.longitude
  }
  return {
    publisherId: 'pet-alert',
    publisherPhoneNumber: petAlert?.contact_phone,
    publisherEmail: petAlert?.contact_email,
    isFromAppUser: false,
    name: petAlert?.animal_name,
    description: petAlert?.message,
    status: 'published',
    alertType: 'lost_pet',
    icadIdentifier: undefined,
    petType: petAlert.animal_espece[0]?.fr,
    specie: petAlert.animal_race[0]?.Fr,
    age: undefined,
    ageExpressedIn: undefined,
    sex: petAlert.animal_sex?.Fr,
    breed: petAlert.animal_race[0]?.Fr,
    height: petAlert.animal_size?.Fr,
    weight: petAlert.animal_silhouette?.Fr,
    hair: petAlert.animal_hair?.Fr,
    colors: [
      petAlert.animal_color1[0]?.Fr,
      petAlert.animal_color2[0]?.Fr,
      petAlert.animal_color3[0]?.Fr,
    ].filter(isString),
    imageUrls: petAlert.animal_photo
      ?.split(',')
      .filter(isUrl)
      .map((p) => p.trim()),
    hasTatoo: petAlert.animal_tatouage === 1,
    hasNecklace: petAlert.animal_hasCollar === 1,
    necklaceMaterial: petAlert.animal_collartype?.Fr,
    necklaceColor: petAlert.animal_collarcolor?.Fr,
    hasMicrochip: petAlert.animal_puce === 'Oui',
    isSterilized: petAlert.animal_surgery === 1,
    location: {
      country: 'France',
      city: petAlert.address_city_nom,
      address: petAlert.address_street,
      postalCode: petAlert.address_city_CP,
      departmentName: petAlert.department?.SEO,
      departmentCode: petAlert.department?.CP,
      coords: {
        latitude: petAlert.coords_lat,
        longitude: petAlert.coords_lng,
      },
    },
    date: new Date(petAlert.date),
  }
}

async function geocodeAddress(address: any) {
  const accessToken = process.env.MAPBOX_TOKEN

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address,
  )}.json?access_token=${accessToken}&country=FR`

  try {
    const response = await axios.get(url)
    const features = response.data.features
    if (features.length > 0) {
      const [longitude, latitude] = features[0].geometry.coordinates
      return {
        latitude,
        longitude,
      }
    }
  } catch (error) {
    return {
      latitude: null,
      longitude: null,
    }
  }
}
