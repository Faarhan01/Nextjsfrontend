import { getProductByIdStrict, listProducts } from '@lib/data/products';
import ProductDetailTemplate from '@modules/products/templates/product-detail-page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const { products } = await listProducts({ limit: 100 });
    return products
      .filter((p) => p.id)
      .map((product) => ({
        id: product.id,
      }));
  } catch (error) {
    console.error('Failed to generate static params for product pages:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdStrict(id);
  if (!product) {
    return { title: 'Product not found', description: 'The requested product does not exist.' };
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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdStrict(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailTemplate productId={product.id} />;
}
