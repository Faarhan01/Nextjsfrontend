'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import CheckoutPage from '@modules/checkout/templates/checkout-page';

export default function CheckoutPageClient() {
  const router = useRouter();
  const {
    cart,
    handleClearCart,
    themeColor,
    getThemeClasses,
    showToast,
    currentUser,
    setAuthModalOpen,
    freeShippingThreshold
  } = useStore();

  return (
    <div className="w-full">
      <CheckoutPage
        cart={cart}
        onClearCart={handleClearCart}
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
