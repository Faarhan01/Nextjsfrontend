'use server';

import { sdk } from '@/lib/sdk';
import { revalidateTag } from 'next/cache';
import { CART_CACHE_TAG } from '@/lib/constants';

export async function placeOrder({ cartId }: { cartId: string }) {
  const result = await sdk.carts.complete(cartId);
  try {
    (revalidateTag as any)(CART_CACHE_TAG);
  } catch {}
  return result;
}
