'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useThemeContext } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import FaqPage from '@modules/content/templates/faq-page';

export default function FaqPageClient() {
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
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  return (
    <div className="w-full">
      <FaqPage
        themeColor={themeColor}
        getThemeClasses={getThemeClasses}
        onNavigate={handleNavigate}
        showToast={(msg) => showToast(msg)}
        logoText={logoText}
      />
    </div>
  );
}
