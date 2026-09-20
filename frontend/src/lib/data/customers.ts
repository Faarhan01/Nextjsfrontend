"use server"

import { sdk } from "@lib/config"
import { UserProfile } from "@/types"
import {
  getAuthHeaders,
  getCacheOptions,
  removeAuthToken,
  setAuthToken,
} from "./cookies"

export async function getCurrentCustomer(): Promise<UserProfile | null> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ user?: UserProfile; customer?: UserProfile }>(`/store/auth`, {
      method: "GET",
      headers: headers as any,
      cache: "no-store",
    })
    .then((res) => res.user || res.customer || null)
    .catch(() => null)
}

export async function loginCustomer(email: string, password: string): Promise<{ user?: UserProfile; customer?: UserProfile; token?: string }> {
  const headers = {
    ...(await getCacheOptions("auth")),
  }

  return sdk.client
    .fetch<{ user?: UserProfile; customer?: UserProfile; token?: string }>(
      `/store/auth`,
      {
        method: "POST",
        headers: headers as any,
        body: {
          email,
          password,
        },
      }
    )
    .then(async (res) => {
      if (res.token) {
        await setAuthToken(res.token)
      }
      return res
    })
}

export async function registerCustomer(data: {
  email: string
  password: string
  first_name?: string
  last_name?: string
  name?: string
}): Promise<{ user?: UserProfile; customer?: UserProfile; token?: string }> {
  const headers = {
    ...(await getCacheOptions("auth")),
  }

  return sdk.client
    .fetch<{ user?: UserProfile; customer?: UserProfile; token?: string }>(
      `/store/auth/register`,
      {
        method: "POST",
        headers: headers as any,
        body: data,
      }
    )
    .then(async (res) => {
      if (res.token) {
        await setAuthToken(res.token)
      }
      return res
    })
}

export async function logoutCustomer() {
  await removeAuthToken()
}

export async function updateCustomer(data: Partial<UserProfile> & { first_name?: string; last_name?: string }): Promise<UserProfile | null> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ user?: UserProfile; customer?: UserProfile }>(`/store/customers/me`, {
      method: "POST",
      headers: headers as any,
      body: data,
    })
    .then((res) => res.user || res.customer || null)
    .catch(() => null)
}

export async function getCustomerOrders(): Promise<any[]> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ orders: any[] }>(`/store/customers/me/orders`, {
      method: "GET",
      headers: headers as any,
      cache: "force-cache",
    })
    .then(({ orders }) => orders || [])
    .catch(() => [])
}
