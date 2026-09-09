import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StorefrontView } from '@modules/seller/templates/storefront-view';
import { getSellers } from '@lib/data/sellers';

export const metadata: Metadata = {
  title: 'Seller Store — Mrbulk',
  description: 'Browse products from verified marketplace sellers on Mrbulk.',
};

export async function generateStaticParams() {
  try {
    const sellers = await getSellers();
    return sellers.map((seller) => ({
      sellerId: seller.id,
    }));
  } catch {
    return [];
  }
}

function resolveSellerId(rawId: string, sellers: any[]): string | null {
  const target = rawId.toLowerCase().trim();
  if (!target) return null;

  const seller = sellers.find((s) => s.id === target || s.slug === target);
  if (seller) return seller.id;

  const indexMatch = target.match(/^seller-0?(\d+)$/);
  if (indexMatch) {
    const idx = parseInt(indexMatch[1], 10) - 1;
    if (idx >= 0 && idx < sellers.length) {
      return sellers[idx].id;
    }
  }

  return null;
}

export default async function StorefrontPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const sellers = await getSellers();

  if (sellers.length === 0) {
    notFound();
  }

  const resolvedSellerId = resolveSellerId(sellerId, sellers);
  if (!resolvedSellerId) {
    notFound();
  }

  const seller = sellers.find((s) => s.id === resolvedSellerId);

  return <StorefrontView sellerId={resolvedSellerId} seller={seller} />;
}

