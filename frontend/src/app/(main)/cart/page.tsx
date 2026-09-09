import type { Metadata } from 'next';
import { retrieveCart } from '@lib/data/carts';
import { medusaLineItemToCartItem } from '@lib/sdk/transformers';
import CartTemplate from '@modules/cart/templates/cart-page';

export const metadata: Metadata = {
  title: 'Shopping Cart — Mrbulk',
  description: 'Review your shopping bag, quantities, and totals before checkout at Mrbulk.',
};

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await retrieveCart().catch((error) => {
    console.error('Failed to fetch cart:', error);
    return null;
  });

  const items = cart?.items && Array.isArray(cart.items) && cart.items.length > 0
    ? cart.items.map((it: any) => medusaLineItemToCartItem(it))
    : undefined;

  return <CartTemplate cart={items} />;
}

