'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Search, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  Package, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Check, 
  X,
  User,
  ShoppingBag
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateSEOMetadata } from '@/utils/seoUtils';
import { useThemeContext, getThemeClasses as defaultGetThemeClasses } from '@/providers/theme-provider';
import { useToastContext } from '@/providers/toast-provider';

interface StaticPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate?: (page: string, params?: any) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
}

interface FaqItem {
  id: number;
  categoryKey: 'shipping' | 'returns' | 'payments' | 'orders' | 'products';
  categoryLabel: string;
  question: string;
  answer: React.ReactNode;
  searchText: string;
}

export const FaqPage: React.FC<StaticPageProps> = ({
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

  const onNavigate = (page: string, params?: any) => {
    if (propOnNavigate) {
      propOnNavigate(page, params);
      return;
    }
    if (page === 'home' || page === '') router.push('/');
    else if (page === 'shop') router.push('/shop');
    else router.push(page.startsWith('/') ? page : `/${page}`);
  };

  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedback, setFeedback] = useState<Record<number, 'yes' | 'no'>>({});

  useEffect(() => {
    updateSEOMetadata(
      `Frequently Asked Questions (FAQ) | ${logoText}`,
      `Find instant answers to shipping speeds, 30-day return policy, payment options, and warranty details at ${logoText}.`,
      '/faq'
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

  // All 14 FAQ Items matching the screenshot
  const allFaqs: FaqItem[] = [
    // SHIPPING & DELIVERY
    {
      id: 1,
      categoryKey: 'shipping',
      categoryLabel: 'SHIPPING & DELIVERY',
      question: 'How long does shipping take, and what shipping methods are available?',
      searchText: 'shipping speed delivery methods fedex ups ground expedited same day processing',
      answer: (
        <div className="space-y-2">
          <p>We offer standard and expedited shipping options for all orders:</p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>
              <strong className="text-slate-900 dark:text-white font-bold">Standard Shipping (3-5 Business Days):</strong> Delivered via FedEx or UPS Ground.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-bold">Expedited Shipping (1-2 Business Days):</strong> Available at checkout for urgent orders.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white font-bold">Same-Day Processing:</strong> Orders placed before 2:00 PM EST ship out on the same business day!
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 2,
      categoryKey: 'shipping',
      categoryLabel: 'SHIPPING & DELIVERY',
      question: 'How do I qualify for FREE shipping on my order?',
      searchText: 'free shipping threshold qualify continental destinations cart drawer progress',
      answer: (
        <div className="space-y-2">
          <p>
            All standard orders exceeding our free shipping threshold (currently set at{' '}
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              $150.00
            </strong>
            ) automatically receive free standard delivery across continental destinations.
          </p>
          <p>
            You can monitor your real-time free shipping progress right inside your shopping cart drawer at any time!
          </p>
        </div>
      )
    },
    {
      id: 3,
      categoryKey: 'shipping',
      categoryLabel: 'SHIPPING & DELIVERY',
      question: 'How can I track the live location of my package?',
      searchText: 'track live location package carrier tracking number automated tracking link order tracking tool',
      answer: (
        <div className="space-y-2">
          <p>
            As soon as your shipment departs our fulfillment warehouse, we generate a carrier tracking number and send an automated tracking link to your registered email address.
          </p>
          <p>
            You can also use our interactive{' '}
            <a
              href="/order-tracking"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('tracking');
              }}
              className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5 cursor-pointer no-underline"
            >
              Order Tracking Tool
            </a>{' '}
            at any time by entering your Order ID and email address.
          </p>
        </div>
      )
    },
    {
      id: 4,
      categoryKey: 'shipping',
      categoryLabel: 'SHIPPING & DELIVERY',
      question: 'Do you offer international worldwide shipping?',
      searchText: 'international worldwide shipping over 60 countries transit customs import duties taxes',
      answer: (
        <div className="space-y-2">
          <p>
            Yes! We ship internationally to over 60 countries. International transit times typically range from 5 to 10 business days depending on customs clearance procedures in your destination country.
          </p>
          <p>
            Applicable local customs taxes and import duties are calculated automatically during checkout.
          </p>
        </div>
      )
    },

    // RETURNS & REFUNDS
    {
      id: 5,
      categoryKey: 'returns',
      categoryLabel: 'RETURNS & REFUNDS',
      question: 'What is your return policy and return window?',
      searchText: 'return policy return window 30 day money back guarantee returns and refund policy self service return label',
      answer: (
        <div className="space-y-2">
          <p>
            We offer a hassle-free{' '}
            <strong className="text-slate-900 font-bold">30-Day Money Back Guarantee</strong>. If you are not completely satisfied with your purchase, you may return unused items in their original packaging within 30 days of delivery.
          </p>
          <p>
            Read our full{' '}
            <a
              href="/returns-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('returns-policy');
              }}
              className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5 cursor-pointer no-underline"
            >
              Returns & Refund Policy
            </a>{' '}
            for self-service return label generation and detailed conditions.
          </p>
        </div>
      )
    },
    {
      id: 6,
      categoryKey: 'returns',
      categoryLabel: 'RETURNS & REFUNDS',
      question: 'How long does it take to process my refund after returning an item?',
      searchText: 'refund process time inspection hub 2 to 3 business days credit card paypal apple pay bank',
      answer: (
        <div className="space-y-2">
          <p>
            Once our inspection team receives your return item at our fulfillment hub, refunds are processed within{' '}
            <strong className="text-slate-900 font-bold">2 to 3 business days</strong>.
          </p>
          <p>
            Funds will be credited back to your original payment method (Credit Card, PayPal, Apple Pay). Banks typically reflect the credit in 3 to 5 business days.
          </p>
        </div>
      )
    },
    {
      id: 7,
      categoryKey: 'returns',
      categoryLabel: 'RETURNS & REFUNDS',
      question: 'Are return shipping labels free, or do I need to pay for shipping?',
      searchText: 'return shipping labels free prepaid defective damaged incorrect items flat label fee',
      answer: (
        <div className="space-y-2">
          <p>
            We provide pre-paid return shipping labels for all domestic returns involving defective, damaged, or incorrect items!
          </p>
          <p>
            For standard preference returns or size exchanges, a flat return shipping label fee will be deducted from your total refund amount.
          </p>
        </div>
      )
    },

    // PAYMENTS & CHECKOUT
    {
      id: 8,
      categoryKey: 'payments',
      categoryLabel: 'PAYMENTS & CHECKOUT',
      question: 'What payment methods do you accept at checkout?',
      searchText: 'payment methods accept checkout visa mastercard american express discover paypal apple pay google pay',
      answer: (
        <div className="space-y-3">
          <p>We accept all major payment credit & debit cards and digital wallets:</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Visa', 'MasterCard', 'American Express', 'Discover', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <span 
                key={method}
                className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-800 shadow-2xs"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 9,
      categoryKey: 'payments',
      categoryLabel: 'PAYMENTS & CHECKOUT',
      question: 'Is my checkout transaction and personal information secure?',
      searchText: 'checkout transaction security personal information 256-bit ssl encryption pci-dss level 1',
      answer: (
        <div className="space-y-2">
          <p>
            Absolutely. Our checkout platform uses industry-standard{' '}
            <strong className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              256-bit SSL encryption
            </strong>{' '}
            and PCI-DSS Level 1 compliance. Your full card credentials are never stored on our servers.
          </p>
        </div>
      )
    },
    {
      id: 10,
      categoryKey: 'payments',
      categoryLabel: 'PAYMENTS & CHECKOUT',
      question: 'How do I redeem a promotional discount code or gift card?',
      searchText: 'redeem promotional discount code gift card promo code discount order summary subtotal',
      answer: (
        <div className="space-y-2">
          <p>
            During checkout, look for the{' '}
            <strong className="text-slate-900 font-bold">"Promo Code / Discount"</strong> input box located under your order summary list. Enter your valid code and click "Apply" to adjust your order subtotal before confirming payment.
          </p>
        </div>
      )
    },

    // ORDERS & ACCOUNT
    {
      id: 11,
      categoryKey: 'orders',
      categoryLabel: 'ORDERS & ACCOUNT',
      question: 'Can I modify or cancel an order after placing it?',
      searchText: 'modify cancel order placement 30 minutes processing support team account dashboard',
      answer: (
        <div className="space-y-2">
          <p>
            Because we strive for fast fulfillment, orders enter processing within 30 minutes of placement. If you need to change your address or cancel an item, please contact our support team immediately or request cancellation in your{' '}
            <button
              onClick={() => onNavigate('account')}
              className="text-blue-600 font-extrabold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              Account Dashboard
            </button>.
          </p>
        </div>
      )
    },
    {
      id: 12,
      categoryKey: 'orders',
      categoryLabel: 'ORDERS & ACCOUNT',
      question: 'Do I need to create an account to place an order?',
      searchText: 'create account place order guest checkout save shipping addresses wishlist history',
      answer: (
        <div className="space-y-2">
          <p>
            No, guest checkout is supported! However, creating a free account allows you to save shipping addresses, track active orders in real time, build custom wishlists, and view your purchase history.
          </p>
        </div>
      )
    },

    // PRODUCTS & WARRANTY
    {
      id: 13,
      categoryKey: 'products',
      categoryLabel: 'PRODUCTS & WARRANTY',
      question: 'Do your products come with a warranty guarantee?',
      searchText: 'warranty guarantee 1-year limited manufacturer warranty defects mechanical component failure',
      answer: (
        <div className="space-y-2">
          <p>
            Yes! All our products include a{' '}
            <strong className="text-slate-900 font-bold">1-Year Limited Manufacturer Warranty</strong> covering structural integrity, hardware defects, and mechanical component failures under normal use.
          </p>
        </div>
      )
    },
    {
      id: 14,
      categoryKey: 'products',
      categoryLabel: 'PRODUCTS & WARRANTY',
      question: 'What should I do if an item I want is out of stock?',
      searchText: 'out of stock notify me when back in stock email notification fresh stock warehouse',
      answer: (
        <div className="space-y-2">
          <p>
            On any out-of-stock product page, you can click{' '}
            <strong className="text-blue-600 font-extrabold">"Notify Me When Back in Stock"</strong> to receive an instant email notification as soon as fresh stock arrives at our warehouse.
          </p>
        </div>
      )
    }
  ];

  // Filter FAQs based on active category and search text
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.categoryKey === activeCategory;
      const qLower = faq.question.toLowerCase();
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || qLower.includes(searchLower) || faq.searchText.includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Track which FAQs are currently open (default all open)
  const [openIds, setOpenIds] = useState<Set<number>>(() => new Set(allFaqs.map(f => f.id)));

  const toggleFaq = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  const handleFeedback = (id: number, val: 'yes' | 'no') => {
    setFeedback(prev => ({ ...prev, [id]: val }));
    showToast?.('Thank you for your feedback!');
  };

  const categoryTabs = [
    { key: 'all', label: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'shipping', label: 'Shipping & Delivery', icon: <Truck className="w-4 h-4" /> },
    { key: 'returns', label: 'Returns & Refunds', icon: <RotateCcw className="w-4 h-4" /> },
    { key: 'payments', label: 'Payments & Checkout', icon: <CreditCard className="w-4 h-4" /> },
    { key: 'orders', label: 'Orders & Account', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'products', label: 'Products & Warranty', icon: <ShieldCheck className="w-4 h-4" /> }
  ];

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
          <span className="text-slate-900 dark:text-white font-extrabold">Help Center & FAQ</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>Customer Knowledge Base</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              How can we help you today?
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Find instant answers regarding shipping speeds, return guidelines, payment methods, order status, and warranties.
            </p>

            {/* Banner Integrated Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers (e.g. shipping time, return policy, payment, tracking)..."
                  className="w-full pl-11 pr-10 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 shadow-xs transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Category Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                  isActive
                    ? `${currentTheme?.bg || 'bg-blue-600'} text-white border-transparent shadow-xs`
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Title Bar & Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 pt-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[10px] sm:text-xs font-extrabold">
              {filteredFaqs.length} Results
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold">
            <button
              onClick={handleExpandAll}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs rounded-lg transition cursor-pointer shadow-2xs"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs rounded-lg transition cursor-pointer shadow-2xs"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQ Accordions List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching questions found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or switching categories to browse available help topics.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition cursor-pointer inline-flex items-center gap-1.5"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.has(faq.id);
              const userFb = feedback[faq.id];

              return (
                <div
                  key={faq.id}
                  className="bg-blue-50/40 dark:bg-slate-900 border border-blue-100/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-200"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 hover:bg-blue-50/70 dark:hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Help Icon Pill */}
                      <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                          {faq.categoryLabel}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Chevron Indicator */}
                    <div className="p-1 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0 mt-1">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Body Expandable Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-blue-100/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/90">
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                        {faq.answer}
                      </div>

                      {/* Helpful Feedback Row */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Was this answer helpful?</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(faq.id, 'yes')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold transition cursor-pointer ${
                              userFb === 'yes'
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Yes</span>
                          </button>

                          <button
                            onClick={() => handleFeedback(faq.id, 'no')}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold transition cursor-pointer ${
                              userFb === 'no'
                                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>No</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Quick Navigation Cards (Track Order, Return Policy, Privacy & Terms) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl w-fit border border-amber-100 dark:border-amber-800">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Track an Order</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Check live carrier dispatch updates and estimated delivery dates.
            </p>
            <a
              href="/order-tracking"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('tracking');
              }}
              className="text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 pt-1 cursor-pointer no-underline"
            >
              <span>Go to Order Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit border border-blue-100 dark:border-blue-800">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Return Policy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Review our 30-day return window guidelines and start a return.
            </p>
            <a
              href="/returns-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('returns-policy');
              }}
              className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 pt-1 cursor-pointer no-underline"
            >
              <span>View Returns Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm transition">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit border border-emerald-100 dark:border-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Privacy & Terms</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Learn how we protect your customer data and security details.
            </p>
            <a
              href="/privacy-policy"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('privacy-policy');
              }}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 pt-1 cursor-pointer no-underline"
            >
              <span>Read Privacy Policy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaqPage;
