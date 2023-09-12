import { describe, expect, it } from 'vitest';
import { delay } from './delay';

describe('delay', () => {
	it('should delay', async () => {
		// use expect.assertions to make sure that a certain number of assertions are called during a async test
		expect.assertions(2);

		const start = performance.now();
		await delay(1000);
		const end = performance.now();

		expect(end - start).toBeGreaterThan(1000);
		expect(end - start).toBeLessThan(1100);
	});
});
