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
  Truck
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { ThemeToggle } from '@modules/common/components/theme-toggle';

interface MobileNavDrawerProps {
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
  onOpenAuthModal
}) => {
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState<boolean>(false);
  const [mobileUserOpen, setMobileUserOpen] = useState<boolean>(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

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
        <div className="drawer-surface rounded-3xl border border-card p-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Header Theme Switcher Pill in Mobile Drawer */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Appearance
            </div>
            <ThemeToggle variant="pill" />
          </div>

          <nav className="space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home className={`w-4 h-4 ${isActive('/') ? currentTheme.text : 'text-slate-400 dark:text-slate-500'}`} />
              <span>Home</span>
            </Link>

            <Link
              href="/shop"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/shop')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${isActive('/shop') ? currentTheme.text : 'text-slate-400 dark:text-slate-500'}`} />
              <span>Shop</span>
            </Link>

            <Link
              href="/categories"
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                isActive('/categories')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${isActive('/categories') ? currentTheme.text : 'text-slate-400 dark:text-slate-500'}`} />
              <span>Categories</span>
            </Link>

            {/* Mobile Company Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
              <button
                onClick={() => setMobileCompanyOpen(!mobileCompanyOpen)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Company</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 dark:text-slate-500 ${mobileCompanyOpen ? 'rotate-180' : ''}`} />
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
                onClick={() => setMobileUserOpen(!mobileUserOpen)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>{currentUser ? currentUser.name : 'Account & Orders'}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 dark:text-slate-500 ${mobileUserOpen ? 'rotate-180' : ''}`} />
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
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{currentUser ? 'My Profile' : 'Sign In / Register'}</span>
                  </Link>
                  <Link
                    href="/order-tracking"
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <Truck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>Track Package</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Wishlist</span>
                    </span>
                    {wishlistLength > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs">
                        {wishlistLength}
                      </span>
                    )}
                  </Link>

                  <Link
                    href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{currentUser?.role === 'seller' ? 'Seller Portal Dashboard' : 'Sell on Mrbulk'}</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
              onClick={onClose}
              className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                pathname.startsWith('/sell')
                  ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>{currentUser?.role === 'seller' ? 'Seller Dashboard' : 'Become a Seller'}</span>
            </Link>

            {(currentUser?.role === 'admin' || pathname.startsWith('/admin')) && (
              <Link
                href="/admin"
                onClick={onClose}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

