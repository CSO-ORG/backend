export interface WorkerData {
	pageToFetchs: number[];
	workerName: string;
	name: string;
	code: string;
	animal: 'chien' | 'chat';
}

export interface PetAlertJson {
	_id: string;
	date: string;
	found: boolean;
	foundBy: string;
	message: string;
	coords: Coords;
	dateCreated: string;
	animalId: string;
	userId: string;
	offerId: string;
	type: string;
	address: Address;
	source: string;
	dpt: string;
	datePublished: string;
	plannedDate: string;
	postOnFb: string;
	shareBy: string;
	shareDate: string;
	shareOnFb: boolean;
	animal: Animal;
	payment_status?: string;
	paid?: boolean;
	payment_date?: string;
	boostId?: string;
}

interface Animal {
	_id: string;
	type: string;
	name: string;
	race: string;
	sex: string;
	photo: string[];
	tatouage: string;
	puce: string;
	userPseudo: string;
	userId: string;
	surgery: string;
	color1: string;
	collar: string;
	silhouette: string;
	size: string;
	hair: string;
	collarKind?: string;
	collarType?: string;
	collarColor?: string;
	color2?: string;
}

interface Address {
	formatted_address: string;
	dpt: string;
	city: City;
	street: string;
}

interface City {
	nom: string;
	code: string;
	codesPostaux: string[];
	codeDepartement: string;
	codeRegion: string;
	population: number;
	centre: Centre;
}

interface Centre {
	type: string;
	coordinates: number[];
}

interface Coords {
	lat: number;
	lng: number;
}
