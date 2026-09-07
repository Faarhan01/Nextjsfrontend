'use server';

import { sdk } from '@/lib/sdk';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { CART_CACHE_TAG, CART_STORAGE_KEY } from '@/lib/constants';

export async function addToCart({
  cartId,
  variantId,
  quantity = 1,
}: {
  cartId?: string;
  variantId: string;
  quantity?: number;
}) {
  let activeCartId = cartId;
  if (!activeCartId) {
    try {
      const cookieStore = await cookies();
      activeCartId = cookieStore.get(CART_STORAGE_KEY)?.value;
    } catch {}
  }

  if (!activeCartId) {
    const { cart } = await sdk.carts.create();
    activeCartId = cart.id;
  }

  const { cart } = await sdk.carts.lineItems.create(activeCartId, {
    variant_id: variantId,
    quantity,
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(CART_STORAGE_KEY, activeCartId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
  } catch {}

  try {
    (revalidateTag as any)(CART_CACHE_TAG);
  } catch {}

  return cart;
}

export async function updateLineItem({
  cartId,
  lineId,
  quantity,
}: {
  cartId: string;
  lineId: string;
  quantity: number;
}) {
  const { cart } = await sdk.carts.lineItems.update(cartId, lineId, {
    quantity,
  });

  try {
    (revalidateTag as any)(CART_CACHE_TAG);
  } catch {}

  return cart;
}

export async function removeLineItem({
  cartId,
  lineId,
}: {
  cartId: string;
  lineId: string;
}) {
  const { cart } = await sdk.carts.lineItems.delete(cartId, lineId);

  try {
    (revalidateTag as any)(CART_CACHE_TAG);
  } catch {}

  return cart;
}
