import 'server-only';
import { sdk } from '../sdk';

export async function askConcierge(payload: {
  query: string;
  catalogProducts?: any[];
  cartItems?: any[];
  history?: any[];
}): Promise<{ reply: string; recommendedProductIds?: string[]; followUpSuggestions?: string[] } | null> {
  try {
    const res = await sdk.ai.concierge(payload);
    if (res && res.success && res.data) return res.data;
    return null;
  } catch (e) {
    console.warn('[lib/data] sdk.ai.concierge failed:', e);
    return null;
  }
}
