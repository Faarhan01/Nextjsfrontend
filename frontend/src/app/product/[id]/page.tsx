import { getProductById } from '../../../lib/data/products';
import ProductDetailPageClient from './ProductDetailPageClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) {
    notFound();
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
  }
}

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound();
  }

  return <ProductDetailPageClient product={product} />
}

