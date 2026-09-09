'use client';

import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  User, 
  Clock, 
  ArrowLeft, 
  FileText, 
  Eye, 
  Check, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Scale,
  Key,
  Trash2,
  Edit3,
  MailCheck,
  Cookie,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageBanner } from '@/components/shared';
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

export const PrivacyPolicyPage: React.FC<StaticPageProps> = ({
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
      `Privacy Policy | ${logoText}`,
      `Learn how ${logoText} (mrbulk.co.za) safeguards your personal information, adheres to South African POPIA regulations, and respects your privacy rights.`,
      '/privacy-policy'
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
      
      {/* Header Banner Section using shared PageBanner */}
      <PageBanner
        title="Privacy Policy"
        description={`At ${logoText}, we prioritize your digital privacy and data security. Learn how we safeguard your personal information, manage cookies, and respect your data rights.`}
        badge="Trust & Compliance Standard"
        themeColor={themeColor}
        logoText={logoText}
        backLabel="Home"
        onBack={() => onNavigate('home')}
        actions={
          <div className="pt-2 select-text">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium shadow-xs">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 select-none" />
              <span className="uppercase text-[10px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">EFFECTIVE DATE</span>
              <span className="font-black text-slate-900 dark:text-white">July 2026 (v2.4)</span>
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Top 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col items-start space-y-2">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100/60 dark:border-blue-800">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">256-bit Encryption</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All transactional data is stored with bank-grade encryption protocols.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col items-start space-y-2">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-100/60 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Never Sold</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We never sell or monetize your personal shopping records to ad brokers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col items-start space-y-2">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100/60 dark:border-blue-800">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Full Data Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Request account export, privacy report, or total erasure at any time.
            </p>
          </div>
        </div>

        {/* Section 01: Introduction & Scope */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">01</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Introduction & Scope</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This Privacy Policy applies to {logoText} ("we", "us", or "our"), operating the storefront website and mobile services. This document outlines our practices regarding the collection, storage, and processing of personal data when you interact with our catalog, create an account, or place orders.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By accessing or using {logoText}, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our policies and practices, you may choose not to use our services.
          </p>
        </div>

        {/* Section 02: Information We Collect */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">02</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Information We Collect</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We collect information directly from you when provided voluntarily, as well as automatically when navigating our store:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Information You Provide Directly</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Account registration (name, email, password hash)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Billing & shipping address details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Payment method details (processed via PCI-DSS compliant gateways)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Customer service correspondence & feedback</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">
                <Eye className="w-4 h-4 shrink-0" />
                <span>Automatically Collected Data</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>IP address, browser type, and operating system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Shopping behavior, page views, and items added to cart</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Referral sources and URL timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>Device identifiers and session cookies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 03: How We Use Your Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">03</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">How We Use Your Information</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We process your personal information for specific, legitimate business purposes:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Order Fulfillment</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">To process payments, verify transactions, ship physical products, and issue digital receipts or tracking numbers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Customer Support</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">To troubleshoot issues, handle refund requests, and respond to inquiries promptly.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Store Personalization</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">To recommend relevant categories, remember wishlist choices, and save custom layout options.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Security & Fraud Prevention</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">To detect unauthorized account access, mitigate payment fraud, and ensure platform safety.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 04: Third-Party Sharing & Partners */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">04</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Third-Party Sharing & Partners</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We share data with trusted third-party service providers solely to facilitate our core operations. These partners are legally bound to protect your data under strict confidentiality agreements:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Logistics Partners</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Shipping couriers (FedEx, UPS, DHL) to deliver orders to your shipping address.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Payment Processors</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gateway partners (Stripe, PayPal) to process encrypted credit card transactions.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Analytics Providers</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated, anonymized web analytics to measure platform performance.</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Legal Compliance</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">We may disclose data if required by law, subpoena, or government regulation.</p>
            </div>
          </div>
        </div>

        {/* Section 05: Your Privacy Rights & Choices */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">05</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Privacy Rights & Choices</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Depending on your jurisdiction (e.g. GDPR, CCPA/CPRA), you hold the following rights over your data:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Right to Access</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Request a copy of all personal information we store about you.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Trash2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Right to Erasure (Forget Me)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Request the permanent deletion of your account and order history.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Right to Rectification</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update or correct inaccurate personal details in your account profile.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                <MailCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Opt-Out of Marketing</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unsubscribe from promotional emails via one-click footer links.</p>
            </div>
          </div>
        </div>

        {/* Section 06: Cookies & Tracking Technologies */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">06</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Cookies & Tracking Technologies</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Cookies are small text files stored on your device. We use essential session cookies to remember your shopping cart items, theme preferences, and account login status. You can disable cookies in your browser settings, though certain interactive store features may become unavailable.
          </p>
        </div>

        {/* Section 07: Data Protection & Security */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">07</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Data Protection & Security</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We implement robust administrative, technical, and physical safeguards designed to protect personal data against accidental loss, unauthorized access, and alteration. These safeguards include SSL/TLS transport encryption, restricted internal employee access, and regular infrastructure vulnerability assessments.
          </p>
        </div>

        {/* Section 08: POPIA & Contact Information */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">08</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">POPIA Compliance & Contacting Us</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              In accordance with the <strong>Protection of Personal Information Act 4 of 2013 (POPIA)</strong> of South Africa, you have the right to request access to, correction of, or deletion of your personal information held by us.
            </p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-black text-slate-900 dark:text-white">Mrbulk (mrbulk.co.za)</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Operated by Mr Cheap General Dealer ZA</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Address:</strong> 150 Industrial Rd, Crown North, Johannesburg, South Africa<br />
                <strong>Email:</strong> <a href="mailto:support@mrbulk.co.za" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">support@mrbulk.co.za</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
