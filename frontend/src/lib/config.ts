import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"
import { getLocaleHeader } from "./util/get-locale-header"

export const isBackendConfigured: boolean = Boolean(
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL &&
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.trim() !== '' &&
  !process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.includes('localhost:9001')
)

let MEDUSA_BACKEND_URL = isBackendConfigured ? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL! : "http://localhost:9001"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  if (!isBackendConfigured) {
    throw new Error("Backend not configured; operating in standalone template mode")
  }

  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  try {
    localeHeader = await getLocaleHeader()
    headers["x-medusa-locale"] ??= localeHeader["x-medusa-locale"]
  } catch {}

  const newHeaders = {
    ...localeHeader,
    ...headers,
  }

  // Use a 3-second timeout so offline backends fail fast
  let signal = init?.signal
  if (!signal && typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    signal = AbortSignal.timeout(3000)
  }

  init = {
    ...init,
    signal,
    headers: newHeaders,
  }
  return originalFetch(input, init)
}
