export const isString = (value: unknown): value is string => {
	return typeof value === 'string';
};

export const isUrl = (value: unknown): value is string => {
	return isString(value) && value.startsWith('http');
};
