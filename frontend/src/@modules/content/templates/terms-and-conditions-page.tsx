'use client';

import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Scale, 
  Printer, 
  Gavel 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateSEOMetadata } from '@/utils/seoUtils';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';

interface StaticPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate?: (page: string) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
}

export const TermsAndConditionsPage: React.FC<StaticPageProps> = ({
  themeColor: propThemeColor,
  getThemeClasses: propGetThemeClasses,
  onNavigate: propOnNavigate,
  showToast: propShowToast,
  logoText: propLogoText
}) => {
  const router = useRouter();
  const themeCtx = useThemeContext();
  const toastCtx = useToastContext();

  const themeColor = propThemeColor ?? themeCtx.themeColor;
  const getThemeClasses = propGetThemeClasses ?? defaultGetThemeClasses;
  const logoText = propLogoText ?? themeCtx.logoText;
  const showToast = propShowToast ?? toastCtx.showToast;

  const onNavigate = (page: string) => {
    if (propOnNavigate) {
      propOnNavigate(page);
      return;
    }
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop') router.push('/shop');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;

  useEffect(() => {
    updateSEOMetadata(
      `Terms & Conditions | ${logoText}`,
      `Read the terms and conditions for using ${logoText} (mrbulk.co.za) store, marketplace services, and online purchases.`,
      '/terms-and-conditions'
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

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
          <span className="text-slate-900 dark:text-white font-extrabold">Terms & Conditions</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>Legal Framework & Use Agreement</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              Terms & Conditions
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Please read these Terms and Conditions carefully before using the {logoText} store, services, or placing any commercial orders.
            </p>

            {/* Print Document Action Button */}
            <div className="pt-2 select-none">
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-4 sm:py-2 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-extrabold shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Print Document</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Section 01: Agreement to Terms */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">01</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Agreement to Terms</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you ("User", "Customer") and {logoText} ("Company", "we", "us"), concerning your access to and use of our e-commerce platform and services.
            </p>
            <p>
              By accessing the store or placing an order, you confirm that you are at least 18 years old and legally capable of entering into binding contracts.
            </p>
          </div>
        </div>

        {/* Section 02: Intellectual Property Rights */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">02</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Intellectual Property Rights</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Unless otherwise indicated, {logoText} retains all proprietary rights to the platform design, source code, database structures, functionality, graphics, logos, and audio/video components. You are granted a limited, non-exclusive license to browse and purchase items for personal, non-commercial use.
            </p>
          </div>
        </div>

        {/* Section 03: User Accounts & Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">03</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">User Accounts & Security</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              When creating an account on {logoText}, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that breach platform rules or exhibit fraudulent behavior.
            </p>
          </div>
        </div>

        {/* Section 04: Products, Pricing & Availability */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">04</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Products, Pricing & Availability</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              We make every effort to display product colors, textures, and specifications accurately. However, we cannot guarantee that your device display will accurately reflect exact shades. All products are subject to availability, and we reserve the right to modify prices or discontinue items without prior notice.
            </p>
          </div>
        </div>

        {/* Section 05: Payment Processing & Taxes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">05</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Payment Processing & Taxes</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              We accept major credit cards, digital wallets, and authorized electronic payment methods. You represent and warrant that you have the legal right to use any payment method utilized in connection with any transaction. Applicable sales taxes and duties are calculated at checkout.
            </p>
          </div>
        </div>

        {/* Section 06: Shipping, Delivery & Title Transfer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">06</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Shipping, Delivery & Title Transfer</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Shipping times provided during checkout are estimates and not guaranteed. Title and risk of loss for all purchased items pass to you upon our delivery to the shipping carrier.
            </p>
          </div>
        </div>

        {/* Section 07: Limitation of Liability */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">07</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Limitation of Liability</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              To the maximum extent permitted by applicable law, {logoText} shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of or inability to use our services or products.
            </p>
          </div>
        </div>

        {/* Section 08: Governing Law & Legal Inquiries (Highlighted Card) */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">08</span>
            <div className="p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xs shrink-0 border border-transparent dark:border-slate-700">
              <Gavel className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Governing Law & Legal Inquiries
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Jurisdiction & legal entity information.
              </p>
            </div>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of South Africa</strong>, including the Consumer Protection Act (CPA) and Electronic Communications and Transactions Act (ECTA).
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-black text-slate-900 dark:text-white">Mrbulk (mrbulk.co.za)</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Trading Entity: Mr Cheap General Dealer ZA</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Physical Address:</strong> 150 Industrial Rd, Crown North, Johannesburg, South Africa<br />
                <strong>Legal Notices & Inquiries:</strong> <a href="mailto:legal@mrbulk.co.za" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">legal@mrbulk.co.za</a> / <a href="mailto:support@mrbulk.co.za" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">support@mrbulk.co.za</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
