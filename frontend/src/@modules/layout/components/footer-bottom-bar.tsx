'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';
import { CountrySelect } from '@modules/layout/components/country-select';
import { MedusaCTA } from '@modules/layout/components/medusa-cta';

interface FooterBottomBarProps {
  logoText: string;
}

export const FooterBottomBar: React.FC<FooterBottomBarProps> = ({ logoText }) => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-8 flex flex-col space-y-6">
      {/* Middle Row: Region Selector & Medusa Badge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs">
            Store Region:
          </span>
          <CountrySelect />
        </div>

        <div className="flex items-center gap-3">
          <MedusaCTA />
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200/80 dark:border-slate-700/80 focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Copyright & Verified Payment Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div>
          © {new Date().getFullYear()} <strong className="text-slate-900 dark:text-white font-bold">{logoText}</strong>. All rights reserved.
        </div>

        {/* Payment Badges */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
          {['Visa', 'Mastercard', 'Apple Pay', 'Instant EFT', 'Ozow', 'PayFast'].map((pay) => (
            <span
              key={pay}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 shadow-2xs tracking-tight"
            >
              {pay}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
