import { StoreRegion, MockProduct, CartItem, UserProfile } from './index';

export type MedusaRegion = StoreRegion;
export type MedusaProduct = any;
export type MedusaProductVariant = any;
export type MedusaProductCategory = any;
export type MedusaProductCollection = any;
export type MedusaLineItem = any;
export type MedusaCart = any;
export type MedusaCustomer = Partial<UserProfile> & {
  first_name?: string;
  last_name?: string;
  metadata?: Record<string, any>;
};
export type MedusaOrder = any;
export type MedusaMoneyAmount = any;
export type MedusaShippingOption = any;
