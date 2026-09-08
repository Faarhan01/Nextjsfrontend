'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { getThemeClasses } from '@/providers/theme-provider';

interface PageBannerProps {
  title: string;
  description?: string;
  badge?: string;
  themeColor?: string;
  logoText?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  backgroundImage?: string;
  backgroundAlt?: string;
  overlayGradient?: string;
  backLabel?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  description,
  badge,
  themeColor = 'blue',
  logoText = 'Mrbulk',
  onBack,
  actions,
  backgroundImage,
  backgroundAlt = '',
  overlayGradient = 'bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-slate-900/70',
  backLabel = 'Home',
}) => {
  const router = useRouter();
  const currentTheme = getThemeClasses(themeColor);

  const lightBannerBg = {
    blue: 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60',
    indigo: 'bg-gradient-to-br from-indigo-200/90 via-indigo-100/75 to-indigo-50/85 dark:from-indigo-950/90 dark:via-indigo-900/60 dark:to-indigo-950/80 border-indigo-300/80 dark:border-indigo-700/60',
    emerald: 'bg-gradient-to-br from-emerald-200/90 via-emerald-100/75 to-emerald-50/85 dark:from-emerald-950/90 dark:via-emerald-900/60 dark:to-emerald-950/80 border-emerald-300/80 dark:border-emerald-700/60',
    rose: 'bg-gradient-to-br from-rose-200/90 via-rose-100/75 to-rose-50/85 dark:from-rose-950/90 dark:via-rose-900/60 dark:to-rose-950/80 border-rose-300/80 dark:border-rose-700/60',
    amber: 'bg-gradient-to-br from-amber-200/90 via-amber-100/75 to-amber-50/85 dark:from-amber-950/90 dark:via-amber-900/60 dark:to-amber-950/80 border-amber-300/80 dark:border-amber-700/60',
    slate: 'bg-gradient-to-br from-slate-200/90 via-slate-100/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800/80 border-slate-300/90 dark:border-slate-700/70',
  }[themeColor] || 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60';

  const ambientGlowClasses = {
    blue: 'bg-blue-400/20 dark:bg-blue-500/25',
    indigo: 'bg-indigo-400/20 dark:bg-indigo-500/25',
    emerald: 'bg-emerald-400/20 dark:bg-emerald-500/25',
    rose: 'bg-rose-400/20 dark:bg-rose-500/25',
    amber: 'bg-amber-400/20 dark:bg-amber-500/25',
    slate: 'bg-slate-400/20 dark:bg-slate-500/25',
  }[themeColor] || 'bg-blue-400/20 dark:bg-blue-500/25';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const isDarkBanner = themeColor === 'slate';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 select-none">
        <button
          onClick={handleBack}
          className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer font-semibold bg-transparent border-none p-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-extrabold">{title}</span>
      </div>

      <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${isDarkBanner ? 'bg-slate-900 text-white' : lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <SafeImage
              src={backgroundImage}
              alt={backgroundAlt || title}
              placeholderType="banner"
              fallbackTitle={title}
              className="w-full h-full object-cover opacity-60 dark:opacity-75 scale-105 transition-transform duration-700"
            />
            <div className={`absolute inset-0 ${overlayGradient}`} />
          </div>
        )}

        {!backgroundImage && (
          <>
            <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
            <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />
          </>
        )}

        <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
          {badge && (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme.text} backdrop-blur-xs select-text`}>
              <span>{badge}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
            {title.includes(logoText) ? title : `${title} — ${logoText}`}
          </h1>

          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              {description}
            </p>
          )}

          {actions && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 select-none">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
