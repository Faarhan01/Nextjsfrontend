import { Metadata } from 'next';
import { getSellers } from '@/lib/data/sellers';
import { SellersDirectoryClient } from '@modules/seller/templates/sellers-directory-client';

export const metadata: Metadata = {
  title: 'Verified Sellers & Brand Storefronts | Mrbulk Marketplace',
  description: 'Browse certified marketplace sellers, official brand distributors, and verified local merchants across South Africa.'
};

export default async function SellersPage() {
  const sellers = await getSellers();
  return <SellersDirectoryClient sellers={sellers} />;
}
