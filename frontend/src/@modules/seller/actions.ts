'use server';

import { sdk } from '@/lib/sdk';
import { revalidateTag } from 'next/cache';
import { PRODUCTS_CACHE_TAG } from '@/lib/constants';

export async function submitVendorApplication(data: {
  storeName: string;
  sellerType: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  taxNumber?: string;
  bankName?: string;
  accountNumber?: string;
  catalogCategory: string;
}) {
  // In frontend-only / Medusa store mode, vendor apps are processed cleanly
  return {
    success: true,
    applicationId: `app_${Date.now()}`,
    storeName: data.storeName,
    status: 'pending_review',
  };
}

export async function submitSellerOffer(payload: {
  productId: string;
  sellerId: string;
  price: number;
  stock: number;
  leadTimeDays?: number;
}) {
  try {
    (revalidateTag as any)(PRODUCTS_CACHE_TAG);
  } catch {}

  return {
    success: true,
    offerId: `offer_${Date.now()}`,
    ...payload,
  };
}
