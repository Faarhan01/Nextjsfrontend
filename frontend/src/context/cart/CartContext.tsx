'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, VendorOffer } from '../types';

export interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartCount: number;
  cartSubtotal: number;
  handleAddToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  onAddToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  handleAdjustQuantity: (id: string, delta: number) => void;
  onAdjustQuantity: (id: string, delta: number) => void;
  handleRemoveFromCart: (id: string) => void;
  onRemoveFromCart: (id: string) => void;
  handleClearCart: () => void;
  onClearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const handleAddToCart = useCallback((product: any, qty: number = 1, selectedOffer?: VendorOffer) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          productId: product.id,
          name: product.name,
          image: product.imageUrl,
          unitPrice: selectedOffer?.price || product.price || 0,
          quantity: qty,
          offerId: selectedOffer?.id,
        },
      ];
    });
  }, []);

  const onAddToCart = handleAddToCart;

  const handleAdjustQuantity = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const onAdjustQuantity = handleAdjustQuantity;

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const onRemoveFromCart = handleRemoveFromCart;

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const onClearCart = handleClearCart;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartCount,
        cartSubtotal,
        handleAddToCart,
        onAddToCart,
        handleAdjustQuantity,
        onAdjustQuantity,
        handleRemoveFromCart,
        onRemoveFromCart,
        handleClearCart,
        onClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
