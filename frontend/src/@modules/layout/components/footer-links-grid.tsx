'use client';

import React from 'react';
import { ShoppingBag, User, Building2, ShieldCheck } from 'lucide-react';
import { FooterLinkSection } from '@modules/layout/components/footer-link-section';
import { useAuthContext } from '@/providers/auth-provider';
import { useWishlistContext } from '@/providers/wishlist-provider';
import { useCartContext } from '@/providers/cart-provider';

export const FooterLinksGrid: React.FC = () => {
  const { currentUser, setAuthModalOpen } = useAuthContext();
  const { wishlist } = useWishlistContext();
  const { cartCount } = useCartContext();

  // Column 1: Shopping
  const shoppingLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/categories', label: 'Categories' },
    { href: '/shop?filter=featured', label: 'Featured Deals' },
    { href: '/shop?sort=price-asc', label: 'Wholesale & Bulk' },
  ];

  // Column 2: User
  const userLinks = [
    {
      href: '/account',
      label: currentUser ? 'My Account' : 'Sign In / Register',
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!currentUser) {
          e.preventDefault();
          setAuthModalOpen(true);
        }
      },
    },
    {
      href: '/order-tracking',
      label: 'Track Order',
    },
    {
      href: '/wishlist',
      label: 'Wishlist',
      badge: wishlist.length > 0 ? (
        <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 text-[10px] font-black border border-rose-200 dark:border-rose-800">
          {wishlist.length}
        </span>
      ) : null,
    },
    {
      href: '/cart',
      label: 'Shopping Cart',
      badge: cartCount > 0 ? (
        <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 text-[10px] font-black border border-blue-200 dark:border-blue-800">
          {cartCount}
        </span>
      ) : null,
    },
    {
      href: currentUser?.role === 'seller' ? '/sell/dashboard' : '/sell',
      label: currentUser?.role === 'seller' ? 'Seller Portal' : 'Seller Hub',
      className: 'text-indigo-600 dark:text-indigo-400 font-bold',
    },
  ];

  // Column 3: Company
  const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/faq', label: 'Help & FAQs' },
    {
      href: '/sell',
      label: 'Sell on Mrbulk',
      className: 'text-emerald-600 dark:text-emerald-400 font-bold',
    },
  ];

  // Column 4: Policies
  const policiesLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-and-conditions', label: 'Terms & Conditions' },
    { href: '/returns-policy', label: 'Returns & Refunds' },
    { href: '/seller-policy', label: 'Seller Policy' },
  ];

  return (
    <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs">
      <nav aria-label="Footer Navigation" className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <FooterLinkSection
          title="Shopping"
          icon={ShoppingBag}
          iconClassName="text-indigo-600 dark:text-indigo-400"
          links={shoppingLinks}
        />
        <FooterLinkSection
          title="User"
          icon={User}
          iconClassName="text-amber-600 dark:text-amber-400"
          links={userLinks}
        />
        <FooterLinkSection
          title="Company"
          icon={Building2}
          iconClassName="text-emerald-600 dark:text-emerald-400"
          links={companyLinks}
        />
        <FooterLinkSection
          title="Policies"
          icon={ShieldCheck}
          iconClassName="text-blue-600 dark:text-blue-400"
          links={policiesLinks}
        />
      </nav>
    </div>
  );
};
