'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Layers, ArrowRight, Tag } from 'lucide-react';
import { useCatalog } from '@/providers/catalog-provider';
import { SafeImage } from '@modules/common/components/safe-image';

interface CategoriesDropdownProps {
  pathname: string;
  currentTheme: {
    bg: string;
    lightBg: string;
    text: string;
    badge: string;
    shadow: string;
  };
}

export const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  pathname,
  currentTheme,
}) => {
  const router = useRouter();
  const { categories } = useCatalog();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCategoriesActive =
    pathname === '/categories' || pathname.startsWith('/category/');

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // Preview up to 5 featured categories
  const previewCategories = (categories || []).slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className="relative"
    >
      <div className="flex items-center">
        <Link
          href="/categories"
          onClick={() => setIsOpen(false)}
          className={`pl-2.5 lg:pl-3 pr-1 py-1.5 rounded-l-full transition-all duration-200 cursor-pointer outline-none ${
            isCategoriesActive
              ? `${currentTheme.lightBg} font-bold shadow-2xs`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          Categories
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Toggle categories menu"
          className={`pr-2 lg:pr-2.5 pl-0.5 py-1.5 rounded-r-full transition-all duration-200 cursor-pointer outline-none flex items-center ${
            isCategoriesActive
              ? `${currentTheme.lightBg}`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${
              isOpen ? 'rotate-180 text-slate-700 dark:text-slate-300' : ''
            }`}
          />
        </button>
      </div>

      {/* Categories Dropdown Popover */}
      <div
        className={`absolute top-[calc(100%+6px)] left-0 w-72 sm:w-80 popover-surface rounded-2xl border border-card p-2 transition-all duration-150 z-50 transform origin-top-left shadow-xl shadow-slate-900/10 dark:shadow-black/40 before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3 ${
          isOpen
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible translate-y-1 pointer-events-none'
        }`}
      >
        <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Browse Categories
          </span>
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="py-1 space-y-0.5 max-h-[320px] overflow-y-auto">
          {previewCategories.map((cat) => {
            const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
            const isActiveCat = pathname === `/category/${slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${slug}`}
                onClick={() => setIsOpen(false)}
                className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition ${
                  isActiveCat
                    ? `${currentTheme.lightBg} ${currentTheme.text} dark:bg-blue-950/60 dark:text-blue-400`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                    <SafeImage
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      placeholderType="product"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold truncate text-slate-800 dark:text-slate-100">
                      {cat.name}
                    </div>
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[170px]">
                        {cat.subcategories.map((s) => s.name).join(', ')}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[170px]">
                        {cat.description || 'Browse products'}
                      </div>
                    )}
                  </div>
                </div>

                {typeof cat.itemCount === 'number' && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                    {cat.itemCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            href="/categories"
            onClick={() => setIsOpen(false)}
            className={`w-full text-center px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${currentTheme.lightBg} ${currentTheme.text} hover:opacity-90 dark:bg-blue-950/60 dark:text-blue-400`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore All Categories</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
