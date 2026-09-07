'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCartContext } from '@/providers/cart-provider';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useUI } from '@/providers/ui-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import CheckoutPage from '@modules/checkout/templates/checkout-page';

export default function CheckoutPageClient() {
  const router = useRouter();
  const { cart, clearCart } = useCartContext();
  const { themeColor, freeShippingThreshold } = useThemeContext();
  const { showToast } = useToastContext();
  const { currentUser, setAuthModalOpen } = useAuthContext();

  return (
    <div className="w-full">
      <CheckoutPage
        cart={cart}
        onClearCart={clearCart}
        onNavigate={(page) => {
          if (page === 'home') router.push('/');
          else if (page === 'order-tracking') router.push('/order-tracking');
          else if (page === 'cart') router.push('/cart');
          else router.push(`/${page}`);
        }}
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={(msg) => showToast(msg)}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        freeShippingThreshold={freeShippingThreshold}
      />
    </div>
  );
}
