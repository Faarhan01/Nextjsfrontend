import type { Metadata } from 'next';
import AccountPageClient from './AccountPageClient';

export const metadata: Metadata = {
  title: 'My Account — Mrbulk',
  description: 'Manage your profile, orders, addresses, and wishlist at Mrbulk.',
};

export default function AccountPage() {
  return <AccountPageClient />;
}
