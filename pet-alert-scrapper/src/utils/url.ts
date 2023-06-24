export function addQueryToUrl(url: URL, params: Record<string, unknown>) {
  const searchParams = Object.entries(params).reduce<URLSearchParams>(
    (acc, [key, value]) => {
      acc.append(key, value as string)
      return acc
    },
    new URLSearchParams(),
  )

  url.search = searchParams.toString()

  return url
}
