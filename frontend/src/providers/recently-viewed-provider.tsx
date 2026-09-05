'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackViewItem } from '../utils/gtm';

interface RecentlyViewedContextValue {
  recentlyViewedIds: string[];
  trackProductView: (
    productId: string,
    product?: { id: string; name: string; imageUrl?: string; category?: string; brand?: string }
  ) => void;
  setRecentlyViewedIds: (ids: string[]) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrbulk_recently_viewed') || localStorage.getItem('luxestore_recently_viewed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setRecentlyViewedIds(parsed);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('mrbulk_recently_viewed', JSON.stringify(recentlyViewedIds));
    } catch {}
  }, [recentlyViewedIds, hydrated]);

  const trackProductView: RecentlyViewedContextValue['trackProductView'] = (productId, product) => {
    if (!productId) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });

    if (product) {
      trackViewItem(
        {
          id: product.id,
          name: product.name,
          price: 0,
          category: product.category,
          brand: product.brand
        },
        'ZAR'
      );
    }
  };

  return (
    <RecentlyViewedContext.Provider
      value={{ recentlyViewedIds, trackProductView, setRecentlyViewedIds }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewedContext(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error('useRecentlyViewedContext must be used within RecentlyViewedProvider');
  return ctx;
}