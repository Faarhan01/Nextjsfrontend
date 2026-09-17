'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { clx } from '@/lib/util/clx';

interface FooterBrandCardProps {
  logoText: string;
  currentTheme: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
    badge: string;
    accent: string;
    primaryHex: string;
    shadow: string;
    ring: string;
  };
}

export const FooterBrandCard: React.FC<FooterBrandCardProps> = ({ logoText, currentTheme }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2.5">
          <div className={clx('w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-md', currentTheme.bg)}>
            {logoText.charAt(0)}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{logoText}</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Your trusted South African marketplace for retail and wholesale products, verified suppliers, and seamless shopping across the country.
        </p>
      </div>
      <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className={clx('w-3 h-3', currentTheme.text)} />
        <span>Operated by Mr Cheap General Dealer ZA</span>
      </div>
    </div>
  );
};

