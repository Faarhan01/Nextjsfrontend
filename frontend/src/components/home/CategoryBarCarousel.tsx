'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MockCategoryPreset } from '../../data/presets';
import { formatCategoryName } from '../../utils/seoUtils';

interface CategoryBarCarouselProps {
  categories: MockCategoryPreset[];
  products?: any[];
  selectedCategory?: string;
  onSelectCategory: (categoryName: string, categoryId?: number | string) => void;
  onViewAllCategories?: () => void;
  themeColor?: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  currentTheme?: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
    badge: string;
    accent: string;
    primaryHex: string;
    shadow: string;
    ring: string;
  };
  className?: string;
}

export const CategoryBarCarousel: React.FC<CategoryBarCarouselProps> = ({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
  themeColor = 'blue',
  currentTheme,
  className = ''
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const normalizedSelectedCategory = useMemo(() => {
    return formatCategoryName(selectedCategory, categories);
  }, [selectedCategory, categories]);

  // Check whether scroll is at bounds
  const checkScrollBoundaries = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    return () => window.removeEventListener('resize', checkScrollBoundaries);
  }, [checkScrollBoundaries, categories]);

  // Scroll active item into view on mount or when selectedCategory changes
  useEffect(() => {
    if (normalizedSelectedCategory && scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(
        `[data-category-name="${normalizedSelectedCategory.toLowerCase()}"]`
      ) as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
    checkScrollBoundaries();
  }, [normalizedSelectedCategory, checkScrollBoundaries]);

  // Smooth scroll handler
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollStep = Math.max(container.clientWidth * 0.6, 220);
    const target = direction === 'left' ? container.scrollLeft - scrollStep : container.scrollLeft + scrollStep;
    container.scrollTo({
      left: target,
      behavior: 'smooth'
    });
    setTimeout(checkScrollBoundaries, 350);
  };

  // Mouse Drag / Touch scrolling handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
    setDragDistance(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    setDragDistance(Math.abs(walk));
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollBoundaries();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Theme-driven active styles
  const activeStyle = currentTheme?.bg
    ? `${currentTheme.bg} text-white shadow-xs`
    : {
        blue: 'bg-blue-600 text-white shadow-xs',
        indigo: 'bg-indigo-600 text-white shadow-xs',
        emerald: 'bg-emerald-600 text-white shadow-xs',
        rose: 'bg-rose-600 text-white shadow-xs',
        amber: 'bg-amber-600 text-white shadow-xs',
        slate: 'bg-slate-900 text-white shadow-xs',
      }[themeColor] || 'bg-blue-600 text-white shadow-xs';

  const hoverStyle = {
    blue: 'hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800',
    indigo: 'hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-800',
    emerald: 'hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800',
    rose: 'hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-800',
    amber: 'hover:text-amber-600 hover:border-amber-200 dark:hover:border-amber-800',
    slate: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600',
  }[themeColor] || 'hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800';

  const allItems = [{ id: 'all', name: 'All' }, ...categories];

  return (
    <section 
      id="category-carousel-bar"
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 ${className}`}
      aria-label="Category Navigation"
    >
      {/* Clean control bar without border */}
      <div className="relative flex items-center bg-transparent rounded-2xl p-1.5 sm:p-2">
        
        {/* Left Scroll Button */}
        <button
          id="category-carousel-prev"
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all cursor-pointer select-none active:scale-95 z-10 ${
            canScrollLeft ? 'opacity-100 hover:bg-slate-200/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white' : 'opacity-30 cursor-not-allowed pointer-events-none'
          }`}
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Left Subtle Gradient Indicator */}
        <div 
          className={`absolute left-10 sm:left-12 top-1.5 bottom-1.5 w-6 bg-gradient-to-r from-white/90 dark:from-slate-950/90 to-transparent pointer-events-none z-1 transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Carousel Scrollable Buttons Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollBoundaries}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none px-2 py-0.5 select-none scroll-smooth cursor-grab active:cursor-grabbing w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {allItems.map((cat) => {
            const isSelected = normalizedSelectedCategory.toLowerCase() === cat.name.toLowerCase();

            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                data-category-name={cat.name.toLowerCase()}
                type="button"
                onClick={() => {
                  if (dragDistance < 6) {
                    onSelectCategory(cat.name, cat.id);
                  }
                }}
                className={`shrink-0 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? activeStyle
                    : `bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 shadow-2xs hover:bg-slate-200/90 dark:hover:bg-slate-700 ${hoverStyle}`
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Right Subtle Gradient Indicator */}
        <div 
          className={`absolute right-10 sm:right-12 top-1.5 bottom-1.5 w-6 bg-gradient-to-l from-white/90 dark:from-slate-950/90 to-transparent pointer-events-none z-1 transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Scroll Button */}
        <button
          id="category-carousel-next"
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-all cursor-pointer select-none active:scale-95 z-10 ${
            canScrollRight ? 'opacity-100 hover:bg-slate-200/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white' : 'opacity-30 cursor-not-allowed pointer-events-none'
          }`}
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

      </div>
    </section>
  );
};

export default CategoryBarCarousel;
