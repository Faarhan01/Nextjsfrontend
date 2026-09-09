'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MockProduct } from '@/types';
import { SafeImage } from '@modules/common/components/safe-image';
import { getProductUrl } from '@/utils/seoUtils';
import { formatCurrency } from '@/utils/pricing';

export interface RecentlyViewedSectionProps {
  products: MockProduct[];
  recentlyViewedIds?: string[];
  currentProductId?: string;
  onSelectProduct?: (productId: string) => void;
  title?: string;
  maxItems?: number;
  className?: string;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  products,
  recentlyViewedIds,
  currentProductId,
  onSelectProduct,
  title = "Recently Viewed Items",
  maxItems = 10,
  className = ""
}) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive recently viewed products list
  const recentProds = React.useMemo(() => {
    let ids: string[] = [];
    if (recentlyViewedIds && recentlyViewedIds.length > 0) {
      ids = recentlyViewedIds;
    } else if (mounted) {
      try {
        const saved = localStorage.getItem('luxestore_recently_viewed');
        if (saved) {
          ids = JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error reading recently viewed from localStorage:', e);
      }
    }

    if (currentProductId) {
      ids = ids.filter((id) => id !== currentProductId);
    }

    return ids
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is MockProduct => Boolean(p))
      .slice(0, maxItems);
  }, [products, recentlyViewedIds, currentProductId, maxItems, mounted]);

  if (!mounted || recentProds.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1">
            {recentProds.length} {recentProds.length === 1 ? 'item' : 'items'}
          </span>
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
            aria-label="Scroll left"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer active:scale-95"
            aria-label="Scroll right"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 overflow-x-auto scrollbar-none py-1 scroll-smooth snap-x snap-mandatory"
      >
        {recentProds.map((rp) => (
          <a
            key={rp.id}
            href={getProductUrl(rp.id, rp.name)}
            onClick={(e) => {
              e.preventDefault();
              if (onSelectProduct) {
                onSelectProduct(rp.id);
              } else {
                router.push(getProductUrl(rp.id, rp.name));
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-slate-50/70 dark:bg-slate-700/60 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 rounded-2xl p-3 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between w-44 sm:w-52 shrink-0 snap-start snap-always block no-underline"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 mb-2 border border-slate-100 dark:border-slate-600/80">
              <SafeImage
                src={rp.imageUrl}
                alt={rp.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                placeholderType="product"
                fallbackTitle={rp.name}
              />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {rp.name}
              </h4>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(rp.price)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
