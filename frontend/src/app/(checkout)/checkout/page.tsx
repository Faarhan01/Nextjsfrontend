import type { Metadata } from 'next';
import CheckoutTemplate from '@modules/checkout/templates/checkout-page';

export const metadata: Metadata = {
  title: 'Checkout — Mrbulk',
  description: 'Complete your purchase securely at Mrbulk. Choose shipping and payment to finish your order.',
};

export default function CheckoutPage() {
  return <CheckoutTemplate />;
}

