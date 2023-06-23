import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    alias: {
      "@foo/": new URL("./src/foo/", import.meta.url).pathname,
    },
  },
})
