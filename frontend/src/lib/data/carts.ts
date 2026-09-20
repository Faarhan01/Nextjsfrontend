"use server"

import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"

export interface CartItemType {
  id: string
  productId?: string
  name?: string
  title?: string
  price?: number
  unit_price?: number
  quantity: number
  imageUrl?: string
  thumbnail?: string
  subtotal?: number
  total?: number
  variant_id?: string
  variant?: any
}

export interface CartType {
  id: string
  region_id?: string
  items: CartItemType[]
  subtotal: number
  discount_total?: number
  shipping_total?: number
  tax_total?: number
  total: number
  email?: string
  shipping_address?: any
  billing_address?: any
  shipping_methods?: any[]
  payment_session?: any
  payment_sessions?: any[]
}

export async function retrieveCart(cartId?: string): Promise<CartType | null> {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${id}`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string): Promise<CartType | null> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  let cart = await retrieveCart()

  if (!cart) {
    const cartResp = await sdk.client
      .fetch<{ cart: CartType }>(`/store/carts`, {
        method: "POST",
        headers: headers as any,
        body: {
          region_id: countryCode,
        },
      })
      .then((resp) => resp)
      .catch(() => null)

    if (cartResp?.cart) {
      cart = cartResp.cart
      await setCartId(cart.id)

      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
    }
  }

  return cart
}

export async function updateCart(data: any): Promise<CartType> {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cartId}`, {
      method: "POST",
      headers: headers as any,
      body: data,
    })
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
      return cart
    })
}

export async function addToCart({
  variantId,
  productId,
  quantity,
  countryCode = "za",
  price,
  name,
  imageUrl,
}: {
  variantId?: string
  productId?: string
  quantity: number
  countryCode?: string
  price?: number
  name?: string
  imageUrl?: string
}) {
  const targetId = variantId || productId
  if (!targetId) {
    throw new Error("Missing item ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cart.id}/line-items`, {
      method: "POST",
      headers: headers as any,
      body: {
        variant_id: targetId,
        productId: productId || targetId,
        quantity,
        price,
        name,
        imageUrl,
      },
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
    })
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      headers: headers as any,
      body: {
        quantity,
      },
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
    })
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
      headers: headers as any,
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
    })
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      headers: headers as any,
      body: {
        option_id: shippingMethodId,
      },
    })
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
    })
}

export async function initiatePaymentSession(
  cart: CartType,
  data: any
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ cart: CartType }>(`/store/carts/${cart.id}/payment-sessions`, {
      method: "POST",
      headers: headers as any,
      body: data,
    })
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
      return resp
    })
}

export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.client
    .fetch<{ type: string; order?: any; cart?: any }>(`/store/carts/${id}/complete`, {
      method: "POST",
      headers: headers as any,
    })
    .then(async (res) => {
      const cartCacheTag = await getCacheTag("carts")
      if (cartCacheTag) revalidateTag(cartCacheTag, "max")
      return res
    })

  if (cartRes?.type === "order" || cartRes?.order) {
    const orderCacheTag = await getCacheTag("orders")
    if (orderCacheTag) revalidateTag(orderCacheTag, "max")

    await removeCartId()
    return cartRes
  }

  return cartRes.cart
}
