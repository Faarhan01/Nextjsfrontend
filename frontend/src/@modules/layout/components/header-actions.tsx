import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search
} from 'lucide-react';
import { useThemeContext } from '@/providers/theme-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { ThemeToggle } from '@modules/common/components/theme-toggle';
import { SafeImage } from '@modules/common/components/safe-image';
import { CartButton } from './cart-button';
import Link from 'next/link';

interface HeaderActionsProps {
  isActive: (path: string) => boolean;
  onToggleMobileSearch: () => void;
  showSearchResults: boolean;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  isActive,
  onToggleMobileSearch,
  showSearchResults,
}) => {
  const router = useRouter();
  const { themeColor } = useThemeContext();
  const { cartCount } = useCartContext();
  const { wishlist } = useWishlistContext();
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const { cartOpen, setCartOpen, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const currentTheme = getThemeClasses(themeColor);

  const handleToggleMobileMenu = useCallback(() => {
    const nextMenuState = !mobileMenuOpen;
    setMobileMenuOpen(nextMenuState);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
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
      <CartButton isActive={isActive('/cart')} />

      {/* Mobile search toggle */}
      <button
        onClick={onToggleMobileSearch}
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
  );
};
