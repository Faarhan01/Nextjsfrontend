'use client';

import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Truck, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { updateSEOMetadata } from '@/utils/seoUtils';

interface StaticPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate: (page: string) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
}

export const ReturnsPolicyPage: React.FC<StaticPageProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  onNavigate,
  showToast,
  logoText = 'mrbulk'
}) => {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;

  useEffect(() => {
    updateSEOMetadata(
      `Returns & Refund Policy | ${logoText}`,
      `Learn about our hassle-free returns, Consumer Protection Act (CPA) compliance, and money back guarantee at ${logoText} (mrbulk.co.za).`,
      '/returns-policy'
    );
  }, [logoText]);
  const lightBannerBg = {
    blue: 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60',
    indigo: 'bg-gradient-to-br from-indigo-200/90 via-indigo-100/75 to-indigo-50/85 dark:from-indigo-950/90 dark:via-indigo-900/60 dark:to-indigo-950/80 border-indigo-300/80 dark:border-indigo-700/60',
    emerald: 'bg-gradient-to-br from-emerald-200/90 via-emerald-100/75 to-emerald-50/85 dark:from-emerald-950/90 dark:via-emerald-900/60 dark:to-emerald-950/80 border-emerald-300/80 dark:border-emerald-700/60',
    rose: 'bg-gradient-to-br from-rose-200/90 via-rose-100/75 to-rose-50/85 dark:from-rose-950/90 dark:via-rose-900/60 dark:to-rose-950/80 border-rose-300/80 dark:border-rose-700/60',
    amber: 'bg-gradient-to-br from-amber-200/90 via-amber-100/75 to-amber-50/85 dark:from-amber-950/90 dark:via-amber-900/60 dark:to-amber-950/80 border-amber-300/80 dark:border-amber-700/60',
    slate: 'bg-gradient-to-br from-slate-200/90 via-slate-100/80 to-slate-50/90 dark:from-slate-800/90 dark:via-slate-850 dark:to-slate-800/80 border-slate-300/90 dark:border-slate-700/70',
  }[themeColor] || 'bg-gradient-to-br from-blue-200/90 via-blue-100/75 to-blue-50/85 dark:from-blue-950/90 dark:via-blue-900/60 dark:to-blue-950/80 border-blue-300/80 dark:border-blue-700/60';

  const ambientGlowClasses = {
    blue: 'bg-blue-400/20 dark:bg-blue-500/25',
    indigo: 'bg-indigo-400/20 dark:bg-indigo-500/25',
    emerald: 'bg-emerald-400/20 dark:bg-emerald-500/25',
    rose: 'bg-rose-400/20 dark:bg-rose-500/25',
    amber: 'bg-amber-400/20 dark:bg-amber-500/25',
    slate: 'bg-slate-400/20 dark:bg-slate-500/25',
  }[themeColor] || 'bg-blue-400/20 dark:bg-blue-500/25';

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-24 space-y-6 sm:space-y-8">
      
      {/* Header Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1 select-none">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer font-semibold no-underline text-slate-500 dark:text-slate-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </a>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-extrabold">Returns & Refund Policy</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>30-Day Hassle-Free Returns</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              Returns & Refund Policy
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              We want you to love your purchases from {logoText}. If a product doesn't meet your expectations, return it hassle-free within 30 days for a full refund or exchange.
            </p>

            {/* Risk-Free Promise Banner Card */}
            <div className="pt-2 flex justify-center select-text">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 select-none" />
                <span className="uppercase text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">RISK-FREE PROMISE</span>
                <span className="font-black text-slate-900 dark:text-white">100% Satisfaction Guaranteed</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 30-Day Window */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 border border-emerald-100 dark:border-emerald-800">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">30-Day Window</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Return any unused item within 30 days of delivery.
              </p>
            </div>
          </div>

          {/* Card 2: Free Return Shipping */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 border border-blue-100 dark:border-blue-800">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Free Return Shipping</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Prepaid return labels provided for all eligible orders.
              </p>
            </div>
          </div>

          {/* Card 3: Fast Refunds */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 border border-blue-100 dark:border-blue-800">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Fast Refunds</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Refunds credited in 3-5 business days upon inspection.
              </p>
            </div>
          </div>

          {/* Card 4: Instant Exchanges */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 border border-amber-100 dark:border-amber-800">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Instant Exchanges</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Exchange sizes or finishes instantly with zero extra fees.
              </p>
            </div>
          </div>

        </div>

        {/* Section: How Returns Work (4 Simple Steps) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Step-by-Step Guide</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              How Returns Work (4 Simple Steps)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Step 1 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-2 shadow-2xs">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-black">
                Step 1
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Initiate Return Online</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Use our instant Return Portal or navigate to My Account to submit your return request.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-2 shadow-2xs">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-black">
                Step 2
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Print Prepaid Label</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Download and print your free prepaid shipping label attached to your return confirmation email.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-2 shadow-2xs">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-black">
                Step 3
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Pack & Drop Off</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Repack items securely in original packaging with tags attached and drop off at any authorized courier location.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-2 shadow-2xs">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 text-xs font-black">
                Step 4
              </span>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Receive Refund</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Once received at our fulfillment hub, refunds are issued back to your original payment method in 3-5 days.
              </p>
            </div>

          </div>
        </div>

        {/* Section: Return Eligibility Criteria */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Return Eligibility Criteria
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              To qualify for a full refund or exchange under our 30-day guarantee:
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Items must be in original, unused, and undamaged condition.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Original tags, certificates, and packaging boxes must be intact.</span>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">Return request must be initiated within 30 days of shipment delivery date.</span>
            </div>
          </div>
        </div>

        {/* Section: Non-Returnable & Restricted Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Special Restrictions</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Non-Returnable & Restricted Items
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              The following categories are non-returnable unless defective upon delivery:
            </p>
          </div>

          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/50 rounded-2xl p-5 space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <div className="flex items-start gap-2.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
              <span>Custom-built or bespoke furniture pieces ordered with tailored specifications.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
              <span>Digital gift cards and downloadable software keys.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
              <span>Final sale clearance items clearly marked as "Non-Returnable" on the product detail page.</span>
            </div>
          </div>
        </div>

        {/* Section: Returns Physical Hub & Contact */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Returns & Inspection Facility
            </h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              All returned parcels and warranty inspections are received and processed at our central Johannesburg facility:
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-black text-slate-900 dark:text-white">Mrbulk Returns Department</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Mr Cheap General Dealer ZA</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Address:</strong> 150 Industrial Rd, Crown North, Johannesburg, South Africa<br />
                <strong>Returns Support:</strong> <a href="mailto:support@mrbulk.co.za" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">support@mrbulk.co.za</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReturnsPolicyPage;
