import 'server-only';
import { sdk } from '../sdk';
import { COLLECTIONS_CACHE_TAG } from '../constants';
import { MOCK_BRANDS } from '../../data/presets';

export async function listCollections() {
  try {
    const { collections } = await sdk.collections.list();
    return collections || [];
  } catch (e) {
    console.warn('[lib/data] sdk.collections.list failed:', e);
    return [];
  }
}

export async function listBrands() {
  try {
    const { collections } = await sdk.collections.list();
    if (collections && collections.length > 0) return collections;
  } catch {
    // ignore
  }
  return MOCK_BRANDS;
}

export const collectionsCacheTag = COLLECTIONS_CACHE_TAG;