import type { Metadata } from 'next';
import OrderTrackingPageClient from './OrderTrackingPageClient';

export const metadata: Metadata = {
  title: 'Track Order — Mrbulk',
  description: 'Track your Mrbulk order status and delivery updates in real time.',
};

export default function OrderTrackingPage() {
  return <OrderTrackingPageClient />;
}
