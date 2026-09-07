'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import OrderTrackingPage from '@modules/account/templates/order-tracking-page';

export default function OrderTrackingPageClient() {
  const router = useRouter();
  const { themeColor } = useThemeContext();
  const { showToast } = useToastContext();
  const { currentUser } = useAuthContext();

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
