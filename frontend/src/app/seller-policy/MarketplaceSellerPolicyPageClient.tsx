'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import MarketplaceSellerPolicyPage from '@modules/content/templates/marketplace-seller-policy-page';

export default function MarketplaceSellerPolicyPageClient() {
  const router = useRouter();
  const { themeColor, logoText } = useThemeContext();
  const { showToast } = useToastContext();

  const handleNavigate = (page: string) => {
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop' || page === 'products') router.push('/shop');
    else if (page === 'contact') router.push('/contact');
    else if (page === 'faq') router.push('/faq');
    else if (page === 'categories') router.push('/categories');
    else if (page === 'about') router.push('/about');
    else if (page === 'sell') router.push('/sell');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  return (
    <div className="w-full">
      <MarketplaceSellerPolicyPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onNavigate={handleNavigate}
        showToast={(msg) => showToast(msg)}
        logoText={logoText || 'Mrbulk'}
      />
    </div>
  );
}
