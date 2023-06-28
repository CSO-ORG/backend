import { CONFIG } from './config';
import { addQueryToUrl } from '@utils/index';
import axios from 'axios';

export const fetchAlertsByPage = async (
	page: number,
	code: string,
	name: string,
) => {
	const filters = {
		pageNumber: page,
		dptName: name,
		dptCode: code,
		animalType: 'chien',
		alertType: 'perdu',
	};

	const urlWithFilters = addQueryToUrl(new URL(CONFIG.URL_TO_FETCH), {
		filters: JSON.stringify(filters),
	}).toString();
	const response = await axios(urlWithFilters);
	const alerts = await response.data;
	return alerts;
};
