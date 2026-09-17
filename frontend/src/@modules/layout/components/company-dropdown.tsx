'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown, Building2, Mail, HelpCircle } from 'lucide-react';
import { clx } from '@/lib/util/clx';

interface CompanyDropdownProps {
  pathname: string;
  currentTheme: {
    bg: string;
    lightBg: string;
    text: string;
    badge: string;
    shadow: string;
  };
}

export const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  pathname,
  currentTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isCompanyActive = ['/about', '/contact', '/faq'].some((p) =>
    pathname.startsWith(p)
  );

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const itemBaseClasses = 'w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition';
  const inactiveItemClasses = 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white';

  return (
    <div
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={clx(
          'px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer outline-none flex items-center gap-1',
          isCompanyActive
            ? clx(currentTheme.lightBg, 'font-bold shadow-2xs')
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
        )}
      >
        <span>Company</span>
        <ChevronDown
          className={clx(
            'w-3.5 h-3.5 transition-transform duration-200 text-slate-400 dark:text-slate-500',
            isOpen && 'rotate-180 text-slate-700 dark:text-slate-300'
          )}
        />
      </button>

      {/* Popover Card */}
      <div
        className={clx(
          'absolute top-[calc(100%+6px)] left-0 w-48 popover-surface rounded-2xl border border-card p-1.5 transition-all duration-150 z-50 transform origin-top-left shadow-xl shadow-slate-900/10 dark:shadow-black/40 before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3',
          isOpen
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible translate-y-1 pointer-events-none'
        )}
      >
        <Link
          href="/about"
          onClick={() => setIsOpen(false)}
          className={clx(
            itemBaseClasses,
            pathname === '/about'
              ? clx(currentTheme.lightBg, 'font-bold')
              : inactiveItemClasses
          )}
        >
          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-extrabold">About Us</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Our story & brand
            </div>
          </div>
        </Link>

        <Link
          href="/contact"
          onClick={() => setIsOpen(false)}
          className={clx(
            itemBaseClasses,
            pathname === '/contact'
              ? clx(currentTheme.lightBg, 'font-bold')
              : inactiveItemClasses
          )}
        >
          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-extrabold">Contact</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Get in touch with us
            </div>
          </div>
        </Link>

        <Link
          href="/faq"
          onClick={() => setIsOpen(false)}
          className={clx(
            itemBaseClasses,
            pathname === '/faq'
              ? clx(currentTheme.lightBg, 'font-bold')
              : inactiveItemClasses
          )}
        >
          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-extrabold">FAQ</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Help center & answers
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
