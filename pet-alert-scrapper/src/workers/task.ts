import { CONFIG } from './config';
import { PetAlertApiFilters, PetAlertData, Results } from '@interfaces/index';
import { addQueryToUrl } from '@utils/index';
import axios from 'axios';

/**
 * Fetch alerts from petalert API with filters
 * @param page page number to fetch
 * @param code departement code
 * @param name departement name
 * @param animal animal type
 * @returns alerts from petalert API
 */
export const fetchAlertsByPage = async (page: number, code: string, name: string, animal: 'chien' | 'chat'): Promise<PetAlertData[]> => {
	const filters: PetAlertApiFilters = {
		page,
		type: 'lost',
	};

	const targetSpecificAnimalTypeUrl = `${animal}-perdu/pet-alert-${code}-${name}`;

	const urlWithFilters = addQueryToUrl(new URL(CONFIG.URL_TO_FETCH + targetSpecificAnimalTypeUrl), {
		filters: JSON.stringify(filters),
	}).toString();
	const response = await axios(urlWithFilters);
	const alerts: Results = response.data.results;
	return alerts.items;
};
