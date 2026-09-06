import 'server-only';
import { unstable_cache } from 'next/cache';
import { sdk } from '../sdk';
import { CATEGORIES_CACHE_TAG } from '../constants';
import { MOCK_CATEGORIES } from '../../data/presets';

async function fetchRawCategories() {
  try {
    const { product_categories } = await sdk.categories.list();
    if (product_categories && product_categories.length > 0) {
      return product_categories.map((c: any) => {
        const numericId = typeof c.id === 'number'
          ? c.id
          : parseInt(String(c.id || '').replace(/\D/g, ''), 10) || 1;
        const preset = MOCK_CATEGORIES.find(p => p.id === numericId || p.name.toLowerCase() === (c.name || '').toLowerCase());
        return {
          id: numericId,
          name: c.name || preset?.name || 'Category',
          handle: c.handle || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          imageUrl: c.imageUrl || c.image_url || c.image || c.metadata?.imageUrl || preset?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
          description: c.description || preset?.description || `Browse quality ${c.name} in bulk and save.`,
          icon: c.icon || c.metadata?.icon || preset?.icon || '',
          itemCount: c.itemCount ?? c.item_count ?? preset?.itemCount ?? 15,
          subcategories: (c.subcategories && c.subcategories.length > 0) ? c.subcategories : (preset?.subcategories || [])
        };
      });
    }
    return MOCK_CATEGORIES;
  } catch (e) {
    console.warn('[lib/data] sdk.categories.list failed, falling back to local catalog:', e);
    return MOCK_CATEGORIES;
  }
}

const getCachedCategories = unstable_cache(
  fetchRawCategories,
  ['medusa-all-categories'],
  { tags: [CATEGORIES_CACHE_TAG], revalidate: 3600 }
);

export async function listCategories() {
  return await getCachedCategories();
}

export { listCategories as getCategories };

export async function getCategoryBySlug(slug: string) {
  const categories = await listCategories();
  return (
    categories.find((c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
    categories[0]
  );
}

export async function getCategoryBySlugStrict(slug: string) {
  const categories = await listCategories();
  return categories.find((c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug) || null;
}

export const categoriesCacheTag = CATEGORIES_CACHE_TAG;
