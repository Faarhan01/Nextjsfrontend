'use client';

import { useCartContext } from './cart-provider';
import type { CartItem, VendorOffer } from '../types';

export interface UseCartReturn {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  adjustQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (next: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
}

export function useCart(): UseCartReturn {
  const ctx = useCartContext();
  return {
    cart: ctx.cart,
    cartCount: ctx.cartCount,
    cartSubtotal: ctx.cartSubtotal,
    addToCart: ctx.addToCart,
    adjustQuantity: ctx.adjustQuantity,
    removeFromCart: ctx.removeFromCart,
    clearCart: ctx.clearCart,
    setCart: ctx.setCart
  };
}

export { CartProvider, useCartContext } from './cart-provider';