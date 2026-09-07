import type { Metadata } from 'next';
import OrderTrackingTemplate from '@modules/account/templates/order-tracking-page';

export const metadata: Metadata = {
  title: 'Track Order — Mrbulk',
  description: 'Track your Mrbulk order status and delivery updates in real time.',
};

export default function OrderTrackingPage() {
  return <OrderTrackingTemplate />;
}

