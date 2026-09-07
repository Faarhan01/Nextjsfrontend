import type { Metadata } from 'next';
import MyAccountTemplate from '@modules/account/templates/my-account-page';

export const metadata: Metadata = {
  title: 'My Account — Mrbulk',
  description: 'Manage your profile, orders, addresses, and wishlist at Mrbulk.',
};

export default function AccountPage() {
  return <MyAccountTemplate />;
}

