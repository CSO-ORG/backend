import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		alias: {
			'@utils/': new URL('./src/utils/', import.meta.url).pathname,
		},
	},
})
