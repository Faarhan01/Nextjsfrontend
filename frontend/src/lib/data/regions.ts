import 'server-only';
import { sdk } from '../sdk';
import { REGIONS_CACHE_TAG } from '../constants';
import { MedusaRegion } from '../../types/medusa';

export async function listRegions(): Promise<MedusaRegion[]> {
  try {
    const { regions } = await sdk.regions.list();
    return regions || [];
  } catch (e) {
    console.warn('[lib/data] sdk.regions.list failed, using defaults:', e);
    return [
      {
        id: 'reg_za',
        name: 'South Africa',
        currency_code: 'zar',
        tax_rate: 15,
        countries: [
          { id: 'za', iso_2: 'za', iso_3: 'zaf', name: 'South Africa', display_name: 'South Africa' }
        ]
      } as MedusaRegion,
      {
        id: 'reg_global',
        name: 'International (USD)',
        currency_code: 'usd',
        tax_rate: 0
      } as MedusaRegion
    ];
  }
}

export async function getRegion(id: string): Promise<MedusaRegion | null> {
  const regions = await listRegions();
  return regions.find((r) => r.id === id) || null;
}

export const regionsCacheTag = REGIONS_CACHE_TAG;