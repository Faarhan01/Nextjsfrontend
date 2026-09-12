'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  ChevronDown,
  Truck,
  Heart,
  ShoppingCart,
  Building2,
  Globe,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../../../types';
import { ThemeToggle } from '@modules/common/components/theme-toggle';
import { SafeImage } from '@modules/common/components/safe-image';
import { useRegion } from '@/providers/region';

interface UserMenuDropdownProps {
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

export const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({
  pathname,
  currentTheme,
  currentUser,
  wishlistLength,
  cartCount,
  setCartOpen,
  setAuthModalOpen,
}) => {
  const router = useRouter();
  const { region } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isUserSectionActive = [
    '/account',
    '/order-tracking',
    '/wishlist',
  ].some((p) => pathname.startsWith(p));

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

  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className="relative"
    >
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1.5 ${
          isUserSectionActive
            ? `${currentTheme.lightBg} font-bold shadow-2xs`
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        }`}
      >
        {currentUser?.avatarUrl ? (
          <SafeImage
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-4 h-4 rounded-full object-cover"
            placeholderType="avatar"
          />
        ) : (
          <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        )}
        <span>{currentUser ? currentUser.name.split(' ')[0] : 'Menu'}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${
            isOpen ? 'rotate-180 text-slate-700 dark:text-slate-300' : ''
          }`}
        />
      </button>

      {/* Popover Surface */}
      <div
        className={`absolute top-[calc(100%+6px)] left-0 w-64 popover-surface rounded-2xl border border-card p-1.5 transition-all duration-150 z-50 transform origin-top-left shadow-xl shadow-slate-900/10 dark:shadow-black/40 before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3 ${
          isOpen
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible translate-y-1 pointer-events-none'
        }`}
      >
        {/* Appearance Theme Toggle */}
        <div className="px-1 py-1 border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <ThemeToggle variant="menu-item" />
        </div>

        {/* Region & Currency Badge */}
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
          <span className="flex items-center gap-1.5 font-semibold">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>Region</span>
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            🇿🇦 South Africa (ZAR)
          </span>
        </div>

        {/* My Account Link */}
        <Link
          href="/account"
          onClick={(e) => {
            setIsOpen(false);
            if (!currentUser) {
              e.preventDefault();
              setAuthModalOpen(true);
            }
          }}
          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg ${currentTheme.bg} text-white flex items-center justify-center shrink-0 shadow-xs`}
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">My Account</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[130px]">
                {currentUser ? currentUser.name : 'Sign In / Register'}
              </div>
            </div>
          </div>
          {!currentUser && (
            <LogIn className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          )}
        </Link>

        {/* Order Tracking */}
        <Link
          href="/order-tracking"
          onClick={() => setIsOpen(false)}
          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">Track Order</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Live package tracking
              </div>
            </div>
          </div>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          onClick={() => setIsOpen(false)}
          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <div className="font-extrabold">Wishlist</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Saved favorites
              </div>
            </div>
          </div>
          {wishlistLength > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs">
              {wishlistLength}
            </span>
          )}
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setCartOpen(true);
          }}
          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg ${currentTheme.lightBg} flex items-center justify-center shrink-0`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-extrabold">Cart</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                View shopping bag
              </div>
            </div>
          </div>
          {cartCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full ${currentTheme.badge} text-white text-[10px] font-black shadow-2xs`}
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Seller Portal */}
        <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            href={currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell'}
            onClick={() => setIsOpen(false)}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {currentUser?.role === 'seller'
                    ? 'Seller Portal'
                    : 'Sell on Mrbulk'}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {currentUser?.role === 'seller'
                    ? 'Manage offers & orders'
                    : 'Vendor partner program'}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
