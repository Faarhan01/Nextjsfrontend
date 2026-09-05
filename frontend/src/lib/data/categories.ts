import 'server-only';
import { sdk } from '../sdk';
import { CATEGORIES_CACHE_TAG } from '../constants';
import { MOCK_CATEGORIES } from '../../data/presets';

export async function listCategories() {
  try {
    const { product_categories } = await sdk.categories.list();
    if (product_categories && product_categories.length > 0) {
      return product_categories;
    }
    return MOCK_CATEGORIES;
  } catch (e) {
    console.warn('[lib/data] sdk.categories.list failed, falling back to local catalog:', e);
    return MOCK_CATEGORIES;
  }
}

export { listCategories as getCategories };

export async function getCategoryBySlug(slug: string) {
  const categories = await listCategories();
  return (
    categories.find((c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
    categories[0]
  );
}

export const categoriesCacheTag = CATEGORIES_CACHE_TAG;