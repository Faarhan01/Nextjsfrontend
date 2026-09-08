"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheOptions,
  removeAuthToken,
  setAuthToken,
} from "./cookies"

export async function getCurrentCustomer() {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/auth`, {
      method: "GET",
      headers: headers as any,
      cache: "no-store",
    })
    .then(({ customer }) => customer)
    .catch(() => null)
}

export async function loginCustomer(email: string, password: string) {
  const headers = {
    ...(await getCacheOptions("auth")),
  }

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer; token?: string }>(
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
    .then(async ({ customer, token }) => {
      if (token) {
        await setAuthToken(token)
      }
      return { customer, token }
    })
}

export async function registerCustomer(data: {
  email: string
  password: string
  first_name: string
  last_name: string
}) {
  const headers = {
    ...(await getCacheOptions("auth")),
  }

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer; token?: string }>(
      `/store/auth/register`,
      {
        method: "POST",
        headers: headers as any,
        body: data,
      }
    )
    .then(async ({ customer, token }) => {
      if (token) {
        await setAuthToken(token)
      }
      return { customer, token }
    })
}

export async function logoutCustomer() {
  await removeAuthToken()
}

export async function updateCustomer(data: HttpTypes.StoreUpdateCustomer) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: "POST",
      headers: headers as any,
      body: data,
    })
    .then(({ customer }) => customer)
}

export async function getCustomerOrders() {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ orders: HttpTypes.StoreOrder[] }>(`/store/customers/me/orders`, {
      method: "GET",
      headers: headers as any,
      cache: "force-cache",
    })
    .then(({ orders }) => orders)
    .catch(() => [])
}
