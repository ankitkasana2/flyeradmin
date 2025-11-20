const DEFAULT_API_BASE_URL = "http://193.203.161.174:3007/api"
const DEFAULT_UPLOADS_BASE_URL = "http://193.203.161.174:3007/uploads"

const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "")
const sanitizePath = (path: string) => path.replace(/^\/+/, "")

const resolveBase = (envValue: string | undefined, fallback: string) =>
  trimTrailingSlash(envValue && envValue.length > 0 ? envValue : fallback)

const joinUrl = (base: string, path?: string) => {
  if (!path) return base
  const safePath = sanitizePath(path)
  return safePath ? `${base}/${safePath}` : base
}

export const API_BASE_URL = resolveBase(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  DEFAULT_API_BASE_URL,
)

export const UPLOADS_BASE_URL = resolveBase(
  process.env.NEXT_PUBLIC_UPLOADS_BASE_URL,
  DEFAULT_UPLOADS_BASE_URL,
)

export const apiUrl = (path = "") => joinUrl(API_BASE_URL, path)

export const uploadsUrl = (path = "") => joinUrl(UPLOADS_BASE_URL, path)

