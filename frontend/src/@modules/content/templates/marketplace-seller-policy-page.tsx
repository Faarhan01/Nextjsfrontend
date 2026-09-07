'use client';

import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Store, 
  Printer, 
  ShieldCheck, 
  Package, 
  DollarSign, 
  Truck, 
  Scale, 
  AlertTriangle, 
  FileText,
  Mail,
  MapPin,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { updateSEOMetadata } from '@/utils/seoUtils';

interface StaticPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate: (page: string) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
}

export const MarketplaceSellerPolicyPage: React.FC<StaticPageProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  onNavigate,
  showToast,
  logoText = 'mrbulk'
}) => {
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;

  useEffect(() => {
    updateSEOMetadata(
      `Marketplace Seller Policy | ${logoText}`,
      `Read the complete Marketplace Seller Policy for selling on ${logoText} (mrbulk.co.za) in South Africa.`,
      '/seller-policy'
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
          <span className="text-slate-900 dark:text-white font-extrabold">Marketplace Seller Policy</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>Vendor Agreement & Operational Standards</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              Marketplace Seller Policy
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Comprehensive guidelines, product standards, commission structures, fulfillment requirements, and operational rules for selling on {logoText} (mrbulk.co.za).
            </p>

            {/* Print Document Action Button */}
            <div className="pt-2 select-none flex items-center justify-center gap-3">
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 border border-blue-100 dark:border-blue-900">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Clear Fee Structure</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Wholesale: 1% fee | Retail: 10% marketplace commission.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 border border-emerald-100 dark:border-emerald-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Verified Vendors</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Legally registered & compliant sellers under South African law.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 border border-amber-100 dark:border-amber-900">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Approved Couriers</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tracked dispatch & safe packaging standards nationwide.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex items-start gap-4 shadow-xs">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl shrink-0 border border-purple-100 dark:border-purple-900">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Consumer Protection</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Strict alignment with CPA and POPIA compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Introduction */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">01</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Introduction</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              This Marketplace Seller Policy ("Seller Policy") applies to all third-party sellers ("Sellers", "you", "your") who apply to sell, list products, or sell products on the Mrbulk online marketplace platform ("Mrbulk", "Platform", "we", "us", "our").
            </p>
            <p>
              Mrbulk is operated by <strong>Mr Cheap General Dealer ZA</strong>, located at <strong>150 Industrial Rd, Crown North, Johannesburg, South Africa</strong> (Email: <strong>support@mrbulk.co.za</strong>).
            </p>
            <p>
              Mrbulk provides an online platform that enables independent Sellers to list and sell products to Customers. By applying to sell, listing products, or selling on Mrbulk, you agree to comply with this Seller Policy, the Mrbulk Terms & Conditions, the Mrbulk Privacy Policy, and all applicable South African laws.
            </p>
          </div>
        </div>

        {/* Section 2: Seller Eligibility */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">02</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Eligibility</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>To sell on Mrbulk, you must:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Be at least 18 years old or be a legally registered business entity.</li>
              <li>Have the legal right and authority to sell the products you list.</li>
              <li>Comply with all South African laws, tax regulations, and trade requirements.</li>
              <li>Complete the verification process required by Mrbulk.</li>
              <li>Provide accurate, complete, and truthful information during registration and whenever requested by Mrbulk.</li>
            </ul>
            <p>Mrbulk reserves the right to approve, reject, suspend, or terminate any Seller account in its sole discretion.</p>
          </div>
        </div>

        {/* Section 3: Seller Account */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">03</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Account</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              You are responsible for maintaining the security and confidentiality of your Seller account credentials. You must not share your login details with unauthorized persons.
            </p>
            <p>
              You are responsible for all activities and transactions conducted through your Seller account. You must keep your business details, contact information, banking details, and payout information up to date at all times.
            </p>
          </div>
        </div>

        {/* Section 4: Seller Verification */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">04</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Verification</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>Mrbulk may require Sellers to provide verification information before or during their participation on the marketplace, including but not limited to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Full name, identity number, or passport number (for individuals).</li>
              <li>Business name, registration documents, and registered address.</li>
              <li>Contact details, email address, and physical business location.</li>
              <li>Banking details or approved payout account information.</li>
              <li>Proof of authorization to sell certain brands or categories of products.</li>
            </ul>
            <p>Mrbulk may suspend or withhold payouts or listings if verification requirements are not satisfied.</p>
          </div>
        </div>

        {/* Section 5: Adding Products to the Marketplace */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">05</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Adding Products to the Marketplace</h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-1.5 text-sm">5.1 Existing Products in the Mrbulk Catalog</h3>
              <p>
                Sellers may attach their own offers (including stock quantity, price, and condition) to products that already exist in the Mrbulk catalog. When attaching an offer to an existing product, the Seller must ensure that the product they supply matches the catalog product exactly in brand, model, specifications, and condition.
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="font-black text-slate-900 dark:text-white mb-1.5 text-sm">5.2 New Products Not in the Mrbulk Catalog</h3>
              <p>
                If a product does not exist in the Mrbulk catalog, the Seller must submit the product details (including title, description, specifications, images, and category) to Mrbulk for review. Mrbulk reviews new product submissions and may approve, reject, or request modifications before the product becomes visible on the marketplace.
              </p>
            </div>
            <p>Mrbulk reserves the right to edit, re-categorize, reject, suspend, or remove any product listing at any time in its sole discretion.</p>
          </div>
        </div>

        {/* Section 6 & 7: Listing Requirements & Images */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">06</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Product Listing Requirements</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>All product information submitted by a Seller must be accurate, complete, clear, and not misleading.</p>
              <p>Product descriptions must accurately describe the product's condition, features, dimensions, specifications, compatibility, and any included accessories.</p>
              <p>Sellers must not use misleading titles, false claims, inappropriate keywords, or deceptive descriptions.</p>
              <p>Sellers must ensure their products comply with applicable South African safety, labeling, and trade standards.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">07</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Product Images and Content</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Product images submitted by Sellers must accurately represent the product being sold.</p>
              <p>Images must be clear, high quality, and free from misleading graphics, watermarks, or irrelevant text.</p>
              <p>Sellers must have the legal right or permission to use all images, text, and media submitted to Mrbulk.</p>
              <p>Mrbulk may remove or replace images that do not meet marketplace standards or that infringe third-party intellectual property rights.</p>
            </div>
          </div>
        </div>

        {/* Section 8 & 9: Seller Responsibility & Stock Management */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">08</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Product Responsibility</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>The Seller is solely responsible for:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The quality, safety, authenticity, and legality of the products they sell.</li>
                <li>Ensuring the products match the description, images, and specifications on the listing.</li>
                <li>Ensuring that products are authentic and do not infringe any trademark, copyright, patent, or other proprietary right.</li>
                <li>Maintaining sufficient stock to fulfill accepted orders.</li>
                <li>Properly packaging products to prevent damage during transit.</li>
                <li>Fulfilling orders promptly in accordance with Mrbulk delivery standards.</li>
                <li>Honoring applicable warranties and South African consumer protection requirements.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">09</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Stock Management</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must keep their stock levels accurate on the platform.</p>
              <p>If a product is out of stock, the Seller must immediately update the quantity or deactivate the offer on the platform.</p>
              <p>Repeated order cancellations due to out-of-stock situations may result in penalties, lower listing visibility, or account suspension.</p>
            </div>
          </div>
        </div>

        {/* Section 10 & 11 & 12: Pricing, Fees & Payouts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">10</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Pricing</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers set their own selling prices for their products on Mrbulk, subject to applicable marketplace rules.</p>
              <p>All prices must be displayed in South African Rand (ZAR) and must include Value-Added Tax (VAT) where applicable.</p>
              <p>Sellers must not engage in deceptive pricing, artificial price inflation, or misleading discounts.</p>
              <p>If a pricing error occurs, the Seller must notify Mrbulk immediately. Mrbulk reserves the right to cancel orders arising from obvious pricing errors.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">11</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Marketplace Fees</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">Wholesale Transactions</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">1% Fee</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applied to the qualifying wholesale transaction value.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Retail Transactions</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">10% Fee</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applied to standard retail order amounts.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Marketplace fees are calculated on the product sale price (excluding shipping fees collected for couriers, unless otherwise specified).</p>
              <p>Mrbulk may modify its fee structure from time to time upon reasonable notice to Sellers.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">12</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Payouts</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Customer payments for marketplace orders are collected and processed by Mrbulk on behalf of the Seller.</p>
              <p>Seller payouts are calculated as the total product sale price collected from the Customer minus:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Applicable marketplace commission/fees.</li>
                <li>Any applicable transaction processing fees or courier deductions.</li>
                <li>Refunds, return deductions, or chargebacks associated with the Seller's products.</li>
                <li>Any outstanding balances or penalties owed by the Seller to Mrbulk.</li>
              </ul>
              <p>Payouts are processed according to the payout schedule established by Mrbulk and transferred to the verified banking details provided by the Seller.</p>
              <p>Mrbulk may hold or delay payouts if an order is under dispute, undergoing return assessment, or subject to fraud or compliance review.</p>
            </div>
          </div>
        </div>

        {/* Section 13-16: Order Fulfilment, Packaging & Shipping */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">13</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Order Acceptance and Fulfilment</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>When an order is placed for a Seller's product, the Seller must accept and prepare the order within the timeframe specified on the platform.</p>
              <p>Sellers must ensure the exact product, quantity, model, and condition ordered by the Customer is packaged and dispatched.</p>
              <p>Sellers must not cancel orders unless there is a genuine, unavoidable issue, in which case the Seller must notify Mrbulk immediately.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">14</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Packaging Standards</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must securely package all products to protect them from damage during courier transportation.</p>
              <p>Packaging must be clean, sturdy, and appropriate for the size, weight, and fragility of the product.</p>
              <p>Sellers are responsible for damage resulting from inadequate or improper packaging.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">15</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Delivery and Couriers</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Orders may be delivered using approved courier services arranged by Mrbulk or integrated with the platform.</p>
              <p>Sellers must make orders ready for collection by the courier at the agreed time and address.</p>
              <p>Sellers must provide accurate tracking information where applicable and must not mark an order as dispatched before it has actually been handed over to the courier.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">16</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Delivery Delays and Issues</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must dispatch orders within the agreed dispatch timeframe.</p>
              <p>If a delay occurs, the Seller must notify Mrbulk promptly so the Customer can be informed.</p>
              <p>Sellers must cooperate with Mrbulk and the courier to investigate lost, delayed, or damaged shipments.</p>
            </div>
          </div>
        </div>

        {/* Section 17: Customer Information & Privacy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">17</span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Customer Information and Privacy</h2>
          </div>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Sellers will receive Customer information (such as name, delivery address, and contact number) solely for the purpose of fulfilling the specific order.
            </p>
            <p className="font-bold text-slate-900 dark:text-white">
              Sellers MUST NOT:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use Customer personal information for marketing or unsolicited communications.</li>
              <li>Share, sell, or disclose Customer personal information to any third party.</li>
              <li>Contact Customers outside the Mrbulk platform except as strictly necessary for order delivery.</li>
              <li>Attempt to induce Customers to transact outside the Mrbulk marketplace.</li>
            </ul>
            <p>Sellers must comply with the Protection of Personal Information Act (POPIA) and Mrbulk's Privacy Policy.</p>
          </div>
        </div>

        {/* Section 18 & 19: Returns, Refunds & Mrbulk Intervention */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">18</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Returns and Refunds</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must comply with the Mrbulk Returns & Refunds Policy and applicable South African consumer protection legislation.</p>
              <p>If a product sold by a Seller is defective, incorrect, damaged upon delivery, or not as described, the Seller is responsible for the cost of return, replacement, or refund.</p>
              <p>Refunds approved for returns of Seller products will be deducted from the Seller's payout balance.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">19</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Mrbulk's Right to Intervene in Orders</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>To protect Customers and maintain marketplace trust, Mrbulk reserves the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Create, manage, or approve returns on behalf of a Seller if the Seller is unresponsive or unreasonable.</li>
                <li>Authorize refunds to Customers where products are defective, damaged, incorrect, or undelivered.</li>
                <li>Cancel an order if the Seller fails to dispatch within the agreed timeframe.</li>
                <li>Withhold payouts relating to disputed orders until the dispute is resolved.</li>
              </ul>
              <p>Mrbulk's decisions regarding customer disputes are final and binding on Sellers.</p>
            </div>
          </div>
        </div>

        {/* Section 20 & 21 & 22: Prohibited Products & IP */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg">20</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Prohibited Products</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must not list or sell any of the following on Mrbulk:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>Counterfeit, fake, replica, or pirated goods.</li>
                <li>Illegal drugs, narcotics, prescription medicines, or controlled substances.</li>
                <li>Weapons, ammunition, explosives, or hazardous materials.</li>
                <li>Stolen property or items obtained unlawfully.</li>
                <li>Products that infringe third-party intellectual property or copyright.</li>
                <li>Recalled, unsafe, or non-compliant consumer products.</li>
                <li>Pornographic, explicit, or offensive material.</li>
                <li>Any item prohibited by South African law or Mrbulk policy.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">21</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Counterfeit and Infringing Products</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Mrbulk has a zero-tolerance policy for counterfeit, pirated, or unauthorized replica goods.</p>
              <p>Sellers warrant that all products they list are genuine, original, and lawfully acquired.</p>
              <p>If a Seller is found listing counterfeit products, Mrbulk will immediately remove the listings, suspend or terminate the Seller account, withhold payouts, and report the matter to relevant authorities where required.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">22</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Product Recalls and Safety Issues</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>If a product sold by a Seller is subject to a recall, safety alert, or regulatory notice, the Seller must notify Mrbulk immediately.</p>
              <p>The Seller is responsible for all costs and remedies associated with product recalls, including customer refunds and return shipping.</p>
            </div>
          </div>
        </div>

        {/* Section 23-28: Operations, Performance, Rules & Compliance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">23</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Customer Reviews and Ratings</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Customers may leave reviews and ratings for products and Sellers.</p>
              <p>Sellers must not manipulate reviews, post fake reviews, solicit biased positive reviews, or offer incentives in exchange for positive reviews.</p>
              <p>Sellers must not harass, threaten, or attempt to intimidate Customers regarding reviews.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">24</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Communications With Customers</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>All communications with Customers must be professional, courteous, and related strictly to order fulfillment or customer support.</p>
              <p>Sellers must not include promotional material, third-party marketing, or flyers directing Customers to other websites or sales channels in their packages.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">25</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Circumvention of Mrbulk</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must not attempt to bypass or circumvent Mrbulk to avoid marketplace fees.</p>
              <p>Sellers must not solicit Customers to purchase products directly from the Seller or through an external website or platform after connecting via Mrbulk.</p>
              <p>Circumvention attempts may result in immediate account termination and forfeiture of pending payouts.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">26</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Performance and Quality Standards</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must maintain high operational performance, including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Low order cancellation rates.</li>
                <li>Timely order preparation and dispatch.</li>
                <li>Low return and defect rates.</li>
                <li>Prompt response to inquiries and return requests.</li>
              </ul>
              <p>Sellers who consistently fail to meet quality standards may have their listings reduced, offers suspended, or accounts closed.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">27</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Account Suspension and Termination</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Mrbulk may suspend or terminate a Seller account, with or without notice, if:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The Seller breaches this Seller Policy, the Terms & Conditions, or any applicable law.</li>
                <li>The Seller provides false, misleading, or fraudulent information.</li>
                <li>The Seller engages in deceptive, abusive, or counterfeit selling practices.</li>
                <li>The Seller fails to maintain acceptable performance standards.</li>
                <li>The Seller's actions create legal, financial, or reputational risks for Mrbulk.</li>
              </ul>
              <p>Upon termination, all active listings will be removed, and pending orders must still be fulfilled or refunded.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">28</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Removal of Product Listings</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Mrbulk reserves the right to remove or delist any product listing at any time, including listings that are:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prohibited, restricted, or counterfeit.</li>
                <li>Inaccurate, misleading, or poorly described.</li>
                <li>Out of stock or repeatedly unavailable.</li>
                <li>Subject to intellectual property complaints or safety alerts.</li>
                <li>Non-compliant with Mrbulk catalog standards.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 29-33: Legal, Taxes, IP, Indemnity & Adjustments */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">29</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Taxes and Legal Compliance</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers are solely responsible for determining, collecting, reporting, and remitting all applicable taxes, including Income Tax and Value-Added Tax (VAT), arising from their sales on Mrbulk.</p>
              <p>Sellers are responsible for complying with all business registration, licensing, and trade laws applicable to their operations.</p>
              <p>Mrbulk is not responsible for any Seller's tax obligations or legal non-compliance.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">30</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Intellectual Property Complaints</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>If Mrbulk receives a notice or complaint alleging that a Seller's product infringes third-party intellectual property rights, Mrbulk may remove the listing immediately.</p>
              <p>The Seller must cooperate fully with Mrbulk to investigate and resolve any intellectual property claims.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">31</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Indemnification</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>The Seller agrees to defend, indemnify, and hold harmless Mrbulk, Mr Cheap General Dealer ZA, their directors, employees, and agents from and against all claims, liabilities, damages, losses, costs, and legal fees arising from:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The Seller's products, listings, sales, or delivery failures.</li>
                <li>Product defects, safety issues, bodily injury, or property damage caused by the Seller's products.</li>
                <li>Any actual or alleged intellectual property infringement by the Seller's products or content.</li>
                <li>The Seller's breach of this Seller Policy, the Terms & Conditions, or applicable law.</li>
                <li>The Seller's tax non-compliance or failure to obtain required licenses.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">32</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Changes to Seller Information</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Sellers must immediately notify Mrbulk of any changes to their business name, registration details, contact details, physical address, or banking information.</p>
              <p>Mrbulk is not responsible for delayed payouts or lost communications resulting from outdated Seller information.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">33</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Seller Payout Adjustments</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Mrbulk may adjust, offset, or deduct from future payouts any amounts owed by the Seller to Mrbulk, including refunds, fee adjustments, penalties, or chargebacks.</p>
              <p>If a Seller's account has a negative balance upon termination, the Seller must repay the outstanding balance to Mrbulk within 14 calendar days.</p>
            </div>
          </div>
        </div>

        {/* Section 34-36: Policy Updates, Relationship & Governing Law */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">34</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Changes to This Seller Policy</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>Mrbulk may update or amend this Seller Policy at any time by posting the revised version on the platform with an updated "Last Updated" date.</p>
              <p>Continued participation on the marketplace after changes are published constitutes your acceptance of the updated Seller Policy.</p>
              <p>If you do not agree with an update, you must stop selling on Mrbulk and request account closure.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">35</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Relationship With Mrbulk</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>The relationship between Mrbulk and the Seller is that of independent contractors.</p>
              <p>Nothing in this Seller Policy creates any partnership, joint venture, employment, franchise, or agency relationship between Mrbulk and the Seller.</p>
              <p>Sellers have no authority to make any representation or enter into any contract on behalf of Mrbulk.</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">36</span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Governing Law and Jurisdiction</h2>
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>This Seller Policy is governed by and construed in accordance with the laws of the Republic of South Africa.</p>
              <p>Any disputes arising from or in connection with this Seller Policy or marketplace operations shall be subject to the exclusive jurisdiction of the South African courts.</p>
            </div>
          </div>
        </div>

        {/* Section 37: Official Contact Details (Highlighted Card) */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">37</span>
            <div className="p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-xs shrink-0 border border-transparent dark:border-slate-700">
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Contact Us
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Official entity & seller inquiries.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>If you have any questions, concerns, or requests regarding this Marketplace Seller Policy or selling on Mrbulk, please contact us:</p>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-black text-slate-900 dark:text-white text-base">Mrbulk</div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Operated by Mr Cheap General Dealer ZA</div>
              
              <div className="pt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Address:</strong><br />
                    150 Industrial Rd<br />
                    Crown North<br />
                    Johannesburg<br />
                    South Africa
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:support@mrbulk.co.za" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      support@mrbulk.co.za
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketplaceSellerPolicyPage;
