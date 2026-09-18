"use server"

import { sdk, isBackendConfigured } from "@lib/config"
import { getCacheOptions } from "./cookies"
import { INITIAL_SELLER_ACCOUNTS } from "@/data/presets"

export async function getSellers() {
  if (!isBackendConfigured) {
    return INITIAL_SELLER_ACCOUNTS;
  }

  const headers = {
    ...(await getCacheOptions("sellers")),
  }

  const next = {
    ...(await getCacheOptions("sellers")),
  }

  return sdk.client
    .fetch<{ sellers: any[] }>(`/store/sellers`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ sellers }) => (sellers && sellers.length > 0 ? sellers : INITIAL_SELLER_ACCOUNTS))
    .catch(() => INITIAL_SELLER_ACCOUNTS)
}
