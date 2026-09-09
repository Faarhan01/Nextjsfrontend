"use server"

import { sdk } from "@lib/config"
import { medusaProductToUiProduct } from "@lib/sdk/transformers"
import { getCacheOptions } from "./cookies"
import { MOCK_PRODUCTS } from "../../data/presets"

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

      if (uiProducts.length === 0 && (!products || products.length === 0)) {
        throw new Error('No products returned from backend');
      }

      return {
        products: uiProducts,
        count: uiProducts.length,
      }
    })
    .catch(() => {
      let fallbackList = [...MOCK_PRODUCTS];
      if (filters.category_id) {
        fallbackList = fallbackList.filter((p) => p.categoryId === filters.category_id);
      }
      if (filters.brandId) {
        fallbackList = fallbackList.filter((p) => p.brandId === filters.brandId);
      }
      if (filters.search || filters.q) {
        const q = (filters.search || filters.q || '').toLowerCase();
        fallbackList = fallbackList.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (filters.limit) {
        fallbackList = fallbackList.slice(0, filters.limit);
      }
      return {
        products: fallbackList,
        count: fallbackList.length,
      };
    })
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
    .then(({ product }) => (product ? medusaProductToUiProduct(product) : null))
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
      const product = products?.[0]
      return product ? medusaProductToUiProduct(product) : null
    })
    .catch(() => null)
}

export async function getProductByIdStrict(id: string) {
  let product = await getProductById(id);
  if (!product) {
    product = await getProductByHandle(id);
  }
  if (!product) {
    const target = id.toLowerCase().trim();
    const fallback = MOCK_PRODUCTS.find((p) => {
      const pId = p.id.toLowerCase();
      if (pId === target || `prod-${pId}` === target || pId.replace(/^prod-/, '') === target) return true;
      if (target.startsWith(`${pId}-`)) return true;
      const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (pSlug === target || (p as any).slug === target) return true;
      return false;
    });
    if (fallback) product = fallback;
  }
  return product;
}

export { listProducts as getProducts }
