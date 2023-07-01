/**
 * Add query params to a URL
 * @param url - URL to add query params to
 * @param params - Object where keys are query param names and values are query param values
 * @returns URL with query params
 * @example
 * ```ts
 * addQueryToUrl(new URL('http://localhost:3000'), { a: 'b' })
 * // => http://localhost:3000/?a=b
 * ```
 */
export function addQueryToUrl(url: URL, params: Record<string, unknown>) {
	const searchParams = Object.entries(params).reduce<URLSearchParams>(
		(acc, [key, value]) => {
			acc.append(key, value as string);
			return acc;
		},
		new URLSearchParams(),
	);

	url.search = searchParams.toString();

	return url;
}
