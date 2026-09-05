'use client';

import React from 'react';
import { X, Search, CheckCircle, Globe, Tag, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/presets';

interface SEOInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  storeName: string;
}

export const SEOInspectorModal: React.FC<SEOInspectorModalProps> = ({
  isOpen,
  onClose,
  showToast,
  storeName
}) => {
  if (!isOpen) return null;

  const topProducts = MOCK_PRODUCTS.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">SEO & Metadata Inspector</h3>
              <p className="text-xs text-slate-500">Live search indexing preview for {storeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Google Search Result Preview */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <Globe className="w-3.5 h-3.5" />
              <span>https://www.{storeName.toLowerCase().replace(/[^a-z]/g, '')}.com</span>
            </div>
            <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer">
              {storeName} - Premium Electronics & Luxury Lifestyle Storefront
            </h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Explore curated electronics, wireless noise-cancelling headphones, ergonomic furniture, and high quality lifestyle essentials with fast shipping and wholesale rates.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Structured Schema (JSON-LD) Status:
            </h4>
            <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1">
              <div><span className="text-emerald-400">@type:</span> "Store"</div>
              <div><span className="text-emerald-400">name:</span> "{storeName}"</div>
              <div><span className="text-emerald-400">productsIndexed:</span> {topProducts.length} items</div>
              <div><span className="text-emerald-400">openGraph:</span> "og:title, og:image, og:description"</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>SEO health score: 98/100 (Sitemap & Meta tags verified)</span>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOInspectorModal;
