export const getNumberOfPagesFromAlertNumber = (results: number) => {
	const numberOfPages = Math.ceil(results / 10);
	return numberOfPages;
};

export const getCodeAndNameFromDepartement = (departement: string) => {
	const targetStringSplitted = departement.split('/');
	const targetString = targetStringSplitted[
		targetStringSplitted.length - 1
	].replace('pet-alert-', '');
	const code = targetString.split(/-(.*)/s)[0];
	const name = targetString.split(/-(.*)/s)[1];
	return { code, name };
};
