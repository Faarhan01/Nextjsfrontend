import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_SELLER_ACCOUNTS } from '@/data/presets';
import { StorefrontView } from '@modules/seller/templates/storefront-view';

export const metadata: Metadata = {
  title: 'Seller Store — Mrbulk',
  description: 'Browse products from verified marketplace sellers on Mrbulk.',
};

export const dynamic = 'force-dynamic';

function sellerExists(sellerId: string): boolean {
  const target = sellerId.toLowerCase().trim();
  if (!target) return false;
  
  // Direct match by ID, userId, or slugified store name
  return INITIAL_SELLER_ACCOUNTS.some((s, idx) => {
    if (s.id.toLowerCase() === target) return true;
    if (s.userId?.toLowerCase() === target) return true;
    const storeSlug = s.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (storeSlug === target) return true;
    if (s.storeName.toLowerCase().replace(/\s+/g, '-') === target) return true;
    if (target === `seller-${idx + 1}` || target === `seller-0${idx + 1}`) return true;
    return false;
  });
}

export default async function StorefrontPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  if (!sellerExists(sellerId)) notFound();

  return <StorefrontView sellerId={sellerId} />;
}

