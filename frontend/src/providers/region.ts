'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '../lib/sdk';
import { DEFAULT_REGION_ID } from '../lib/constants';
import type { MedusaRegion } from '../types/medusa';

const REGION_STORAGE_KEY = 'medusa_selected_region';

export interface UseRegionReturn {
  region: MedusaRegion | null;
  regionId: string;
  setRegionId: (id: string) => void;
  regions: MedusaRegion[];
  refresh: () => Promise<void>;
}

let cachedRegions: MedusaRegion[] | null = null;

export function useRegion(): UseRegionReturn {
  const [regions, setRegions] = useState<MedusaRegion[]>(cachedRegions || []);
  const [regionId, setRegionIdState] = useState<string>(DEFAULT_REGION_ID);

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(REGION_STORAGE_KEY) : null;
      if (saved) setRegionIdState(saved);
    } catch {
      // ignore
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await sdk.regions.list();
      const list = res.regions || [];
      cachedRegions = list;
      setRegions(list);
    } catch (e) {
      console.warn('[useRegion] sdk.regions.list failed, using defaults:', e);
    }
  }, []);

  useEffect(() => {
    if (regions.length === 0) {
      void refresh();
    }
  }, [refresh, regions.length]);

  const setRegionId = useCallback((id: string) => {
    setRegionIdState(id);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(REGION_STORAGE_KEY, id);
      }
    } catch {
      // ignore
    }
  }, []);

  const region = regions.find((r) => r.id === regionId) || regions[0] || null;

  return { region, regionId, setRegionId, regions, refresh };
}