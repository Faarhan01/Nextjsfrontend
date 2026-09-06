import 'server-only';
import { cookies } from 'next/headers';
import { sdk } from '../sdk';
import { CART_CACHE_TAG, CART_STORAGE_KEY } from '../constants';
import { MedusaCart } from '../../types/medusa';

export async function getCart(cartId: string): Promise<MedusaCart | null> {
  try {
    const { cart } = await sdk.carts.retrieve(cartId);
    return cart;
  } catch (e) {
    console.warn('[lib/data] sdk.carts.retrieve failed:', e);
    return null;
  }
}

export async function createCart(region_id?: string): Promise<MedusaCart | null> {
  try {
    const { cart } = await sdk.carts.create({ region_id });
    return cart;
  } catch (e) {
    console.warn('[lib/data] sdk.carts.create failed:', e);
    return null;
  }
}

export async function retrieveCart(): Promise<MedusaCart | null> {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_STORAGE_KEY)?.value;
    if (!cartId) return null;
    return await getCart(cartId);
  } catch (e) {
    console.warn('[lib/data] retrieveCart failed:', e);
    return null;
  }
}

export async function setCartCookie(cartId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(CART_STORAGE_KEY, cartId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      httpOnly: false,
    });
  } catch {}
}

export const cartCacheTag = CART_CACHE_TAG;
