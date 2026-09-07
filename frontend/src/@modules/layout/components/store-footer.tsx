'use client';

import React from 'react';
import { useThemeContext } from '@/providers/theme-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import { FooterTrustCarousel } from '@modules/layout/components/footer-trust-carousel';
import { FooterBrandCard } from '@modules/layout/components/footer-brand-card';
import { FooterLinksGrid } from '@modules/layout/components/footer-links-grid';
import { FooterNewsletter } from '@modules/layout/components/footer-newsletter';
import { FooterBottomBar } from '@modules/layout/components/footer-bottom-bar';

export const StoreFooter: React.FC = () => {
  const { logoText, themeColor } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 mt-auto border-t border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
      {/* Dynamic Theme Accent Top Glow Bar */}
      <div className={`h-1 w-full ${currentTheme.bg}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        {/* Top Features / Customer Perks Horizontal Carousel */}
        <FooterTrustCarousel />

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-8">
          <FooterBrandCard logoText={logoText} currentTheme={currentTheme} />
          <FooterLinksGrid />
        </div>

        {/* Newsletter Subscription Row */}
        <FooterNewsletter currentTheme={currentTheme} />

        {/* Bottom Copyright & Security Line */}
        <FooterBottomBar logoText={logoText} />
      </div>
    </footer>
  );
};