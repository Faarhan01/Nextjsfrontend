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

function parsePrice(price: string | number | undefined): number {
  if (typeof price === 'number') return price;
  const parsed = parseFloat(String(price || '0').replace(/[^0-9.]/g, ''));
  return parsed || 0;
}

function errorRes(res: Response, statusCode: number, message: string) {
  res.status(statusCode).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
}

// ----- Products -----

export function listProducts(req: Request, res: Response): void {
  try {
    const { q, search, category_id, categoryId, brand, limit, offset } = req.query as Record<string, string>;
    const searchTerm = search || q || undefined;
    const catId = category_id || categoryId;
    const numericCatId = catId ? Number(String(catId).replace(/\D/g, '')) : undefined;

    let products = getProducts({
      search: searchTerm,
      categoryId: numericCatId,
      brand: brand || undefined
    });

    const off = offset ? Number(offset) : 0;
    const lim = limit ? Number(limit) : products.length;
    const slice = products.slice(off, off + lim);

    res.json({
      products: slice,
      count: products.length,
      total: products.length,
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
    res.json({ product });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch product.');
  }
}

// ----- Product categories -----

export function listProductCategories(_req: Request, res: Response): void {
  try {
    const categories = getCategories();
    res.json({ 
      categories, 
      product_categories: categories, 
      count: categories.length 
    });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch categories.');
  }
}

// ----- Collections & Brands -----

export function listCollections(_req: Request, res: Response): void {
  try {
    const brands = getBrands();
    const collections = [
      { id: 'col_bestsellers', title: 'Bestsellers', handle: 'bestsellers' },
      { id: 'col_flash_deals', title: 'Flash Deals', handle: 'flash-deals' },
      { id: 'col_wholesale', title: 'Wholesale Bulk', handle: 'wholesale-bulk' },
      ...brands.map(b => ({
        id: `col_${b.id}`,
        title: b.name,
        handle: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }))
    ];
    res.json({ collections, count: collections.length });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch collections.');
  }
}

export function listBrands(_req: Request, res: Response): void {
  try {
    const brands = getBrands();
    res.json({ brands, count: brands.length });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to fetch brands.');
  }
}

// ----- Regions -----

export const REGIONS = [
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

// ----- Cart (Simple, lightweight Express Cart) -----

export interface CartLineItem {
  id: string;
  productId: string;
  title: string;
  name: string;
  thumbnail: string;
  imageUrl: string;
  price: number;
  unit_price: number;
  quantity: number;
  subtotal: number;
  total: number;
  variant_id?: string;
  variant?: any;
}

export interface CartState {
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
  shipping_methods?: any[];
  payment_session?: any;
  payment_sessions?: any[];
}

const cartsDb = new Map<string, CartState>();

function recomputeTotals(cart: CartState) {
  cart.subtotal = cart.items.reduce((sum, i) => sum + (i.total || i.price * i.quantity), 0);
  cart.tax_total = Math.round(cart.subtotal * 0.15 * 100) / 100;
  cart.total = Math.round((cart.subtotal + cart.shipping_total + cart.tax_total - cart.discount_total) * 100) / 100;
  cart.updated_at = new Date().toISOString();
}

function resolveProduct(idOrVariantId: string): ProductItem | null {
  const cleanId = idOrVariantId.replace(/^(variant_|prod_)/, '');
  return getProductById(cleanId) || getProductById(idOrVariantId) || null;
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
    const { variant_id, productId, quantity, price, title, name, imageUrl } = req.body || {};
    const targetId = productId || variant_id;
    const quantityNum = Math.max(1, Number(quantity) || 1);

    const product = targetId ? resolveProduct(targetId) : null;
    const unitPrice = price !== undefined ? parsePrice(price) : (product ? (product.numericPrice ?? parsePrice(product.price)) : 0);
    const itemTitle = title || name || product?.name || 'Item';
    const itemImage = imageUrl || product?.imageUrl || '';

    const existing = cart.items.find(i => i.productId === (product?.id || targetId) || (variant_id && i.variant_id === variant_id));
    if (existing) {
      existing.quantity += quantityNum;
      existing.subtotal = Math.round(existing.price * existing.quantity * 100) / 100;
      existing.total = existing.subtotal;
    } else {
      const line: CartLineItem = {
        id: `item_${randomUUID().slice(0, 8)}`,
        productId: product?.id || targetId || 'item',
        title: itemTitle,
        name: itemTitle,
        thumbnail: itemImage,
        imageUrl: itemImage,
        price: unitPrice,
        unit_price: unitPrice,
        quantity: quantityNum,
        subtotal: Math.round(unitPrice * quantityNum * 100) / 100,
        total: Math.round(unitPrice * quantityNum * 100) / 100,
        variant_id: variant_id || `var_${targetId}`
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
      target.subtotal = Math.round(target.price * target.quantity * 100) / 100;
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

export function completeCart(req: Request, res: Response): void {
  try {
    const cart = cartsDb.get(req.params.id);
    if (!cart) {
      errorRes(res, 404, `Cart with id: ${req.params.id} was not found`);
      return;
    }

    const items = cart.items.map(it => ({
      id: it.productId,
      name: it.name || it.title,
      price: it.price,
      quantity: it.quantity,
      image: it.imageUrl || it.thumbnail
    }));

    const order: OrderRecord = createOrder({
      userId: undefined,
      email: cart.email || 'customer@mrbulk.co.za',
      shippingAddress: cart.shipping_address || {
        name: 'Customer',
        street: '123 Main St',
        city: 'Johannesburg',
        state: 'GP',
        zip: '2000',
        country: 'ZA'
      },
      items,
      subtotal: cart.subtotal,
      shippingFee: cart.shipping_total,
      tax: cart.tax_total,
      total: cart.total,
      paymentMethod: 'card'
    });

    cartsDb.delete(cart.id);

    res.json({
      order,
      type: 'order',
      data: {
        id: order.id,
        display_id: Math.floor(1000 + Math.random() * 9000),
        status: order.status,
        total: order.total,
        created_at: order.orderDate
      }
    });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to complete cart.');
  }
}

// ----- Shipping Options & Methods -----

export const SHIPPING_OPTIONS = [
  {
    id: 'so_tcg_std',
    name: 'The Courier Guy Standard (2-4 business days)',
    amount: 99,
    price: 99
  },
  {
    id: 'so_tcg_exp',
    name: 'The Courier Guy Priority Express (Overnight)',
    amount: 195,
    price: 195
  },
  {
    id: 'so_pargo',
    name: 'Pargo Click & Collect Point',
    amount: 75,
    price: 75
  }
];

export function listShippingOptions(_req: Request, res: Response): void {
  res.json({ shipping_options: SHIPPING_OPTIONS, options: SHIPPING_OPTIONS });
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
    cart.shipping_methods = [
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
      { id: `ps_card_${cart.id}`, provider_id: 'card', name: 'Credit / Debit Card (Paystack)', is_selected: true },
      { id: `ps_eft_${cart.id}`, provider_id: 'eft', name: 'Instant EFT (OZOW)', is_selected: false }
    ];

    cart.payment_sessions = paymentSessions;
    cart.payment_session = paymentSessions[0];

    res.json({ cart });
  } catch (error: any) {
    errorRes(res, 500, error.message || 'Failed to initialize payment sessions.');
  }
}

// ----- Orders lookup -----

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
