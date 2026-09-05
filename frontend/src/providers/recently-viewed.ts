'use client';

import { useRecentlyViewedContext } from './recently-viewed-provider';

export function useRecentlyViewed() {
  const ctx = useRecentlyViewedContext();
  return {
    recentlyViewedIds: ctx.recentlyViewedIds,
    trackProductView: ctx.trackProductView,
    setRecentlyViewedIds: ctx.setRecentlyViewedIds
  };
}

export { RecentlyViewedProvider, useRecentlyViewedContext } from './recently-viewed-provider';