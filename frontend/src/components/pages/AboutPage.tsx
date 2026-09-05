'use client';

import React, { useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Award, 
  Users, 
  Globe2, 
  ShoppingBag, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Zap,
  Store
} from 'lucide-react';
import { SafeImage } from '../ui/SafeImage';
import { updateSEOMetadata } from '../../utils/seoUtils';

interface StaticPageProps {
  themeColor?: string;
  getThemeClasses?: (color: string) => any;
  onNavigate: (page: string, params?: any) => void;
  showToast?: (msg: string) => void;
  logoText?: string;
}

export const AboutPage: React.FC<StaticPageProps> = ({
  themeColor = 'blue',
  getThemeClasses,
  onNavigate,
  logoText = 'mrbulk'
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const currentTheme = getThemeClasses ? getThemeClasses(themeColor) : null;

  useEffect(() => {
    updateSEOMetadata(
      `About Us | ${logoText}`,
      `Discover ${logoText} - crafting premium shopping experiences with handpicked authentic goods, express courier delivery, and customer-first support.`,
      '/about'
    );
  }, [logoText]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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

  const highlights = [
    {
      icon: <Award className={`w-6 h-6 ${currentTheme?.text || 'text-blue-600'}`} />,
      title: 'Curated Quality',
      description: 'Every product in our catalog undergoes rigorous quality testing and authenticity verification before being listed.',
      badge: '100% Authentic'
    },
    {
      icon: <Users className={`w-6 h-6 ${currentTheme?.text || 'text-blue-600'}`} />,
      title: 'Customer First',
      description: 'Your satisfaction is our ultimate benchmark. Enjoy dedicated concierge support around the clock.',
      badge: '24/7 Concierge'
    },
    {
      icon: <Globe2 className={`w-6 h-6 ${currentTheme?.text || 'text-blue-600'}`} />,
      title: 'Express Logistics',
      description: 'Fast, traceable door-to-door delivery with real-time dispatch tracking and SMS updates.',
      badge: 'Fast Courier'
    },
    {
      icon: <ShieldCheck className={`w-6 h-6 ${currentTheme?.text || 'text-blue-600'}`} />,
      title: 'Secure Checkout',
      description: '256-bit SSL encrypted transactions supporting bank EFT, instant card payments, and digital wallets.',
      badge: 'Bank Grade'
    },
    {
      icon: <Zap className={`w-6 h-6 ${currentTheme?.text || 'text-blue-600'}`} />,
      title: 'Seamless Returns',
      description: 'Hassle-free 30-day return policy backed by automated return label generation.',
      badge: '30-Day Policy'
    }
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
          <span className="text-slate-900 dark:text-white font-extrabold">About Us</span>
        </div>

        <div className={`relative w-full py-8 sm:py-12 px-4 sm:px-8 ${lightBannerBg} text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-sm border overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-80 h-80 ${ambientGlowClasses} rounded-full blur-3xl pointer-events-none`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${ambientGlowClasses} rounded-full blur-2xl pointer-events-none`} />

          <div className="max-w-3xl mx-auto relative z-10 text-center space-y-4">
            
            {/* Badge Pill */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-white/85 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-xs ${currentTheme ? currentTheme.text : 'text-blue-700 dark:text-blue-400'} backdrop-blur-xs select-text`}>
              <span>Effortless E-Commerce Standard</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white select-text">
              About {logoText}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed select-text">
              Crafting premium shopping experiences with handpicked authentic goods, nationwide express courier delivery, and customer-first support.
            </p>

            {/* Action Buttons: Shop & FAQ */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 select-none">
              <a
                href="/shop"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('products');
                }}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 ${currentTheme?.bg || 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-xs sm:text-xs rounded-xl shadow-md transition cursor-pointer no-underline`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Shop Catalog</span>
              </a>

              <a
                href="/faq"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('faq');
                }}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer backdrop-blur-md no-underline"
              >
                <HelpCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${currentTheme?.text || 'text-blue-600 dark:text-blue-400'}`} />
                <span>FAQ &amp; Support</span>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Horizontal Carousel Section for Highlights ("Curated Quality", etc.) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" /> Why Choose Us
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Core Highlights</h2>
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
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[260px] sm:min-w-[280px] max-w-[280px] snap-start bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3 flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-blue-900/20 transition shadow-2xs"
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
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: Our Story - Driven by Quality, Defined by Excellence */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Our Story</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Driven by Quality, Defined by Excellence
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              Founded with a simple yet ambitious vision: to eliminate the guesswork from online shopping by curating only authentic, high-grade products across luxury apparel, cutting-edge electronics, and home essentials.
            </p>
            <p>
              Whether you are ordering a flagship smartphone, wireless noise-canceling headphones, or designer accessories, our team works tirelessly to ensure your unboxing experience exceeds expectation.
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Fast Courier Dispatch</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Encrypted Payments</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">30-Day Easy Returns</span>
            </div>
          </div>

          {/* Storefront Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 max-h-80 shadow-xs relative">
            <SafeImage
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&fm=webp"
              alt="Open Shop Storefront"
              className="w-full h-full object-cover max-h-80 hover:scale-102 transition duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
              <Store className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>SHOP IS OPEN 24/7</span>
            </div>
          </div>
        </div>

        {/* Section 2: Our Core Principles */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Our Core Principles</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              The values that guide every product we select and every parcel we ship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl w-fit border border-amber-100 dark:border-amber-800">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Uncompromised Quality</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Every product in our catalog undergoes rigorous quality assessment and authenticity verification before listed.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-2.5 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl w-fit border border-rose-100 dark:border-rose-800">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Customer-Centric Care</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Your satisfaction is our benchmark. Enjoy 24/7 concierge support, instant updates, and hassle-free resolutions.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit border border-blue-100 dark:border-blue-800">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Nationwide & Global Courier</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Reliable door-to-door logistics with real-time tracking SMS alerts and express shipping options.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit border border-emerald-100 dark:border-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Transparent & Ethical</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No hidden fees, transparent EFT/Card checkout, and sustainable eco-conscious packaging standards.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Journey & Growth */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Journey & Growth</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Our Growth Story</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white font-black text-xs rounded-lg">2021</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Store Founded</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Started as a curated boutique store focusing on premium lifestyle goods and luxury fashion essentials.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white font-black text-xs rounded-lg">2023</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Electronics Expansion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Expanded catalog to include cutting-edge audio gear, smart wearables, high-tech gadgets, and home tech.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white font-black text-xs rounded-lg">2025</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Express Logistics Network</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Partnered with premier courier services to offer guaranteed door-to-door 24-48hr shipping nationwide.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="inline-block px-3 py-1 bg-slate-900 dark:bg-slate-700 text-white font-black text-xs rounded-lg">2026</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Commerce Concierge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Integrated intelligent AI shopping assistant and real-time order tracking tools for seamless customer support.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Lighter Background Call-To-Action Card ("Ready to experience effortless luxury shopping?") */}
        <div className="bg-gradient-to-br from-blue-100/90 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 rounded-3xl border border-blue-200/80 dark:border-slate-800 p-8 sm:p-12 text-center space-y-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Ready to experience effortless luxury shopping?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Browse our full catalog today or reach out to our customer support concierge for personalized product recommendations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <a
              href="/shop"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('products');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer no-underline"
            >
              <span>Browse All Products</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/categories"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('categories');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/90 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold text-xs rounded-xl border border-slate-300/80 dark:border-slate-700 transition shadow-xs cursor-pointer no-underline flex items-center justify-center"
            >
              <span>View Categories</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
