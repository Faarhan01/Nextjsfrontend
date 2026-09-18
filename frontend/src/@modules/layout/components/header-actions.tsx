import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  Download
} from 'lucide-react';
import { clx } from '@/lib/util/clx';
import { useThemeContext } from '@/providers/theme-provider';
import { useCartContext } from '@/providers/cart-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { useUI } from '@/providers/ui-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { ThemeToggle } from '@modules/common/components/theme-toggle';
import { SafeImage } from '@modules/common/components/safe-image';
import { downloadHtmlTemplate } from '@/utils/htmlTemplateGenerator';
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
  const { themeColor, logoText } = useThemeContext();
  const { cartCount } = useCartContext();
  const { wishlist } = useWishlistContext();
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const { showToast } = useToastContext();
  const { products, categories, slides } = useCatalog();
  const { cartOpen, setCartOpen, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const currentTheme = getThemeClasses(themeColor);

  const handleDownloadSite = useCallback(() => {
    showToast('Preparing standalone HTML storefront download...');
    try {
      downloadHtmlTemplate({
        storeName: logoText,
        themeColor,
        products,
        categories,
        slides,
      });
      showToast('HTML storefront downloaded successfully!');
    } catch (e) {
      console.error(e);
      showToast('Failed to download HTML storefront.');
    }
  }, [logoText, themeColor, products, categories, slides, showToast]);

  const handleToggleMobileMenu = useCallback(() => {
    const nextMenuState = !mobileMenuOpen;
    setMobileMenuOpen(nextMenuState);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
      {/* Dark / Light Mode Toggle Button */}
      <ThemeToggle variant="icon-button" />

      {/* Standalone HTML Storefront Download Button */}
      <button
        onClick={handleDownloadSite}
        className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full border border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0"
        title="Download Standalone HTML Site"
        aria-label="Download Standalone HTML Site"
      >
        <Download className="w-4 h-4" />
      </button>

      {/* Account button */}
      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else router.push('/account');
        }}
        className={clx(
          'hidden lg:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
          isActive('/account')
            ? clx(currentTheme.lightBg, 'border-current/20 shadow-2xs')
            : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
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
        className={clx(
          'hidden lg:flex w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40',
          isActive('/wishlist')
            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
            : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
        title="Saved Wishlist"
      >
        <Heart className={clx('w-4 h-4', wishlist.length > 0 && 'fill-rose-500 text-rose-500')} />
        {wishlist.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
            {wishlist.length}
          </span>
        )}
      </Link>

      {/* Cart drawer button */}
      <button
        onClick={() => setCartOpen(true)}
        className={clx(
          'w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
          cartOpen || isActive('/cart')
            ? clx(currentTheme.lightBg, 'border-current/20 shadow-2xs')
            : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
        title="Shopping Cart"
      >
        <ShoppingCart className="w-4 h-4" />
        {cartCount > 0 && (
          <span
            className={clx(
              'absolute -top-0.5 -right-0.5 text-white text-[9px] font-extrabold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs',
              currentTheme.badge
            )}
          >
            {cartCount}
          </span>
        )}
      </button>

      {/* Mobile search toggle */}
      <button
        onClick={onToggleMobileSearch}
        className={clx(
          'lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
          showSearchResults
            ? clx(currentTheme.lightBg, 'border-current/20 shadow-2xs')
            : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
        title="Search Products"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Mobile menu toggle */}
      <button
        onClick={handleToggleMobileMenu}
        className={clx(
          'lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
          mobileMenuOpen
            ? clx(currentTheme.lightBg, 'border-current/20 shadow-2xs')
            : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 primary-icon" />}
      </button>
    </div>
  );
};

