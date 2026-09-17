'use client';

import React from 'react';
import { clx } from '@/lib/util/clx';

export interface CategoryPillProps {
  id: string | number;
  name: string;
  isSelected: boolean;
  activeStyle: string;
  hoverStyle: string;
  onSelect: (categoryName: string, categoryId?: string | number) => void;
  dragDistance: number;
}

/**
 * CategoryPill Sub-Component
 * Renders a single interactive category pill with drag-threshold protection and active state styling.
 */
export const CategoryPill: React.FC<CategoryPillProps> = React.memo(({
  id,
  name,
  isSelected,
  activeStyle,
  hoverStyle,
  onSelect,
  dragDistance,
}) => {
  const handleClick = () => {
    if (dragDistance < 6) {
      onSelect(name, id);
    }
  };

  return (
    <button
      id={`cat-btn-${id}`}
      data-category-name={name.toLowerCase()}
      type="button"
      onClick={handleClick}
      className={clx(
        'shrink-0 px-3.5 sm:px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
        isSelected
          ? activeStyle
          : clx(
              'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 shadow-2xs hover:bg-slate-200/90 dark:hover:bg-slate-700',
              hoverStyle
            )
      )}
    >
      {name}
    </button>
  );
});

CategoryPill.displayName = 'CategoryPill';
