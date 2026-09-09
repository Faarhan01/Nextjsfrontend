'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { formatCurrency } from '@/utils/pricing';
import { 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Eye, 
  Heart, 
  ShoppingBag, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Tag, 
  Crown,
  Volume2, 
  Wifi, 
  BatteryCharging
} from 'lucide-react';
import { SafeImage } from '@modules/common/components/safe-image';
import { StockBadge } from '@modules/common/components/stock-badge';
import { MockProduct, MockCategory } from '@/types';
import { getProductSaleDetails } from '@/utils/productUtils';

interface TechElectronicsShowcaseProps {
  products: MockProduct[];
  categories: MockCategory[];
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  getThemeClasses: (color: string) => any;
  wishlist: string[];
  onToggleWishlist: (productId: string, productName: string) => void;
  onAddToCart: (product: any) => void;
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: MockProduct) => void;
  onViewCategory: (categoryName: string) => void;
}

export interface TechProductItem extends MockProduct {
  tagline?: string;
  specs?: string[];
  subTag?: 'audio' | 'gadgets' | 'workspace' | 'displays';
  discountTag?: string;
  ratingScore?: string;
  reviewCount?: number;
}

export function TechElectronicsShowcase({
  products,
  categories,
  themeColor,
  getThemeClasses,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onQuickView,
  onViewCategory
}: TechElectronicsShowcaseProps) {
  const currentTheme = getThemeClasses(themeColor);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Added To Cart feedback state
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Countdown timer for the mini banner
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Curated list of Electronics products with tech metadata
  const techProducts: TechProductItem[] = useMemo(() => {
    // Gather products with Electronics category or matching IDs
    const matchedFromProps = products.filter(p => {
      if (p.categoryId === 1 || p.id.includes('prod-1') || p.id.includes('prod-3') || p.id.includes('elec')) {
        return true;
      }
      return false;
    });

    const defaultElectronicsList: TechProductItem[] = [
      {
        id: 'tech-elec-1',
        name: 'AcousticPro Wireless ANC Headphones',
        price: 'R2,499.00',
        originalPrice: 'R3,199.00',
        isSale: true,
        saleBadgeText: 'SAVE R700',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Studio-grade hybrid active noise cancellation with 40-hour battery life.',
        specs: ['Active Noise Cancelling', '40h Battery', 'Hi-Res Audio'],
        subTag: 'audio',
        ratingScore: '4.9',
        reviewCount: 142
      },
      {
        id: 'tech-elec-2',
        name: 'Ultra-Thin Mechanical Wireless Keyboard',
        price: 'R1,899.00',
        originalPrice: 'R2,299.00',
        isSale: true,
        saleBadgeText: 'BESTSELLER',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Machined aluminum chassis with tactile low-profile switches and RGB backlight.',
        specs: ['Bluetooth 5.3', 'Hot-Swappable', 'RGB Backlit'],
        subTag: 'workspace',
        ratingScore: '4.8',
        reviewCount: 98
      },
      {
        id: 'tech-elec-3',
        name: 'Magnetic 3-in-1 Fast Wireless Charging Station',
        price: 'R899.00',
        originalPrice: 'R1,199.00',
        isSale: true,
        saleBadgeText: '25% OFF',
        imageUrl: 'https://images.unsplash.com/photo-1622445268121-ac11f17a2834?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Simultaneous fast charging for smartphone, smartwatch, and wireless earbuds.',
        specs: ['15W MagFast', 'Overheat Shield', 'Foldable Stand'],
        subTag: 'gadgets',
        ratingScore: '4.7',
        reviewCount: 215
      },
      {
        id: 'tech-elec-4',
        name: 'Smart OLED Ambient Desk Light Bar',
        price: 'R1,399.00',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Auto-dimming screen bar with anti-glare optical engine and wireless dial control.',
        specs: ['Zero Glare', 'Auto Dimming', 'Wireless Dial'],
        subTag: 'workspace',
        ratingScore: '4.9',
        reviewCount: 76
      },
      {
        id: 'tech-elec-5',
        name: '4K Ultra-Mini Portable Laser Projector',
        price: 'R4,999.00',
        originalPrice: 'R5,999.00',
        isSale: true,
        saleBadgeText: 'HOT DEAL',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Cinema-grade laser projection engine with built-in Dolby Atmos speakers.',
        specs: ['4K HDR Laser', 'Dolby Audio', 'Auto Focus'],
        subTag: 'displays',
        ratingScore: '4.9',
        reviewCount: 312
      },
      {
        id: 'tech-elec-6',
        name: 'Titanium GPS Fitness Smartwatch',
        price: 'R3,499.00',
        originalPrice: 'R4,199.00',
        isSale: true,
        saleBadgeText: 'TRENDING',
        imageUrl: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Aerospace-grade titanium casing with dual-frequency GPS and ECG heart monitor.',
        specs: ['Dual GPS', '100m Water', 'ECG Monitor'],
        subTag: 'gadgets',
        ratingScore: '4.8',
        reviewCount: 189
      },
      {
        id: 'tech-elec-7',
        name: 'High-Fidelity TWS Earbuds with Smart Case',
        price: 'R1,999.00',
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Touchscreen smart charging case with spatial audio motion tracking.',
        specs: ['Smart Case', 'Spatial 3D', 'IPX7 Waterproof'],
        subTag: 'audio',
        ratingScore: '4.8',
        reviewCount: 164
      },
      {
        id: 'tech-elec-8',
        name: 'Ergonomic Vertical Wireless Laser Mouse',
        price: 'R999.00',
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
        url: '',
        description: 'Scientifically designed 57-degree vertical grip to reduce wrist muscle strain.',
        specs: ['57° Ergo Angle', 'Quiet Click', '4000 DPI'],
        subTag: 'workspace',
        ratingScore: '4.7',
        reviewCount: 88
      }
    ];

    // Combine matched products with curated defaults ensuring no duplicate IDs
    const merged: TechProductItem[] = [...defaultElectronicsList];
    
    matchedFromProps.forEach(p => {
      if (!merged.some(m => m.id === p.id)) {
        merged.push({
          ...p,
          specs: p.description ? [p.description.substring(0, 20)] : ['High Performance', 'Warranty Included'],
          subTag: 'gadgets',
          ratingScore: '4.8',
          reviewCount: 45
        });
      }
    });

    return merged;
  }, [products]);

  // Scroll controls for products carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleAddToCartWithFeedback = (prod: TechProductItem) => {
    onAddToCart(prod);
    setAddedItemIds(prev => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [prod.id]: false }));
    }, 1800);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 w-full">
      
      {/* ================= 1. DEDICATED SMALL TECH BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/70 to-slate-50 dark:bg-slate-800/95 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-850 border border-blue-200/80 dark:border-slate-700 shadow-sm dark:shadow-xl mb-8 p-6 sm:p-8 lg:p-10 text-slate-900 dark:text-white">
        
        {/* Animated Background Mesh & Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 dark:bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15 dark:opacity-10" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Banner Left Info Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Top Badges & Countdown */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-gradient-to-r dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-300 dark:border-blue-400/40 text-blue-800 dark:text-cyan-300 text-xs font-black uppercase tracking-wider shadow-2xs">
                <Cpu className="w-3 h-3 text-blue-600 dark:text-cyan-400 animate-spin-slow" />
                Next-Gen Electronics Hub
              </span>

              {/* Flash Deal Timer */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-750/90 dark:bg-slate-700/90 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-2xs">
                <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-extrabold">Flash Sale:</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-300">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Banner Main Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                High-Performance Tech &amp; Audio Lab
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-2 max-w-2xl leading-relaxed">
                Elevate your daily workflow and audio immersion with precision-engineered wireless gear, ergonomic workspace tools, and smart OLED peripherals.
              </p>
            </div>

            {/* Spec Highlights Pill Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { icon: Volume2, text: 'Active ANC Audio' },
                { icon: Wifi, text: 'Ultra-Low Latency' },
                { icon: BatteryCharging, text: 'Fast Charge Tech' },
                { icon: ShieldCheck, text: '2-Year Hardware Warranty' }
              ].map((spec, i) => (
                <div 
                  key={i} 
                  className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200/90 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <spec.icon className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                  <span>{spec.text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Banner Right Action & Callout Column */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-blue-200/80 dark:border-slate-700/80 pt-4 lg:pt-0 lg:pl-8">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-cyan-400 block">
                Exclusive Member Discount
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Up to <span className="text-amber-600 dark:text-amber-400">35% OFF</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Free express shipping on all tech orders over R500</p>
            </div>

            <button
              onClick={() => onViewCategory('Electronics')}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${currentTheme.bg} hover:brightness-110`}
            >
              <span>Explore All Electronics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ================= 2. CAROUSEL CARD WRAPPER ================= */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8 shadow-xs relative">
        
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/30 dark:bg-amber-900/15 rounded-full blur-3xl -ml-16 -mb-16" />
        </div>

        {/* Section Header Line - Copy from Products by Category */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200/70 dark:border-slate-700">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Featured Electronics &amp; Tech Essentials
          </h2>

          {/* Carousel Controls Header Group */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 w-full sm:w-auto">
            {/* Left / Right Scroll Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={() => scrollCarousel('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                aria-label="Scroll left"
                title="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition active:scale-95 shadow-2xs cursor-pointer shrink-0"
                aria-label="Scroll right"
                title="Scroll right"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Explore All Button */}
            <button
              onClick={() => onViewCategory('Electronics')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 dark:bg-slate-800 hover:${currentTheme.bg} text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all duration-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer group hover:scale-[1.02] active:scale-95 shrink-0 whitespace-nowrap`}
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative z-10 mt-3 group/carousel">
          {/* Side Floating Left Arrow */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="hidden sm:flex absolute -left-3 lg:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-md cursor-pointer shrink-0"
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Side Floating Right Arrow */}
          <button 
            onClick={() => scrollCarousel('right')}
            className="hidden sm:flex absolute -right-3 lg:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 hover:text-white transition-all duration-200 active:scale-95 shadow-md cursor-pointer shrink-0"
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Scrollable Track */}
          <div 
            ref={scrollContainerRef}
            className="w-full overflow-x-auto scrollbar-none py-1.5 sm:py-2 px-0.5 sm:px-1 scroll-smooth snap-x snap-mandatory touch-auto"
          >
            <div className="flex gap-2.5 sm:gap-4 min-w-full px-0.5 pr-4 sm:pr-6">
              {techProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                const isAdded = addedItemIds[prod.id];
                const ratingScore = prod.ratingScore || '4.9';
                const sale = getProductSaleDetails(prod);

                return (
                  <div 
                    key={prod.id}
                    className="snap-start shrink-0 w-[160px] sm:w-[220px] lg:w-[240px] bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                  >
                    {/* Image Block */}
                    <div 
                      onClick={() => onSelectProduct(prod.id)}
                      className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-700/50 cursor-pointer"
                    >
                      <SafeImage 
                        src={prod.imageUrl} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        alt={prod.name} 
                        placeholderType="product"
                        fallbackTitle={prod.name}
                      />

                      {/* Badges Overlay */}
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
                        {sale.isSale && (
                          <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-2xs flex items-center gap-1 border border-rose-500/50">
                            <Tag className="w-2 h-2 text-white" />
                            <span>{sale.badgeText}</span>
                          </div>
                        )}
                        {(prod.isFeatured || (!sale.isSale && prod.isFeatured !== false)) && (
                          <div className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-[9px] sm:text-[10px] tracking-wider uppercase border border-slate-700/50 shadow-2xs flex items-center gap-1">
                            <Crown className="w-2 h-2 text-amber-400" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Action Stack (Wishlist & Quick View) */}
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(prod.id, prod.name);
                          }}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md shadow-2xs transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
                            isWishlisted
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-200 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <Heart className={`w-3 h-3 ${isWishlisted ? 'fill-white' : ''}`} />
                        </button>

                        {onQuickView && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickView(prod);
                            }}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-600 dark:text-slate-200 hover:${currentTheme.text} hover:${currentTheme.lightBg} shadow-2xs transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 cursor-pointer`}
                            title="Quick View"
                          >
                            <Eye className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-800">
                      <div className="cursor-pointer" onClick={() => onSelectProduct(prod.id)}>
                        <h3 className={`text-xs sm:text-xs font-extrabold text-slate-900 dark:text-white group-hover:${currentTheme.text} transition-colors duration-200 line-clamp-2 leading-tight sm:leading-snug w-full`}>
                          {prod.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                          <StockBadge product={prod} />
                          <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 bg-amber-50/80 dark:bg-amber-950/50 px-1 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50 text-[9px] sm:text-[10px] font-extrabold w-max">
                            <Star className="w-2 h-2 text-amber-500 fill-amber-400 shrink-0" />
                            <span>{ratingScore}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/80">
                        <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 block font-bold uppercase tracking-wider">Price</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{formatCurrency(prod.price)}</span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-medium">{formatCurrency(prod.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}
