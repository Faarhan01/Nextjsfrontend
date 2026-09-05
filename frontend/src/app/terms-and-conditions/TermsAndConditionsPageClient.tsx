'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import TermsAndConditionsPage from '../../components/pages/TermsAndConditionsPage';

export default function TermsAndConditionsPageClient() {
  const router = useRouter();
  const { themeColor, getThemeClasses, showToast, logoText } = useStore();

  const handleNavigate = (page: string) => {
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop' || page === 'products') router.push('/shop');
    else if (page === 'contact') router.push('/contact');
    else if (page === 'faq') router.push('/faq');
    else if (page === 'categories') router.push('/categories');
    else if (page === 'about') router.push('/about');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  return (
    <div className="w-full">
      <TermsAndConditionsPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onNavigate={handleNavigate}
        showToast={(msg) => showToast(msg)}
        logoText={logoText}
      />
    </div>
  );
}
