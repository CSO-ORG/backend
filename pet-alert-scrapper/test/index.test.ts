import { bar } from "@foo/index"
import { test, assert } from "vitest"

test("simple test", () => {
  assert.equal(bar, "3")
})
