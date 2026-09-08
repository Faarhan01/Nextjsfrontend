"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export async function listCollections() {
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
    .then(({ collections }) => collections)
    .catch(() => [])
}

export async function listBrands() {
  const collections = await listCollections()
  return collections
}

export { listBrands as getBrands }
