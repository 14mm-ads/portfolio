export function assetUrl(path: string | null | undefined) {
  if (!path) return undefined
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
