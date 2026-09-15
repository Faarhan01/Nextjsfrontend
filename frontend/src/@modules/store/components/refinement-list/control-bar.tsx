'use client';

import React from 'react';
import { 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  List 
} from 'lucide-react';
import { ThemeClasses } from '@/providers/theme-provider';
import { SortProducts, SortOption } from './sort-products';

export interface ControlBarProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onReshuffle?: () => void;
  gridView: 'cols-4' | 'list';
  setGridView: (view: 'cols-4' | 'list') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  activeFiltersCount: number;
  onOpenMobileFilters: () => void;
  currentTheme: ThemeClasses;
}

/**
 * Medusa-style ControlBar Component
 * Renders the top bar with Sort selector, active filter chips, mobile drawer toggle, and layout switcher.
 */
export const ControlBar: React.FC<ControlBarProps> = React.memo(({
  sortBy,
  setSortBy,
  onReshuffle,
  gridView,
  setGridView,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  activeFiltersCount,
  onOpenMobileFilters,
  currentTheme,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      {/* Sort Dropdown Filter */}
      <SortProducts
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReshuffle={onReshuffle}
        currentTheme={currentTheme}
      />

      <div className="flex items-center justify-between sm:justify-end gap-3">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={`${currentTheme.bg} text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center`}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Active filters pill list */}
        {activeFiltersCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {selectedCategory !== 'All' && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${currentTheme.lightBg} text-[11px] font-bold border border-slate-200/80 dark:border-slate-700/80 shadow-2xs`}>
                Category: {selectedCategory}
                <button 
                  type="button"
                  onClick={() => setSelectedCategory('All')} 
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrand !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                Brand: {selectedBrand}
                <button 
                  type="button"
                  onClick={() => setSelectedBrand('All')} 
                  className="hover:text-slate-900 dark:hover:text-white cursor-pointer ml-0.5"
                  aria-label="Remove brand filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Layout Grid vs List view toggler */}
        <div className="flex items-center border border-slate-200 dark:border-slate-700 p-1 rounded-xl bg-slate-50 dark:bg-slate-800">
          <button 
            type="button"
            onClick={() => setGridView('cols-4')}
            className={`p-1.5 px-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              gridView === 'cols-4' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button 
            type="button"
            onClick={() => setGridView('list')}
            className={`p-1.5 px-2.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              gridView === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>
    </div>
  );
});

ControlBar.displayName = 'ControlBar';
export default ControlBar;
