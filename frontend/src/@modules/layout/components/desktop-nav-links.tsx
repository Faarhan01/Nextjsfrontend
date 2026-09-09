'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../../../types';
import { CompanyDropdown } from './company-dropdown';
import { CategoriesDropdown } from './categories-dropdown';
import { UserMenuDropdown } from './user-menu-dropdown';

export interface DesktopNavLinksProps {
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
  cartCount: number;
  setCartOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
}

export const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  pathname,
  currentTheme,
  currentUser,
  wishlistLength,
  cartCount,
  setCartOpen,
  setAuthModalOpen,
}) => {
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      aria-label="Main Navigation"
      className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 text-xs sm:text-sm font-semibold flex-shrink-0"
    >
      {/* 1. Home Link */}
      <Link
        href="/"
        className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none ${
          isActive('/')
            ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        }`}
      >
        Home
      </Link>

      {/* 2. Shop Catalog Link */}
      <Link
        href="/shop"
        className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none ${
          isActive('/shop')
            ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        }`}
      >
        Shop
      </Link>

      {/* 3. Categories Dropdown */}
      <CategoriesDropdown pathname={pathname} currentTheme={currentTheme} />

      {/* 4. Company Dropdown */}
      <CompanyDropdown pathname={pathname} currentTheme={currentTheme} />

      {/* 5. User / Account Dropdown */}
      <UserMenuDropdown
        pathname={pathname}
        currentTheme={currentTheme}
        currentUser={currentUser}
        wishlistLength={wishlistLength}
        cartCount={cartCount}
        setCartOpen={setCartOpen}
        setAuthModalOpen={setAuthModalOpen}
      />

      {/* 6. Seller Hub Link */}
      <Link
        href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
        className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 ${
          pathname.startsWith('/sell')
            ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        }`}
      >
        <Building2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>{currentUser?.role === 'seller' ? 'Seller Hub' : 'Sell'}</span>
      </Link>

      {/* 7. Admin Link (Role guarded) */}
      {(currentUser?.role === 'admin' || isActive('/admin')) && (
        <Link
          href="/admin"
          className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 ${
            isActive('/admin')
              ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <ShieldCheck
            className={`w-3.5 h-3.5 ${currentTheme.text} dark:text-blue-400`}
          />
          <span>Admin</span>
        </Link>
      )}
    </nav>
  );
};
