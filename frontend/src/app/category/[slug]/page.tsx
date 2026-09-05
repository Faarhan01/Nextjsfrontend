import type { Metadata } from 'next';
import { getCategories } from '../../../lib/data/categories';
import CategoryDetailPageClient from './CategoryDetailPageClient';

export const metadata: Metadata = {
  title: 'Category — Mrbulk',
  description: 'Browse products by category at Mrbulk.',
};

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return <CategoryDetailPageClient initialSlug={slug} />;
}
