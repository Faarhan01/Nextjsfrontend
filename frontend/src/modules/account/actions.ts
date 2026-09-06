'use server';

import { sdk } from '@/lib/sdk';

export async function loginCustomer(credentials: { email: string; password?: string }) {
  return await sdk.customers.login({
    email: credentials.email,
    password: credentials.password || 'defaultpass'
  });
}

export async function registerCustomer(data: { name: string; email: string; password?: string }) {
  return await sdk.customers.register({
    name: data.name,
    email: data.email,
    password: data.password || 'defaultpass'
  });
}

export async function trackCustomerOrder(orderId: string) {
  return await sdk.orders.track(orderId);
}
