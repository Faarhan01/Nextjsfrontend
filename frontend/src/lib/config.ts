import { getLocaleHeader } from "./util/get-locale-header"

export interface FetchArgs {
  method?: string
  headers?: Record<string, string>
  body?: any
  query?: Record<string, any>
  cache?: RequestCache
  next?: any
  signal?: AbortSignal
}

export const isBackendConfigured: boolean = Boolean(
  (process.env.NEXT_PUBLIC_BACKEND_URL &&
    process.env.NEXT_PUBLIC_BACKEND_URL.trim() !== '' &&
    !process.env.NEXT_PUBLIC_BACKEND_URL.includes('localhost:9001')) ||
  (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL &&
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.trim() !== '' &&
    !process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.includes('localhost:9001'))
)

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9001"

async function apiFetch<T>(
  path: string,
  init?: FetchArgs
): Promise<T> {
  if (!isBackendConfigured) {
    throw new Error("Backend not configured; operating in standalone mode")
  }

  let fullUrl = path.startsWith("http") ? path : `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`

  if (init?.query && Object.keys(init.query).length > 0) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(init.query)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    }
    const queryString = params.toString()
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
    }
  }

  const reqHeaders: Record<string, string> = {
    "Accept": "application/json",
    ...(init?.headers || {})
  }

  try {
    const localeHeader = await getLocaleHeader()
    if (localeHeader["accept-language"]) {
      reqHeaders["accept-language"] ??= localeHeader["accept-language"]
    }
  } catch {}

  let bodyData: any = undefined
  if (init?.body !== undefined) {
    if (typeof init.body === "object" && !(init.body instanceof FormData)) {
      reqHeaders["Content-Type"] = "application/json"
      bodyData = JSON.stringify(init.body)
    } else {
      bodyData = init.body
    }
  }

  // Fast 3-second timeout for offline backends
  let signal = init?.signal
  if (!signal && typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    signal = AbortSignal.timeout(3000)
  }

  const response = await fetch(fullUrl, {
    method: init?.method || "GET",
    headers: reqHeaders,
    body: bodyData,
    cache: init?.cache,
    next: init?.next,
    signal
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`API Error ${response.status}: ${errorText}`)
  }

  return response.json() as Promise<T>
}

export const sdk = {
  baseUrl: BACKEND_URL,
  client: {
    fetch: apiFetch
  }
}

export default sdk
