"use server"

import { sdk, isBackendConfigured } from "@lib/config"
import { StoreRegion } from "@/types"
import { getCacheOptions } from "./cookies"

export type MedusaRegion = StoreRegion

export const DEFAULT_REGION: StoreRegion = {
  id: "reg_za",
  name: "South Africa",
  currency_code: "zar",
  tax_rate: 15,
  countries: [
    {
      id: "c_za",
      iso_2: "za",
      iso_3: "zaf",
      name: "South Africa",
      display_name: "South Africa",
    },
  ],
}

export async function listRegions(): Promise<StoreRegion[]> {
  if (!isBackendConfigured) {
    return [DEFAULT_REGION];
  }

  const headers = {
    ...(await getCacheOptions("regions")),
  }

  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ regions }) => (regions && regions.length > 0 ? regions : [DEFAULT_REGION]))
    .catch(() => [DEFAULT_REGION])
}

export async function getRegion(id: string): Promise<StoreRegion | null> {
  const headers = {
    ...(await getCacheOptions("regions")),
  }

  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ region: StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ region }) => region || DEFAULT_REGION)
    .catch(() => DEFAULT_REGION)
}
