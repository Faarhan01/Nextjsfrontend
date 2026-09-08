import type { Metadata } from 'next';
import { listCategories } from '@lib/data/categories';
import { listProducts } from '@lib/data/products';
import { CategoriesPage as CategoriesTemplate } from '@modules/products/templates/categories-page';

export const metadata: Metadata = {
  title: 'Browse Categories — Mrbulk',
  description: 'Explore all product departments and categories at Mrbulk, from tech & audio to home & living.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const [categories, productsResult] = await Promise.all([
    listCategories(),
    listProducts(),
  ]);

  return <CategoriesTemplate categories={categories} products={productsResult.products} />;
}

