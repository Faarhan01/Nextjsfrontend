import 'server-only';
import { unstable_cache } from 'next/cache';
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

async function fetchRawProducts(params: { limit?: number; offset?: number; q?: string } = {}) {
  try {
    const res = await sdk.products.list(params);
    const medusaProducts: MedusaProduct[] = res.products || [];
    return medusaProducts.map((p) => medusaProductToUiProduct(p));
  } catch (e) {
    console.warn('[lib/data] sdk.products.list failed, falling back to local catalog:', e);
    return [...MOCK_WOO_PRODUCTS];
  }
}

const getCachedProducts = unstable_cache(
  async () => fetchRawProducts({ limit: 100 }),
  ['medusa-all-products'],
  { tags: [PRODUCTS_CACHE_TAG], revalidate: 3600 }
);

export async function listProducts(
  filters: ProductFilters = {}
): Promise<typeof MOCK_WOO_PRODUCTS> {
  let products = await getCachedProducts();

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
}

export { listProducts as getProducts };

export async function getProductByIdStrict(id: string) {
  const getCachedProduct = unstable_cache(
    async (productId: string) => {
      try {
        const { product } = await sdk.products.retrieve(productId);
        return medusaProductToUiProduct(product);
      } catch {
        return (
          MOCK_WOO_PRODUCTS.find(
            (p) => p.id === productId || p.id === `prod-${productId}` || (p as any).slug === productId
          ) || null
        );
      }
    },
    ['medusa-product-detail', id],
    { tags: [PRODUCTS_CACHE_TAG, PRODUCT_CACHE_TAG(id)], revalidate: 3600 }
  );

  return getCachedProduct(id);
}

export async function getProductById(id: string) {
  return (await getProductByIdStrict(id)) || MOCK_WOO_PRODUCTS[0];
}

export async function getProductByHandle(handle: string) {
  return getProductById(handle);
}

export const productsCacheTags = {
  list: PRODUCTS_CACHE_TAG,
  detail: PRODUCT_CACHE_TAG
};
