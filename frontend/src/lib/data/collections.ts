"use server"

import { sdk, isBackendConfigured } from "@lib/config"
import { getCacheOptions } from "./cookies"
import { MOCK_BRANDS } from "../../data/presets"

export async function listCollections() {
  if (!isBackendConfigured) {
    return MOCK_BRANDS;
  }

  const headers = {
    ...(await getCacheOptions("collections")),
  }

  const next = {
    ...(await getCacheOptions("collections")),
  }

  return sdk.client
    .fetch<{ collections: any[] }>(`/store/collections`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ collections }) => (collections && collections.length > 0 ? collections : []))
    .catch(() => [])
}

export async function listBrands() {
  const collections = await listCollections()
  return (collections && collections.length > 0) ? collections : MOCK_BRANDS
}

export { listBrands as getBrands }
