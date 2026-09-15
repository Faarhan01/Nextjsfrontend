'use client';

import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  X, 
  Check, 
  Tag, 
  Star 
} from 'lucide-react';
import { ThemeClasses } from '@/providers/theme-provider';
import { MockProduct } from '@/types';
import { CategoryIcon } from './category-icon';

export interface RatingOption {
  id: string;
  label: string;
}

export const DEFAULT_RATING_OPTIONS: RatingOption[] = [
  { id: 'all', label: 'All Reviews' },
  { id: '4.5', label: '4.5★ & above' },
  { id: '4.0', label: '4.0★ & above' },
  { id: '3.5', label: '3.5★ & above' },
];

export interface RefinementListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
  selectedRating: string;
  setSelectedRating: (rating: string) => void;
  ratingOptions?: RatingOption[];
  products: MockProduct[];
  activeFiltersCount: number;
  resetAllFilters: () => void;
  currentTheme: ThemeClasses;
  className?: string;
}

/**
 * Medusa-style RefinementList Component
 * Renders the filter sidebar containing search, category filters, brand filters, and rating filters.
 */
export const RefinementList: React.FC<RefinementListProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  selectedBrand,
  setSelectedBrand,
  availableBrands,
  selectedRating,
  setSelectedRating,
  ratingOptions = DEFAULT_RATING_OPTIONS,
  products,
  activeFiltersCount,
  resetAllFilters,
  currentTheme,
  className = '',
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight flex items-center gap-2">
          <SlidersHorizontal className={`w-4 h-4 ${currentTheme.text}`} /> Filter Catalog
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            type="button"
            onClick={resetAllFilters}
            className={`text-[11px] font-extrabold ${currentTheme.text} flex items-center gap-1 cursor-pointer transition hover:underline`}
          >
            <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Search Products
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Select */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Select Category
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1.5 scrollbar-thin">
          {availableCategories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                  isSelected 
                    ? `${currentTheme.bg} text-white shadow-xs` 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CategoryIcon
                    category={cat}
                    className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-500'} shrink-0`}
                  />
                  <span className="truncate">{cat}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                    {count}
                  </span>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Select */}
      {availableBrands.length > 1 && (
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Filter by Brand
          </label>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1.5 scrollbar-thin">
            {availableBrands.map((brandName) => {
              const isSelected = selectedBrand.toLowerCase() === brandName.toLowerCase();
              const count = brandName === 'All'
                ? products.length
                : products.filter(p => p.brand?.toLowerCase() === brandName.toLowerCase()).length;

              return (
                <button
                  key={brandName}
                  type="button"
                  onClick={() => setSelectedBrand(brandName)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                    isSelected 
                      ? `${currentTheme.bg} text-white shadow-xs` 
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-400'} shrink-0`} />
                    <span className="truncate">{brandName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                      {count}
                    </span>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Rating Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          Filter by Rating
        </label>
        <div className="space-y-1">
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRating(opt.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                  isSelected 
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold' 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export * from './category-icon';
export * from './sort-products';
export default RefinementList;
