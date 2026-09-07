import type { Metadata } from 'next';
import { getProducts } from '@lib/data/products';
import { getCategories } from '@lib/data/categories';
import ShopTemplate from '@modules/products/templates/shop-page';

export const metadata: Metadata = {
  title: 'Shop Catalog & Collections — Mrbulk',
  description: 'Browse luxury catalog, electronics, interior decor, and lifestyle products at Mrbulk. Fast shipping across South Africa.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ShopTemplate products={products} categories={categories} />;
}


