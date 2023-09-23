/**
 * Verifies if the value is a string
 * @param value value to verify
 * @returns true if the value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

/**
 * Verifies if the value is an url
 * @param value value to verify
 * @returns true if the value is an url
 */
export const isUrl = (value: unknown): value is string => {
  return isString(value) && value.startsWith('http')
}
