'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useCatalog } from '@/providers/catalog-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import CartPage from '@modules/cart/templates/cart-page';

export default function CartPageClient() {
  const router = useRouter();
  const { cart, adjustQuantity, removeFromCart, clearCart } = useCartContext();
  const { themeColor, freeShippingThreshold } = useThemeContext();
  const { showToast } = useToastContext();
  const { productsSettings } = useCatalog();
  const { currentUser, setAuthModalOpen } = useAuthContext();

  return (
    <div className="w-full">
      <CartPage
        cart={cart}
        freeShippingThreshold={freeShippingThreshold}
        onAdjustQuantity={adjustQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onNavigate={(page) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else if (page === 'checkout') router.push('/checkout');
          else router.push(`/${page}`);
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={showToast}
        productsSettings={productsSettings}
        currentUser={currentUser || undefined}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />
    </div>
  );
}
