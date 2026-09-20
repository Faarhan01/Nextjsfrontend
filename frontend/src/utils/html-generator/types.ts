import { MockProduct, SlideConfig } from '@/types';

export interface GenerateTemplateOptions {
  storeName?: string;
  themeColor?: string;
  products?: MockProduct[];
  categories?: any[];
  slides?: SlideConfig[];
}

export interface SerializedProduct {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  originalPriceNum?: number;
  imageUrl: string;
  category: string;
  isSale: boolean;
  saleBadgeText?: string;
  isFeatured: boolean;
  sellerName: string;
  rating: number;
  reviewsCount: number;
  stockCount: number;
  description: string;
}

export interface ThemeColors {
  primary: string;
  hover: string;
  light: string;
  border: string;
  ring: string;
}

export const THEME_HEX_MAP: Record<string, ThemeColors> = {
  blue: { primary: '#2563eb', hover: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe', ring: 'rgba(37, 99, 235, 0.25)' },
  emerald: { primary: '#059669', hover: '#047857', light: '#ecfdf5', border: '#a7f3d0', ring: 'rgba(5, 150, 105, 0.25)' },
  indigo: { primary: '#4f46e5', hover: '#4338ca', light: '#eef2ff', border: '#c7d2fe', ring: 'rgba(79, 70, 229, 0.25)' },
  rose: { primary: '#e11d48', hover: '#be123c', light: '#fff1f2', border: '#fecdd3', ring: 'rgba(225, 29, 72, 0.25)' },
  amber: { primary: '#d97706', hover: '#b45309', light: '#fffbeb', border: '#fde68a', ring: 'rgba(217, 119, 6, 0.25)' },
  slate: { primary: '#0f172a', hover: '#1e293b', light: '#f8fafc', border: '#cbd5e1', ring: 'rgba(15, 23, 42, 0.25)' },
};

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function serializeProduct(p: any, index: number = 0): SerializedProduct {
  const parsedPriceNum = typeof p.price === 'number'
    ? p.price
    : parseFloat(String(p.price || '499').replace(/[^0-9.]/g, '')) || 499;

  const parsedOrigNum = p.originalPrice
    ? (typeof p.originalPrice === 'number' ? p.originalPrice : parseFloat(String(p.originalPrice).replace(/[^0-9.]/g, '')))
    : undefined;

  const formattedPrice = `R${parsedPriceNum.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formattedOriginalPrice = parsedOrigNum
    ? `R${parsedOrigNum.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : undefined;

  const sellerName = p.primarySellerName || (p.offers && p.offers[0]?.sellerName) || 'Mrbulk Official ZA';
  const rating = p.rating || (p.offers && p.offers[0]?.rating) || Number((4.6 + ((index % 5) * 0.08)).toFixed(1));
  const reviewsCount = p.reviewsCount || (p.offers && p.offers[0]?.reviewsCount) || (24 + (index * 7));

  return {
    id: p.id || `prod-${index + 1}`,
    name: p.name || p.title || 'Product Item',
    price: formattedPrice,
    priceNum: parsedPriceNum,
    originalPrice: formattedOriginalPrice,
    originalPriceNum: parsedOrigNum,
    imageUrl: p.imageUrl || p.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    category: p.category || (p.categoryName) || 'General Merchandise',
    isSale: !!p.isSale || !!parsedOrigNum,
    saleBadgeText: p.saleBadgeText || (parsedOrigNum ? `${Math.round(((parsedOrigNum - parsedPriceNum) / parsedOrigNum) * 100)}% OFF` : 'SALE'),
    isFeatured: !!p.isFeatured,
    sellerName,
    rating,
    reviewsCount,
    stockCount: p.inventoryQuantity ?? p.stockCount ?? 15,
    description: p.description || 'Authentic certified merchandise with manufacturer warranty across South Africa.',
  };
}
