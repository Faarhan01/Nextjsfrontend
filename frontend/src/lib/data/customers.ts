import 'server-only';
import { sdk } from '../sdk';
import { MedusaCustomer, MedusaOrder } from '../../types/medusa';

export async function getCurrentCustomer(token?: string): Promise<MedusaCustomer | null> {
  try {
    const { customer } = await sdk.customers.retrieve();
    return customer;
  } catch (e) {
    console.warn('[lib/data] sdk.customers.retrieve failed:', e);
    return null;
  }
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<{ customer: MedusaCustomer; token?: string } | null> {
  try {
    const res = await sdk.customers.login({ email, password });
    return res;
  } catch (e) {
    console.warn('[lib/data] sdk.customers.login failed:', e);
    return null;
  }
}

export async function registerCustomer(
  data: { name: string; email: string; password: string }
): Promise<{ customer: MedusaCustomer; token?: string } | null> {
  try {
    return await sdk.customers.register(data);
  } catch (e) {
    console.warn('[lib/data] sdk.customers.register failed:', e);
    return null;
  }
}

export async function trackOrder(orderId: string): Promise<MedusaOrder | null> {
  try {
    const res = await sdk.orders.track(orderId);
    return (res?.order as MedusaOrder) ?? null;
  } catch (e) {
    console.warn('[lib/data] sdk.orders.track failed:', e);
    return null;
  }
}