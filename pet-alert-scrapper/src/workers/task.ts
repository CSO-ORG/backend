import { PetAlertApiFilters, PetAlertJson } from '@interfaces/index';
import { addQueryToUrl } from '@utils/index';
import axios from 'axios';
import { CONFIG } from './config';

/**
 * Fetch alerts from petalert API with filters
 * @param page page number to fetch
 * @param code departement code
 * @param name departement name
 * @param animal animal type
 * @returns alerts from petalert API
 */
export const fetchAlertsByPage = async (page: number, code: string, name: string, animal: 'chien' | 'chat'): Promise<PetAlertJson[]> => {
	const filters: PetAlertApiFilters = {
		pageNumber: page,
		dptName: name,
		dptCode: code,
		animalType: animal,
		alertType: 'perdu',
	};

	const urlWithFilters = addQueryToUrl(new URL(CONFIG.URL_TO_FETCH), {
		filters: JSON.stringify(filters),
	}).toString();
	const response = await axios(urlWithFilters);
	const alerts: PetAlertJson[] = await response.data;
	return alerts;
};
