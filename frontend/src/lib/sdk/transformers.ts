import { MockProduct, CartItem } from '../../types';
import { slugify } from '../../utils/seoUtils';

/**
 * Transforms a raw or backend product into the storefront UI product format.
 */
export function medusaProductToUiProduct(prod: any, currency: string = 'zar'): MockProduct {
  if (!prod) {
    return {
      id: 'default',
      name: 'Product',
      price: 'R 0.00',
      imageUrl: '',
      url: '/product/default'
    };
  }

  const numericPrice = typeof prod.numericPrice === 'number'
    ? prod.numericPrice
    : (typeof prod.price === 'number' ? prod.price : parseFloat(String(prod.price || '0').replace(/[^0-9.]/g, '')) || 0);

  const formattedPrice = typeof prod.price === 'string' && prod.price.startsWith('R')
    ? prod.price
    : `R ${numericPrice.toFixed(2)}`;

  const images = Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : [];
  const thumbnail = prod.imageUrl || prod.thumbnail || images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  return {
    id: String(prod.id),
    name: prod.name || prod.title || 'Product',
    price: formattedPrice,
    retailPrice: prod.retailPrice || formattedPrice,
    originalPrice: prod.originalPrice || formattedPrice,
    isSale: prod.isSale ?? false,
    imageUrl: thumbnail,
    images: images.length > 0 ? images : [thumbnail],
    stock: prod.stock ?? 50,
    url: prod.url || `/product/${prod.handle || prod.id}`,
    description: prod.description || '',
    category: prod.category || prod.categories?.[0]?.name || 'General',
    categoryId: prod.categoryId ? Number(prod.categoryId) : 1,
    sku: prod.sku || `SKU-${prod.id}`,
    tags: Array.isArray(prod.tags) ? prod.tags.map((t: any) => typeof t === 'string' ? t : t.value || '') : [],
    rating: prod.rating ?? 4.8,
    reviewsCount: prod.reviewsCount ?? 12,
    offers: prod.offers || []
  };
}

/**
 * Transforms a UI product into standard object format.
 */
export function uiProductToMedusaProduct(uiProduct: MockProduct): any {
  const cleanPriceStr = (uiProduct.price || '0').replace(/[^0-9.]/g, '');
  const numericPrice = parseFloat(cleanPriceStr) || 0;
  const handle = slugify(uiProduct.name) || `prod-${uiProduct.id}`;

  return {
    id: uiProduct.id,
    title: uiProduct.name,
    handle,
    description: uiProduct.description || '',
    thumbnail: uiProduct.imageUrl,
    images: (uiProduct.images || [uiProduct.imageUrl]).map((url, i) => ({ id: `img_${uiProduct.id}_${i}`, url })),
    price: numericPrice,
    formattedPrice: uiProduct.price,
    stock: uiProduct.stock ?? 50,
    category: uiProduct.category,
    categoryId: uiProduct.categoryId
  };
}

/**
 * Transforms a line item into a CartItem.
 */
export function medusaLineItemToCartItem(line: any): CartItem {
  const numericPrice = typeof line.price === 'number'
    ? line.price
    : (typeof line.unit_price === 'number' ? line.unit_price : 0);

  return {
    id: line.id || `item_${Date.now()}`,
    productId: line.productId || line.variant_id || line.id,
    name: line.name || line.title || 'Cart Item',
    price: numericPrice,
    retailPrice: numericPrice,
    imageUrl: line.imageUrl || line.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    quantity: line.quantity || 1,
  };
}

export function cartItemToMedusaLineItem(item: CartItem, cartId?: string): any {
  return {
    id: item.id,
    cart_id: cartId,
    title: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    thumbnail: item.imageUrl,
    productId: item.productId
  };
}
