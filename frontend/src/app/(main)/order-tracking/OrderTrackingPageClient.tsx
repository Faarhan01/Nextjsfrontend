'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import OrderTrackingPage from '@modules/account/templates/order-tracking-page';

export default function OrderTrackingPageClient() {
  const router = useRouter();
  const {
    themeColor,
    getThemeClasses,
    showToast,
    currentUser
  } = useStore();

  return (
    <div className="w-full">
      <OrderTrackingPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        showToast={(msg) => showToast(msg)}
        currentUser={currentUser}
        onNavigate={(page) => {
          if (page === 'home') router.push('/');
          else if (page === 'shop') router.push('/shop');
          else if (page === 'account') router.push('/account');
          else router.push(`/${page}`);
        }}
      />
    </div>
  );
}
