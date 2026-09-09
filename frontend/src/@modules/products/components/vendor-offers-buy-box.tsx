'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, 
  ShieldCheck, 
  Truck, 
  Star, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  Sparkles, 
  Info, 
  RotateCcw, 
  BadgePercent,
  Check
} from 'lucide-react';
import { MockProduct, VendorOffer, SellerAccount } from '@/types';
import { formatCurrency } from '@/utils/pricing';

interface VendorOffersBuyBoxProps {
  product: MockProduct;
  sellers: SellerAccount[];
  selectedOfferId?: string;
  onSelectOffer?: (offer: VendorOffer) => void;
  onAddToCartWithOffer: (product: MockProduct, qty: number, offer: VendorOffer) => void;
  className?: string;
}

export function VendorOffersBuyBox({
  product,
  sellers,
  selectedOfferId,
  onSelectOffer,
  onAddToCartWithOffer,
  className = ''
}: VendorOffersBuyBoxProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [selectedOfferState, setSelectedOfferState] = useState<string | null>(selectedOfferId || null);

  React.useEffect(() => {
    if (selectedOfferId !== undefined) {
      setSelectedOfferState(selectedOfferId);
    }
  }, [selectedOfferId]);

  const offers = product.offers || [];

  // Active / Selected Offer
  const currentOffer = React.useMemo(() => {
    if (selectedOfferState) {
      const found = offers.find(o => o.offerId === selectedOfferState);
      if (found) return found;
    }
    if (offers.length > 0) {
      // Default to lowest price or first offer
      return offers.reduce((lowest, curr) => (curr.price < lowest.price ? curr : lowest), offers[0]);
    }
    return null;
  }, [offers, selectedOfferState]);

  // Find Seller Account for the current offer or primary seller
  const currentSeller = React.useMemo(() => {
    const sellerId = currentOffer?.sellerId || product.primarySellerId;
    return sellers.find(s => s.id === sellerId) || {
      id: sellerId || '849201',
      storeName: currentOffer?.sellerName || product.primarySellerName || 'Verified Merchant',
      rating: currentOffer?.rating || 4.9,
      location: 'South Africa',
      dispatchSla: '1 - 2 business days',
      returnPolicyDays: 30,
      verifiedBadgeText: 'Verified Marketplace Seller',
      status: 'active'
    };
  }, [currentOffer, product, sellers]);

  // Other competing offers
  const otherOffers = React.useMemo(() => {
    let list = offers.filter(o => o.offerId !== currentOffer?.offerId);
    if (conditionFilter !== 'All') {
      list = list.filter(o => o.condition === conditionFilter);
    }
    return list;
  }, [offers, currentOffer, conditionFilter]);

  const uniqueConditions = React.useMemo(() => {
    const set = new Set<string>();
    offers.forEach(o => set.add(o.condition));
    return ['All', ...Array.from(set)];
  }, [offers]);

  if (offers.length === 0) {
    return (
      <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 ${className}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Sold & Fulfilled by:</span>
          <span className="text-slate-900 dark:text-white font-extrabold">{product.primarySellerName || 'Mrbulk Official'}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-slate-400" /> 1-2 day dispatch</span>
          <span className="flex items-center gap-1"><RotateCcw className="w-3 h-3 text-slate-400" /> 30-Day returns</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main "Sold By" Merchant Card */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/70 dark:border-slate-700/70">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
              Sold & Dispatched By
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/store/${currentSeller.id}`}
                className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5 group"
              >
                <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="group-hover:underline">{currentSeller.storeName}</span>
              </Link>
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Verified Partner
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 px-2.5 py-1 rounded-xl">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">{currentSeller.rating?.toFixed(1) || '4.9'}</span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400 font-medium">/ 5.0</span>
            </div>
            <Link
              href={`/store/${currentSeller.id}`}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-3 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition"
            >
              Visit Storefront
            </Link>
          </div>
        </div>

        {/* Offer Highlights & Guarantees */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3.5 text-[11px]">
          <div className="flex items-center gap-2 p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Condition</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{currentOffer?.condition || 'Brand New'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dispatch SLA</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{currentSeller.dispatchSla || `${currentOffer?.shippingDays || 2} Business Days`}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-white/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/50 dark:border-slate-700/50 col-span-2 sm:col-span-1">
            <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Returns</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{currentSeller.returnPolicyDays || 30}-Day Guarantee</span>
            </div>
          </div>
        </div>

        {currentOffer?.notes && (
          <div className="mt-3 p-2.5 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed"><strong className="font-bold">Seller Note:</strong> {currentOffer.notes}</p>
          </div>
        )}
      </div>

      {/* "Other Sellers on Mrbulk" Comparison Accordion */}
      {offers.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3.5 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/70 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Compare {offers.length - 1} Other Seller Offer{offers.length - 1 > 1 ? 's' : ''}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                From {formatCurrency(Math.min(...offers.map(o => o.price)))}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              <span>{isExpanded ? 'Hide offers' : 'Show offers'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80"
              >
                {/* Condition Filter Chips */}
                {uniqueConditions.length > 2 && (
                  <div className="flex items-center gap-1.5 pb-2 overflow-x-auto scrollbar-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Filter:</span>
                    {uniqueConditions.map(cond => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => setConditionFilter(cond)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer shrink-0 ${
                          conditionFilter === cond
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                )}

                {/* Offer Items Comparison List */}
                <div className="space-y-2.5 pt-2">
                  {otherOffers.map((offer) => {
                    const offerSeller = sellers.find(s => s.id === offer.sellerId);
                    const priceDiff = offer.price - (currentOffer?.price || 0);

                    return (
                      <div
                        key={offer.offerId}
                        className="p-3 sm:p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/store/${offer.sellerId}`}
                              className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white hover:text-blue-600 transition"
                            >
                              {offer.sellerName}
                            </Link>

                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                              {offer.condition}
                            </span>

                            {offer.isFeatured && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-0.5">
                                <Sparkles className="w-2 h-2 fill-current" /> Top Value
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                              <strong className="text-slate-700 dark:text-slate-300 font-bold">{offer.rating?.toFixed(1) || '4.8'}</strong>
                              <span>({offer.reviewsCount || 10})</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Truck className="w-3 h-3 text-slate-400" />
                              <span>{offerSeller?.dispatchSla || `${offer.shippingDays} days delivery`}</span>
                            </span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {offer.stockCount} in stock
                            </span>
                          </div>

                          {offer.notes && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-0.5">
                              "{offer.notes}"
                            </p>
                          )}
                        </div>

                        {/* Price and Add to Cart Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                          <div className="text-left sm:text-right">
                            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white block">
                              {formatCurrency(offer.price)}
                            </span>
                            {priceDiff !== 0 && (
                              <span className={`text-[10px] font-bold block ${priceDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                                {priceDiff < 0 ? `Save ${formatCurrency(Math.abs(priceDiff))}` : `+${formatCurrency(priceDiff)} vs selected`}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOfferState(offer.offerId);
                                if (onSelectOffer) {
                                  onSelectOffer(offer);
                                }
                              }}
                              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                              title="Set as primary offer"
                            >
                              Select
                            </button>

                            <button
                              type="button"
                              onClick={() => onAddToCartWithOffer(product, 1, offer)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                            >
                              <ShoppingCart className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
