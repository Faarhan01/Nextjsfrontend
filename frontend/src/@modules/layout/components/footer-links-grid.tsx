'use client';

import React from 'react';
import { ShoppingCart, User, Building2, ShieldCheck } from 'lucide-react';
import { FooterLinkSection } from '@modules/layout/components/footer-link-section';
import { useAuthContext } from '@/providers/auth-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';

export const FooterLinksGrid: React.FC = () => {
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const { wishlist } = useWishlistContext();

  const shoppingLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop Catalog' },
    { href: '/categories', label: 'All Categories' },
  ];

  const userLinks = [
    {
      href: '/account',
      label: 'My Account',
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!currentUser) {
          e.preventDefault();
          setAuthModalOpen(true);
        }
      },
    },
    {
      href: '/wishlist',
      label: 'Wishlist',
      badge: wishlist.length > 0 ? (
        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[10px] font-black border border-rose-200 dark:border-rose-800">
          {wishlist.length}
        </span>
      ) : null,
    },
    { href: '/order-tracking', label: 'Track Order' },
  ];

  const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact & Location' },
    { href: '/faq', label: 'FAQ' },
    { href: '/sell', label: 'Sell on Mrbulk', className: 'text-emerald-600 dark:text-emerald-400 font-bold' },
  ];

  const policyLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/returns-policy', label: 'Returns & Refund Policy' },
    { href: '/seller-policy', label: 'Marketplace Seller Policy', className: 'text-blue-600 dark:text-blue-400 font-bold' },
  ];

  return (
    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <FooterLinkSection title="Shopping" icon={ShoppingCart} iconClassName="text-blue-600 dark:text-blue-400" links={shoppingLinks} />
        <FooterLinkSection title="User" icon={User} iconClassName="text-indigo-600 dark:text-indigo-400" links={userLinks} />
        <FooterLinkSection title="Company" icon={Building2} iconClassName="text-emerald-600 dark:text-emerald-400" links={companyLinks} />
        <FooterLinkSection title="Policies" icon={ShieldCheck} iconClassName="text-rose-600 dark:text-rose-400" links={policyLinks} />
      </div>
    </div>
  );
};
