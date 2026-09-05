import { MOCK_CATEGORIES } from '../../data/presets';

export async function getCategories() {
  return MOCK_CATEGORIES;
}

export async function getCategoryBySlug(slug: string) {
  return MOCK_CATEGORIES.find((c) => c.name.toLowerCase().replace(/\s+/g, '-') === slug) || MOCK_CATEGORIES[0];
}
