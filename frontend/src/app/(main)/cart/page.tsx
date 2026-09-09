import type { Metadata } from 'next';
import { retrieveCart } from '@lib/data/carts';
import CartTemplate from '@modules/cart/templates/cart-page';

export const metadata: Metadata = {
  title: 'Shopping Cart — Mrbulk',
  description: 'Review your shopping bag, quantities, and totals before checkout at Mrbulk.',
};

export default async function CartPage() {
  const cart = await retrieveCart().catch((error) => {
    console.error('Failed to fetch cart:', error);
    return null;
  });

  return <CartTemplate cart={cart?.items ?? []} />;
}

