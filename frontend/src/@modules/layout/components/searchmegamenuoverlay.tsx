'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, ShoppingCart } from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { MockProduct } from '../../../types';
import { getProductUrl } from '../../../utils/seoUtils';

interface SearchMegamenuOverlayProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchSuggestions: MockProduct[];
  onClose: () => void;
  onPerformSearch: (overrideQuery?: string) => void;
  onAddToCart: (prod: MockProduct) => void;
}

const POPULAR_SEARCH_TAGS = ['Audio', 'Watches', 'Furniture', 'Nova', 'Lighting', 'Noise Cancelling'];

export const SearchMegamenuOverlay: React.FC<SearchMegamenuOverlayProps> = ({
  searchQuery,
  setSearchQuery,
  searchSuggestions,
  onClose,
  onPerformSearch,
  onAddToCart
}) => {
  const router = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 pointer-events-auto"
      />

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-full left-0 right-0 mt-2 px-4 sm:px-6 lg:px-8 z-40 pointer-events-auto max-w-4xl mx-auto"
      >
        <div className="modal-surface rounded-3xl p-4 sm:p-6 space-y-4 overflow-hidden shadow-2xl shadow-slate-950/20 dark:shadow-black/60">
          {/* Mobile search input field */}
          <div className="lg:hidden relative">
            <input
              type="text"
              placeholder="Search all luxury products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onClose();
                  onPerformSearch();
                }
              }}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 rounded-2xl text-sm font-medium outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
          </div>

          {/* Popular Search tags */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Popular:
            </span>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  onClose();
                  onPerformSearch(tag);
                }}
                className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-200 font-semibold transition shrink-0 cursor-pointer active:scale-95 border border-transparent dark:border-slate-700/60"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results Grid */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>{searchQuery.trim() ? `Search Results (${searchSuggestions.length})` : 'Featured Collections'}</span>
              {searchQuery.trim() && (
                <button
                  onClick={() => {
                    onClose();
                    onPerformSearch();
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>View All Results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {searchSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      router.push(getProductUrl(prod.id, prod.name));
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 transition cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shrink-0">
                      <SafeImage
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        placeholderType="product"
                        fallbackTitle={prod.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{prod.category || 'Luxury Goods'}</p>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{prod.price}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700 transition shrink-0"
                      title="Quick add to cart"
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No products found matching &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Try searching for &ldquo;Headphones&rdquo;, &ldquo;Watch&rdquo;, or &ldquo;Furniture&rdquo;.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

