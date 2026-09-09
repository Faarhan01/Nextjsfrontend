'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Truck } from 'lucide-react';

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
    <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className={`w-8 h-8 rounded-xl ${currentTheme.bg} text-white flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform`}>
            {logoText.charAt(0)}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{logoText}</h3>
        </Link>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Your trusted South African marketplace for bulk groceries, retail essentials, and wholesale merchandise. Verified suppliers with express delivery across all 9 provinces.
        </p>
        <div className="flex flex-col gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>HQ &amp; Distribution: Johannesburg, South Africa</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Courier Guy &amp; Fastway Nationwide Express</span>
          </div>
        </div>
      </div>
      <div className="pt-3 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800">
        <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
        <span>Operated by Mr Cheap General Dealer ZA</span>
      </div>
    </div>
  );
};
