'use client';

import React from 'react';
import { ShoppingBag, RotateCcw } from 'lucide-react';
import { MockProduct } from '@/types';
import { ThemeClasses } from '@/providers/theme-provider';
import { ProductPreview } from '@modules/store/components/product-preview';
import { ProductListItem } from '@modules/store/components/product-preview/product-list-item';

export interface PaginatedProductsProps {
  products: MockProduct[];
  wishlist: string[];
  gridView: 'cols-4' | 'list';
  activeFiltersCount: number;
  selectedCategory: string;
  selectedBrand: string;
  searchQuery: string;
  onResetFilters: () => void;
  onSelectProduct: (id: string) => void;
  onToggleWishlist: (id: string, name: string) => void;
  onQuickView?: (product: MockProduct) => void;
  currentTheme: ThemeClasses;
}

/**
 * Medusa-style PaginatedProducts Component
 * Manages rendering of filtered product catalogs, empty states, and layout toggling (Grid vs List).
 */
export const PaginatedProducts: React.FC<PaginatedProductsProps> = React.memo(({
  products,
  wishlist,
  gridView,
  activeFiltersCount,
  selectedCategory,
  selectedBrand,
  searchQuery,
  onResetFilters,
  onSelectProduct,
  onToggleWishlist,
  onQuickView,
  currentTheme,
}) => {
  return (
    <div className="space-y-6">
      {/* Results count header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wide uppercase px-1">
        <span>
          Displaying {products.length} {products.length === 1 ? 'product' : 'products'}
        </span>
        {activeFiltersCount > 0 && (
          <button 
            type="button"
            onClick={onResetFilters} 
            className={`${currentTheme.text} hover:underline cursor-pointer lowercase flex items-center gap-1 font-bold`}
          >
            <RotateCcw className="w-3 h-3" /> clear all filters
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl py-16 text-center shadow-xs space-y-3 px-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">No products matched your criteria</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn&apos;t find any items matching &ldquo;{selectedCategory !== 'All' ? selectedCategory : ''} {selectedBrand !== 'All' ? selectedBrand : ''} {searchQuery}&rdquo;. Try resetting your filters.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className={`mt-3 px-5 py-2.5 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs ${currentTheme.bg}`}
          >
            Reset All Filters
          </button>
        </div>
      ) : gridView === 'list' ? (
        /* LIST VIEW: One product on each line */
        <div className="space-y-4">
          {products.map((prod) => (
            <ProductListItem
              key={prod.id}
              product={prod}
              isWishlisted={wishlist.includes(prod.id)}
              onSelectProduct={onSelectProduct}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              currentTheme={currentTheme}
            />
          ))}
        </div>
      ) : (
        /* GRID VIEW (4-Column dense grid) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((prod) => (
            <ProductPreview
              key={prod.id}
              product={prod}
              isWishlisted={wishlist.includes(prod.id)}
              onSelectProduct={onSelectProduct}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              currentTheme={currentTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
});

PaginatedProducts.displayName = 'PaginatedProducts';
export default PaginatedProducts;
