'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useThemeContext } from '@/providers/theme-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useAuthContext } from '@/providers/auth-provider';
import { useToastContext } from '@/providers/toast-provider';
import { getThemeClasses } from '@/providers/theme-provider';
import {
  Mail,
  Send,
  ShoppingCart,
  User,
  Building2,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { FooterTrustCarousel } from '@modules/layout/components/footer-trust-carousel';

export const StoreFooter: React.FC = () => {
  const { logoText, themeColor } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);
  const { wishlist } = useWishlistContext();
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const { showToast } = useToastContext();

  const [newsletterEmail, setNewsletterEmail] = useState('');

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
    <footer className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 mt-auto border-t border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
      {/* Dynamic Theme Accent Top Glow Bar */}
      <div className={`h-1 w-full ${currentTheme.bg}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        {/* Top Features / Customer Perks Horizontal Carousel */}
        <FooterTrustCarousel />

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-8">
          {/* Store Name & Description Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${currentTheme.bg} text-white flex items-center justify-center font-black text-sm shadow-md`}>
                  {logoText.charAt(0)}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{logoText}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Your trusted South African marketplace for retail and wholesale products, verified suppliers, and seamless shopping across the country.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800">
              <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
              <span>Operated by Mr Cheap General Dealer ZA</span>
            </div>
          </div>

          {/* Navigation Links Grid Card */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* 1. Shopping */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <ShoppingCart className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                  <span>Shopping</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li>
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Shop Catalog
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      All Categories
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 2. User */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <User className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                  <span>User</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li>
                    <Link
                      href="/account"
                      onClick={(e) => {
                        if (!currentUser) {
                          e.preventDefault();
                          setAuthModalOpen(true);
                        }
                      }}
                      className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/wishlist" className="hover:text-slate-900 dark:hover:text-white transition flex items-center justify-between w-full py-0.5 hover:translate-x-1 duration-200 group">
                      <span className="group-hover:text-slate-900 dark:group-hover:text-white">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[10px] font-black border border-rose-200 dark:border-rose-800">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link href="/order-tracking" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Track Order
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 3. Company */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <Building2 className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                  <span>Company</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li>
                    <Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Contact &amp; Location
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/sell" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200 text-emerald-600 dark:text-emerald-400 font-bold">
                      Sell on Mrbulk
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 4. Policies */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                  <ShieldCheck className={`w-3.5 h-3.5 ${currentTheme.text}`} />
                  <span>Policies</span>
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns-policy" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200">
                      Returns &amp; Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/seller-policy" className="hover:text-slate-900 dark:hover:text-white transition block py-0.5 hover:translate-x-1 duration-200 text-blue-600 dark:text-blue-400 font-bold">
                      Marketplace Seller Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Row (Responsive: stacked on mobile, text left / form right on larger screens) */}
        <div className="pb-10 border-b border-slate-200/90 dark:border-slate-800">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
            {/* Left side: Heading and description text */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Mail className={`w-4 h-4 ${currentTheme.text}`} />
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">Join Store Newsletter</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                Subscribe for exclusive discounts, new arrivals, and special member updates.
              </p>
            </div>

            {/* Right side: Input field & Subscribe button */}
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
                className={`px-5 py-2.5 ${currentTheme.bg} hover:brightness-110 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-md active:scale-95`}
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Security Line */}
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
      </div>
    </footer>
  );
};
