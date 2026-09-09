'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useRegion } from '@/providers/region';

interface CountrySelectProps {
  className?: string;
  variant?: 'compact' | 'footer';
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  className = '',
  variant = 'footer',
}) => {
  const { regions, regionId, region, setRegionId } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const getRegionFlag = (code: string) => {
    switch (code.toLowerCase()) {
      case 'zar':
        return '🇿🇦';
      case 'usd':
        return '🌐';
      case 'eur':
        return '🇪🇺';
      case 'gbp':
        return '🇬🇧';
      default:
        return '🌍';
    }
  };

  const currentFlag = getRegionFlag(region?.currency_code || 'zar');

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select store region and currency"
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        <span className="text-sm leading-none">{currentFlag}</span>
        <span className="truncate max-w-[140px]">
          {region?.name || 'South Africa'} ({(region?.currency_code || 'ZAR').toUpperCase()})
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-600 dark:text-slate-300' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Store regions"
          className="absolute bottom-[calc(100%+8px)] left-0 sm:right-0 sm:left-auto w-56 popover-surface rounded-2xl border border-card p-1.5 shadow-xl shadow-slate-950/20 dark:shadow-black/50 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span>Shipping Destination</span>
            </span>
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {regions.map((r) => {
              const isSelected = r.id === regionId;
              const flag = getRegionFlag(r.currency_code);

              return (
                <button
                  key={r.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setRegionId(r.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{flag}</span>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{r.name}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono">
                        {r.currency_code} {r.tax_rate ? `• ${r.tax_rate}% VAT` : ''}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
