'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
  Building2,
  Mail,
  HelpCircle,
  User,
  Truck,
  Heart,
  ShoppingCart,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { ThemeToggle } from '@modules/common/components/theme-toggle';

interface DesktopNavLinksProps {
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
  setAuthModalOpen
}) => {
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 text-xs sm:text-sm font-semibold flex-shrink-0">
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

      <Link
        href="/categories"
        className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none ${
          isActive('/categories')
            ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        }`}
      >
        Categories
      </Link>

      {/* Company Dropdown */}
      <div className="relative group">
        <button
          type="button"
          className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1 ${
            ['/about', '/contact', '/faq'].some((p) => pathname.startsWith(p))
              ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <span>Company</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
        </button>

        <div className="absolute top-[calc(100%+6px)] left-0 w-48 popover-surface p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-1">
          <Link
            href="/about"
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">About Us</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Our story & brand</div>
            </div>
          </Link>

          <Link
            href="/contact"
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">Contact</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Get in touch with us</div>
            </div>
          </Link>

          <Link
            href="/faq"
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">FAQ</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Help center & answers</div>
            </div>
          </Link>
        </div>
      </div>

      {/* User Dropdown */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => {
            if (!currentUser) setAuthModalOpen(true);
            else router.push('/account');
          }}
          className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 ${
            ['/account', '/order-tracking', '/wishlist'].some((p) => pathname.startsWith(p))
              ? `${currentTheme.lightBg} ${currentTheme.text} font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Menu</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
        </button>

        <div className="absolute top-[calc(100%+6px)] left-0 w-60 popover-surface p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left group-hover:translate-y-0 translate-y-1">
          {/* Header Theme Switcher Toggle */}
          <div className="px-1 py-1 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <ThemeToggle variant="menu-item" />
          </div>

          <Link
            href="/account"
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                setAuthModalOpen(true);
              }
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg ${currentTheme.bg} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-extrabold">My Account</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[110px]">
                  {currentUser ? currentUser.name : 'Sign In / Profile'}
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/order-tracking"
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-extrabold">Track Order</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Live package tracking</div>
              </div>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <div>
                <div className="font-extrabold">Wishlist</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Saved favorites</div>
              </div>
            </div>
            {wishlistLength > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
                {wishlistLength}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-lg ${currentTheme.lightBg} ${currentTheme.text} dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center shrink-0`}>
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-extrabold">Cart</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">View shopping bag</div>
              </div>
            </div>
            {cartCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black shadow-2xs`}>
                {cartCount}
              </span>
            )}
          </button>

          <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/80">
            <Link
              href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {currentUser?.role === 'seller' ? 'Seller Portal' : 'Sell on Mrbulk'}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {currentUser?.role === 'seller' ? 'Manage offers & orders' : 'Vendor partner program'}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

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

      {(currentUser?.role === 'admin' || isActive('/admin')) && (
        <Link
          href="/admin"
          className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 ${
            isActive('/admin')
              ? `${currentTheme.lightBg} ${currentTheme.text} font-extrabold shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text} dark:text-blue-400`} />
          <span>Admin</span>
        </Link>
      )}
    </nav>
  );
};
