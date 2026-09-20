import type { Metadata } from 'next';
import { retrieveCart } from '@lib/data/carts';
import CartTemplate from '@modules/cart/templates/cart-page';
import { CartItem } from '@/types';

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

  const items: CartItem[] | undefined = cart?.items && Array.isArray(cart.items) && cart.items.length > 0
    ? cart.items.map((it: any) => ({
        id: it.id,
        productId: it.productId || it.variant_id || it.id,
        name: it.name || it.title || 'Cart Item',
        price: typeof it.price === 'number' ? it.price : (it.unit_price || 0),
        imageUrl: it.imageUrl || it.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        quantity: it.quantity || 1,
        retailPrice: it.retailPrice || (typeof it.price === 'number' ? it.price : it.unit_price || 0),
      }))
    : undefined;

  return <CartTemplate cart={items} />;
}
