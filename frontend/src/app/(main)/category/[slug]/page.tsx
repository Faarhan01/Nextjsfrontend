import type { Metadata } from 'next';
import { getCategories, getCategoryBySlugStrict } from '@lib/data/categories';
import { listProducts } from '@lib/data/products';
import CategoryDetailTemplate from '@modules/products/templates/category-detail-page';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugStrict(slug);
  if (!category) return { title: 'Category not found', description: 'The requested category does not exist.', other: { 'data-nextjs-not-found': 'true' } };
  return {
    title: `${category.name} — Mrbulk`,
    description: `Shop ${category.name.toLowerCase()} products at Mrbulk.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlugStrict(slug);
  if (!category) notFound();

  const [allCategories, { products: categoryProducts }] = await Promise.all([
    getCategories(),
    listProducts({ category_id: category.id }),
  ]);

  return (
    <CategoryDetailTemplate
      slug={slug}
      categoryName={category.name}
      categories={allCategories}
      products={categoryProducts}
    />
  );
}

