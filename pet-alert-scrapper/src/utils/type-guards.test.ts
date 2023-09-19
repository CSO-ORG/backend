import { isString } from './type-guards';
import { isUrl } from '@utils/type-guards';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('type-guards', () => {
	describe('isString', () => {
		it('return true and a type of string if the value is a string', () => {
			const value = 'string';

			expect(isString(value)).toBe(true);
			expectTypeOf(value).toEqualTypeOf<string>();
		});

		it('return false if the value is not a string', () => {
			const value = 1;

			expect(isString(value)).toBe(false);
			expectTypeOf(value).not.toEqualTypeOf<string>();
		});

		it('return false if the value is undefined', () => {
			const value = undefined;

			expect(isString(value)).toBe(false);
			expectTypeOf(value).not.toEqualTypeOf<string>();
		});
	});

	describe('isUrl', () => {
		it('return true and a type of string if the value is a string and starts with http', () => {
			const value = 'http://www.google.com';

			expect(isUrl(value)).toBe(true);
			expectTypeOf(value).toEqualTypeOf<string>();
		});

		it('return false if the value is not a string', () => {
			const value = 1;

			expect(isUrl(value)).toBe(false);
			expectTypeOf(value).not.toEqualTypeOf<string>();
		});

		it('return false if the value is undefined', () => {
			const value = undefined;

			expect(isUrl(value)).toBe(false);
			expectTypeOf(value).not.toEqualTypeOf<string>();
		});

		it('return false if the value is a string but does not start with http', () => {
			const value = 'www.google.com';

			expect(isUrl(value)).toBe(false);
		});
	});
});
