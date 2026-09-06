import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_SELLER_ACCOUNTS } from '@/data/presets';
import StorefrontPageClient from './StorefrontPageClient';

export const metadata: Metadata = {
  title: 'Seller Store — Mrbulk',
  description: 'Browse products from verified marketplace sellers on Mrbulk.',
};

export const dynamic = 'force-dynamic';

function sellerExists(sellerId: string): boolean {
  return INITIAL_SELLER_ACCOUNTS.some(
    (s) => s.id.toLowerCase() === sellerId.toLowerCase() ||
      s.storeName.toLowerCase().replace(/\s+/g, '-') === sellerId.toLowerCase()
  );
}

export default async function StorefrontPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  if (!sellerExists(sellerId)) notFound();

  return <StorefrontPageClient initialSellerId={sellerId} />;
}
