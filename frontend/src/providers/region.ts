'use client';

import { useEffect, useState, useCallback } from 'react';
import { sdk } from '../lib/sdk';
import { DEFAULT_REGION_ID } from '../lib/constants';
import type { StoreRegion } from '../types';

export type MedusaRegion = StoreRegion;

const REGION_STORAGE_KEY = 'mrbulk_selected_region';

export interface UseRegionReturn {
  region: StoreRegion | null;
  regionId: string;
  setRegionId: (id: string) => void;
  regions: StoreRegion[];
  refresh: () => Promise<void>;
}

const DEFAULT_REGIONS: StoreRegion[] = [
  {
    id: DEFAULT_REGION_ID,
    name: 'South Africa',
    currency_code: 'zar',
    tax_rate: 15,
    countries: [{ id: 'za', iso_2: 'za', iso_3: 'zaf', name: 'South Africa', display_name: 'South Africa' }]
  },
  {
    id: 'reg_global',
    name: 'International (USD)',
    currency_code: 'usd',
    tax_rate: 0
  }
];

let cachedRegions: StoreRegion[] | null = null;
let inFlightFetch: Promise<StoreRegion[]> | null = null;

export function useRegion(): UseRegionReturn {
  const [regions, setRegions] = useState<StoreRegion[]>(cachedRegions || DEFAULT_REGIONS);
  const [regionId, setRegionIdState] = useState<string>(DEFAULT_REGION_ID);

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined'
        ? (localStorage.getItem(REGION_STORAGE_KEY) || localStorage.getItem('medusa_selected_region'))
        : null;
      if (saved) setRegionIdState(saved);
    } catch {
      // ignore
    }
  }, []);

  const refresh = useCallback(async () => {
    if (inFlightFetch) {
      const result = await inFlightFetch;
      setRegions(result);
      return;
    }

    inFlightFetch = (async () => {
      try {
        const res = await sdk.regions.list();
        const list = (res.regions && res.regions.length > 0) ? res.regions : DEFAULT_REGIONS;
        cachedRegions = list;
        return list;
      } catch {
        cachedRegions = DEFAULT_REGIONS;
        return DEFAULT_REGIONS;
      } finally {
        inFlightFetch = null;
      }
    })();

    const result = await inFlightFetch;
    setRegions(result);
  }, []);

  useEffect(() => {
    if (!cachedRegions) {
      void refresh();
    }
  }, [refresh]);

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
