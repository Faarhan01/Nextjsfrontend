'use server';

import { sdk } from '@/lib/sdk';

export async function getProductByHandle(handle: string) {
  return await sdk.products.retrieve(handle);
}
