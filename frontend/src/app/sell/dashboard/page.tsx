import { Metadata } from 'next';
import { SellerDashboard } from '../../../components/seller/SellerDashboard';

export const metadata: Metadata = {
  title: 'Seller Portal & Dashboard | Mrbulk South Africa',
  description: 'Manage your marketplace store offers, inventory stock, customer orders, courier dispatch, and weekly EFT payouts.'
};

export default function Page() {
  return <SellerDashboard />;
}
