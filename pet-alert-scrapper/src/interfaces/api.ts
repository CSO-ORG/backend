export interface PetAlertApiFilters {
	pageNumber: number;
	dptName: string;
	dptCode: string;
	animalType: 'chien' | 'chat';
	alertType: 'perdu';
}
