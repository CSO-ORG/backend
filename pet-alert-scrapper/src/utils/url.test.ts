import { addQueryToUrl } from '@utils/index';
import { describe, expect, it } from 'vitest';

describe('url', () => {
	describe('addQueryToUrl', () => {
		it('should convert object to search params', () => {
			const params = { a: 'b' };
			const url = addQueryToUrl(new URL('http://localhost:3000'), params);
			const expectUrl = 'http://localhost:3000/?a=b';

			expect(url.href).toBe(expectUrl);
		});

		it('should convert object with array to search params', () => {
			const params = { a: ['b', 5] };
			const url = addQueryToUrl(new URL('http://localhost:3000'), params);
			const expectUrl = 'http://localhost:3000/?a=b%2C5';

			expect(url.href).toBe(expectUrl);
		});
	});
});
