import { MOCK_WOO_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '../../data/presets';
import { SlideConfig } from '../../types';

export type HomeData = {
  products: typeof MOCK_WOO_PRODUCTS;
  categories: typeof MOCK_CATEGORIES;
  brands: typeof MOCK_BRANDS;
  slides: SlideConfig[];
};

export async function getHomeData(): Promise<HomeData> {
  return {
    products: MOCK_WOO_PRODUCTS,
    categories: MOCK_CATEGORIES,
    brands: MOCK_BRANDS,
    slides: [],
  };
}
