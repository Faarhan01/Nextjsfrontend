import {
  MedusaProduct,
  MedusaCart,
  MedusaLineItem,
  MedusaRegion,
  MedusaProductCategory,
  MedusaProductCollection,
  MedusaCustomer,
  MedusaOrder
} from './types';
import { MOCK_WOO_PRODUCTS, MOCK_CATEGORIES } from '../../data/presets';
import { uiProductToMedusaProduct } from './transformers';

export interface MedusaClientConfig {
  baseUrl?: string;
  publishableApiKey?: string;
  defaultCurrency?: string;
}

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const CART_STORAGE_KEY = 'medusa_cart_id';
const LOCAL_CART_CACHE_KEY = 'medusa_local_cart_state';

export class MedusaClient {
  private baseUrl: string;
  private publishableApiKey?: string;
  private isOnline: boolean | null = null;
  private lastHealthCheck: number = 0;

  constructor(config?: MedusaClientConfig) {
    this.baseUrl = (config?.baseUrl || DEFAULT_BACKEND_URL).replace(/\/$/, '');
    this.publishableApiKey = config?.publishableApiKey;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
    this.isOnline = null;
  }

  /**
   * Ping backend to check if Medusa Store API is responding.
   */
  public async checkHealth(): Promise<boolean> {
    const now = Date.now();
    // Cache health check for 10 seconds
    if (this.isOnline !== null && now - this.lastHealthCheck < 10000) {
      return this.isOnline;
    }

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        this.isOnline = false;
        return false;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.baseUrl}/store/products?limit=1`, {
        signal: controller.signal,
        headers: this.getHeaders()
      });
      clearTimeout(timeoutId);

      this.isOnline = res.ok;
      this.lastHealthCheck = now;
      return res.ok;
    } catch {
      this.isOnline = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.publishableApiKey) {
      headers['x-publishable-api-key'] = this.publishableApiKey;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers as Record<string, string> || {})
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Medusa API error (${response.status}): ${errorBody || response.statusText}`);
    }

    return response.json();
  }

  // ==========================================
  // Products API
  // ==========================================
  public products = {
    list: async (params?: { limit?: number; offset?: number; q?: string; category_id?: string[]; collection_id?: string[] }): Promise<{ products: MedusaProduct[]; count: number }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          const query = new URLSearchParams();
          if (params?.limit) query.set('limit', String(params.limit));
          if (params?.offset) query.set('offset', String(params.offset));
          if (params?.q) query.set('q', params.q);
          const endpoint = `/store/products${query.toString() ? `?${query.toString()}` : ''}`;
          return await this.request<{ products: MedusaProduct[]; count: number }>(endpoint);
        } catch (e) {
          console.warn('[MedusaClient] Failed to fetch live products, falling back to local catalog:', e);
        }
      }

      // Local Mock Catalog (Medusa format)
      let mockList = MOCK_WOO_PRODUCTS.map(uiProductToMedusaProduct);
      if (params?.q) {
        const q = params.q.toLowerCase();
        mockList = mockList.filter(p => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
      }
      return {
        products: mockList,
        count: mockList.length
      };
    },

    retrieve: async (idOrHandle: string): Promise<{ product: MedusaProduct }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          // If numeric or starts with prod_, try ID
          if (idOrHandle.startsWith('prod_')) {
            return await this.request<{ product: MedusaProduct }>(`/store/products/${idOrHandle}`);
          }
          const res = await this.request<{ products: MedusaProduct[] }>(`/store/products?handle=${encodeURIComponent(idOrHandle)}`);
          if (res.products && res.products.length > 0) {
            return { product: res.products[0] };
          }
        } catch (e) {
          console.warn('[MedusaClient] Error retrieving live product, falling back:', e);
        }
      }

      // Fallback from local presets
      const allMock = MOCK_WOO_PRODUCTS.map(uiProductToMedusaProduct);
      const found = allMock.find(p => p.id === idOrHandle || p.handle === idOrHandle) || allMock[0];
      return { product: found };
    }
  };

  // ==========================================
  // Categories & Collections API
  // ==========================================
  public categories = {
    list: async (): Promise<{ product_categories: MedusaProductCategory[] }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          return await this.request<{ product_categories: MedusaProductCategory[] }>('/store/product-categories');
        } catch (e) {
          console.warn('[MedusaClient] Categories live fetch failed, using presets:', e);
        }
      }

      const categories: MedusaProductCategory[] = MOCK_CATEGORIES.map(c => ({
        id: `cat_${c.id}`,
        name: c.name,
        handle: c.name.toLowerCase().replace(/\s+/g, '-'),
        description: c.description || '',
        is_active: true
      }));

      return { product_categories: categories };
    }
  };

  public collections = {
    list: async (): Promise<{ collections: MedusaProductCollection[] }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          return await this.request<{ collections: MedusaProductCollection[] }>('/store/collections');
        } catch (e) {
          console.warn('[MedusaClient] Collections live fetch failed, using presets:', e);
        }
      }

      return {
        collections: [
          { id: 'col_bestsellers', title: 'Bestsellers', handle: 'bestsellers' },
          { id: 'col_flash_deals', title: 'Flash Deals', handle: 'flash-deals' },
          { id: 'col_wholesale', title: 'Wholesale Bulk', handle: 'wholesale-bulk' }
        ]
      };
    }
  };

  // ==========================================
  // Regions API
  // ==========================================
  public regions = {
    list: async (): Promise<{ regions: MedusaRegion[] }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          return await this.request<{ regions: MedusaRegion[] }>('/store/regions');
        } catch (e) {
          console.warn('[MedusaClient] Regions live fetch failed:', e);
        }
      }

      return {
        regions: [
          {
            id: 'reg_za',
            name: 'South Africa',
            currency_code: 'zar',
            tax_rate: 15,
            countries: [{ id: 'za', iso_2: 'za', iso_3: 'zaf', name: 'South Africa', display_name: 'South Africa' }]
          },
          {
            id: 'reg_global',
            name: 'International (USD)',
            currency_code: 'usd',
            tax_rate: 0
          }
        ]
      };
    }
  };

  // ==========================================
  // Carts API
  // ==========================================
  public carts = {
    create: async (data?: { region_id?: string; country_code?: string }): Promise<{ cart: MedusaCart }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          const res = await this.request<{ cart: MedusaCart }>('/store/carts', {
            method: 'POST',
            body: JSON.stringify(data || {})
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, res.cart.id);
          }
          return res;
        } catch (e) {
          console.warn('[MedusaClient] Live cart creation failed, using local emulation:', e);
        }
      }

      // Local emulation
      const cartId = `cart_local_${Date.now()}`;
      const mockCart: MedusaCart = {
        id: cartId,
        region_id: data?.region_id || 'reg_za',
        items: [],
        shipping_methods: [],
        subtotal: 0,
        discount_total: 0,
        shipping_total: 0,
        tax_total: 0,
        total: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, cartId);
        localStorage.setItem(LOCAL_CART_CACHE_KEY, JSON.stringify(mockCart));
      }

      return { cart: mockCart };
    },

    retrieve: async (cartId?: string): Promise<{ cart: MedusaCart }> => {
      const effectiveId = cartId || (typeof window !== 'undefined' ? localStorage.getItem(CART_STORAGE_KEY) : null);
      if (!effectiveId) {
        return this.carts.create();
      }

      const isLive = await this.checkHealth();
      if (isLive && !effectiveId.startsWith('cart_local_')) {
        try {
          return await this.request<{ cart: MedusaCart }>(`/store/carts/${effectiveId}`);
        } catch (e) {
          console.warn('[MedusaClient] Live cart retrieve failed, using local fallback:', e);
        }
      }

      // Local fallback
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_CART_CACHE_KEY);
        if (cached) {
          try {
            return { cart: JSON.parse(cached) };
          } catch {
            // ignore JSON error
          }
        }
      }

      return this.carts.create();
    },

    lineItems: {
      create: async (cartId: string, item: { variant_id: string; quantity: number }): Promise<{ cart: MedusaCart }> => {
        const isLive = await this.checkHealth();
        if (isLive && !cartId.startsWith('cart_local_')) {
          try {
            return await this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items`, {
              method: 'POST',
              body: JSON.stringify(item)
            });
          } catch (e) {
            console.warn('[MedusaClient] Live line item create failed:', e);
          }
        }

        // Local emulation
        const { cart } = await this.carts.retrieve(cartId);
        const existingItem = cart.items.find(i => i.variant_id === item.variant_id);

        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
          existingItem.total = existingItem.subtotal;
        } else {
          // Find matching mock product
          const allProds = MOCK_WOO_PRODUCTS.map(uiProductToMedusaProduct);
          const product = allProds.find(p => p.variants.some(v => v.id === item.variant_id)) || allProds[0];
          const variant = product.variants.find(v => v.id === item.variant_id) || product.variants[0];
          const unitPrice = variant.prices[0]?.amount || 9900;

          const newLineItem: MedusaLineItem = {
            id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            cart_id: cart.id,
            title: product.title,
            thumbnail: product.thumbnail,
            variant_id: variant.id,
            variant,
            unit_price: unitPrice,
            quantity: item.quantity,
            subtotal: unitPrice * item.quantity,
            total: unitPrice * item.quantity
          };
          cart.items.push(newLineItem);
        }

        // Recalculate totals
        cart.subtotal = cart.items.reduce((sum, i) => sum + (i.total || (i.unit_price * i.quantity)), 0);
        cart.tax_total = Math.round(cart.subtotal * 0.15);
        cart.total = cart.subtotal + cart.shipping_total + cart.tax_total - cart.discount_total;
        cart.updated_at = new Date().toISOString();

        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_CART_CACHE_KEY, JSON.stringify(cart));
        }

        return { cart };
      },

      update: async (cartId: string, lineId: string, data: { quantity: number }): Promise<{ cart: MedusaCart }> => {
        const isLive = await this.checkHealth();
        if (isLive && !cartId.startsWith('cart_local_')) {
          try {
            return await this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
              method: 'POST',
              body: JSON.stringify(data)
            });
          } catch (e) {
            console.warn('[MedusaClient] Live line item update failed:', e);
          }
        }

        const { cart } = await this.carts.retrieve(cartId);
        const target = cart.items.find(i => i.id === lineId);
        if (target) {
          if (data.quantity <= 0) {
            cart.items = cart.items.filter(i => i.id !== lineId);
          } else {
            target.quantity = data.quantity;
            target.subtotal = target.quantity * target.unit_price;
            target.total = target.subtotal;
          }
        }

        cart.subtotal = cart.items.reduce((sum, i) => sum + (i.total || (i.unit_price * i.quantity)), 0);
        cart.tax_total = Math.round(cart.subtotal * 0.15);
        cart.total = cart.subtotal + cart.shipping_total + cart.tax_total - cart.discount_total;

        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_CART_CACHE_KEY, JSON.stringify(cart));
        }

        return { cart };
      },

      delete: async (cartId: string, lineId: string): Promise<{ cart: MedusaCart }> => {
        const isLive = await this.checkHealth();
        if (isLive && !cartId.startsWith('cart_local_')) {
          try {
            return await this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
              method: 'DELETE'
            });
          } catch (e) {
            console.warn('[MedusaClient] Live line item delete failed:', e);
          }
        }

        const { cart } = await this.carts.retrieve(cartId);
        cart.items = cart.items.filter(i => i.id !== lineId);

        cart.subtotal = cart.items.reduce((sum, i) => sum + (i.total || (i.unit_price * i.quantity)), 0);
        cart.tax_total = Math.round(cart.subtotal * 0.15);
        cart.total = cart.subtotal + cart.shipping_total + cart.tax_total - cart.discount_total;

        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_CART_CACHE_KEY, JSON.stringify(cart));
        }

        return { cart };
      }
    },

    complete: async (cartId: string): Promise<{ type: 'order'; data: MedusaOrder }> => {
      const isLive = await this.checkHealth();
      if (isLive && !cartId.startsWith('cart_local_')) {
        try {
          return await this.request<{ type: 'order'; data: MedusaOrder }>(`/store/carts/${cartId}/complete`, {
            method: 'POST'
          });
        } catch (e) {
          console.warn('[MedusaClient] Live cart completion failed:', e);
        }
      }

      // Local emulation
      const { cart } = await this.carts.retrieve(cartId);
      const mockOrder: MedusaOrder = {
        id: `order_${Date.now()}`,
        display_id: Math.floor(1000 + Math.random() * 9000),
        status: 'pending',
        fulfillment_status: 'not_fulfilled',
        payment_status: 'captured',
        cart_id: cart.id,
        customer_id: 'cust_guest',
        email: cart.email || 'customer@example.com',
        billing_address: cart.billing_address || {
          first_name: 'Customer',
          last_name: 'Guest',
          address_1: '123 Market St',
          city: 'Johannesburg',
          country_code: 'za',
          postal_code: '2001'
        },
        shipping_address: cart.shipping_address || {
          first_name: 'Customer',
          last_name: 'Guest',
          address_1: '123 Market St',
          city: 'Johannesburg',
          country_code: 'za',
          postal_code: '2001'
        },
        region_id: cart.region_id,
        currency_code: 'zar',
        shipping_methods: cart.shipping_methods,
        items: cart.items,
        subtotal: cart.subtotal,
        discount_total: cart.discount_total,
        shipping_total: cart.shipping_total,
        tax_total: cart.tax_total,
        refunded_total: 0,
        total: cart.total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Reset cart
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem(LOCAL_CART_CACHE_KEY);
      }

      return { type: 'order', data: mockOrder };
    }
  };

  // ==========================================
  // Customers & Auth API
  // ==========================================
  public customers = {
    retrieve: async (): Promise<{ customer: MedusaCustomer | null }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        try {
          return await this.request<{ customer: MedusaCustomer }>('/store/auth');
        } catch {
          return { customer: null };
        }
      }
      return { customer: null };
    },

    login: async (credentials: { email: string; password: string }): Promise<{ customer: MedusaCustomer }> => {
      const isLive = await this.checkHealth();
      if (isLive) {
        return await this.request<{ customer: MedusaCustomer }>('/store/auth', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
      }

      return {
        customer: {
          id: `cust_${Date.now()}`,
          email: credentials.email,
          first_name: 'Store',
          last_name: 'Customer',
          has_account: true
        }
      };
    }
  };
}

// Singleton client instance for immediate frontend use
export const medusa = new MedusaClient();
