/**
 * MedusaJS Storefront Type Definitions
 * Compatible with Medusa v2 and Medusa v1 Store APIs
 */

export interface MedusaMoneyAmount {
  id?: string;
  currency_code: string;
  amount: number;
  min_quantity?: number;
  max_quantity?: number;
  price_list_id?: string | null;
}

export interface MedusaProductOptionValue {
  id: string;
  value: string;
  option_id: string;
  metadata?: Record<string, unknown> | null;
}

export interface MedusaProductOption {
  id: string;
  title: string;
  product_id: string;
  values: MedusaProductOptionValue[];
  metadata?: Record<string, unknown> | null;
}

export interface MedusaProductImage {
  id: string;
  url: string;
  metadata?: Record<string, unknown> | null;
}

export interface MedusaProductTag {
  id: string;
  value: string;
}

export interface MedusaProductCollection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
  is_active?: boolean;
  is_internal?: boolean;
  parent_category_id?: string | null;
  category_children?: MedusaProductCategory[];
  metadata?: Record<string, unknown> | null;
}

export interface MedusaProductVariant {
  id: string;
  title: string;
  product_id?: string;
  sku?: string;
  barcode?: string;
  ean?: string;
  upc?: string;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  prices: MedusaMoneyAmount[];
  options: MedusaProductOptionValue[];
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaProduct {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  handle: string;
  is_giftcard?: boolean;
  status: 'draft' | 'proposed' | 'published' | 'rejected';
  thumbnail?: string | null;
  images: MedusaProductImage[];
  options: MedusaProductOption[];
  variants: MedusaProductVariant[];
  categories?: MedusaProductCategory[];
  collection_id?: string | null;
  collection?: MedusaProductCollection | null;
  tags?: MedusaProductTag[];
  type?: { id: string; value: string } | null;
  discountable?: boolean;
  external_id?: string | null;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code?: string | null;
  countries?: { id: string; iso_2: string; iso_3: string; name: string; display_name: string }[];
  payment_providers?: { id: string; is_installed: boolean }[];
  fulfillment_providers?: { id: string; is_installed: boolean }[];
  metadata?: Record<string, unknown> | null;
}

export interface MedusaAddress {
  id?: string;
  customer_id?: string;
  company?: string | null;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  country_code: string;
  province?: string | null;
  postal_code: string;
  phone?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface MedusaLineItem {
  id: string;
  cart_id?: string;
  order_id?: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  is_giftcard?: boolean;
  should_merge?: boolean;
  allow_discounts?: boolean;
  has_shipping?: boolean;
  unit_price: number;
  quantity: number;
  variant_id?: string | null;
  variant?: MedusaProductVariant | null;
  subtotal?: number;
  discount_total?: number;
  total?: number;
  original_total?: number;
  original_tax_total?: number;
  tax_total?: number;
  metadata?: Record<string, unknown> | null;
}

export interface MedusaShippingOption {
  id: string;
  name: string;
  region_id: string;
  profile_id: string;
  amount: number;
  is_return?: boolean;
  price_type?: 'flat_rate' | 'calculated';
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown> | null;
}

export interface MedusaShippingMethod {
  id: string;
  shipping_option_id: string;
  order_id?: string;
  claim_order_id?: string;
  cart_id?: string;
  swap_id?: string;
  return_id?: string;
  price: number;
  data?: Record<string, unknown>;
  shipping_option?: MedusaShippingOption;
}

export interface MedusaPaymentSession {
  id: string;
  cart_id: string;
  provider_id: string;
  is_selected?: boolean;
  is_initiated?: boolean;
  status: 'authorized' | 'pending' | 'requires_more' | 'error' | 'canceled';
  data: Record<string, unknown>;
  amount?: number;
}

export interface MedusaCart {
  id: string;
  email?: string | null;
  billing_address_id?: string | null;
  billing_address?: MedusaAddress | null;
  shipping_address_id?: string | null;
  shipping_address?: MedusaAddress | null;
  items: MedusaLineItem[];
  region_id: string;
  region?: MedusaRegion | null;
  discounts?: { id: string; code: string; is_dynamic: boolean; rule: any }[];
  gift_cards?: { id: string; code: string; value: number; balance: number }[];
  customer_id?: string | null;
  payment_session?: MedusaPaymentSession | null;
  payment_sessions?: MedusaPaymentSession[];
  shipping_methods: MedusaShippingMethod[];
  type?: 'default' | 'swap' | 'draft_order' | 'payment_link' | 'claim';
  completed_at?: string | null;
  payment_authorized_at?: string | null;
  idempotency_key?: string | null;
  context?: Record<string, unknown>;
  metadata?: Record<string, unknown> | null;
  subtotal: number;
  discount_total: number;
  item_tax_total?: number;
  shipping_total: number;
  shipping_tax_total?: number;
  tax_total: number;
  refunded_total?: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  billing_address_id?: string | null;
  billing_address?: MedusaAddress | null;
  shipping_addresses?: MedusaAddress[];
  phone?: string | null;
  has_account?: boolean;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedusaOrder {
  id: string;
  status: 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action';
  fulfillment_status: 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'partially_shipped' | 'shipped' | 'partially_returned' | 'returned' | 'canceled' | 'requires_action';
  payment_status: 'not_paid' | 'awaiting' | 'captured' | 'partially_refunded' | 'refunded' | 'canceled' | 'requires_action';
  display_id: number;
  cart_id?: string | null;
  customer_id: string;
  customer?: MedusaCustomer;
  email: string;
  billing_address: MedusaAddress;
  shipping_address: MedusaAddress;
  region_id: string;
  region?: MedusaRegion;
  currency_code: string;
  tax_rate?: number;
  discounts?: any[];
  gift_cards?: any[];
  shipping_methods: MedusaShippingMethod[];
  items: MedusaLineItem[];
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  paid_total?: number;
  refundable_amount?: number;
  no_notification?: boolean;
  idempotency_key?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface MedusaListResponse<T> {
  items?: T[];
  count: number;
  offset: number;
  limit: number;
  [key: string]: any;
}
