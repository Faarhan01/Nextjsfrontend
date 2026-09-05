'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CartItem, VendorOffer } from '../../types';

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
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  const handleAddToCart = useCallback((product: any, qty: number = 1, selectedOffer?: VendorOffer) => {
    const p = selectedOffer ? selectedOffer.price : (typeof product.price === 'number' ? product.price : 0);
    const cartItemId = selectedOffer ? `${product.id}__offer_${selectedOffer.offerId}` : (product.id || `cart-${Date.now()}`);

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: p,
          imageUrl: product.imageUrl || '',
          quantity: qty,
          retailPrice: p,
          wholesalePrice: product.wholesalePrice,
          minWholesaleQuantity: product.minWholesaleQuantity,
          selectedOfferId: selectedOffer?.offerId,
          sellerId: selectedOffer?.sellerId,
          sellerName: selectedOffer?.sellerName,
          sellerPrice: p,
          condition: selectedOffer?.condition,
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
