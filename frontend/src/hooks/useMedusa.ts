'use client';

import { useState, useEffect, useCallback } from 'react';
import { sdk as medusa, MedusaCart, MedusaProduct, MedusaRegion } from '../lib/sdk';

export interface UseMedusaReturn {
  backendUrl: string;
  isLiveBackend: boolean;
  checkingConnection: boolean;
  cart: MedusaCart | null;
  loadingCart: boolean;
  regions: MedusaRegion[];
  checkConnection: () => Promise<boolean>;
  addToCart: (variantId: string, quantity?: number) => Promise<MedusaCart | null>;
  updateCartItem: (lineId: string, quantity: number) => Promise<MedusaCart | null>;
  removeCartItem: (lineId: string) => Promise<MedusaCart | null>;
  refreshCart: () => Promise<MedusaCart | null>;
  listProducts: (params?: { limit?: number; offset?: number; q?: string }) => Promise<{ products: MedusaProduct[]; count: number }>;
  retrieveProduct: (idOrHandle: string) => Promise<MedusaProduct | null>;
}

export function useMedusa(): UseMedusaReturn {
  const backendUrl = medusa.getBaseUrl();
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(true);
  const [cart, setCart] = useState<MedusaCart | null>(null);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const [regions, setRegions] = useState<MedusaRegion[]>([]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setCheckingConnection(true);
    try {
      const isOnline = await medusa.checkHealth();
      setIsLiveBackend(isOnline);
      return isOnline;
    } catch {
      setIsLiveBackend(false);
      return false;
    } finally {
      setCheckingConnection(false);
    }
  }, []);

  const refreshCart = useCallback(async (): Promise<MedusaCart | null> => {
    setLoadingCart(true);
    try {
      const res = await medusa.carts.retrieve();
      setCart(res.cart);
      return res.cart;
    } catch (e) {
      console.warn('[useMedusa] Failed to retrieve cart:', e);
      return null;
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const live = await medusa.checkHealth();
      if (!isMounted) return;
      setIsLiveBackend(live);
      setCheckingConnection(false);

      // Load initial regions
      try {
        const regRes = await medusa.regions.list();
        if (isMounted) setRegions(regRes.regions || []);
      } catch {
        // ignore
      }

      // Load or create cart
      await refreshCart();
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [refreshCart]);

  const addToCart = useCallback(async (variantId: string, quantity: number = 1): Promise<MedusaCart | null> => {
    setLoadingCart(true);
    try {
      const currentCart = cart || (await refreshCart());
      if (!currentCart) return null;

      const res = await medusa.carts.lineItems.create(currentCart.id, {
        variant_id: variantId,
        quantity
      });
      setCart(res.cart);
      return res.cart;
    } catch (e) {
      console.error('[useMedusa] Error adding to cart:', e);
      return null;
    } finally {
      setLoadingCart(false);
    }
  }, [cart, refreshCart]);

  const updateCartItem = useCallback(async (lineId: string, quantity: number): Promise<MedusaCart | null> => {
    if (!cart) return null;
    setLoadingCart(true);
    try {
      const res = await medusa.carts.lineItems.update(cart.id, lineId, { quantity });
      setCart(res.cart);
      return res.cart;
    } catch (e) {
      console.error('[useMedusa] Error updating cart item:', e);
      return null;
    } finally {
      setLoadingCart(false);
    }
  }, [cart]);

  const removeCartItem = useCallback(async (lineId: string): Promise<MedusaCart | null> => {
    if (!cart) return null;
    setLoadingCart(true);
    try {
      const res = await medusa.carts.lineItems.delete(cart.id, lineId);
      setCart(res.cart);
      return res.cart;
    } catch (e) {
      console.error('[useMedusa] Error removing cart item:', e);
      return null;
    } finally {
      setLoadingCart(false);
    }
  }, [cart]);

  const listProducts = useCallback(async (params?: { limit?: number; offset?: number; q?: string }) => {
    return await medusa.products.list(params);
  }, []);

  const retrieveProduct = useCallback(async (idOrHandle: string): Promise<MedusaProduct | null> => {
    try {
      const res = await medusa.products.retrieve(idOrHandle);
      return res.product;
    } catch {
      return null;
    }
  }, []);

  return {
    backendUrl,
    isLiveBackend,
    checkingConnection,
    cart,
    loadingCart,
    regions,
    checkConnection,
    addToCart,
    updateCartItem,
    removeCartItem,
    refreshCart,
    listProducts,
    retrieveProduct
  };
}
