'use client';

import React from 'react';
import { ArrowUpDown, ChevronDown, Shuffle } from 'lucide-react';
import { ThemeClasses } from '@/providers/theme-provider';

export type SortOption = 'random' | 'price-asc' | 'price-desc' | 'newest' | 'rating-desc';

export interface SortProductsProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onReshuffle?: () => void;
  currentTheme: ThemeClasses;
}

/**
 * Medusa-style SortProducts Component
 * Encapsulates the sorting selector and random reshuffle trigger.
 */
export const SortProducts: React.FC<SortProductsProps> = React.memo(({
  sortBy,
  setSortBy,
  onReshuffle,
  currentTheme,
}) => {
  return (
    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
      <label 
        htmlFor="shop-sort-select" 
        className="text-xs font-extrabold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-3 shrink-0 cursor-pointer select-none"
      >
        <span className={`w-7 h-7 rounded-xl ${currentTheme.lightBg} border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 shadow-2xs`}>
          <ArrowUpDown className={`w-3.5 h-3.5 ${currentTheme.text}`} />
        </span>
        <span>Sort By:</span>
      </label>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-60">
          <select
            id="shop-sort-select"
            value={sortBy}
            onChange={(e) => {
              const val = e.target.value as SortOption;
              setSortBy(val);
              if (val === 'random' && onReshuffle) {
                onReshuffle();
              }
            }}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl pl-3.5 pr-9 py-2 text-xs font-extrabold text-slate-800 dark:text-white focus:outline-none transition shadow-2xs cursor-pointer w-full appearance-none"
          >
            <option value="random">Recommended / Random</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            <option value="rating-desc">Highest Rated</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {sortBy === 'random' && onReshuffle && (
          <button
            type="button"
            onClick={onReshuffle}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700 shadow-2xs"
            title="Reshuffle products randomly"
          >
            <Shuffle className="w-3 h-3 text-slate-700 dark:text-slate-200" />
          </button>
        )}
      </div>
    </div>
  );
});

SortProducts.displayName = 'SortProducts';
