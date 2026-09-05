import 'server-only';
import { sdk } from '../sdk';
import { PRODUCTS_CACHE_TAG, PRODUCT_CACHE_TAG } from '../constants';
import { MOCK_WOO_PRODUCTS } from '../../data/presets';
import { medusaProductToUiProduct } from '../sdk/transformers';
import type { MedusaProduct } from '../../types/medusa';

export type ProductFilters = {
  categoryId?: number;
  brandId?: number;
  search?: string;
  limit?: number;
};

export async function listProducts(
  filters: ProductFilters = {}
): Promise<typeof MOCK_WOO_PRODUCTS> {
  try {
    const params: { limit?: number; offset?: number; q?: string } = {};
    if (filters.limit) params.limit = filters.limit;
    if (filters.search) params.q = filters.search;

    const res = await sdk.products.list(params);
    const medusaProducts: MedusaProduct[] = res.products || [];

    let products = medusaProducts.map((p) => medusaProductToUiProduct(p));

    if (filters.categoryId) {
      products = products.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.brandId) {
      products = products.filter((p) => p.brandId === filters.brandId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }
    return products;
  } catch (e) {
    console.warn('[lib/data] sdk.products.list failed, falling back to local catalog:', e);
    let products = [...MOCK_WOO_PRODUCTS];
    if (filters.categoryId) products = products.filter((p) => p.categoryId === filters.categoryId);
    if (filters.brandId) products = products.filter((p) => p.brandId === filters.brandId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters.limit) products = products.slice(0, filters.limit);
    return products;
  }
}

export { listProducts as getProducts };

export async function getProductById(id: string) {
  try {
    const { product } = await sdk.products.retrieve(id);
    return medusaProductToUiProduct(product);
  } catch {
    return (
      MOCK_WOO_PRODUCTS.find(
        (p) => p.id === id || p.id === `prod-${id}` || (p as any).slug === id
      ) || MOCK_WOO_PRODUCTS[0]
    );
  }
}

export async function getProductByHandle(handle: string) {
  return getProductById(handle);
}

export const productsCacheTags = {
  list: PRODUCTS_CACHE_TAG,
  detail: PRODUCT_CACHE_TAG
};