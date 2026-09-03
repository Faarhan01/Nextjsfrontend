import { UserProfile, MockProduct } from '../types';

const API_BASE_URL = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('luxestore_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('luxestore_auth_token', token);
      } else {
        localStorage.removeItem('luxestore_auth_token');
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('luxestore_auth_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        throw new Error('You appear to be offline. Please check your internet connection.');
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
      } else {
        const text = await response.text().catch(() => '');
        data = { error: text || `HTTP ${response.status} ${response.statusText}` };
      }

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
        const err = new Error(errorMessage) as Error & { status?: number; data?: any };
        err.status = response.status;
        err.data = data;
        throw err;
      }

      return data as T;
    } catch (error: any) {
      console.warn(`[API Client Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  // --- AUTH ENDPOINTS ---
  async login(email: string, password?: string): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const res = await this.request<{ success: boolean; user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async register(name: string, email: string, password?: string): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const res = await this.request<{ success: boolean; user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getProfile(): Promise<{ success: boolean; user: UserProfile }> {
    return this.request<{ success: boolean; user: UserProfile }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- PRODUCTS ENDPOINTS ---
  async getProducts(params?: { categoryId?: number; search?: string; brand?: string; isFeatured?: boolean }): Promise<{ success: boolean; count: number; products: MockProduct[] }> {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) queryParams.set('categoryId', String(params.categoryId));
    if (params?.search) queryParams.set('search', params.search);
    if (params?.brand) queryParams.set('brand', params.brand);
    if (params?.isFeatured !== undefined) queryParams.set('isFeatured', String(params.isFeatured));

    const qs = queryParams.toString();
    return this.request<{ success: boolean; count: number; products: MockProduct[] }>(`/products${qs ? `?${qs}` : ''}`);
  }

  async getProductById(id: string): Promise<{ success: boolean; product: MockProduct }> {
    return this.request<{ success: boolean; product: MockProduct }>(`/products/${id}`);
  }

  async saveProduct(product: Partial<MockProduct>): Promise<{ success: boolean; product: MockProduct; message: string }> {
    const isNew = !product.id;
    const method = isNew ? 'POST' : 'PUT';
    const endpoint = isNew ? '/products' : `/products/${product.id}`;

    return this.request<{ success: boolean; product: MockProduct; message: string }>(endpoint, {
      method,
      body: JSON.stringify(product)
    });
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // --- ORDERS ENDPOINTS ---
  async placeOrder(orderData: {
    items: any[];
    shippingAddress: any;
    subtotal: number;
    shippingFee?: number;
    tax?: number;
    total: number;
    email?: string;
    paymentMethod?: string;
  }): Promise<{ success: boolean; order: any; message: string }> {
    return this.request<{ success: boolean; order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async trackOrder(orderId: string): Promise<{ success: boolean; order: any }> {
    return this.request<{ success: boolean; order: any }>(`/orders/track/${encodeURIComponent(orderId)}`);
  }

  async getUserOrders(email?: string): Promise<{ success: boolean; count: number; orders: any[] }> {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.request<{ success: boolean; count: number; orders: any[] }>(`/orders/user${qs}`);
  }

  // --- AI CONCIERGE & GENERATORS ---
  async generateConciergeReply(params: {
    query: string;
    catalogProducts?: any[];
    cartItems?: any[];
    history?: any[];
  }): Promise<{ success: boolean; data: { reply: string; recommendedProductIds?: string[]; followUpSuggestions?: string[] } }> {
    return this.request<{ success: boolean; data: { reply: string; recommendedProductIds?: string[]; followUpSuggestions?: string[] } }>('/ai/concierge', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async generateProducts(params: {
    prompt: string;
    imageBase64?: string;
    imageMimeType?: string;
  }): Promise<{ success: boolean; data: { products: any[] } }> {
    return this.request<{ success: boolean; data: { products: any[] } }>('/ai/products/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async enhanceProductCopy(params: {
    productName: string;
    originalDescription?: string;
    brandName?: string;
    categoryName?: string;
  }): Promise<{ success: boolean; data: any }> {
    return this.request<{ success: boolean; data: any }>('/ai/products/enhance', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  // --- HEALTH & STATS ---
  async checkHealth(): Promise<{ success: boolean; status: string }> {
    return this.request<{ success: boolean; status: string }>('/health');
  }

  async getStoreStats(): Promise<{ success: boolean; stats: any }> {
    return this.request<{ success: boolean; stats: any }>('/orders/stats');
  }
}

export const apiClient = new ApiClient();
