"use server"

import { sdk } from "@lib/config"
import { MedusaRegion } from "../../types/medusa"
import { getCacheOptions } from "./cookies"

export const DEFAULT_REGION: MedusaRegion = {
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
    .then(({ regions }) => (regions && regions.length > 0 ? regions : [DEFAULT_REGION]))
    .catch(() => [DEFAULT_REGION])
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
    .then(({ region }) => region || DEFAULT_REGION)
    .catch(() => DEFAULT_REGION)
}
