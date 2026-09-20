"use server"

import { sdk, isBackendConfigured } from "@lib/config"
import { getCacheOptions } from "./cookies"
import { MOCK_PRODUCTS } from "../../data/presets"
import { MockProduct } from "@/types"

export type ProductListQueryParams = {
  limit?: number
  offset?: number
  q?: string
  category_id?: number | string
  brandId?: number | string
  search?: string
}

function normalizeProduct(p: any): MockProduct {
  const priceVal = typeof p.numericPrice === 'number'
    ? p.numericPrice
    : (typeof p.price === 'number' ? p.price : parseFloat(String(p.price || '0').replace(/[^0-9.]/g, '')) || 0);

  const formattedPrice = typeof p.price === 'string' && p.price.startsWith('R')
    ? p.price
    : `R ${priceVal.toFixed(2)}`;

  return {
    id: String(p.id),
    name: p.name || p.title || 'Product',
    price: formattedPrice,
    retailPrice: p.retailPrice || formattedPrice,
    originalPrice: p.originalPrice || formattedPrice,
    isSale: p.isSale ?? false,
    saleBadgeText: p.saleBadgeText,
    isFeatured: p.isFeatured ?? false,
    imageUrl: p.imageUrl || p.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.imageUrl || p.thumbnail],
    stock: p.stock ?? 50,
    url: p.url || `/product/${p.handle || p.id}`,
    description: p.description || '',
    category: p.category || (p.categories?.[0]?.name) || 'General',
    categoryId: p.categoryId ? Number(p.categoryId) : 1,
    brand: p.brand || p.subtitle || 'Mrbulk Marketplace',
    brandId: p.brandId,
    sku: p.sku || `SKU-${p.id}`,
    barcode: p.barcode,
    rating: p.rating ?? 4.8,
    reviewsCount: p.reviewsCount ?? 12,
    tags: Array.isArray(p.tags) ? p.tags.map((t: any) => (typeof t === 'string' ? t : t.value || '')) : [],
    offers: p.offers || [],
    bulkPricing: p.bulkPricing || []
  };
}

function filterMockProducts(filters: ProductListQueryParams = {}): { products: MockProduct[]; count: number } {
  let list = [...MOCK_PRODUCTS];
  if (filters.category_id !== undefined && filters.category_id !== null) {
    list = list.filter((p) => p.categoryId === filters.category_id || String(p.categoryId) === String(filters.category_id));
  }
  if (filters.brandId !== undefined && filters.brandId !== null) {
    list = list.filter((p) => p.brandId === filters.brandId || String(p.brandId) === String(filters.brandId));
  }
  const searchStr = filters.search || filters.q;
  if (searchStr) {
    const q = searchStr.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.limit) {
    list = list.slice(0, filters.limit);
  }
  return {
    products: list,
    count: list.length,
  };
}

export async function listProducts(filters: ProductListQueryParams = {}): Promise<{ products: MockProduct[]; count: number }> {
  if (!isBackendConfigured) {
    return filterMockProducts(filters);
  }

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
  }

  if (filters.q || filters.search) {
    query.search = filters.search || filters.q
  }
  if (filters.category_id) {
    query.categoryId = filters.category_id
  }
  if (filters.brandId) {
    query.brandId = filters.brandId
  }

  return sdk.client
    .fetch<{ products: any[]; count?: number }>(`/store/products`, {
      method: "GET",
      query,
      headers: headers as any,
      next: next as any,
      cache: "force-cache",
    })
    .then(({ products }) => {
      let uiProducts = (products || []).map(normalizeProduct)

      if (filters.category_id) {
        uiProducts = uiProducts.filter((p) => p.categoryId === filters.category_id || String(p.categoryId) === String(filters.category_id))
      }
      if (filters.brandId) {
        uiProducts = uiProducts.filter((p) => p.brandId === filters.brandId || String(p.brandId) === String(filters.brandId))
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
    .catch(() => {
      return filterMockProducts(filters);
    })
}

export async function getProductById(id: string): Promise<MockProduct | null> {
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
    .then(({ product }) => (product ? normalizeProduct(product) : null))
    .catch(() => null)
}

export async function getProductByHandle(handle: string): Promise<MockProduct | null> {
  return getProductById(handle)
}

export async function getProductByIdStrict(id: string): Promise<MockProduct | null> {
  const target = id.toLowerCase().trim();
  const findInMock = () => {
    return MOCK_PRODUCTS.find((p) => {
      const pId = p.id.toLowerCase();
      if (pId === target || `prod-${pId}` === target || pId.replace(/^prod-/, '') === target) return true;
      if (target.startsWith(`${pId}-`)) return true;
      const pSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (pSlug === target || (p as any).slug === target) return true;
      return false;
    }) || null;
  };

  if (!isBackendConfigured) {
    return findInMock();
  }

  let product = await getProductById(id);
  if (!product) {
    product = findInMock();
  }
  return product;
}

export { listProducts as getProducts }
