'use server';

import { sdk } from '@/lib/sdk';

export async function askConcierge(payload: {
  query: string;
  catalogProducts?: any[];
  cartItems?: any[];
  history?: any[];
}) {
  return await sdk.ai.concierge(payload);
}
