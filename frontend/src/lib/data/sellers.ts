"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export async function getSellers() {
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
    .then(({ sellers }) => sellers)
    .catch(() => [])
}
