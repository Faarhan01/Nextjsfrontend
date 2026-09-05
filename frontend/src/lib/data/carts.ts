import 'server-only';
import { sdk } from '../sdk';
import { CART_CACHE_TAG } from '../constants';
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

export const cartCacheTag = CART_CACHE_TAG;