import {
  MedusaProduct,
  MedusaProductVariant,
  MedusaLineItem
} from '../../types/medusa';
import { MockWooProduct, CartItem } from '../../types';
import { slugify } from '../../utils/seoUtils';

/**
 * Transforms a Medusa product into the storefront UI product format.
 */
export function medusaProductToUiProduct(medusa: MedusaProduct, currency: string = 'zar'): MockWooProduct {
  const primaryVariant = medusa.variants?.[0];
  const priceObj = primaryVariant?.prices?.find(p => p.currency_code.toLowerCase() === currency.toLowerCase()) || primaryVariant?.prices?.[0];
  
  // Medusa usually stores prices in smallest currency unit (cents), but handle both decimal & integer cents
  const rawAmount = priceObj?.amount ?? 0;
  const numericPrice = rawAmount > 500 ? (rawAmount / 100) : rawAmount;
  const formattedPrice = `R ${numericPrice.toFixed(2)}`;

  const images = medusa.images?.map(img => img.url) || [];
  const thumbnail = medusa.thumbnail || images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const category = medusa.categories?.[0];

  return {
    id: medusa.id,
    name: medusa.title,
    price: formattedPrice,
    retailPrice: formattedPrice,
    originalPrice: formattedPrice,
    isSale: false,
    imageUrl: thumbnail,
    images: images.length > 0 ? images : [thumbnail],
    stock: primaryVariant?.inventory_quantity ?? 50,
    url: `/product/${medusa.handle || medusa.id}`,
    description: medusa.description || '',
    category: category?.name || 'General',
    categoryId: category?.id ? parseInt(category.id.replace(/\D/g, ''), 10) || 1 : 1,
    sku: primaryVariant?.sku || `MED-${medusa.id.slice(0, 6)}`,
    tags: medusa.tags?.map(t => t.value) || [],
    rating: 4.8,
    reviewsCount: 12,
    offers: []
  };
}

/**
 * Transforms a UI product (MockWooProduct) into a compliant MedusaProduct.
 */
export function uiProductToMedusaProduct(uiProduct: MockWooProduct): MedusaProduct {
  const cleanPriceStr = (uiProduct.price || '0').replace(/[^0-9.]/g, '');
  const numericPrice = parseFloat(cleanPriceStr) || 0;
  // Medusa uses cents: R100 -> 10000
  const centsAmount = Math.round(numericPrice * 100);

  const handle = slugify(uiProduct.name) || `prod-${uiProduct.id}`;

  const variant: MedusaProductVariant = {
    id: `variant_${uiProduct.id}`,
    title: 'Default Variant',
    product_id: uiProduct.id,
    sku: uiProduct.sku || `SKU-${uiProduct.id}`,
    barcode: uiProduct.barcode,
    inventory_quantity: uiProduct.stock ?? 100,
    allow_backorder: false,
    manage_inventory: true,
    prices: [
      {
        currency_code: 'zar',
        amount: centsAmount
      },
      {
        currency_code: 'usd',
        amount: Math.round(centsAmount / 18)
      }
    ],
    options: [
      {
        id: `opt_val_${uiProduct.id}`,
        value: 'Default',
        option_id: `opt_${uiProduct.id}`
      }
    ]
  };

  return {
    id: uiProduct.id,
    title: uiProduct.name,
    subtitle: uiProduct.brand,
    description: uiProduct.description,
    handle,
    status: 'published',
    thumbnail: uiProduct.imageUrl,
    images: (uiProduct.images && uiProduct.images.length > 0 ? uiProduct.images : [uiProduct.imageUrl]).map((url, idx) => ({
      id: `img_${uiProduct.id}_${idx}`,
      url
    })),
    options: [
      {
        id: `opt_${uiProduct.id}`,
        title: 'Option',
        product_id: uiProduct.id,
        values: [
          {
            id: `opt_val_${uiProduct.id}`,
            value: 'Default',
            option_id: `opt_${uiProduct.id}`
          }
        ]
      }
    ],
    variants: [variant],
    categories: uiProduct.category ? [
      {
        id: `cat_${uiProduct.categoryId || 1}`,
        name: uiProduct.category,
        handle: slugify(uiProduct.category)
      }
    ] : [],
    tags: (uiProduct.tags || []).map((val, idx) => ({
      id: `tag_${idx}`,
      value: val
    })),
    discountable: true
  };
}

/**
 * Transforms a Medusa line item into storefront CartItem.
 */
export function medusaLineItemToCartItem(item: MedusaLineItem): CartItem {
  const unitPriceDecimal = (item.unit_price || 0) > 500 ? (item.unit_price / 100) : item.unit_price;

  return {
    id: item.id,
    productId: item.variant?.product_id || item.variant_id || item.id,
    name: item.title,
    price: unitPriceDecimal,
    imageUrl: item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    quantity: item.quantity,
    retailPrice: unitPriceDecimal
  };
}

/**
 * Transforms a storefront CartItem into Medusa LineItem input.
 */
export function cartItemToMedusaLineItemInput(item: CartItem): { variant_id: string; quantity: number } {
  return {
    variant_id: `variant_${item.productId || item.id}`,
    quantity: item.quantity
  };
}

/**
 * Format Medusa price (amount in cents or decimal).
 */
export function formatMedusaPrice(amount: number, currencyCode: string = 'ZAR'): string {
  const isCents = amount > 500;
  const standardAmount = isCents ? amount / 100 : amount;
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(standardAmount);
}
