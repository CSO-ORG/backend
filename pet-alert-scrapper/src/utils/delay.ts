/**
 * Delay for a given amount of time.
 * @param ms - The amount of time to wait in milliseconds.
 * @returns A void promise that resolves after the given amount of time.
 */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
