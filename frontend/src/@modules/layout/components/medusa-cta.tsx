'use client';

import React from 'react';

interface MedusaCTAProps {
  className?: string;
}

export const MedusaCTA: React.FC<MedusaCTAProps> = ({ className = '' }) => {
  return (
    <a
      href="https://www.medusajs.com"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition text-[11px] font-semibold border border-slate-200/80 dark:border-slate-700/80 ${className}`}
      title="Powered by Medusa open source commerce engine"
    >
      <span>Powered by</span>
      <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
        Medusa JS
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
    </a>
  );
};
