// Google Tag Manager & GA4 E-commerce Data Layer Architecture
// Standard GA4 Schema: https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export interface GA4Item {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  currency?: string;
  index?: number;
}

export interface GA4EcommerceEvent {
  event: string;
  ecommerce: {
    currency?: string;
    value?: number;
    transaction_id?: string;
    tax?: number;
    shipping?: number;
    coupon?: string;
    items?: GA4Item[];
    [key: string]: any;
  } | null;
  [key: string]: any;
}

export interface DataLayerLogEntry {
  id: string;
  timestamp: string;
  event: string;
  payload: Record<string, any>;
}

// Storage keys
export const GTM_ID_STORAGE_KEY = 'luxestore_gtm_id';
export const GA4_MEASUREMENT_ID_STORAGE_KEY = 'luxestore_ga4_measurement_id';
const TRACKED_PURCHASES_STORAGE_KEY = 'luxestore_tracked_purchases_v1';
const DATALAYER_LOGS_STORAGE_KEY = 'luxestore_datalayer_logs_v1';

// In-memory transaction deduplication set
const trackedTransactionIds = new Set<string>();

// Subscribed listeners for admin live inspector
type DataLayerListener = (entry: DataLayerLogEntry) => void;
const listeners: Set<DataLayerListener> = new Set();

// Initialize deduplication cache from localStorage
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem(TRACKED_PURCHASES_STORAGE_KEY);
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      parsed.forEach((id) => trackedTransactionIds.add(id));
    }
  } catch (e) {
    console.warn('[GTM] Failed to load tracked purchases cache:', e);
  }
}

/**
 * Retrieves the currently configured GTM ID
 */
export function getStoredGtmId(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GTM_ID_STORAGE_KEY) || 'GTM-LX84920';
}

/**
 * Saves GTM ID and updates the tracking scripts
 */
export function setStoredGtmId(gtmId: string): void {
  if (typeof window === 'undefined') return;
  const cleanId = gtmId.trim().toUpperCase();
  localStorage.setItem(GTM_ID_STORAGE_KEY, cleanId);
  initGTM(cleanId);
}

/**
 * Retrieves the currently configured GA4 Measurement ID
 */
export function getStoredGa4Id(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GA4_MEASUREMENT_ID_STORAGE_KEY) || 'G-LX94285912';
}

/**
 * Saves GA4 Measurement ID
 */
export function setStoredGa4Id(ga4Id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GA4_MEASUREMENT_ID_STORAGE_KEY, ga4Id.trim().toUpperCase());
}

/**
 * Safely parses raw price values into valid floating-point numbers
 */
export function parsePrice(price: string | number | undefined | null): number {
  if (typeof price === 'number') return isNaN(price) ? 0 : Number(price.toFixed(2));
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Number(parsed.toFixed(2));
}

/**
 * Injects Google Tag Manager script into <head> and fallback <iframe> into <body>
 */
