import { PetAlertApiFilters } from '@interfaces/index';
import { addQueryToUrl } from '@utils/index';
import axios from 'axios';
import { CONFIG } from './config';

export const fetchAlertsByPage = async (
	page: number,
	code: string,
	name: string,
	animal: 'chien' | 'chat',
) => {
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
	const alerts = await response.data;
	return alerts;
};
