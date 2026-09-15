'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';

export interface StoreBannerProps {
  selectedCategory: string;
  totalProductsCount: number;
  onNavigateHome?: () => void;
}

/**
 * Medusa-style StoreBanner Component
 * Renders the top catalog banner with breadcrumbs, category heading, and catalog stats.
 */
export const StoreBanner: React.FC<StoreBannerProps> = React.memo(({
  selectedCategory,
  totalProductsCount,
  onNavigateHome,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full py-8 sm:py-12 px-4 sm:px-8 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl shadow-sm dark:shadow-xl border border-slate-200/90 dark:border-slate-800">
        <div className="absolute inset-0 z-0">
          <SafeImage 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1400&fm=webp" 
            alt="Shop Catalog"
            placeholderType="banner"
            className="w-full h-full object-cover opacity-60 dark:opacity-75 scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/70 dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950/85" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-3 sm:space-y-4">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 select-none">
            <a 
              href="/" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (onNavigateHome) onNavigateHome();
              }} 
              className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 font-semibold no-underline text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-extrabold">Shop</span>
          </div>

          {/* Badge Pill */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300/80 dark:border-white/20 backdrop-blur-md shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Mrbulk Catalog
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {selectedCategory !== 'All' ? `${selectedCategory} Collection` : 'All Products & Collections'}
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Browse our complete catalog of {totalProductsCount} luxury products with real-time stock and fast delivery.
          </p>
        </div>
      </div>
    </div>
  );
});

StoreBanner.displayName = 'StoreBanner';
export default StoreBanner;
