'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, VendorOffer, UserProfile } from '../types';
import { trackAddToCart } from '../utils/gtm';
import { parsePriceNumber } from '../utils/pricing';
import { useToastContext } from './toast-provider';

interface CartContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  adjustQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  loadForUser: (user: UserProfile | null) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadUserCart(user: UserProfile | null): CartItem[] {
  if (typeof window === 'undefined') return [];
  const key = user ? `mrbulk_cart_${user.id}` : 'mrbulk_cart_guest';
  const fallbackKey = user ? `luxestore_cart_${user.id}` : 'luxestore_cart_guest';
  try {
    const saved = localStorage.getItem(key) || localStorage.getItem(fallbackKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const toast = useToastContext();

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedUserRaw = localStorage.getItem('mrbulk_user') || localStorage.getItem('luxestore_user');
      let user: UserProfile | null = null;
      if (savedUserRaw && savedUserRaw !== 'null' && savedUserRaw !== 'none') {
        const parsed = JSON.parse(savedUserRaw);
        if (parsed && typeof parsed === 'object') {
          user = parsed;
          setUserId(user.id);
        }
      }
      setCart(loadUserCart(user));
      setHydrated(true);
    } catch {
      setHydrated(true);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (userId) {
        localStorage.setItem(`mrbulk_cart_${userId}`, JSON.stringify(cart));
      } else {
        localStorage.setItem('mrbulk_cart_guest', JSON.stringify(cart));
      }
    } catch {}
  }, [cart, userId, hydrated]);

  const addToCart = useCallback(
    (product: any, qty: number = 1, selectedOffer?: VendorOffer) => {
      const p = selectedOffer
        ? selectedOffer.price
        : typeof product.price === 'number'
        ? product.price
        : parsePriceNumber(String(product.price));
      const targetSellerId = selectedOffer?.sellerId || product.primarySellerId || '849201';
      const targetSellerName = selectedOffer?.sellerName || product.primarySellerName || 'Verified Merchant';
      const cartItemId = selectedOffer ? `${product.id}__offer_${selectedOffer.offerId}` : product.id;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        if (existingIndex >= 0) {
          return prev.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + qty } : item
          );
        }
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            name: product.name,
            price: p,
            imageUrl: product.imageUrl,
            quantity: qty,
            retailPrice: p,
            wholesalePrice: product.wholesalePrice
              ? parsePriceNumber(String(product.wholesalePrice))
              : undefined,
            minWholesaleQuantity: product.minWholesaleQuantity,
            selectedOfferId: selectedOffer?.offerId,
            sellerId: targetSellerId,
            sellerName: targetSellerName,
            sellerPrice: p,
            condition: selectedOffer?.condition || 'Brand New'
          }
        ];
      });

      trackAddToCart({ id: product.id, name: product.name, price: p }, qty, 'ZAR');
      toast.showToast(`Added ${product.name} to cart!`, 'success');
    },
    [toast]
  );

  const adjustQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  const removeFromCart = useCallback(
    (id: string) => {
      const item = cart.find((c) => c.id === id);
      setCart((prev) => prev.filter((i) => i.id !== id));
      if (item) {
        toast.showToast(`Removed ${item.name} from cart`, 'info');
      }
    },
    [cart, toast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    toast.showToast('Cart cleared', 'info');
  }, [toast]);

  const loadForUser = useCallback((user: UserProfile | null) => {
    setUserId(user?.id || null);
    setCart(loadUserCart(user));
  }, []);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        addToCart,
        adjustQuantity,
        removeFromCart,
        clearCart,
        setCart,
        loadForUser
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}