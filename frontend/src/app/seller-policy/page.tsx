import type { Metadata } from 'next';
import MarketplaceSellerPolicyPageClient from './MarketplaceSellerPolicyPageClient';

export const metadata: Metadata = {
  title: 'Seller Policy — Mrbulk',
  description: 'Review the marketplace seller policy, compliance requirements, and vendor guidelines for Mrbulk.',
};

export default function SellerPolicyPage() {
  return <MarketplaceSellerPolicyPageClient />;
}