export function initGTM(gtmId?: string): void {
  if (typeof window === 'undefined') return;

  const activeId = (gtmId || getStoredGtmId()).trim();
  if (!activeId || !activeId.startsWith('GTM-')) {
    return;
  }

  // Ensure window.dataLayer exists
  window.dataLayer = window.dataLayer || [];

  // Prevent duplicate script injection
  const existingScript = document.getElementById('gtm-script-tag');
  if (existingScript) {
    if (existingScript.getAttribute('data-gtm-id') === activeId) {
      return; // Already initialized with this ID
    }
    existingScript.remove();
    const existingIframe = document.getElementById('gtm-noscript-tag');
    if (existingIframe) existingIframe.remove();
  }

  // 1. Inject Head Script
  try {
    const script = document.createElement('script');
    script.id = 'gtm-script-tag';
    script.setAttribute('data-gtm-id', activeId);
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(activeId)}`;

    // Initial GTM start push
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    document.head.appendChild(script);

    // 2. Inject Body <noscript> Fallback <iframe>
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript-tag';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(activeId)}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);

    if (document.body) {
      document.body.insertAdjacentElement('afterbegin', noscript);
    }
  } catch (err) {
    console.error('[GTM] Failed to initialize Google Tag Manager snippet:', err);
  }
}

/**
 * Safe DataLayer Push with schema validation, history storage, and real-time subscriber broadcast
 */
export function pushToDataLayer(eventData: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];

  try {
    // 1. Push directly to window.dataLayer
    window.dataLayer.push(eventData);

    // 2. Format a log entry for live admin inspector
    const entry: DataLayerLogEntry = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString(),
      event: eventData.event || 'custom_event',
      payload: JSON.parse(JSON.stringify(eventData))
    };

    // 3. Persist recent logs (keep last 50)
    try {
      const logs = getDataLayerLogs();
      logs.unshift(entry);
      localStorage.setItem(DATALAYER_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {}

    // 4. Notify active listeners
    listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (e) {
        console.error('[GTM Listener Error]', e);
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`%c[GA4 / GTM DataLayer] Push: ${eventData.event}`, 'color: #f59e0b; font-weight: bold;', eventData);
    }
  } catch (err) {
    console.error('[GTM] Error pushing to dataLayer:', err);
  }
}

/**
 * Retrieve recent dataLayer push history for the admin console
 */
export function getDataLayerLogs(): DataLayerLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DATALAYER_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Clear stored DataLayer logs
 */
export function clearDataLayerLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DATALAYER_LOGS_STORAGE_KEY);
}

/**
 * Subscribe to real-time dataLayer push events
 */
export function subscribeToDataLayer(listener: DataLayerListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 1. GA4 E-commerce Event: view_item
 * Triggered on Product Detail Pages (PDP)
 */
export function trackViewItem(
  product: {
    id: string;
    name: string;
    price?: string | number;
    brand?: string;
    category?: string;
    variant?: string;
    retailPrice?: number | string;
  },
  currency: string = 'ZAR'
): void {
  if (!product || !product.id) return;

  const itemPrice = parsePrice(product.retailPrice || product.price);

  const item: GA4Item = {
    item_id: String(product.id),
    item_name: product.name || 'Product',
    price: itemPrice,
    quantity: 1,
    item_brand: product.brand || 'Mrbulk',
    item_category: product.category || 'General',
    currency
  };

  if (product.variant) item.item_variant = product.variant;

  // Clear previous ecommerce object first to avoid data contamination
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency,
      value: itemPrice,
      items: [item]
    }
  });
}

/**
 * 2. GA4 E-commerce Event: add_to_cart
 * Triggered when a product is added to the shopping cart
 */
export function trackAddToCart(
  product: {
    id: string;
    name: string;
    price?: string | number;
    brand?: string;
    category?: string;
    variant?: string;
    retailPrice?: number | string;
  },
  quantity: number = 1,
  currency: string = 'ZAR'
): void {
  if (!product || !product.id) return;

  const itemPrice = parsePrice(product.retailPrice || product.price);
  const qty = Math.max(1, quantity || 1);

  const item: GA4Item = {
    item_id: String(product.id),
    item_name: product.name || 'Product',
    price: itemPrice,
    quantity: qty,
    item_brand: product.brand || 'Mrbulk',
    item_category: product.category || 'General',
    currency
  };

  if (product.variant) item.item_variant = product.variant;

  // Clear previous ecommerce object first
  pushToDataLayer({ ecommerce: null });

  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency,
      value: Number((itemPrice * qty).toFixed(2)),
      items: [item]
    }
  });
}

/**
 * 3. GA4 E-commerce Event: begin_checkout
 * Triggered when the user enters the checkout flow
 */
export function trackBeginCheckout(
  cart: Array<{
    id: string;
    name: string;
    price: number | string;
    quantity: number;
    brand?: string;
    category?: string;
    variant?: string;
  }>,
  totalValueOrCoupon?: number | string,
  currency: string = 'ZAR',
  couponCode?: string
): void {
  if (!cart || cart.length === 0) return;

  const items: GA4Item[] = cart.map((item, idx) => ({
    item_id: String(item.id),
    item_name: item.name || `Item ${item.id}`,
    price: parsePrice(item.price),
    quantity: Math.max(1, item.quantity || 1),
    item_brand: item.brand || 'Mrbulk',
    item_category: item.category || 'General',
    currency,
    index: idx + 1
  }));

  let totalVal: number | undefined;
  let promo: string | undefined = couponCode;

  if (typeof totalValueOrCoupon === 'number') {
    totalVal = totalValueOrCoupon;
  } else if (typeof totalValueOrCoupon === 'string') {
    promo = totalValueOrCoupon;
  }

  const computedValue =
    typeof totalVal === 'number'
      ? totalVal
      : items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Clear previous ecommerce object first
  pushToDataLayer({ ecommerce: null });

  const payload: GA4EcommerceEvent = {
    event: 'begin_checkout',
    ecommerce: {
      currency,
      value: Number(computedValue.toFixed(2)),
      items
    }
  };

  if (promo) {
    payload.ecommerce!.coupon = promo;
  }

  pushToDataLayer(payload);
}

/**
 * 4. GA4 E-commerce Event: purchase
 * Triggered on Order Success / Thank You page.
 * Includes strict transaction deduplication to prevent duplicate reporting on page refresh.
 */
export function trackPurchase(order: {
  transaction_id: string;
  value: number | string;
  currency?: string;
  tax?: number;
  shipping?: number;
  coupon?: string;
  items: Array<{
    id?: string;
    item_id?: string;
    name?: string;
    item_name?: string;
    price: number | string;
    quantity?: number;
    brand?: string;
    item_brand?: string;
    category?: string;
    item_category?: string;
    variant?: string;
    item_variant?: string;
  }>;
}): boolean {
  if (!order || !order.transaction_id) {
    console.warn('[GTM] Purchase event ignored: missing order or transaction_id');
    return false;
  }

  const txId = String(order.transaction_id).trim();

  // Deduplication check: Has this order already been pushed?
  if (trackedTransactionIds.has(txId)) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[GTM] Duplicate purchase event suppressed for transaction_id: ${txId}`);
    }
    return false;
  }

  // Mark transaction as tracked
  trackedTransactionIds.add(txId);
  if (typeof window !== 'undefined') {
    try {
      const currentList = Array.from(trackedTransactionIds);
      localStorage.setItem(TRACKED_PURCHASES_STORAGE_KEY, JSON.stringify(currentList.slice(-100)));
    } catch (e) {}
  }

  const currency = order.currency || 'ZAR';
  const orderValue = parsePrice(order.value);

  const formattedItems: GA4Item[] = (order.items || []).map((item, idx) => {
    const id = item.item_id || item.id || `item-${idx + 1}`;
    const name = item.item_name || item.name || 'Purchased Item';
    const price = parsePrice(item.price);
    const qty = Math.max(1, item.quantity || 1);
    const brand = item.item_brand || item.brand || 'Mrbulk';
    const category = item.item_category || item.category || 'General';

    const it: GA4Item = {
      item_id: String(id),
      item_name: name,
      price,
      quantity: qty,
      item_brand: brand,
      item_category: category,
      currency,
      index: idx + 1
    };

    if (item.variant || item.item_variant) {
      it.item_variant = item.item_variant || item.variant;
    }

    return it;
  });

  // Clear previous ecommerce object first
  pushToDataLayer({ ecommerce: null });

  const payload: GA4EcommerceEvent = {
    event: 'purchase',
    ecommerce: {
      transaction_id: txId,
      value: orderValue,
      currency,
      items: formattedItems
    }
  };

  if (typeof order.tax === 'number') payload.ecommerce!.tax = order.tax;
  if (typeof order.shipping === 'number') payload.ecommerce!.shipping = order.shipping;
  if (order.coupon) payload.ecommerce!.coupon = order.coupon;

  pushToDataLayer(payload);
  return true;
}
