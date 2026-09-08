"use server"

import { sdk } from "@lib/config"
import { medusaProductToUiProduct } from "@lib/sdk/transformers"
import { getCacheOptions } from "./cookies"

type ProductListQueryParams = {
  limit?: number
  offset?: number
  q?: string
  category_id?: number
  brandId?: number
  search?: string
}

export async function listProducts(filters: ProductListQueryParams = {}) {
  const limit = filters.limit || 100
  const offset = filters.offset || 0

  const headers = {
    ...(await getCacheOptions("products")),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  const query: Record<string, unknown> = {
    limit,
    offset,
    fields:
      "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
  }

  if (filters.q) {
    query.q = filters.q
  }
  if (filters.category_id) {
    query.category_id = [filters.category_id]
  }

  return sdk.client
    .fetch<{ products: any[]; count: number }>(`/store/products`, {
      method: "GET",
      query,
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ products }) => {
      let uiProducts = products.map((p: any) => medusaProductToUiProduct(p))

      if (filters.category_id) {
        uiProducts = uiProducts.filter((p) => p.categoryId === filters.category_id)
      }
      if (filters.brandId) {
        uiProducts = uiProducts.filter((p) => p.brandId === filters.brandId)
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        uiProducts = uiProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        )
      }
      if (filters.limit) {
        uiProducts = uiProducts.slice(0, filters.limit)
      }

      return {
        products: uiProducts,
        count: uiProducts.length,
      }
    })
    .catch(() => ({ products: [], count: 0 }))
}

export async function getProductById(id: string) {
  const headers = {
    ...(await getCacheOptions("products")),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ product: any }>(`/store/products/${id}`, {
      method: "GET",
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ product }) => medusaProductToUiProduct(product))
    .catch(() => null)
}

export async function getProductByHandle(handle: string) {
  const headers = {
    ...(await getCacheOptions("products")),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: any[] }>(`/store/products`, {
      method: "GET",
      query: {
        handle,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,",
      },
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ products }) => {
      const product = products[0]
      return product ? medusaProductToUiProduct(product) : null
    })
    .catch(() => null)
}

export async function getProductByIdStrict(id: string) {
  const product = await getProductById(id)
  return product
}

export { listProducts as getProducts }
