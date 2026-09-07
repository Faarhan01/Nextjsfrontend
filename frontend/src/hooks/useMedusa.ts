'use client';

import { useState, useEffect, useCallback } from 'react';
import { sdk } from '@/lib/sdk';
import type { MedusaCart, MedusaProduct } from '@/types/medusa';

export interface UseMedusaReturn {
  cart: MedusaCart | null;
  products: MedusaProduct[];
  loading: boolean;
  isLiveBackend: boolean;
  backendUrl: string;
  addToCart: (variantId: string, quantity?: number) => Promise<MedusaCart | null>;
  updateLineItem: (lineId: string, quantity: number) => Promise<MedusaCart | null>;
  removeLineItem: (lineId: string) => Promise<MedusaCart | null>;
  refreshCart: () => Promise<void>;
  client: typeof sdk;
}

export function useMedusa(): UseMedusaReturn {
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const backendUrl = sdk.getBaseUrl();

  const refreshCart = useCallback(async () => {
    try {
      const res = await sdk.carts.retrieve();
      if (res?.cart) {
        setCart(res.cart);
      }
    } catch (e) {
      console.warn('[useMedusa] Failed to retrieve cart:', e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const isOnline = await sdk.checkHealth();
        if (mounted) setIsLiveBackend(isOnline);

        const [cartRes, productsRes] = await Promise.all([
          sdk.carts.retrieve(),
          sdk.products.list({ limit: 50 }),
        ]);

        if (mounted) {
          if (cartRes?.cart) setCart(cartRes.cart);
          if (productsRes?.products) setProducts(productsRes.products);
        }
      } catch (err) {
        console.warn('[useMedusa] Init failed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1): Promise<MedusaCart | null> => {
      try {
        const res = await sdk.carts.lineItems.create(cart?.id, {
          variant_id: variantId,
          quantity,
        });
        if (res?.cart) {
          setCart(res.cart);
          return res.cart;
        }
      } catch (err) {
        console.error('[useMedusa] addToCart error:', err);
      }
      return null;
    },
    [cart?.id]
  );

  const updateLineItem = useCallback(
    async (lineId: string, quantity: number): Promise<MedusaCart | null> => {
      if (!cart?.id) return null;
      try {
        const res = await sdk.carts.lineItems.update(cart.id, lineId, { quantity });
        if (res?.cart) {
          setCart(res.cart);
          return res.cart;
        }
      } catch (err) {
        console.error('[useMedusa] updateLineItem error:', err);
      }
      return null;
    },
    [cart?.id]
  );

  const removeLineItem = useCallback(
    async (lineId: string): Promise<MedusaCart | null> => {
      if (!cart?.id) return null;
      try {
        const res = await sdk.carts.lineItems.delete(cart.id, lineId);
        if (res?.cart) {
          setCart(res.cart);
          return res.cart;
        }
      } catch (err) {
        console.error('[useMedusa] removeLineItem error:', err);
      }
      return null;
    },
    [cart?.id]
  );

  return {
    cart,
    products,
    loading,
    isLiveBackend,
    backendUrl,
    addToCart,
    updateLineItem,
    removeLineItem,
    refreshCart,
    client: sdk,
  };
}
