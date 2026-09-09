import React from 'react';

export interface StockBadgeProps {
  product?: {
    stock?: number;
    stockStatus?: string;
    inStock?: boolean;
  };
  stock?: number;
  stockStatus?: string;
  inStock?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | string;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({
  product,
  stock: stockProp,
  stockStatus: statusProp,
  inStock: inStockProp,
  size = 'xs',
  className = ''
}) => {
  const stock = product?.stock ?? stockProp ?? 10;
  const inStock = product?.inStock ?? inStockProp ?? (stock > 0);
  const status = product?.stockStatus ?? statusProp;

  let sizeClass = 'text-[9px] px-1.5 py-0.5';
  if (size === 'sm') sizeClass = 'text-[10px] px-2 py-0.5';
  if (size === 'md') sizeClass = 'text-xs px-2.5 py-1';
  if (size === 'lg') sizeClass = 'text-xs sm:text-sm px-3 py-1.5 font-bold';

  if (status === 'out_of_stock' || stock <= 0 || inStock === false) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-lg font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 ${sizeClass} ${className}`}>
        <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-lg font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 ${sizeClass} ${className}`}>
        <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 animate-pulse" />
        Low Stock ({stock})
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 ${sizeClass} ${className}`}>
      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
      In Stock
    </span>
  );
};

export default StockBadge;
