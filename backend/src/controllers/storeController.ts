import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import {
  getProducts,
  getProductById,
  getCategories,
  getBrands,
  ProductItem,
  ProductCategory
} from '../services/productStore.ts';
import { getOrderById, createOrder, OrderRecord } from '../services/orderStore.ts';
import { dbManager } from '../services/dbManager.ts';

// ----- Helpers -----

function priceToCents(price: string | number | undefined): number {
  if (typeof price === 'number') return Math.round(price * 100);
  const parsed = parseFloat(String(price || '0').replace(/[^0-9.]/g, ''));
  return Math.round((parsed || 0) * 100);
}

function errorRes(res: Response, statusCode: number, message: string) {
  res.status(statusCode).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
}

function productToMedusa(p: ProductItem) {
  const cents = priceToCents(p.numericPrice ?? p.price);
  return {
    id: p.id,
    title: p.name,
    subtitle: p.brand || '',
    description: p.description || '',
    handle: (p.url?.replace(/^\/product\//, '') || p.id).toLowerCase(),
    status: 'published',
    thumbnail: p.imageUrl,
    images: (p.images && p.images.length > 0 ? p.images : [p.imageUrl]).map((url, idx) => ({
      id: `img_${p.id}_${idx}`,
      url
    })),
    options: [
      {
        id: `opt_${p.id}`,
        title: 'Default',
        product_id: p.id,
        values: [{ id: `opt_val_${p.id}`, value: 'Default', option_id: `opt_${p.id}` }]
      }
    ],
    variants: [
      {
        id: `variant_${p.id}`,
        title: 'Default',
        product_id: p.id,
        sku: `SKU-${p.id}`,
        inventory_quantity: p.stock ?? 50,
        allow_backorder: false,
        manage_inventory: true,
        prices: [
          { currency_code: 'zar', amount: cents },
          { currency_code: 'usd', amount: Math.round(cents / 18) }
        ],
        options: [{ id: `opt_val_${p.id}`, value: 'Default', option_id: `opt_${p.id}` }]
      }
    ],
    categories: p.categoryId
      ? [
          {
            id: `cat_${p.categoryId}`,
            name: p.categoryName || 'General',
            handle: (p.categoryName || 'general').toLowerCase().replace(/\s+/g, '-')
          }
        ]
      : [],
    tags: (p.tags || []).map((value, idx) => ({ id: `tag_${idx}`, value })),
    discountable: true,
    metadata: {
      offers: p.offers || [],
      bulkPricing: p.bulkPricing || [],
      specifications: p.specifications || {},
      primarySellerId: p.primarySellerId || '',
      primarySellerName: p.primarySellerName || '',
      brand: p.brand || 'Mrbulk Marketplace',
      brandId: p.brandId,
      rating: p.rating || 4.8,
      reviewsCount: p.reviewsCount || 15,
      isSale: p.isSale ?? false,
      saleBadgeText: p.saleBadgeText
    }
  };
}

function categoryToMedusa(c: ProductCategory) {
  const numericId = c.id;
  const handle = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const imageUrl = c.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800';
  const description = c.description || `Browse our collection of ${c.name.toLowerCase()} in bulk and save.`;
  const subcategories = c.subcategories || [];
  const itemCount = c.itemCount ?? 15;

  return {
    id: `cat_${numericId}`,
    numeric_id: numericId,
    name: c.name,
    handle,
    description,
    imageUrl,
    image_url: imageUrl,
    image: imageUrl,
    icon: c.icon || '',
    item_count: itemCount,
    itemCount,
    is_active: true,
    category_children: subcategories.map((sub, idx) => ({
      id: `cat_${sub.id || `${numericId}${idx + 1}`}`,
      numeric_id: sub.id,
      name: sub.name,
      handle: sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: sub.description || '',
      category_children: []
    })),
    subcategories,
    metadata: {
      imageUrl,
      image_url: imageUrl,
      icon: c.icon || '',
      numericId,
      itemCount,
      subcategories
    }
  };
}

// ----- Products -----

export function listProducts(req: Request, res: Response): void {
  try {
    const { q, category_id, limit, offset } = req.query as Record<string, string>;
    let products = getProducts({
      search: q || undefined,
      categoryId: category_id ? Number(String(category_id).replace(/\D/g, '')) : undefined
    });

    const off = offset ? Number(offset) : 0;
    const lim = limit ? Number(limit) : products.length;
    const slice = products.slice(off, off + lim);

    res.json({
      products: slice.map(productToMedusa),
      count: products.length,
      offset: off,
      limit: lim
    });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch products.');
  }
}

export function retrieveProduct(req: Request, res: Response): void {
  try {
    const rawParam = req.params.id;
    let product = getProductById(rawParam);
    if (!product) {
      const cleanHandle = rawParam.toLowerCase().replace(/^\/product\//, '');
      const all = getProducts();
      product = all.find(p => {
        const handle = (p.url?.replace(/^\/product\//, '') || p.id).toLowerCase();
        return handle === cleanHandle || p.id.toLowerCase() === rawParam.toLowerCase();
      }) || null;
    }
    if (!product) {
      errorRes(res, 404, `Product with id or handle: ${req.params.id} was not found`);
      return;
    }
    res.json({ product: productToMedusa(product) });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch product.');
  }
}

// ----- Product categories -----

export function listProductCategories(_req: Request, res: Response): void {
  try {
    const categories = getCategories().map(categoryToMedusa);
    res.json({ product_categories: categories, count: categories.length });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch categories.');
  }
}

// ----- Collections -----

export function listCollections(_req: Request, res: Response): void {
  res.json({
    collections: [
      { id: 'col_bestsellers', title: 'Bestsellers', handle: 'bestsellers' },
      { id: 'col_flash_deals', title: 'Flash Deals', handle: 'flash-deals' },
      { id: 'col_wholesale', title: 'Wholesale Bulk', handle: 'wholesale-bulk' }
    ],
    count: 3
  });
}

// ----- Regions -----

const REGIONS = [
  {
    id: 'reg_za',
    name: 'South Africa',
    currency_code: 'zar',
    tax_rate: 15,
    countries: [
      { id: 'za', iso_2: 'za', iso_3: 'zaf', name: 'South Africa', display_name: 'South Africa' }
    ]
  },
  {
    id: 'reg_global',
    name: 'International (USD)',
    currency_code: 'usd',
    tax_rate: 0
  }
];

export function listRegions(_req: Request, res: Response): void {
  res.json({ regions: REGIONS, count: REGIONS.length });
}

export function retrieveRegion(req: Request, res: Response): void {
  const region = REGIONS.find(r => r.id === req.params.id);
  if (!region) {
    errorRes(res, 404, `Region with id: ${req.params.id} was not found`);
    return;
  }
  res.json({ region });
}

// ----- Carts (simple in-memory map, scoped per id) -----

interface CartLineItem {
  id: string;
  cart_id: string;
  title: string;
  thumbnail: string;
  variant_id: string;
  variant: {
    id: string;
    product_id: string;
    title: string;
    prices: Array<{ currency_code: string; amount: number }>;
  };
  unit_price: number;
  quantity: number;
  subtotal: number;
  total: number;
}

interface CartState {
  id: string;
  region_id: string;
  items: CartLineItem[];
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  email?: string;
  shipping_address?: any;
  billing_address?: any;
  created_at: string;
  updated_at: string;
}

const cartsDb = new Map<string, CartState>();

function recomputeTotals(cart: CartState) {
  cart.subtotal = cart.items.reduce(
    (sum, i) => sum + (i.total || i.unit_price * i.quantity),
    0
  );
  cart.tax_total = Math.round(cart.subtotal * 0.15);
  cart.total = cart.subtotal + cart.shipping_total + cart.tax_total - cart.discount_total;
  cart.updated_at = new Date().toISOString();
}

function resolveVariant(variantId: string): { product: ProductItem; cents: number; title: string } | null {
  const productId = variantId.replace(/^variant_/, '');
  const product = getProductById(productId);
  if (!product) return null;
  const cents = priceToCents(product.numericPrice ?? product.price);
  return { product, cents, title: product.name };
}

export function createCart(req: Request, res: Response): void {
  try {
    const { region_id, email } = req.body || {};
    const cart: CartState = {
      id: `cart_${randomUUID().slice(0, 8)}`,
      region_id: region_id || 'reg_za',
      items: [],
      subtotal: 0,
      discount_total: 0,
      shipping_total: 0,
      tax_total: 0,
      total: 0,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    cartsDb.set(cart.id, cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to create cart.');
  }
}

export function retrieveCart(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to retrieve cart.');
  }
}

export function addLineItem(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    const { variant_id, quantity } = req.body || {};
    const quantityNum = Math.max(1, Number(quantity) || 1);
    const resolved = resolveVariant(variant_id);
    if (!resolved) {
      errorRes(res, 400, `Variant with id: ${variant_id} was not found`);
      return;
    }
    const existing = cart.items.find(i => i.variant_id === variant_id);
    if (existing) {
      existing.quantity += quantityNum;
      existing.subtotal = existing.unit_price * existing.quantity;
      existing.total = existing.subtotal;
    } else {
      const line: CartLineItem = {
        id: `item_${randomUUID().slice(0, 8)}`,
        cart_id: cart.id,
        title: resolved.title,
        thumbnail: resolved.product.imageUrl,
        variant_id,
        variant: {
          id: variant_id,
          product_id: resolved.product.id,
          title: resolved.title,
          prices: [{ currency_code: 'zar', amount: resolved.cents }]
        },
        unit_price: resolved.cents,
        quantity: quantityNum,
        subtotal: resolved.cents * quantityNum,
        total: resolved.cents * quantityNum
      };
      cart.items.push(line);
    }
    recomputeTotals(cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to add line item.');
  }
}

export function updateLineItem(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    const { quantity } = req.body || {};
    const target = cart.items.find(i => i.id === req.params.lineId);
    if (!target) {
      errorRes(res, 404, `Line item with id: ${req.params.lineId} was not found`);
      return;
    }
    const quantityNum = Math.max(0, Number(quantity) || 0);
    if (quantityNum === 0) {
      cart.items = cart.items.filter(i => i.id !== req.params.lineId);
    } else {
      target.quantity = quantityNum;
      target.subtotal = target.unit_price * target.quantity;
      target.total = target.subtotal;
    }
    recomputeTotals(cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to update line item.');
  }
}

export function deleteLineItem(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    cart.items = cart.items.filter(i => i.id !== req.params.lineId);
    recomputeTotals(cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to delete line item.');
  }
}

export function completeCart(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }

    const items = cart.items.map(it => ({
      id: it.variant.product_id,
      name: it.title,
      price: it.unit_price / 100,
      quantity: it.quantity,
      image: it.thumbnail
    }));

    const order: OrderRecord = createOrder({
      userId: undefined,
      email: cart.email || 'guest@example.com',
      shippingAddress: cart.shipping_address || {
        name: 'Customer',
        street: '123 Main St',
        city: 'Johannesburg',
        state: 'GP',
        zip: '2000',
        country: 'ZA'
      },
      items,
      subtotal: cart.subtotal / 100,
      shippingFee: cart.shipping_total / 100,
      tax: cart.tax_total / 100,
      total: cart.total / 100,
      paymentMethod: 'card'
    });

    cartsDb.delete(cart.id);

    res.json({
      type: 'order',
      data: {
        id: `order_${order.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        display_id: Math.floor(1000 + Math.random() * 9000),
        status: 'pending',
        fulfillment_status: 'not_fulfilled',
        payment_status: 'awaiting',
        cart_id: cart.id,
        email: cart.email,
        items: cart.items,
        subtotal: cart.subtotal,
        discount_total: cart.discount_total,
        shipping_total: cart.shipping_total,
        tax_total: cart.tax_total,
        refunded_total: 0,
        total: cart.total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to complete cart.');
  }
}

export function updateCart(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    const { email, shipping_address, billing_address, region_id } = req.body || {};
    if (email !== undefined) cart.email = email;
    if (shipping_address !== undefined) cart.shipping_address = shipping_address;
    if (billing_address !== undefined) cart.billing_address = billing_address;
    if (region_id !== undefined) cart.region_id = region_id;

    recomputeTotals(cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to update cart.');
  }
}

// ----- Shipping Options & Methods -----

export const SHIPPING_OPTIONS = [
  {
    id: 'so_tcg_std',
    name: 'The Courier Guy Standard (2-4 business days)',
    region_id: 'reg_za',
    profile_id: 'sp_default',
    amount: 9900,
    is_return: false,
    admin_only: false,
    data: { id: 'tcg_std' },
    price_type: 'flat_rate'
  },
  {
    id: 'so_tcg_exp',
    name: 'The Courier Guy Priority Express (Overnight)',
    region_id: 'reg_za',
    profile_id: 'sp_default',
    amount: 19500,
    is_return: false,
    admin_only: false,
    data: { id: 'tcg_exp' },
    price_type: 'flat_rate'
  },
  {
    id: 'so_pargo',
    name: 'Pargo Click & Collect Point',
    region_id: 'reg_za',
    profile_id: 'sp_default',
    amount: 7500,
    is_return: false,
    admin_only: false,
    data: { id: 'pargo_pickup' },
    price_type: 'flat_rate'
  }
];

export function listShippingOptions(req: Request, res: Response): void {
  try {
    const cartId = req.params.cartId || (req.query.cart_id as string);
    res.json({ shipping_options: SHIPPING_OPTIONS });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch shipping options.');
  }
}

export function addShippingMethod(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    const { option_id } = req.body || {};
    const option = SHIPPING_OPTIONS.find(o => o.id === option_id) || SHIPPING_OPTIONS[0];

    cart.shipping_total = option.amount;
    (cart as any).shipping_methods = [
      {
        id: `sm_${randomUUID().slice(0, 8)}`,
        shipping_option_id: option.id,
        price: option.amount,
        name: option.name
      }
    ];

    recomputeTotals(cart);
    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to set shipping method.');
  }
}

// ----- Payment Sessions -----

export function createPaymentSessions(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }
    const paymentSessions = [
      {
        id: `ps_manual_${cart.id}`,
        provider_id: 'manual',
        is_selected: true,
        data: {}
      },
      {
        id: `ps_payfast_${cart.id}`,
        provider_id: 'payfast',
        is_selected: false,
        data: {}
      }
    ];

    (cart as any).payment_sessions = paymentSessions;
    (cart as any).payment_session = paymentSessions[0];

    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to initialize payment sessions.');
  }
}

// ----- Brands -----

export function listBrands(_req: Request, res: Response): void {
  try {
    const brands = getBrands();
    res.json({ brands, count: brands.length });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch brands.');
  }
}

// Re-export lookup for legacy /order tracking endpoint (kept simple)
export function lookupOrder(req: Request, res: Response): void {
  const order = getOrderById(req.params.id);
  if (!order) {
    errorRes(res, 404, `Order ${req.params.id} was not found.`);
    return;
  }
  res.json({ order });
}

// ----- Sellers -----

export function listSellers(_req: Request, res: Response): void {
  try {
    const sellers = dbManager.getUsers()
      .filter(entry => entry.user.role === 'seller')
      .map(entry => ({
        id: entry.user.sellerId || entry.user.id,
        name: entry.user.name,
        email: entry.user.email,
        avatarUrl: entry.user.avatarUrl,
        status: entry.user.status,
        joinedDate: entry.user.joinedDate,
        storeName: entry.user.name,
        slug: entry.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));
    res.json({ sellers, count: sellers.length });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch sellers.');
  }
}
