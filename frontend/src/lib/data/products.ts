import { MOCK_WOO_PRODUCTS } from '../../data/presets';

export type ProductFilters = {
  categoryId?: number;
  brandId?: number;
  search?: string;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<typeof MOCK_WOO_PRODUCTS> {
  let products = [...MOCK_WOO_PRODUCTS];

  if (filters.categoryId) {
    products = products.filter((p) => p.categoryId === filters.categoryId);
  }

  if (filters.brandId) {
    products = products.filter((p) => p.brandId === filters.brandId);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter((p) =>
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

export async function getProductById(id: string) {
  return MOCK_WOO_PRODUCTS.find((p) => p.id === id || p.id === `prod-${id}` || (p as any).slug === id) || MOCK_WOO_PRODUCTS[0];
}
