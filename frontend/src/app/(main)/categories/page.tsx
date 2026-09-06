import type { Metadata } from 'next';
import { getCategories } from '@lib/data/categories';
import { getProducts } from '@lib/data/products';
import CategoriesPageClient from './CategoriesPageClient';

export const metadata: Metadata = {
  title: 'Browse Categories — Mrbulk',
  description: 'Explore all product departments and categories at Mrbulk, from tech & audio to home & living.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CategoriesPageClient categories={categories} products={products} />;
}
