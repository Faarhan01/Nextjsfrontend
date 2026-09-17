'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { useThemeContext, getThemeClasses } from '@/providers/theme-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { DesktopNavLinks } from '@modules/layout/components/desktop-nav-links';
import { HeaderSearch } from '@modules/layout/components/header-search';
import { HeaderActions } from '@modules/layout/components/header-actions';
import { SearchMegamenuOverlay } from '@modules/layout/components/search-megamenu-overlay';
import { MobileNavDrawer } from '@modules/layout/components/mobile-nav-drawer';
import { clx } from '@/lib/util/clx';

/**
 * MedusaJS Storefront Navigation Template
 * Adopts the Medusa Next.js starter layout template pattern while preserving
 * the custom floating pill design system, backdrop blur, and responsive styling.
 */
export const Nav: React.FC = () => {
  const pathname = usePathname();
  const { logoText, themeColor } = useThemeContext();
  const { cartCount, addToCart } = useCartContext();
  const { wishlist } = useWishlistContext();
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    handlePerformSearch,
    setCartOpen,
  } = useUI();
  const { products } = useCatalog();
  const currentTheme = getThemeClasses(themeColor);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Close menus and overlays when navigating between pages
  useEffect(() => {
    setShowSearchResults(false);
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  // Scroll listener for sticky header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = useCallback(
    (path: string) => {
      if (path === '/' && pathname === '/') return true;
      if (path !== '/' && pathname.startsWith(path)) return true;
      return false;
    },
    [pathname]
  );

  const handleToggleMobileSearch = useCallback(() => {
    setShowSearchResults((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setShowSearchResults(false);
        handlePerformSearch();
      }
    },
    [handlePerformSearch]
  );

  // Filtered search suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return products.filter((p) => p.isFeatured).slice(0, 4);
    }
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const brandMatch = p.brand?.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        return nameMatch || descMatch || catMatch || brandMatch || tagMatch;
      })
      .slice(0, 6);
  }, [searchQuery, products]);

  return (
    <header
      role="banner"
      className="sticky top-2 sm:top-3.5 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto pointer-events-none mb-2 sm:mb-4 relative"
    >
      <div
        className={clx(
          'pointer-events-auto rounded-2xl sm:rounded-full border backdrop-blur-2xl px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 relative z-50 transition-[box-shadow,background-color,border-color] duration-150',
          mobileMenuOpen || showSearchResults || isScrolled
            ? 'bg-card-translucent-strong border-card text-theme-primary shadow-xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-900/5 dark:ring-slate-800/80'
            : 'bg-card-translucent border-card text-theme-primary shadow-lg shadow-slate-900/5 dark:shadow-black/30 ring-1 ring-slate-900/5 dark:ring-slate-800/80'
        )}
      >
        <div className="w-full flex items-center justify-between gap-2 sm:gap-4 h-9 sm:h-10">
          {/* 1. Medusa Brand Logo & Home Anchor */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-2 text-slate-900 dark:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-full"
            >
              <div
                className={clx(
                  'w-7.5 h-7.5 rounded-full text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200',
                  currentTheme.bg,
                  currentTheme.shadow
                )}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span className="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
                {logoText}
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation Menu with Categories & Company Dropdowns */}
          <DesktopNavLinks
            pathname={pathname}
            currentTheme={currentTheme}
            currentUser={currentUser}
            wishlistLength={wishlist.length}
            cartCount={cartCount}
            setCartOpen={setCartOpen}
            setAuthModalOpen={setAuthModalOpen}
          />

          {/* 3. Search Bar Input */}
          <HeaderSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowSearchResults={setShowSearchResults}
            onKeyDown={handleKeyDown}
          />

          {/* 4. Action Buttons (Theme, Account, Wishlist, CartButton, Mobile Toggles) */}
          <HeaderActions
            isActive={isActive}
            onToggleMobileSearch={handleToggleMobileSearch}
            showSearchResults={showSearchResults}
          />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNavDrawer
            pathname={pathname}
            currentTheme={currentTheme}
            currentUser={currentUser}
            wishlistLength={wishlist.length}
            onClose={() => setMobileMenuOpen(false)}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Catalog Search Megamenu Overlay */}
      <AnimatePresence>
        {showSearchResults && (
          <SearchMegamenuOverlay
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchSuggestions={searchSuggestions}
            onClose={() => setShowSearchResults(false)}
            onPerformSearch={handlePerformSearch}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Nav;
