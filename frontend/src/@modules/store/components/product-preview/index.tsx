'use client';

import React from 'react';
import { Heart, Eye, Tag, Crown, Star } from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { MockProduct } from '@/types';
import { getProductSaleDetails } from '@/utils/productUtils';
import { getProductRatingDetails } from '@/utils/productRating';
import { formatCurrency } from '@/utils/pricing';
import { ThemeClasses } from '@/providers/theme-provider';

export interface ProductPreviewProps {
  product: MockProduct;
  isWishlisted: boolean;
  onSelectProduct: (id: string) => void;
  onToggleWishlist: (id: string, name: string) => void;
  onQuickView?: (product: MockProduct) => void;
  currentTheme: ThemeClasses;
}

/**
 * Medusa-style ProductPreview Component
 * Renders a high-density 4-column responsive product card for the catalog grid.
 */
export const ProductPreview: React.FC<ProductPreviewProps> = React.memo(({
  product,
  isWishlisted,
  onSelectProduct,
  onToggleWishlist,
  onQuickView,
  currentTheme,
}) => {
  const sale = getProductSaleDetails(product);
  const ratingInfo = getProductRatingDetails(product);

  return (
    <div 
      className="bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
    >
      {/* Image Container */}
      <div 
        onClick={() => onSelectProduct(product.id)}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-700/50 cursor-pointer"
      >
        <SafeImage 
          src={product.imageUrl} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          alt={product.name} 
          placeholderType="product"
          fallbackTitle={product.name}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {sale.isSale && (
            <div className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50 whitespace-nowrap">
              <Tag className="w-2.5 h-2.5 text-white" />
              <span>{sale.badgeText}</span>
            </div>
          )}
          {(product.isFeatured || (!sale.isSale && product.isFeatured !== false)) && (
            <div className="px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white font-extrabold text-[11px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1 whitespace-nowrap">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* Top-Right Action Stack */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id, product.name);
            }}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 stroke-[2.5] ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:text-blue-600 shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer"
              title="Quick View"
            >
              <Eye className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
        <div className="cursor-pointer" onClick={() => onSelectProduct(product.id)}>
          {product.category && (
            <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-1 truncate">
              <span>{product.category}</span>
            </div>
          )}
          <h3 className={`text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white ${currentTheme.groupHoverText} transition-colors line-clamp-2 leading-snug w-full min-h-[2.5rem]`}>
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap mt-2" suppressHydrationWarning>
            <StockBadge product={product} />
            {ratingInfo.hasReviews ? (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/50 px-1.5 py-0.5 rounded-md border border-amber-200/50 dark:border-amber-900/50 text-xs font-bold w-max" suppressHydrationWarning>
                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 shrink-0" />
                <span>{ratingInfo.ratingFormatted}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700 text-xs font-medium w-max" suppressHydrationWarning>
                <Star className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 shrink-0" />
                <span>0.0</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700/80">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-normal">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductPreview.displayName = 'ProductPreview';
export default ProductPreview;
