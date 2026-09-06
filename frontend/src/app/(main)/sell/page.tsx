import { Metadata } from 'next';
import VendorOnboardingPage from '@modules/seller/templates/vendor-onboarding-client';

export const metadata: Metadata = {
  title: 'Sell on Mrbulk | Multi-Vendor Partner Program',
  description: 'Join the premier South African wholesale & retail marketplace. List your brand, reach thousands of verified buyers, and scale your sales with automated payouts.'
};

export default function Page() {
  return <VendorOnboardingPage />;
}
