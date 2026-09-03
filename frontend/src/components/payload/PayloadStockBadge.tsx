'use client';

import React from 'react';
import { PackageCheck, AlertCircle, Clock } from 'lucide-react';

interface PayloadStockBadgeProps {
  inventory: number;
  lowStockThreshold?: number;
  allowBackorder?: boolean;
  className?: string;
}

export function PayloadStockBadge({
  inventory,
  lowStockThreshold = 5,
  allowBackorder = false,
  className = ''
}: PayloadStockBadgeProps) {
  if (inventory <= 0) {
    if (allowBackorder) {
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ${className}`}>
          <Clock className="w-3.5 h-3.5" /> Backorder Available
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
      </span>
    );
  }

  if (inventory <= lowStockThreshold) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 animate-pulse ${className}`}>
        <AlertCircle className="w-3.5 h-3.5" /> Only {inventory} left in stock
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 ${className}`}>
      <PackageCheck className="w-3.5 h-3.5" /> In Stock & Ready to Ship
    </span>
  );
}
