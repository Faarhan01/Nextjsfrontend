import { getProductByIdStrict } from '@lib/data/products';
import ProductDetailTemplate from '@modules/products/templates/product-detail-page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdStrict(id);
  if (!product) {
    return { title: 'Product not found', description: 'The requested product does not exist.', other: { 'data-nextjs-not-found': 'true' } };
  }
  return {
    title: `${product.name} | Mrbulk`,
    description: product.description || `Buy ${product.name} online at Mrbulk. Fast shipping and secure checkout.`,
    openGraph: {
      title: `${product.name} | Mrbulk`,
      description: product.description || `Buy ${product.name} online at Mrbulk.`,
      images: product.imageUrl ? [product.imageUrl] : [],
      type: 'website',
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdStrict(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailTemplate productId={product.id} />;
}


