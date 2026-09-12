'use client';

import { useState, useEffect, useCallback } from 'react';
import { sdk } from '@/lib/sdk';
import { useCartContext } from '@/providers/cart-provider';
import { useRegion } from '@/providers/region';
import type { CartItem, VendorOffer } from '@/types';
import type { MedusaRegion } from '@/types/medusa';

export interface UseMedusaReturn {
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: any, qty?: number, selectedOffer?: VendorOffer) => void;
  adjustQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Connection & Environment
  isLiveBackend: boolean;
  backendUrl: string;
  isCheckingHealth: boolean;
  checkHealth: () => Promise<boolean>;

  // Regions & Localization
  regions: MedusaRegion[];
  region: MedusaRegion | null;
  regionId: string;
  setRegionId: (id: string) => void;

  // SDK References
  client: typeof sdk;
  sdk: typeof sdk;
}

/**
 * Primary React hook for MedusaJS integration.
 * Provides access to the Medusa cart, connection state, localization regions,
 * and direct access to the typed Medusa client SDK.
 */
export function useMedusa(): UseMedusaReturn {
  const cartCtx = useCartContext();
  const regionCtx = useRegion();

  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setIsCheckingHealth(true);
    try {
      const live = await sdk.checkHealth();
      setIsLiveBackend(live);
      return live;
    } catch {
      setIsLiveBackend(false);
      return false;
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  return {
    cart: cartCtx.cart,
    cartCount: cartCtx.cartCount,
    cartSubtotal: cartCtx.cartSubtotal,
    addToCart: cartCtx.addToCart,
    adjustQuantity: cartCtx.adjustQuantity,
    removeFromCart: cartCtx.removeFromCart,
    clearCart: cartCtx.clearCart,

    isLiveBackend,
    backendUrl: sdk.getBaseUrl(),
    isCheckingHealth,
    checkHealth,

    regions: regionCtx.regions,
    region: regionCtx.region,
    regionId: regionCtx.regionId,
    setRegionId: regionCtx.setRegionId,

    client: sdk,
    sdk
  };
}

export default useMedusa;
