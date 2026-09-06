import 'server-only';
import { unstable_cache } from 'next/cache';
import { sdk } from '../sdk';
import { COLLECTIONS_CACHE_TAG } from '../constants';
import { MOCK_BRANDS } from '../../data/presets';

async function fetchRawCollections() {
  try {
    const { collections } = await sdk.collections.list();
    return collections || [];
  } catch (e) {
    console.warn('[lib/data] sdk.collections.list failed:', e);
    return [];
  }
}

const getCachedCollections = unstable_cache(
  fetchRawCollections,
  ['medusa-all-collections'],
  { tags: [COLLECTIONS_CACHE_TAG], revalidate: 3600 }
);

export async function listCollections() {
  return await getCachedCollections();
}

export async function listBrands() {
  try {
    const collections = await getCachedCollections();
    if (collections && collections.length > 0) return collections;
  } catch {
    // ignore
  }
  return MOCK_BRANDS;
}

export const collectionsCacheTag = COLLECTIONS_CACHE_TAG;
