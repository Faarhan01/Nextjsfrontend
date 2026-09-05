import type { Metadata } from 'next';
import StorefrontPageClient from './StorefrontPageClient';

export const metadata: Metadata = {
  title: 'Seller Store — Mrbulk',
  description: 'Browse products from verified marketplace sellers on Mrbulk.',
};

export const dynamic = 'force-dynamic';

export default async function StorefrontPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  
  return <StorefrontPageClient initialSellerId={sellerId} />;
}
