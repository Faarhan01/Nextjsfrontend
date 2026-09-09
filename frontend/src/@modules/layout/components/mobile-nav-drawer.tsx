'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Home,
  ShoppingBag,
  LayoutGrid,
  Building2,
  ChevronDown,
  User,
  ShieldCheck,
  Heart,
  Truck,
  Globe,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { ThemeToggle } from '@modules/common/components/theme-toggle';
import { useCatalog } from '@/providers/catalog-provider';
import { useRegion } from '@/providers/region';

export interface MobileNavDrawerProps {
  pathname: string;
  currentTheme: {
    bg: string;
    lightBg: string;
    text: string;
    badge: string;
    shadow: string;
  };
  currentUser: UserProfile | null;
  wishlistLength: number;
  onClose: () => void;
  onOpenAuthModal: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  pathname,
  currentTheme,
  currentUser,
  wishlistLength,
  onClose,
  onOpenAuthModal,
}) => {
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState<boolean>(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState<boolean>(false);
  const [mobileUserOpen, setMobileUserOpen] = useState<boolean>(false);
  const { categories } = useCatalog();
  const { region } = useRegion();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const topCategories = (categories || []).slice(0, 6);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-30 lg:hidden pointer-events-auto"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute top-full left-0 right-0 mt-2 px-4 sm:px-6 z-40 lg:hidden pointer-events-auto"
      >
        <div className="drawer-surface rounded-3xl border border-card p-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl shadow-slate-950/20 dark:shadow-black/60">
          {/* Header Theme Switcher Pill in Mobile Drawer */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Appearance
            </div>
            <ThemeToggle variant="pill" />
          </div>

          <nav className="space-y-1">
            {/* Home Link */}
            <Link
              href="/"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home
                className={`w-4 h-4 ${
                  isActive('/')
                    ? currentTheme.text
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>Home</span>
            </Link>

            {/* Shop Link */}
            <Link
              href="/shop"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/shop')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag
                className={`w-4 h-4 ${
                  isActive('/shop')
                    ? currentTheme.text
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>Shop Catalog</span>
            </Link>

            {/* Mobile Categories Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              <div className="flex items-center justify-between">
                <Link
                  href="/categories"
                  onClick={onClose}
                  className={`flex-1 text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive('/categories')
                      ? `${currentTheme.lightBg} ${currentTheme.text} font-bold dark:bg-blue-950/60 dark:text-blue-400`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutGrid
                    className={`w-4 h-4 ${
                      isActive('/categories')
                        ? currentTheme.text
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>Categories</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  aria-label="Expand categories"
                  className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileCategoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileCategoriesOpen && (
                <div className="pl-6 pr-2 py-1.5 space-y-1 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl mb-1">
                  {topCategories.map((cat) => {
                    const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/50"
                      >
                        <span className="truncate">{cat.name}</span>
                        {typeof cat.itemCount === 'number' && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {cat.itemCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                  <Link
                    href="/categories"
                    onClick={onClose}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline pt-1 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    <span>View all categories</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Company Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              <button
                type="button"
                onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Company</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform text-slate-400 dark:text-slate-500 ${
                    mobileCompanyOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileCompanyOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl mb-1">
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Contact &amp; Support
                  </Link>
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Frequently Asked Questions
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile User Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              <button
                type="button"
                onClick={() => setMobileUserOpen(!mobileUserOpen)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>
                    {currentUser ? currentUser.name : 'Account & Orders'}
                  </span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform text-slate-400 dark:text-slate-500 ${
                    mobileUserOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {mobileUserOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-50/70 dark:bg-slate-800/50 rounded-xl mb-1">
                  <Link
                    href="/account"
                    onClick={(e) => {
                      onClose();
                      if (!currentUser) {
                        e.preventDefault();
                        onOpenAuthModal();
                      }
                    }}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    {currentUser
                      ? `Profile (${currentUser.name})`
                      : 'Sign In / Register'}
                  </Link>
                  <Link
                    href="/order-tracking"
                    onClick={onClose}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Track My Order
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>Saved Wishlist</span>
                    {wishlistLength > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                        {wishlistLength}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>

            {/* Saved Wishlist Link */}
            <Link
              href="/wishlist"
              onClick={onClose}
              className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/wishlist')
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart
                  className={`w-4 h-4 ${
                    wishlistLength > 0
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>Wishlist</span>
              </div>
              {wishlistLength > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-2xs">
                  {wishlistLength}
                </span>
              )}
            </Link>

            {/* Track Order Direct Link */}
            <Link
              href="/order-tracking"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/order-tracking')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold dark:bg-blue-950/60 dark:text-blue-400`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck
                className={`w-4 h-4 ${
                  isActive('/order-tracking')
                    ? currentTheme.text
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>Track Order</span>
            </Link>

            {/* Seller Hub Link */}
            <Link
              href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                pathname.startsWith('/sell')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold dark:bg-blue-950/60 dark:text-blue-400`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>
                {currentUser?.role === 'seller'
                  ? 'Seller Portal'
                  : 'Sell on Mrbulk'}
              </span>
            </Link>

            {/* Admin link if applicable */}
            {(currentUser?.role === 'admin' || isActive('/admin')) && (
              <Link
                href="/admin"
                onClick={onClose}
                className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive('/admin')
                    ? `${currentTheme.lightBg} ${currentTheme.text} font-bold dark:bg-blue-950/60 dark:text-blue-400`
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 ${currentTheme.text} dark:text-blue-400`}
                />
                <span>Admin Panel</span>
              </Link>
            )}

            {/* Medusa Region Indicator */}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 py-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Store Region</span>
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                🇿🇦 South Africa (ZAR)
              </span>
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};
