'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Store, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Calendar, 
  Truck, 
  RotateCcw, 
  Search, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  Filter
} from 'lucide-react';
import { SellerAccount } from '@/types';
import { SafeImage } from '@modules/common/components/safe-image';
import { useThemeContext, getThemeClasses } from '@/providers/theme-provider';

interface SellersDirectoryClientProps {
  sellers: SellerAccount[];
}

export function SellersDirectoryClient({ sellers }: SellersDirectoryClientProps) {
  const { themeColor, logoText } = useThemeContext();
  const currentTheme = getThemeClasses(themeColor);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'fast_dispatch' | 'top_rated'>('all');

  const filteredSellers = useMemo(() => {
    return sellers.filter((seller) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = seller.storeName.toLowerCase().includes(q);
        const matchesDesc = (seller.description || '').toLowerCase().includes(q);
        const matchesLoc = (seller.location || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesLoc) return false;
      }

      if (filterType === 'verified') {
        if (!seller.verifiedBadgeText && seller.status !== 'active') return false;
      }
      if (filterType === 'fast_dispatch') {
        const sla = (seller.dispatchSla || '').toLowerCase();
        if (!sla.includes('same-day') && !sla.includes('1') && !sla.includes('24h')) return false;
      }
      if (filterType === 'top_rated') {
        if ((seller.rating || 0) < 4.8) return false;
      }

      return true;
    });
  }, [sellers, searchQuery, filterType]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <Link href="/" className="hover:text-slate-800 dark:hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="font-extrabold text-slate-900 dark:text-white">Marketplace Sellers</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Verified Merchant Network
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Certified Storefronts & Distributors
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Connect directly with certified South African brands, official distributors, and independent boutique creators.
              </p>
            </div>

            <Link
              href="/sell"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl ${currentTheme.bg} text-white font-extrabold text-xs shadow-md ${currentTheme.shadow} hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap`}
            >
              <Building2 className="w-4 h-4" />
              <span>Become a Verified Seller</span>
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sellers by store name, province, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All ({sellers.length})
              </button>
              <button
                onClick={() => setFilterType('verified')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  filterType === 'verified'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Official Partners
              </button>
              <button
                onClick={() => setFilterType('fast_dispatch')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  filterType === 'fast_dispatch'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Fast Dispatch
              </button>
              <button
                onClick={() => setFilterType('top_rated')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  filterType === 'top_rated'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Top Rated (4.8+)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sellers Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredSellers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
            <Store className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">No merchants matched</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your keyword search or filter settings.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterType('all'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Banner & Logo Stage */}
                <div>
                  <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    {seller.bannerUrl ? (
                      <SafeImage
                        src={seller.bannerUrl}
                        alt={seller.storeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        placeholderType="banner"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  </div>

                  {/* Identity Row */}
                  <div className="px-5 pt-0 pb-4 relative">
                    <div className="flex items-end justify-between -mt-10 mb-3">
                      <div className="w-18 h-18 rounded-2xl bg-white dark:bg-slate-900 border-3 border-white dark:border-slate-900 shadow-md overflow-hidden relative flex items-center justify-center shrink-0">
                        {seller.logoUrl ? (
                          <SafeImage
                            src={seller.logoUrl}
                            alt={seller.storeName}
                            className="w-full h-full object-cover"
                            placeholderType="product"
                          />
                        ) : (
                          <div className="w-full h-full bg-brand text-white flex items-center justify-center font-black text-xl">
                            {seller.storeName.charAt(0)}
                          </div>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {seller.verifiedBadgeText || 'Verified'}
                      </span>
                    </div>

                    <h3 className={`text-base font-black text-slate-900 dark:text-white ${currentTheme.groupHoverText} transition-colors line-clamp-1`}>
                      {seller.storeName}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {seller.location || 'South Africa'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {seller.rating?.toFixed(1) || '4.9'} ({seller.ordersCount || 40}+ orders)
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {seller.description}
                    </p>

                    {/* Quick Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{seller.dispatchSla || '1-2 Days'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>{seller.returnPolicyDays || 30}-Day Returns</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/store/${seller.id}`}
                    className={`w-full py-2.5 px-4 rounded-xl ${currentTheme.bg} text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                  >
                    <span>Visit Official Store</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sell With Us Callout */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black uppercase tracking-wider backdrop-blur">
              Marketplace Partner Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to sell to thousands of shoppers?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Enjoy automated weekly EFT payouts, verified merchant branding, integrated courier dispatch, and multi-vendor buy-box priority.
            </p>
          </div>

          <Link
            href="/sell"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Apply for Vendor Account
          </Link>
        </div>
      </div>
    </div>
  );
}
