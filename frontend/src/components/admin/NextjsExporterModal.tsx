'use client';

import React from 'react';
import { X, Code, Download, Layers, CheckCircle2 } from 'lucide-react';
import { downloadHtmlTemplate } from '@/utils/htmlTemplateGenerator';
import { useCatalog } from '@/providers/catalog-provider';
import { useThemeContext } from '@/providers/theme-provider';

interface NextjsExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  storeName: string;
}

export const NextjsExporterModal: React.FC<NextjsExporterModalProps> = ({
  isOpen,
  onClose,
  showToast,
  storeName
}) => {
  const { products, categories, slides } = useCatalog();
  const { themeColor } = useThemeContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Next.js 15 App Router Exporter</h3>
              <p className="text-xs text-slate-500">Export clean TypeScript codebase for {storeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            Your export package contains a complete multi-page static HTML website with exact styling, floating pill header, authentic South African footer, responsive pages, and unified shopping cart.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" /> Multi-Page Static Site Structure (ZIP):
            </h4>
            <ul className="space-y-1 pl-5 list-disc text-slate-600">
              <li><code className="text-blue-600">index.html</code> - Homepage with banners, deals, bestsellers & testimonials</li>
              <li><code className="text-blue-600">shop.html</code> - Full catalog with search, category filtering & sorting</li>
              <li><code className="text-blue-600">categories.html</code> - Department directory with product counts</li>
              <li><code className="text-blue-600">cart.html & checkout.html</code> - Dedicated cart & SA checkout flows</li>
              <li><code className="text-blue-600">about.html & contact.html</code> - Company info, WhatsApp & direct support</li>
              <li><code className="text-blue-600">order-tracking.html & faq.html</code> - Courier tracking & help centre</li>
              <li><code className="text-blue-600">privacy-policy.html & terms-and-conditions.html</code> - POPIA & CPA policies</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Ready for one-click ZIP download. No build step or server required!</span>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              downloadHtmlTemplate({
                storeName: storeName || 'Mrbulk Store',
                themeColor: themeColor || 'emerald',
                products,
                categories,
                slides,
              });
              showToast('Multi-page HTML website downloaded successfully!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Multi-Page Website (ZIP)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextjsExporterModal;
