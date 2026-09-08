"use server"

import { sdk } from "@lib/config"
import { MedusaRegion } from "../../types/medusa"
import { getCacheOptions } from "./cookies"

export async function listRegions(): Promise<MedusaRegion[]> {
  const headers = {
    ...(await getCacheOptions("regions")),
  }

  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: MedusaRegion[] }>(`/store/regions`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(() => [])
}

export async function getRegion(id: string): Promise<MedusaRegion | null> {
  const headers = {
    ...(await getCacheOptions("regions")),
  }

  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ region: MedusaRegion }>(`/store/regions/${id}`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(() => null)
}
