"server-only"

import { headers } from "next/headers"

export async function getLocaleHeader(): Promise<Record<string, string | null>> {
  try {
    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language")
    const locale = acceptLanguage?.split(",")[0]?.trim() || "en-ZA"

    return {
      "accept-language": locale,
    }
  } catch {
    return {
      "accept-language": "en-ZA",
    }
  }
}
