import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		alias: {
			'@utils/': new URL('./src/utils/', import.meta.url).pathname,
			'@interfaces/': new URL('./src/interfaces/', import.meta.url).pathname,
			'@workers/': new URL('./src/workers/', import.meta.url).pathname,
			'@services/': new URL('./src/services/', import.meta.url).pathname,
		},
	},
});
