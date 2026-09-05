'use client';

import { useStore } from '../context/StoreContext';
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
  const store = useStore();
  return {
    cart: store.cart,
    cartCount: store.cartCount,
    cartSubtotal: store.cartSubtotal,
    addToCart: store.handleAddToCart,
    adjustQuantity: store.handleAdjustQuantity,
    removeFromCart: store.handleRemoveFromCart,
    clearCart: store.handleClearCart,
    setCart: store.setCart
  };
}