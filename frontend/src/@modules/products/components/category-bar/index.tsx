'use client';

import React, { useMemo } from 'react';
import { MockCategoryPreset } from '@/data/presets';
import { formatCategoryName } from '@/utils/seoUtils';
import { useThemeContext, getThemeClasses, ThemeClasses } from '@/providers/theme-provider';
import { clx } from '@/lib/util/clx';
import { CategoryNavButton } from './category-nav-button';
import { CategoryPill } from './category-pill';
import { useCategoryScroll } from './use-category-scroll';

export interface CategoryBarProps {
  categories: MockCategoryPreset[];
  products?: any[];
  selectedCategory?: string;
  onSelectCategory: (categoryName: string, categoryId?: number | string) => void;
  onViewAllCategories?: () => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  currentTheme?: ThemeClasses;
  className?: string;
}

export type CategoryBarCarouselProps = CategoryBarProps;

/**
 * MedusaJS Storefront Category Navigation Control Bar
 * 
 * Provides an interactive horizontal carousel for storefront categories:
 * - Clean atomic sub-components (CategoryNavButton, CategoryPill)
 * - Extracted touch & drag gesture scroll hook (useCategoryScroll)
 * - Strict preservation of responsive padding, styling, and color theme integration
 */
export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  themeColor,
  currentTheme,
  className = '',
}) => {
  const themeCtx = useThemeContext();
  const effectiveThemeColor = themeColor || themeCtx?.themeColor || 'blue';
  const effectiveTheme = currentTheme || getThemeClasses(effectiveThemeColor);

  const normalizedSelectedCategory = useMemo(() => {
    return formatCategoryName(selectedCategory, categories);
  }, [selectedCategory, categories]);

  const allItems = useMemo(() => [
    { id: 'all', name: 'All' } as { id: string | number; name: string },
    ...categories,
  ], [categories]);

  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    dragDistance,
    checkScrollBoundaries,
    handleScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
  } = useCategoryScroll({
    selectedCategoryName: normalizedSelectedCategory,
    itemCount: allItems.length,
  });

  // Theme-driven active styles
  const activeStyle = useMemo(() => {
    if (effectiveTheme?.bg) {
      return `${effectiveTheme.bg} text-white shadow-xs font-bold`;
    }
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-600 text-white shadow-xs font-bold',
      indigo: 'bg-indigo-600 text-white shadow-xs font-bold',
      emerald: 'bg-emerald-600 text-white shadow-xs font-bold',
      rose: 'bg-rose-600 text-white shadow-xs font-bold',
      amber: 'bg-amber-600 text-white shadow-xs font-bold',
      slate: 'bg-slate-900 text-white shadow-xs font-bold',
    };
    return colorMap[effectiveThemeColor] || 'bg-blue-600 text-white shadow-xs font-bold';
  }, [effectiveTheme, effectiveThemeColor]);

  const hoverStyle = useMemo(() => {
    const hoverMap: Record<string, string> = {
      blue: 'hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800',
      indigo: 'hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-800',
      emerald: 'hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800',
      rose: 'hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-800',
      amber: 'hover:text-amber-600 hover:border-amber-200 dark:hover:border-amber-800',
      slate: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600',
    };
    return hoverMap[effectiveThemeColor] || 'hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800';
  }, [effectiveThemeColor]);

  return (
    <section
      id="category-carousel-bar"
      className={clx('w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8', className)}
      aria-label="Category Navigation"
    >
      <div className="relative flex items-center gap-1.5 sm:gap-2.5 bg-transparent rounded-2xl p-1 sm:p-1.5">
        <CategoryNavButton
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => handleScroll('left')}
        />

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollBoundaries}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-0.5 select-none scroll-smooth cursor-grab active:cursor-grabbing w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {allItems.map((cat) => {
            const isSelected = normalizedSelectedCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <CategoryPill
                key={cat.id}
                id={cat.id}
                name={cat.name}
                isSelected={isSelected}
                activeStyle={activeStyle}
                hoverStyle={hoverStyle}
                onSelect={onSelectCategory}
                dragDistance={dragDistance}
              />
            );
          })}
        </div>

        <CategoryNavButton
          direction="right"
          disabled={!canScrollRight}
          onClick={() => handleScroll('right')}
        />
      </div>
    </section>
  );
};

export const CategoryBarCarousel = CategoryBar;

export * from './category-pill';
export * from './category-nav-button';
export * from './use-category-scroll';

export default CategoryBar;
