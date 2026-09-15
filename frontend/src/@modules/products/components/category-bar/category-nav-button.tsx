'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CategoryNavButtonProps {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  id?: string;
}

/**
 * CategoryNavButton Sub-Component
 * Accessible scroll button for navigating the category track left/right.
 */
export const CategoryNavButton: React.FC<CategoryNavButtonProps> = React.memo(({
  direction,
  disabled,
  onClick,
  id,
}) => {
  const isLeft = direction === 'left';
  const label = isLeft ? 'Scroll left' : 'Scroll right';
  const defaultId = isLeft ? 'category-carousel-prev' : 'category-carousel-next';

  return (
    <button
      id={id || defaultId}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        !disabled
          ? 'opacity-100 hover:bg-slate-200/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white cursor-pointer'
          : 'opacity-25 cursor-not-allowed pointer-events-none'
      }`}
    >
      {isLeft ? (
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      ) : (
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      )}
    </button>
  );
});

CategoryNavButton.displayName = 'CategoryNavButton';
