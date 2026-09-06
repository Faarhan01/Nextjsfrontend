import { dbManager, ProductItem, ProductCategory } from './dbManager.ts';
import { MOCK_BRANDS } from '../../../frontend/src/data/presets.ts';

export type { ProductItem, ProductCategory };

export function getProducts(query?: {
  categoryId?: number;
  search?: string;
  brand?: string;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}) {
  let list = [...dbManager.getProducts()];

  if (query) {
    if (query.categoryId) {
      list = list.filter(p => p.categoryId === Number(query.categoryId));
    }
    if (query.brand) {
      list = list.filter(p => p.brand?.toLowerCase() === query.brand?.toLowerCase());
    }
    if (query.isFeatured !== undefined) {
      list = list.filter(p => p.isFeatured === query.isFeatured);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.tags?.some(t => t.toLowerCase().includes(s))
      );
    }
    if (query.minPrice !== undefined) {
      list = list.filter(p => (p.numericPrice || 0) >= query.minPrice!);
    }
    if (query.maxPrice !== undefined) {
      list = list.filter(p => (p.numericPrice || 0) <= query.maxPrice!);
    }
    if (query.sortBy) {
      if (query.sortBy === 'price_asc') {
        list.sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0));
      } else if (query.sortBy === 'price_desc') {
        list.sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0));
      } else if (query.sortBy === 'rating') {
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }
  }

  return list;
}

export function getProductById(id: string): ProductItem | null {
  return dbManager.getProductById(id);
}

export function saveProduct(productData: Partial<ProductItem>): ProductItem {
  return dbManager.saveProduct(productData);
}

export function deleteProduct(id: string): boolean {
  return dbManager.deleteProduct(id);
}

export function getCategories(): ProductCategory[] {
  return dbManager.getCategories();
}

export function getBrands() {
  return dbManager.getBrands() || MOCK_BRANDS;
}

