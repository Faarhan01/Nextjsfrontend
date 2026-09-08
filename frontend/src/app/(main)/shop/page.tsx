import type { Metadata } from 'next';
import { listProducts } from '@lib/data/products';
import { listCategories } from '@lib/data/categories';
import ShopTemplate from '@modules/products/templates/shop-page';

export const metadata: Metadata = {
  title: 'Shop Catalog & Collections — Mrbulk',
  description: 'Browse luxury catalog, electronics, interior decor, and lifestyle products at Mrbulk. Fast shipping across South Africa.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [productsResult, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return <ShopTemplate products={productsResult.products} categories={categories} />;
}


