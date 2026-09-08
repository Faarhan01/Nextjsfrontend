"server-only"

import { headers } from "next/headers"

export async function getLocaleHeader(): Promise<Record<string, string | null>> {
  const headersList = await headers()
  const acceptLanguage = headersList.get("accept-language")
  const locale = acceptLanguage?.split(",")[0]?.trim() || "en"

  return {
    "x-medusa-locale": locale,
  }
}
