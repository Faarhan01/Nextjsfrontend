'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/providers/cart-provider';
import { useUI } from '@/providers/ui-provider';
import { useThemeContext, getThemeClasses } from '@/providers/theme-provider';

interface CartButtonProps {
  isActive?: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({ isActive = false }) => {
  const { cartCount } = useCartContext();
  const { cartOpen, setCartOpen } = useUI();
  const { themeColor } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={`w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-150 cursor-pointer relative hover:scale-105 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
        cartOpen || isActive
          ? `${currentTheme.text} ${currentTheme.lightBg} ${
              currentTheme.border.split(' ')[0]
            } dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800`
          : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
      }`}
      title="Shopping Cart"
      aria-label={`Shopping cart with ${cartCount} items`}
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
  );
};
