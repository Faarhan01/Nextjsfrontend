'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  Send, 
  Store, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  Sparkles,
  Check,
  Building2
} from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
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

interface StoreLocation {
  id: string;
  city: string;
  country: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapImage: string;
  coordsLabel: string;
  mapUrl: string;
}

export const ContactPage: React.FC<StaticPageProps> = ({
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCity, setActiveCity] = useState<string>('johannesburg');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    updateSEOMetadata(
      `Contact Us & Headquarters | ${logoText}`,
      `Get in touch with ${logoText} (mrbulk.co.za) support team or visit our flagship warehouse and headquarters at 150 Industrial Rd, Crown North, Johannesburg, South Africa.`,
      '/contact'
    );
  }, [logoText]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    orderId: '',
    category: 'General Support Inquiry',
    message: ''
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCopy = (text: string, label: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (err) {}
    setCopiedText(label);
    showToast?.(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast?.('Inquiry submitted successfully! Our Mrbulk team will respond within 2 hours.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      orderId: '',
      category: 'General Support Inquiry',
      message: ''
    });
  };

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

  const contactHighlights = [
    {
      icon: <Phone className={`w-5 h-5 ${currentTheme?.text || 'text-blue-600'}`} />,
      label: 'CALL US (SA)',
      value: '+27 (0) 11 837 0000',
      subtext: 'Mon - Fri: 8:00 - 17:00 SAST',
      badge: 'Support Line',
      action: () => handleCopy('+27 (0) 11 837 0000', 'phone number')
    },
    {
      icon: <Mail className={`w-5 h-5 ${currentTheme?.text || 'text-blue-600'}`} />,
      label: 'EMAIL SUPPORT',
      value: 'support@mrbulk.co.za',
      subtext: 'Fast SLA response time',
      badge: 'Help Desk',
      action: () => handleCopy('support@mrbulk.co.za', 'email address')
    },
    {
      icon: <Building2 className={`w-5 h-5 ${currentTheme?.text || 'text-blue-600'}`} />,
      label: 'HEAD OFFICE ADDRESS',
      value: '150 Industrial Rd, Crown North',
      subtext: 'Johannesburg, South Africa',
      badge: 'Headquarters',
      action: () => handleCopy('150 Industrial Rd, Crown North, Johannesburg, South Africa', 'head office address')
    },
    {
      icon: <HelpCircle className={`w-5 h-5 ${currentTheme?.text || 'text-blue-600'}`} />,
      label: 'SELLER & BULK HELP',
      value: 'Seller & Wholesale Hub',
      subtext: 'Join as a marketplace vendor →',
      badge: 'Marketplace',
      action: () => onNavigate('seller-policy')
    }
  ];

  const stores: StoreLocation[] = [
    {
      id: 'johannesburg',
      city: 'Johannesburg (HQ)',
      country: 'South Africa',
      name: 'Mrbulk Head Office & Central Hub',
      address: '150 Industrial Rd, Crown North, Johannesburg, South Africa',
      phone: '+27 (0) 11 837 0000',
      email: 'support@mrbulk.co.za',
      hours: 'Mon - Fri: 8:00 AM - 5:00 PM | Sat: 8:30 AM - 1:00 PM',
      mapImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&fm=webp',
      coordsLabel: 'Johannesburg, South Africa',
      mapUrl: 'https://maps.google.com/?q=150+Industrial+Rd+Crown+North+Johannesburg'
    },
    {
      id: 'capetown',
      city: 'Cape Town',
      country: 'South Africa',
      name: 'Mrbulk Western Cape Logistics Hub',
      address: 'Montague Gardens, Cape Town, 7441, South Africa',
      phone: '+27 (0) 21 555 0182',
      email: 'capetown@mrbulk.co.za',
      hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      mapImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&fm=webp',
      coordsLabel: 'Cape Town, South Africa',
      mapUrl: 'https://maps.google.com/?q=Montague+Gardens+Cape+Town'
    },
    {
      id: 'durban',
      city: 'Durban',
      country: 'South Africa',
      name: 'Mrbulk KZN Distribution Point',
      address: 'Riverhorse Valley, Durban, 4017, South Africa',
      phone: '+27 (0) 31 555 0199',
      email: 'durban@mrbulk.co.za',
      hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      mapImage: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1200&fm=webp',
      coordsLabel: 'Durban, South Africa',
      mapUrl: 'https://maps.google.com/?q=Riverhorse+Valley+Durban'
    }
  ];

  const currentStore = stores.find(s => s.id === activeCity) || stores[0];

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
            <ArrowLeft className="w-3 h-3" /> Home
          </a>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-extrabold">Contact Us</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>24/7 Dedicated Support Concierge</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              We'd Love to Hear From You
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Have a question about an order, product availability, returns, or store locations? Send us a message or visit one of our flagship boutiques.
            </p>

            {/* Action Buttons: Contact Form & Physical Store */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 select-none">
              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById('contact-form');
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 ${currentTheme?.bg || 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-xs sm:text-xs rounded-xl shadow-md transition cursor-pointer`}
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Contact Form</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const storeEl = document.getElementById('physical-store');
                  if (storeEl) {
                    storeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer backdrop-blur-md"
              >
                <Store className={`w-3 h-3 sm:w-4 sm:h-4 ${currentTheme?.text || 'text-blue-600 dark:text-blue-400'}`} />
                <span>Physical Store</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Contact Highlights Horizontal Carousel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Direct Communication
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Concierge Channels</h2>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Track */}
          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-2 px-0.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {contactHighlights.map((item, idx) => (
              <div
                key={idx}
                onClick={item.action ? item.action : undefined}
                className={`min-w-[260px] sm:min-w-[280px] max-w-[280px] snap-start bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 transition shadow-2xs ${item.action ? 'cursor-pointer' : ''}`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl border border-slate-100 dark:border-slate-700 shadow-2xs">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      {item.badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {item.label}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base break-words">
                      {item.value}
                    </h3>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Customer Support Form */}
        <div id="contact-form" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-6 sm:scroll-mt-8">
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <Send className="w-3 h-3" />
              <span>Send a Message</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Support Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Fill out the details below and our concierge team will respond promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="e.g. ORD-9824"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Subject / Topic Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer"
              >
                <option value="General Support Inquiry" className="dark:bg-slate-800">General Support Inquiry</option>
                <option value="Order Status & Tracking" className="dark:bg-slate-800">Order Status & Tracking</option>
                <option value="Returns & Exchanges" className="dark:bg-slate-800">Returns & Exchanges</option>
                <option value="Product Availability & Sizing" className="dark:bg-slate-800">Product Availability & Sizing</option>
                <option value="VIP & Wholesale Inquiry" className="dark:bg-slate-800">VIP & Wholesale Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Your Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide details about your query or order..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 ${currentTheme?.bg || 'bg-blue-600 hover:bg-blue-700'} text-white font-extrabold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer`}
            >
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        </div>

        {/* Section 2: Our Flagship Stores */}
        <div id="physical-store" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-6 sm:scroll-mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <Store className="w-3 h-3" />
                <span>OUR FLAGSHIP STORES</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Visit Our Boutiques
              </h2>
            </div>

            {/* City Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setActiveCity(store.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                    activeCity === store.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs border border-slate-200 dark:border-slate-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {store.city}
                </button>
              ))}
            </div>
          </div>

          {/* Active Store Details Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{currentStore.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{currentStore.address}</span>
                </p>
              </div>

              <button
                onClick={() => handleCopy(currentStore.address, 'address')}
                className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
                title="Copy Address"
              >
                {copiedText === 'address' ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/80 dark:border-slate-700">
              <div className="space-y-1">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Phone:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentStore.phone}</span>
              </div>

              <div className="space-y-1">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Email:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentStore.email}</span>
              </div>

              <div className="sm:col-span-2 space-y-1 pt-1">
                <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Hours:
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentStore.hours}</span>
              </div>
            </div>

            <a
              href={currentStore.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 active:bg-black text-white font-extrabold text-xs rounded-xl transition shadow-xs cursor-pointer"
            >
              <Send className="w-3 h-3 text-blue-400" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>

          {/* Map Preview Graphic */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-64 bg-slate-200 dark:bg-slate-800 group">
            <SafeImage
              src={currentStore.mapImage}
              alt={`${currentStore.city} Location Map`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />

            {/* Map Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2 text-xs font-black">
              <MapPin className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{currentStore.coordsLabel}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
