'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { SafeImage } from '@modules/common/components/safe-image';
import { ThemeToggle } from '@modules/common/components/theme-toggle';
import { DesktopNavLinks } from '@modules/layout/components/desktopnavlinks';
import { SearchMegamenuOverlay } from '@modules/layout/components/searchmegamenuoverlay';
import { MobileNavDrawer } from '@modules/layout/components/mobilenavdrawer';

export const StoreHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    logoText,
    currentTheme,
    cartCount,
    wishlist,
    currentUser,
    cartOpen,
    setCartOpen,
    setAuthModalOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    handlePerformSearch,
    products,
    handleAddToCart
  } = useStore();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleToggleMobileSearch = useCallback(() => {
    setShowSearchResults((prev) => {
      const next = !prev;
      return next;
    });
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [mobileMenuOpen, setMobileMenuOpen]);

  const handleToggleMobileMenu = useCallback(() => {
    const nextMenuState = !mobileMenuOpen;
    setMobileMenuOpen(nextMenuState);
    if (nextMenuState) {
      setShowSearchResults(false);
    }
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <header className="sticky top-2 sm:top-3.5 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto pointer-events-none mb-2 sm:mb-4 relative">
      <div
        className={`pointer-events-auto rounded-2xl sm:rounded-full border backdrop-blur-2xl px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 relative z-50 transition-[box-shadow,background-color,border-color] duration-150 ${
          mobileMenuOpen || showSearchResults || isScrolled
            ? 'bg-card/95 border-card text-theme-primary shadow-xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-900/5 dark:ring-slate-800/80'
            : 'bg-card/90 border-card/80 text-theme-primary shadow-lg shadow-slate-900/5 dark:shadow-black/30 hover:bg-card hover:border-card'
        }`}
      >
        <div className="w-full flex items-center justify-between gap-2 sm:gap-4 h-9 sm:h-10">
          {/* 1. Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group flex items-center gap-2 text-slate-900 dark:text-slate-100 focus:outline-none">
              <div
                className={`w-7.5 h-7.5 rounded-full ${currentTheme.bg} text-white flex items-center justify-center shadow-xs ${currentTheme.shadow} group-hover:scale-105 transition-transform duration-200`}
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
                {logoText}
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation Menu */}
          <DesktopNavLinks
            pathname={pathname}
            currentTheme={currentTheme}
            currentUser={currentUser}
            wishlistLength={wishlist.length}
            cartCount={cartCount}
            setCartOpen={setCartOpen}
            setAuthModalOpen={setAuthModalOpen}
          />

          {/* 3. Desktop Search Input */}
          <div className="relative hidden lg:block flex-1 max-w-[200px] lg:max-w-xs xl:max-w-md mx-2 lg:mx-3">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products, brands, tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setShowSearchResults(false);
                  handlePerformSearch();
                }
              }}
              className="w-full text-xs pl-8 pr-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 rounded-full transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100"
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
          </div>

          {/* 4. Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <ThemeToggle variant="icon-button" />

            {/* Account button */}
            <button
              onClick={() => {
                if (!currentUser) setAuthModalOpen(true);
                else router.push('/account');
              }}
              className={`hidden lg:flex w-8.5 h-8.5 sm:w-9 sm:h-9 items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                isActive('/account')
                  ? `${currentTheme.lightBg} ${currentTheme.text} ${currentTheme.border.split(' ')[0]} dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
              title={currentUser ? `My Account (${currentUser.name})` : 'My Account'}
            >
              {currentUser ? (
                <SafeImage
                  src={currentUser.avatarUrl}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                  alt={currentUser.name}
                  placeholderType="avatar"
                  fallbackTitle={currentUser.name}
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>

            {/* Wishlist button */}
            <Link
              href="/wishlist"
              className={`hidden lg:flex w-8.5 h-8.5 sm:w-9 sm:h-9 items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 ${
                isActive('/wishlist')
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart drawer button */}
            <button
              onClick={() => setCartOpen(true)}
              className={`w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                cartOpen || isActive('/cart')
                  ? `${currentTheme.text} ${currentTheme.lightBg} ${currentTheme.border.split(' ')[0]} dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 ${currentTheme.badge} text-white text-[9px] font-extrabold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile search toggle */}
            <button
              onClick={handleToggleMobileSearch}
              className={`lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                showSearchResults
                  ? `${currentTheme.text} ${currentTheme.lightBg} ${currentTheme.border.split(' ')[0]} dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
              title="Search Products"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={handleToggleMobileMenu}
              className={`lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                mobileMenuOpen
                  ? `${currentTheme.text} ${currentTheme.lightBg} ${currentTheme.border.split(' ')[0]} dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5 primary-icon" />}
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Search Megamenu Overlay */}
      <AnimatePresence>
        {showSearchResults && (
          <SearchMegamenuOverlay
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchSuggestions={searchSuggestions}
            onClose={() => setShowSearchResults(false)}
            onPerformSearch={handlePerformSearch}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

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
    </header>
  );
};
