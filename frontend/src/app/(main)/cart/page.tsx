import type { Metadata } from 'next';
import CartTemplate from '@modules/cart/templates/cart-page';

export const metadata: Metadata = {
  title: 'Shopping Cart — Mrbulk',
  description: 'Review your shopping bag, quantities, and totals before checkout at Mrbulk.',
};

export default function CartPage() {
  return <CartTemplate />;
}

