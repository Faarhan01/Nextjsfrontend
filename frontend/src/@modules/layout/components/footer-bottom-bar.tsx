'use client';

import React from 'react';

interface FooterBottomBarProps {
  logoText: string;
}

export const FooterBottomBar: React.FC<FooterBottomBarProps> = ({ logoText }) => {
  return (
    <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
      <div>
        © {new Date().getFullYear()} <strong className="text-slate-900 dark:text-white font-bold">{logoText}</strong>. All rights reserved.
      </div>

      {/* Payment Badges */}
      <div className="flex items-center gap-2">
        {['Visa', 'Mastercard', 'Apple Pay', 'PayPal', 'EFT'].map((pay) => (
          <span
            key={pay}
            className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 shadow-2xs tracking-tight"
          >
            {pay}
          </span>
        ))}
      </div>
    </div>
  );
};
