'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface NewsletterSectionProps {
  themeColor?: string;
  getThemeClasses?: (color?: string) => any;
  showToast?: (msg: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  showToast
}) => {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast?.('Please enter a valid email address.');
      return;
    }
    showToast?.('Thank you for joining our VIP newsletter! Check your inbox for your 15% discount code.');
    setEmail('');
  };

  const btnBg = currentTheme?.bg || 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500';
  const badgeClasses = currentTheme 
    ? `${currentTheme.lightBg} ${currentTheme.text} ${currentTheme.border}`
    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-slate-900 dark:text-white relative overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider shadow-2xs ${badgeClasses}`}>
            <Sparkles className="w-3.5 h-3.5" /> VIP Perks &amp; Product Drops
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Unlock 15% Off Your First Order
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Join our insider list for early access to new product arrivals, exclusive flash sales, and subscriber-only discounts.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-slate-400 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition shadow-2xs"
                required
              />
            </div>
            <button
              type="submit"
              className={`px-6 py-3 ${btnBg} text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer active:scale-95`}
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>We respect your privacy. Unsubscribe anytime in one click.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
