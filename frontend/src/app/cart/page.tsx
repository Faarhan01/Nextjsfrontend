'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import CartPage from '../../components/cart/CartPage';

export default function CartRoute() {
  const router = useRouter();
  const {
    cart,
    freeShippingThreshold,
    handleAdjustQuantity,
    handleRemoveFromCart,
    handleClearCart,
    themeColor,
    getThemeClasses,
    showToast,
    productsSettings,
    currentUser,
    setAuthModalOpen
  } = useStore();

  return (
    <div className="w-full">
      <CartPage
        cart={cart}
        freeShippingThreshold={freeShippingThreshold}
        onAdjustQuantity={handleAdjustQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
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

