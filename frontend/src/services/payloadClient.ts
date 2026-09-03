import {
  PayloadProductDoc,
  PayloadCategoryDoc,
  PayloadOrderDoc,
  PayloadCouponDoc,
  PayloadReviewDoc,
  PayloadPageDoc,
  PayloadGlobalSettings,
  PayloadPaginatedResponse,
  PayloadFacetsResponse,
  PayloadAddress,
  PayloadAccessRule,
  PayloadAccessEvaluation,
  PayloadRole,
  PayloadHookExecutionLog,
  PayloadVersionDoc,
  PayloadApiKeyDoc,
  PayloadWebhookEvent,
  PayloadSecurityStatus,
  PayloadMediaDoc,
  PayloadBulkOperationResult,
  PayloadFormDoc,
  PayloadFormSubmissionDoc,
  PayloadRedirectDoc,
  PayloadSEOSettings
} from '../types/payload';

const API_BASE = '/api/payload';

class PayloadClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('luxestore_auth_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
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
        data = { error: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || `Payload API error (${response.status})`);
      }

      return data as T;
    } catch (err: any) {
      console.warn(`[PayloadClient] ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- PRODUCTS COLLECTION ---
  products = {
    find: async (params: {
      category?: string | number;
      brand?: string;
      isFeatured?: boolean;
      isSale?: boolean;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      inStockOnly?: boolean;
      sort?: string;
      page?: number;
      limit?: number;
    } = {}): Promise<PayloadPaginatedResponse<PayloadProductDoc>> => {
      const sp = new URLSearchParams();
      if (params.category) sp.set('category', String(params.category));
      if (params.brand) sp.set('brand', params.brand);
      if (params.isFeatured !== undefined) sp.set('isFeatured', String(params.isFeatured));
      if (params.isSale !== undefined) sp.set('isSale', String(params.isSale));
      if (params.search) sp.set('search', params.search);
      if (params.minPrice !== undefined) sp.set('minPrice', String(params.minPrice));
      if (params.maxPrice !== undefined) sp.set('maxPrice', String(params.maxPrice));
      if (params.inStockOnly) sp.set('inStockOnly', 'true');
      if (params.sort) sp.set('sort', params.sort);
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));

      const qs = sp.toString();
      return this.request<PayloadPaginatedResponse<PayloadProductDoc>>(`/products${qs ? `?${qs}` : ''}`);
    },

    findByID: async (idOrSlug: string): Promise<{ success: boolean; doc: PayloadProductDoc }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc }>(`/products/${encodeURIComponent(idOrSlug)}`);
    },

    create: async (data: Partial<PayloadProductDoc>): Promise<{ success: boolean; doc: PayloadProductDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc; message: string }>('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update: async (id: string, data: Partial<PayloadProductDoc>): Promise<{ success: boolean; doc: PayloadProductDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc; message: string }>(`/products/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    }
  };

  // --- FACETS & SEARCH AGGREGATIONS ---
  facets = {
    get: async (): Promise<{ success: boolean } & PayloadFacetsResponse> => {
      return this.request<{ success: boolean } & PayloadFacetsResponse>('/facets');
    }
  };

  // --- INVENTORY & LOW STOCK ---
  inventory = {
    getLowStock: async (): Promise<{ success: boolean; docs: PayloadProductDoc[]; totalDocs: number; alertMessage: string }> => {
      return this.request<{ success: boolean; docs: PayloadProductDoc[]; totalDocs: number; alertMessage: string }>('/inventory/low-stock');
    }
  };

  // --- CATEGORIES COLLECTION ---
  categories = {
    find: async (): Promise<{ success: boolean; docs: PayloadCategoryDoc[]; totalDocs: number }> => {
      return this.request<{ success: boolean; docs: PayloadCategoryDoc[]; totalDocs: number }>('/categories');
    },

    findByID: async (idOrSlug: string | number): Promise<{ success: boolean; doc: PayloadCategoryDoc }> => {
      return this.request<{ success: boolean; doc: PayloadCategoryDoc }>(`/categories/${encodeURIComponent(idOrSlug)}`);
    }
  };

  // --- REVIEWS & RATINGS COLLECTION ---
  reviews = {
    find: async (productId?: string): Promise<{
      success: boolean;
      docs: PayloadReviewDoc[];
      totalDocs: number;
      averageRating: number;
      ratingDistribution: Record<number, number>;
    }> => {
      const sp = new URLSearchParams();
      if (productId) sp.set('productId', productId);
      const qs = sp.toString();
      return this.request(`/reviews${qs ? `?${qs}` : ''}`);
    },

    create: async (data: {
      productId: string;
      rating: number;
      title: string;
      comment: string;
      authorName?: string;
      authorEmail?: string;
    }): Promise<{ success: boolean; doc: PayloadReviewDoc; message: string }> => {
      return this.request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  };

  // --- PROMOTIONS & COUPONS ---
  promotions = {
    validate: async (code: string, subtotal: number): Promise<{
      success: boolean;
      valid: boolean;
      coupon?: PayloadCouponDoc;
      discountAmount: number;
      message?: string;
    }> => {
      return this.request('/promotions/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
    }
  };

  // --- CART ENGINE ---
  cart = {
    validate: async (payload: {
      items: Array<{ id: string; quantity: number; name?: string }>;
      couponCode?: string;
      shippingType?: 'standard' | 'express';
    }): Promise<{
      success: boolean;
      valid: boolean;
      financials: {
        subtotal: number;
        discount: number;
        shippingFee: number;
        tax: number;
        total: number;
        freeShippingThreshold: number;
        qualifiesForFreeShipping: boolean;
      };
      items: any[];
      outOfStockItems: any[];
      couponApplied?: PayloadCouponDoc | null;
    }> => {
      return this.request('/cart/validate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  };

  // --- ORDERS COLLECTION ---
  orders = {
    create: async (orderData: {
      customer: { id?: string; name: string; email: string; phone?: string };
      items: Array<{ id: string; quantity: number; variantId?: string }>;
      shippingAddress: PayloadAddress;
      billingAddress?: PayloadAddress;
      couponCode?: string;
      paymentMethod?: string;
      shippingType?: 'standard' | 'express';
      notes?: string;
    }): Promise<{ success: boolean; doc: PayloadOrderDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadOrderDoc; message: string }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    },

    findByID: async (idOrNumber: string): Promise<{ success: boolean; doc: PayloadOrderDoc }> => {
      return this.request<{ success: boolean; doc: PayloadOrderDoc }>(`/orders/${encodeURIComponent(idOrNumber)}`);
    },

    updateStatus: async (idOrNumber: string, status: PayloadOrderDoc['fulfillmentStatus']): Promise<{ success: boolean; doc: PayloadOrderDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadOrderDoc; message: string }>(`/orders/${encodeURIComponent(idOrNumber)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    },

    findForCustomer: async (email?: string, customerId?: string): Promise<{ success: boolean; docs: PayloadOrderDoc[]; totalDocs: number }> => {
      const sp = new URLSearchParams();
      if (email) sp.set('email', email);
      if (customerId) sp.set('customerId', customerId);
      const qs = sp.toString();
      return this.request<{ success: boolean; docs: PayloadOrderDoc[]; totalDocs: number }>(`/orders${qs ? `?${qs}` : ''}`);
    }
  };

  // --- DYNAMIC PAGE LAYOUT BLOCKS ---
  pages = {
    getBySlug: async (slug: string = 'home'): Promise<{ success: boolean; doc: PayloadPageDoc }> => {
      return this.request<{ success: boolean; doc: PayloadPageDoc }>(`/pages/${encodeURIComponent(slug)}`);
    }
  };

  // --- GLOBALS ---
  globals = {
    get: async (): Promise<{ success: boolean; globals: PayloadGlobalSettings }> => {
      return this.request<{ success: boolean; globals: PayloadGlobalSettings }>('/globals');
    },

    update: async (patch: Partial<PayloadGlobalSettings>): Promise<{ success: boolean; globals: PayloadGlobalSettings; message: string }> => {
      return this.request<{ success: boolean; globals: PayloadGlobalSettings; message: string }>('/globals', {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
    }
  };

  // --- ACCESS CONTROL & RBAC ---
  accessControl = {
    getRules: async (): Promise<{ success: boolean; rules: PayloadAccessRule[] }> => {
      return this.request<{ success: boolean; rules: PayloadAccessRule[] }>('/access-control/rules');
    },

    evaluate: async (
      collection: string,
      operation: 'read' | 'create' | 'update' | 'delete',
      role: PayloadRole = 'guest',
      userEmail?: string
    ): Promise<{ success: boolean; evaluation: PayloadAccessEvaluation }> => {
      return this.request<{ success: boolean; evaluation: PayloadAccessEvaluation }>('/access-control/evaluate', {
        method: 'POST',
        body: JSON.stringify({ collection, operation, role, userEmail })
      });
    }
  };

  // --- LIFECYCLE HOOKS AUDIT TRAIL ---
  hooks = {
    getLogs: async (limit: number = 30): Promise<{ success: boolean; logs: PayloadHookExecutionLog[]; total: number }> => {
      return this.request<{ success: boolean; logs: PayloadHookExecutionLog[]; total: number }>(`/hooks/logs?limit=${limit}`);
    },

    clearLogs: async (): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>('/hooks/logs', {
        method: 'DELETE'
      });
    }
  };

  // --- DRAFTS & VERSIONS ---
  versions = {
    getForProduct: async (productId: string): Promise<{ success: boolean; versions: PayloadVersionDoc<PayloadProductDoc>[] }> => {
      return this.request<{ success: boolean; versions: PayloadVersionDoc<PayloadProductDoc>[] }>(`/products/${encodeURIComponent(productId)}/versions`);
    },

    createDraft: async (data: Partial<PayloadProductDoc>): Promise<{ success: boolean; doc: PayloadProductDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc; message: string }>('/products/draft', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    publish: async (productId: string): Promise<{ success: boolean; doc: PayloadProductDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc; message: string }>(`/products/${encodeURIComponent(productId)}/publish`, {
        method: 'POST'
      });
    },

    restore: async (productId: string, versionId: string): Promise<{ success: boolean; doc: PayloadProductDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadProductDoc; message: string }>(`/products/${encodeURIComponent(productId)}/restore/${encodeURIComponent(versionId)}`, {
        method: 'POST'
      });
    }
  };

  // --- SECURITY & SCOPED API KEYS ---
  security = {
    getStatus: async (): Promise<{ success: boolean; status: PayloadSecurityStatus }> => {
      return this.request<{ success: boolean; status: PayloadSecurityStatus }>('/security/status');
    },

    getKeys: async (): Promise<{ success: boolean; keys: PayloadApiKeyDoc[] }> => {
      return this.request<{ success: boolean; keys: PayloadApiKeyDoc[] }>('/security/keys');
    },

    createKey: async (name: string, role: PayloadRole, scopes: string[]): Promise<{ success: boolean; doc: PayloadApiKeyDoc; secretKey: string; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadApiKeyDoc; secretKey: string; message: string }>('/security/keys', {
        method: 'POST',
        body: JSON.stringify({ name, role, scopes })
      });
    },

    revokeKey: async (id: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/security/keys/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    }
  };

  // --- WEBHOOKS & PAYMENT INTEGRATION ---
  webhooks = {
    getEvents: async (limit: number = 20): Promise<{ success: boolean; events: PayloadWebhookEvent[] }> => {
      return this.request<{ success: boolean; events: PayloadWebhookEvent[] }>(`/webhooks/events?limit=${limit}`);
    },

    simulate: async (
      provider: 'stripe' | 'fedex' | 'resend' | 'custom',
      event: string,
      payloadData: Record<string, any>,
      signature?: string
    ): Promise<{ success: boolean; event: PayloadWebhookEvent }> => {
      return this.request<{ success: boolean; event: PayloadWebhookEvent }>('/webhooks/simulate', {
        method: 'POST',
        body: JSON.stringify({ provider, event, payload: payloadData, signature })
      });
    }
  };

  // --- MEDIA ASSETS & RESPONSIVE DERIVATIVES (PAYLOAD 3.88) ---
  media = {
    find: async (params: { sort?: string; page?: number; limit?: number; search?: string } = {}): Promise<PayloadPaginatedResponse<PayloadMediaDoc>> => {
      const sp = new URLSearchParams();
      if (params.sort) sp.set('sort', params.sort);
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.search) sp.set('search', params.search);
      const qs = sp.toString();
      return this.request<PayloadPaginatedResponse<PayloadMediaDoc>>(`/media${qs ? `?${qs}` : ''}`);
    },

    findByID: async (id: string): Promise<{ success: boolean; doc: PayloadMediaDoc }> => {
      return this.request<{ success: boolean; doc: PayloadMediaDoc }>(`/media/${encodeURIComponent(id)}`);
    },

    create: async (data: {
      alt: string;
      caption?: string;
      filename: string;
      mimeType?: string;
      filesize?: number;
      width?: number;
      height?: number;
      url: string;
      focalX?: number;
      focalY?: number;
    }): Promise<{ success: boolean; doc: PayloadMediaDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadMediaDoc; message: string }>('/media', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/media/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    }
  };

  // --- BULK OPERATIONS ENGINE (PAYLOAD 3.88) ---
  bulk = {
    updatePrices: async (params: {
      percentageChange?: number;
      fixedAdjustment?: number;
      categorySlug?: string;
      status?: string;
    }): Promise<PayloadBulkOperationResult> => {
      return this.request<PayloadBulkOperationResult>('/products/bulk-price-update', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    },

    updateOrderStatus: async (params: {
      orderIds: string[];
      fulfillmentStatus?: PayloadOrderDoc['fulfillmentStatus'];
      paymentStatus?: PayloadOrderDoc['paymentStatus'];
    }): Promise<PayloadBulkOperationResult> => {
      return this.request<PayloadBulkOperationResult>('/orders/bulk-status-update', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    },

    deleteDrafts: async (): Promise<PayloadBulkOperationResult> => {
      return this.request<PayloadBulkOperationResult>('/products/bulk-delete-drafts', {
        method: 'POST'
      });
    }
  };

  // --- FORM BUILDER PLUGIN (PAYLOAD 3.88) ---
  forms = {
    find: async (): Promise<{ success: boolean; docs: PayloadFormDoc[]; totalDocs: number }> => {
      return this.request<{ success: boolean; docs: PayloadFormDoc[]; totalDocs: number }>('/forms');
    },

    findByID: async (idOrSlug: string): Promise<{ success: boolean; doc: PayloadFormDoc }> => {
      return this.request<{ success: boolean; doc: PayloadFormDoc }>(`/forms/${encodeURIComponent(idOrSlug)}`);
    },

    save: async (data: Partial<PayloadFormDoc> & { title: string; fields: any[] }): Promise<{ success: boolean; doc: PayloadFormDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadFormDoc; message: string }>('/forms', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/forms/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    },

    submit: async (formId: string, submissionData: Record<string, any>): Promise<{ success: boolean; submission: PayloadFormSubmissionDoc; message: string }> => {
      return this.request<{ success: boolean; submission: PayloadFormSubmissionDoc; message: string }>(`/forms/${encodeURIComponent(formId)}/submit`, {
        method: 'POST',
        body: JSON.stringify(submissionData)
      });
    },

    getSubmissions: async (formId?: string, limit: number = 50): Promise<{ success: boolean; docs: PayloadFormSubmissionDoc[]; totalDocs: number }> => {
      return this.request<{ success: boolean; docs: PayloadFormSubmissionDoc[]; totalDocs: number }>(`/forms/${encodeURIComponent(formId || 'all')}/submissions?limit=${limit}`);
    }
  };

  // --- REDIRECTS PLUGIN (PAYLOAD 3.88) ---
  redirects = {
    find: async (): Promise<{ success: boolean; docs: PayloadRedirectDoc[]; totalDocs: number }> => {
      return this.request<{ success: boolean; docs: PayloadRedirectDoc[]; totalDocs: number }>('/redirects');
    },

    save: async (data: { id?: string; from: string; to: any; statusCode?: 301 | 302 }): Promise<{ success: boolean; doc: PayloadRedirectDoc; message: string }> => {
      return this.request<{ success: boolean; doc: PayloadRedirectDoc; message: string }>('/redirects', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>(`/redirects/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    },

    lookup: async (pathname: string): Promise<{ success: boolean; redirect: PayloadRedirectDoc | null }> => {
      return this.request<{ success: boolean; redirect: PayloadRedirectDoc | null }>(`/redirects/lookup?pathname=${encodeURIComponent(pathname)}`);
    }
  };

  // --- SEO PLUGIN & GLOBAL METADATA (PAYLOAD 3.88) ---
  seo = {
    get: async (): Promise<{ success: boolean; settings: PayloadSEOSettings }> => {
      return this.request<{ success: boolean; settings: PayloadSEOSettings }>('/seo');
    },

    update: async (patch: Partial<PayloadSEOSettings>): Promise<{ success: boolean; settings: PayloadSEOSettings; message: string }> => {
      return this.request<{ success: boolean; settings: PayloadSEOSettings; message: string }>('/seo', {
        method: 'PATCH',
        body: JSON.stringify(patch)
      });
    }
  };
}

export const payload = new PayloadClient();
