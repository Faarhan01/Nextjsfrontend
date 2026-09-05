export interface ProductSaleDetails {
  isOnSale: boolean;
  isSale: boolean;
  salePrice: string;
  originalPrice?: string;
  discountPercentage?: number;
  badgeText?: string;
}

export function getProductSaleDetails(product: any): ProductSaleDetails {
  if (!product) {
    return { isOnSale: false, isSale: false, salePrice: '0' };
  }
  const isSale = Boolean(product.isSale || product.originalPrice);
  const badgeText = product.saleBadgeText || (isSale ? 'SALE' : undefined);
  
  let discountPercentage: number | undefined;
  if (product.originalPrice && product.price) {
    const orig = parseFloat(String(product.originalPrice).replace(/[^0-9.]/g, ''));
    const curr = parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
    if (orig > 0 && curr < orig) {
      discountPercentage = Math.round(((orig - curr) / orig) * 100);
    }
  }

  return {
    isOnSale: isSale,
    isSale,
    salePrice: product.price || '0',
    originalPrice: product.originalPrice,
    discountPercentage,
    badgeText
  };
}
