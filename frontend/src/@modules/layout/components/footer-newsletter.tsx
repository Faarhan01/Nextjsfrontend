'use client';

import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { clx } from '@/lib/util/clx';
import { useToastContext } from '@/providers/toast-provider';

interface FooterNewsletterProps {
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

export const FooterNewsletter: React.FC<FooterNewsletterProps> = ({ currentTheme }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToastContext();

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Thank you for subscribing to our VIP newsletter!', 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="pb-10 border-b border-slate-200/90 dark:border-slate-800">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Mail className={clx('w-4 h-4', currentTheme.text)} />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Join Store Newsletter</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
            Subscribe for exclusive discounts, new arrivals, and special member updates.
          </p>
        </div>

        <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[420px] shrink-0">
          <input
            type="email"
            placeholder="Enter your email address"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:bg-white dark:focus:bg-slate-800 w-full placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
            required
          />
          <button
            type="submit"
            className={clx(
              'px-5 py-2.5 hover:brightness-110 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95',
              currentTheme.bg
            )}
          >
            <span>Subscribe</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};

