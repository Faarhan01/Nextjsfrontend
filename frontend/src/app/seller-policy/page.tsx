import type { Metadata } from 'next';
import MarketplaceSellerPolicyTemplate from '@modules/content/templates/marketplace-seller-policy-page';

export const metadata: Metadata = {
  title: 'Seller Policy — Mrbulk',
  description: 'Review the marketplace seller policy, compliance requirements, and vendor guidelines for Mrbulk.',
};

export default function SellerPolicyPage() {
  return <MarketplaceSellerPolicyTemplate />;
}

