import { MockProduct, CartItem, ProductsSettings } from '../types';

export const CURRENCY_SYMBOL = 'R';
export const CURRENCY_CODE = 'ZAR';

export const parsePriceNumber = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export function formatCurrency(val: string | number | undefined | null, showCode = false): string {
  const num = parsePriceNumber(val);
  const formatted = num.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return showCode ? `R${formatted} ZAR` : `R${formatted}`;
}

export function getProductPrices(
  product: MockProduct | any,
  productsSettings?: ProductsSettings
) {
  const globalRetailMarkup = productsSettings?.globalRetailMarkup ?? 50;
  const globalWholesaleMarkup = productsSettings?.globalWholesalePrice ?? 20;
  const minWholesaleQty = product?.minWholesaleQuantity || productsSettings?.minWholesaleQuantity || 6;

  const costVal = parsePriceNumber(product?.costPrice);
  const explicitRetailVal = parsePriceNumber(product?.retailMarkupPrice || product?.retailPrice);
  const explicitWholesaleVal = parsePriceNumber(product?.wholesalePrice);
  const originalVal = parsePriceNumber(product?.originalPrice);
  const basePriceVal = parsePriceNumber(product?.price);

  let wholesalePrice = 0;
  let retailPrice = 0;

  if (explicitWholesaleVal > 0) {
    wholesalePrice = explicitWholesaleVal;
  } else if (costVal > 0) {
    wholesalePrice = costVal * (1 + globalWholesaleMarkup / 100);
  } else {
    wholesalePrice = basePriceVal > 0 ? basePriceVal : 96.00;
  }

  if (explicitRetailVal > 0) {
    retailPrice = explicitRetailVal;
  } else if (originalVal > 0 && originalVal > wholesalePrice) {
    retailPrice = originalVal;
  } else if (costVal > 0) {
    retailPrice = costVal * (1 + globalRetailMarkup / 100);
  } else {
    const markupFactor = (1 + globalRetailMarkup / 100) / Math.max(1, (1 + globalWholesaleMarkup / 100));
    retailPrice = wholesalePrice * (markupFactor > 1 ? markupFactor : 1.25);
  }

  return {
    costPrice: costVal,
    retailPrice: Number(retailPrice.toFixed(2)),
    wholesalePrice: Number(wholesalePrice.toFixed(2)),
    minWholesaleQuantity: minWholesaleQty
  };
}

export function getCartItemUnitPrice(
  item: {
    quantity: number;
    retailPrice?: number;
    wholesalePrice?: number;
    minWholesaleQuantity?: number;
    price?: number;
  },
  productInCatalog?: MockProduct | any,
  productsSettings?: ProductsSettings
): number {
  let retailPrice = item.retailPrice;
  let wholesalePrice = item.wholesalePrice;
  let minWholesaleQty = item.minWholesaleQuantity;

  if (!retailPrice || !wholesalePrice || !minWholesaleQty) {
    if (productInCatalog) {
      const p = getProductPrices(productInCatalog, productsSettings);
      retailPrice = p.retailPrice;
      wholesalePrice = p.wholesalePrice;
      minWholesaleQty = p.minWholesaleQuantity;
    } else {
      wholesalePrice = wholesalePrice || item.price || 96.00;
      retailPrice = retailPrice || Number((wholesalePrice * 1.25).toFixed(2));
      minWholesaleQty = minWholesaleQty || productsSettings?.minWholesaleQuantity || 6;
    }
  }

  if (item.quantity < minWholesaleQty) {
    return retailPrice;
  }
  return wholesalePrice;
}
