import { MockProduct, SlideConfig } from '@/types';
import { DEFAULT_SLIDES, MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/data/presets';

interface GenerateTemplateOptions {
  storeName?: string;
  themeColor?: string;
  products?: MockProduct[];
  categories?: any[];
  slides?: SlideConfig[];
}

export function generateHtmlTemplate({
  storeName = 'Mrbulk',
  themeColor = 'blue',
  products = [],
  categories = [],
  slides = []
}: GenerateTemplateOptions): string {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const activeCategories = categories && categories.length > 0 ? categories : MOCK_CATEGORIES;
  const sourceProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;

  // Theme color definitions matching the site's palette
  const themeHexMap: Record<string, { primary: string; hover: string; light: string; border: string; ring: string }> = {
    blue: { primary: '#2563eb', hover: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe', ring: 'rgba(37, 99, 235, 0.25)' },
    emerald: { primary: '#059669', hover: '#047857', light: '#ecfdf5', border: '#a7f3d0', ring: 'rgba(5, 150, 105, 0.25)' },
    indigo: { primary: '#4f46e5', hover: '#4338ca', light: '#eef2ff', border: '#c7d2fe', ring: 'rgba(79, 70, 229, 0.25)' },
    rose: { primary: '#e11d48', hover: '#be123c', light: '#fff1f2', border: '#fecdd3', ring: 'rgba(225, 29, 72, 0.25)' },
    amber: { primary: '#d97706', hover: '#b45309', light: '#fffbeb', border: '#fde68a', ring: 'rgba(217, 119, 6, 0.25)' },
    slate: { primary: '#0f172a', hover: '#1e293b', light: '#f8fafc', border: '#cbd5e1', ring: 'rgba(15, 23, 42, 0.25)' },
  };

  const currentColors = themeHexMap[themeColor] || themeHexMap.blue;

  // Category mapping helper
  const catMap = new Map((activeCategories || []).map((c: any) => [c.id, c.name]));

  // Pre-serialize products with rich attributes for the embedded interactive catalog
  const serializedProducts = JSON.stringify(
    sourceProducts.map((p, index) => {
      const resolvedCategory = p.category || catMap.get((p as any).categoryId) || 'General';
      const parsedPriceNum = typeof p.price === 'number' 
        ? p.price 
        : parseFloat(String(p.price || '499').replace(/[^0-9.]/g, '')) || 499;
      
      const parsedOrigNum = p.originalPrice 
        ? (typeof p.originalPrice === 'number' ? p.originalPrice : parseFloat(String(p.originalPrice).replace(/[^0-9.]/g, '')))
        : undefined;

      const formattedPrice = `R${parsedPriceNum.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const formattedOriginalPrice = parsedOrigNum 
        ? `R${parsedOrigNum.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : undefined;

      const sellerName = (p as any).primarySellerName || ((p as any).offers && (p as any).offers[0]?.sellerName) || 'Mrbulk Official ZA';
      const rating = (p as any).rating || ((p as any).offers && (p as any).offers[0]?.rating) || (4.6 + ((index % 5) * 0.08));
      const reviewsCount = (p as any).reviewsCount || ((p as any).offers && (p as any).offers[0]?.reviewsCount) || (24 + (index * 7));

      return {
        id: p.id || `prod-${index + 1}`,
        name: p.name || 'Premium Marketplace Product',
        price: formattedPrice,
        priceNum: parsedPriceNum,
        originalPrice: formattedOriginalPrice,
        originalPriceNum: parsedOrigNum,
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
        category: resolvedCategory,
        isSale: Boolean(p.isSale || parsedOrigNum),
        saleBadgeText: (p as any).saleBadgeText || (parsedOrigNum ? `${Math.round((1 - parsedPriceNum / parsedOrigNum) * 100)}% OFF` : 'SALE'),
        isFeatured: Boolean(p.isFeatured || index < 6),
        sellerName,
        rating: Math.min(5, Math.max(3.8, parseFloat(rating.toFixed(1)))),
        reviewsCount: reviewsCount,
        stockCount: (p as any).stockCount || (12 + ((index * 3) % 40)),
        description: p.description || 'Verified authentic quality merchandise sourced directly from certified South African distributors. Covered with full 12-month manufacturer warranty and rapid nationwide dispatch.'
      };
    })
  );

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(storeName)} — Online E-Commerce & Marketplace South Africa</title>
  <meta name="description" content="Shop retail and wholesale products or discover verified independent marketplace sellers on ${escapeHtml(storeName)}. Operated by Mr Cheap General Dealer ZA, South Africa." />

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
          },
          colors: {
            brand: {
              DEFAULT: '${currentColors.primary}',
              hover: '${currentColors.hover}',
              light: '${currentColors.light}',
              border: '${currentColors.border}',
            }
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #334155;
    }
    .glass-nav {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    ::selection {
      background-color: ${currentColors.primary};
      color: #ffffff;
    }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col transition-colors duration-200">

  <!-- Top Announcement Bar -->
  <div class="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand text-white rounded">Nationwide SA</span>
        <span class="font-medium">Free Delivery on all orders over R1,000 &bull; Operated by Mr Cheap General Dealer ZA</span>
      </div>
      <div class="flex items-center gap-4 text-slate-400 text-[11px]">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span> 100% Authentic Stock</span>
        <span class="text-slate-500">|</span>
        <a href="#footer" class="hover:text-white transition">24/7 Helpline: 0800-MRBULK</a>
      </div>
    </div>
  </div>

  <!-- Primary Sticky Header Navigation -->
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 glass-nav border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center gap-3 group shrink-0">
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand text-white flex items-center justify-center font-black text-xl shadow-md shadow-brand/25 group-hover:scale-105 transition-transform">
          ${escapeHtml(storeName.charAt(0).toUpperCase())}
        </div>
        <div>
          <span class="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white block leading-none group-hover:text-brand transition-colors">
            ${escapeHtml(storeName)}
          </span>
          <span class="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Marketplace & Wholesale</span>
        </div>
      </a>

      <!-- Desktop Search Bar -->
      <div class="hidden md:flex flex-1 max-w-lg mx-6 relative">
        <input
          type="text"
          id="catalog-search-input"
          placeholder="Search products, electronics, wholesale bulk..."
          class="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Quick Nav Links -->
      <nav class="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700 dark:text-slate-300">
        <a href="#products-section" class="hover:text-brand transition-colors">Shop Catalog</a>
        <a href="#flash-deals-section" class="hover:text-brand transition-colors flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Flash Deals</span>
        </a>
        <a href="#promo-banners" class="hover:text-brand transition-colors">Wholesale</a>
        <a href="#reviews-section" class="hover:text-brand transition-colors">Reviews</a>
      </nav>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Dark Mode Toggle Button -->
        <button
          onclick="toggleDarkMode()"
          class="p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title="Toggle Dark / Light Theme"
          aria-label="Toggle Dark Mode"
        >
          <svg id="theme-sun-icon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg id="theme-moon-icon" class="w-5 h-5 block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Wishlist Button -->
        <button
          onclick="toggleWishlistDrawer()"
          class="p-2.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all relative cursor-pointer"
          title="Wishlist"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span id="wishlist-badge" class="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">0</span>
        </button>

        <!-- Cart Button -->
        <button
          onclick="toggleCartDrawer()"
          class="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl shadow-md shadow-brand/20 hover:bg-brand-hover hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open Shopping Cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span class="text-xs font-bold hidden sm:inline">Cart</span>
          <span id="cart-badge" class="w-5 h-5 bg-white text-brand rounded-full text-xs font-black flex items-center justify-center">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Horizontal Category Navigation Bar -->
  <div class="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-18 sm:top-20 z-30 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 py-2.5 overflow-x-auto custom-scrollbar scroll-smooth">
        <button
          onclick="filterByCategory('all')"
          id="cat-pill-all"
          class="cat-pill px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all bg-brand text-white shadow-xs cursor-pointer"
        >
          All Categories
        </button>
        ${activeCategories.slice(0, 10).map((cat) => `
          <button
            onclick="filterByCategory('${escapeHtml(cat.name)}')"
            id="cat-pill-${escapeHtml(cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))}"
            class="cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap transition-all cursor-pointer"
          >
            ${escapeHtml(cat.name)}
          </button>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Hero Section with Rotating Promo Slides -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
    <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-slate-950 text-white border border-slate-800">
      <div id="hero-slider" class="relative h-[280px] xs:h-[340px] sm:h-[400px] lg:h-[450px] w-full overflow-hidden">
        ${activeSlides.map((slide, idx) => `
          <div
            id="slide-${idx}"
            class="hero-slide absolute inset-0 w-full h-full flex items-center transition-opacity duration-700 ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}"
            style="background-image: url('${slide.backgroundImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop'}'); background-size: cover; background-position: center;"
          >
            <!-- Scrim Overlays -->
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/20"></div>

            <!-- Slide Content -->
            <div class="relative z-20 px-6 sm:px-12 lg:px-16 max-w-xl">
              <span class="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider bg-brand text-white rounded-full mb-3 shadow">
                South Africa Marketplace
              </span>
              <h1 class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3 leading-tight drop-shadow-md">
                ${escapeHtml(slide.title)}
              </h1>
              <p class="text-sm sm:text-base text-slate-200 font-medium mb-6 line-clamp-2 drop-shadow">
                ${escapeHtml(slide.subtitle)}
              </p>
              <a
                href="#products-section"
                class="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white text-sm font-extrabold rounded-xl shadow-lg shadow-brand/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>${escapeHtml(slide.buttonText || 'Explore Catalog')}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        `).join('')}

        <!-- Carousel Navigation Controls -->
        <button
          onclick="prevSlide()"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur border border-white/20 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
          aria-label="Previous Slide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onclick="nextSlide()"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur border border-white/20 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
          aria-label="Next Slide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>

        <!-- Carousel Dots -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          ${activeSlides.map((_, i) => `
            <button
              onclick="goToSlide(${i})"
              id="dot-${i}"
              class="h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}"
              aria-label="Go to slide ${i + 1}"
            ></button>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- Trust Badges Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Free Nationwide Delivery</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">On all qualifying orders over R1,000</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">100% Authentic</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Verified manufacturer stock</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">Secure SA Payments</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">PayFast, Ozow, Visa & Mastercard</p>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5 transition-colors">
        <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">7-Day Easy Returns</h4>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Hassle-free refunds nationwide</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Bento Promo Banners Grid -->
  <section id="promo-banners" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <div class="relative rounded-3xl overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md flex flex-col justify-between min-h-[190px]">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand text-white inline-block mb-2.5">Wholesale Savings</span>
          <h3 class="text-lg sm:text-xl font-extrabold leading-tight">Direct Retail & Bulk Wholesale Savings</h3>
          <p class="text-xs text-slate-300 mt-1.5">Save up to 35% on multi-pack case orders.</p>
        </div>
        <a href="#products-section" onclick="filterByCategory('Groceries & Wholesale')" class="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-brand transition mt-4">
          <span>Shop Wholesale</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>

      <div class="relative rounded-3xl overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-brand/90 to-brand-hover text-white shadow-md flex flex-col justify-between min-h-[190px]">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white inline-block mb-2.5">Tech Showcase</span>
          <h3 class="text-lg sm:text-xl font-extrabold leading-tight">Next-Gen Electronics & Audio Deals</h3>
          <p class="text-xs text-white/90 mt-1.5">Active noise cancellation & high-fidelity sound.</p>
        </div>
        <a href="#products-section" onclick="filterByCategory('Electronics')" class="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline transition mt-4">
          <span>Explore Electronics</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>

      <div class="relative rounded-3xl overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md flex flex-col justify-between min-h-[190px]">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white inline-block mb-2.5">Home & Living</span>
          <h3 class="text-lg sm:text-xl font-extrabold leading-tight">Contemporary Kitchen & Home Decor</h3>
          <p class="text-xs text-amber-100 mt-1.5">Curated modern essentials for your living space.</p>
        </div>
        <a href="#products-section" onclick="filterByCategory('Home & Kitchen')" class="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:underline transition mt-4">
          <span>Browse Home</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- Flash Deals with Live Countdown Timer -->
  <section id="flash-deals-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
    <div class="bg-gradient-to-r from-brand via-brand-hover to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-2 text-center md:text-left">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-sm">
          <svg class="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" /></svg>
          Limited Flash Deals of the Week
        </div>
        <h3 class="text-2xl sm:text-3xl font-black tracking-tight">Save Up to 40% On Top Rated Picks</h3>
        <p class="text-xs sm:text-sm text-white/90 max-w-md">Dispatched direct from certified South African marketplace distributors.</p>
      </div>

      <!-- Live Countdown Box -->
      <div class="flex items-center gap-2 sm:gap-3 text-center shrink-0">
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 min-w-[64px]">
          <span id="countdown-hours" class="block text-xl sm:text-2xl font-black leading-none">08</span>
          <span class="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Hours</span>
        </div>
        <span class="text-xl font-bold">:</span>
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 min-w-[64px]">
          <span id="countdown-minutes" class="block text-xl sm:text-2xl font-black leading-none">42</span>
          <span class="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Mins</span>
        </div>
        <span class="text-xl font-bold">:</span>
        <div class="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 min-w-[64px]">
          <span id="countdown-seconds" class="block text-xl sm:text-2xl font-black leading-none">19</span>
          <span class="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Secs</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Curated Products Catalog Section -->
  <section id="products-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Marketplace Catalog</h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Discover verified independent sellers & bulk wholesale items</p>
      </div>

      <!-- Tab Buttons & Sort Selector -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl overflow-x-auto custom-scrollbar">
          <button
            onclick="switchTab('all')"
            id="tab-all"
            class="product-tab px-3.5 py-1.5 text-xs font-black rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            All Items
          </button>
          <button
            onclick="switchTab('bestsellers')"
            id="tab-bestsellers"
            class="product-tab px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Bestsellers
          </button>
          <button
            onclick="switchTab('sale')"
            id="tab-sale"
            class="product-tab px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            Special Deals
          </button>
        </div>

        <select
          id="sort-select"
          onchange="handleSortChange(this.value)"
          class="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>

    <!-- Product Grid Container -->
    <div id="product-grid" class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Populated via JavaScript on load -->
    </div>
  </section>

  <!-- Verified Customer Reviews / Testimonials -->
  <section id="reviews-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
    <div class="text-center max-w-2xl mx-auto mb-8">
      <span class="text-xs font-black uppercase tracking-wider text-brand">Verified Feedback</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">What South African Shoppers Say</h2>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">Over 15,000 orders fulfilled nationwide across Gauteng, Western Cape, KZN and beyond.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-3">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            "Apex Tech Direct delivered my wireless noise-cancelling headphones to Sandton in under 48 hours. Genuine product with full manufacturer warranty. Exceptional service."
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">Thabo M.</h4>
            <p class="text-[11px] text-slate-400">Johannesburg, Gauteng</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">Verified Buyer</span>
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-3">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            "The bulk wholesale prices saved our retail shop over R3,800 on inventory stock this month. The courier delivery was prompt and tracked every step of the way."
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">Candice R.</h4>
            <p class="text-[11px] text-slate-400">Cape Town, Western Cape</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">Verified Merchant</span>
        </div>
      </div>

      <div class="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-3">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            "Checkout using Ozow Instant EFT took less than 30 seconds. Received the parcel in Umhlanga within two business days. Mrbulk is now my go-to online store."
          </p>
        </div>
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-slate-900 dark:text-white">Devan P.</h4>
            <p class="text-[11px] text-slate-400">Durban, KwaZulu-Natal</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">Verified Buyer</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Newsletter Signup & VIP Perks -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div class="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors">
      <div class="max-w-md text-center lg:text-left">
        <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Join Our VIP Shoppers Club</h3>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Receive instant promo codes, flash sale alerts, and R100 off your first wholesale order over R1,000.</p>
      </div>
      <form onsubmit="handleNewsletter(event)" class="flex flex-col sm:flex-row w-full max-w-md gap-2">
        <input
          type="email"
          required
          placeholder="Enter your email address..."
          class="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand placeholder:text-slate-400"
        />
        <button
          type="submit"
          class="px-6 py-3 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          Subscribe
        </button>
      </form>
    </div>
  </section>

  <!-- Multi-Column Footer -->
  <footer id="footer" class="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-black text-lg">
              ${escapeHtml(storeName.charAt(0).toUpperCase())}
            </div>
            <span class="text-xl font-black tracking-tight text-white">${escapeHtml(storeName)}</span>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
            ${escapeHtml(storeName)} is an online e-commerce marketplace in South Africa operated by Mr Cheap General Dealer ZA, offering direct retail and wholesale products as well as independent marketplace seller items.
          </p>
          <div class="flex items-center gap-3 text-xs text-slate-400">
            <span>🇿🇦 Proudly South African</span>
            <span>&bull;</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider mb-3">Shop Collections</h4>
          <ul class="space-y-2 text-xs text-slate-400">
            <li><a href="#products-section" onclick="filterByCategory('Electronics')" class="hover:text-white transition">Electronics & Audio</a></li>
            <li><a href="#products-section" onclick="filterByCategory('Home & Kitchen')" class="hover:text-white transition">Home & Kitchen</a></li>
            <li><a href="#products-section" onclick="filterByCategory('Apparel & Fashion')" class="hover:text-white transition">Fashion & Apparel</a></li>
            <li><a href="#products-section" onclick="filterByCategory('Groceries & Wholesale')" class="hover:text-white transition">Wholesale & Bulk</a></li>
            <li><a href="#flash-deals-section" class="hover:text-white transition">Weekly Flash Deals</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider mb-3">Customer Support</h4>
          <ul class="space-y-2 text-xs text-slate-400">
            <li><a href="#" onclick="showToast('Tracking: Enter order number in confirmation view.')" class="hover:text-white transition">Track Your Order</a></li>
            <li><a href="#" onclick="showToast('Returns: 7-Day Hassle-Free Policy nationwide.')" class="hover:text-white transition">Returns Policy</a></li>
            <li><a href="#" onclick="showToast('Shipping: Free nationwide over R1,000.')" class="hover:text-white transition">Delivery Information</a></li>
            <li><a href="#" onclick="showToast('Helpline: 0800-MRBULK | support@mrbulk.co.za')" class="hover:text-white transition">Contact Help Desk</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider mb-3">Safe Payment Methods</h4>
          <div class="space-y-2 text-xs text-slate-400">
            <p class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> PayFast Online Gateway</p>
            <p class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Ozow Instant EFT (All Banks)</p>
            <p class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Visa & Mastercard 3D Secure</p>
            <p class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Cash on Delivery (Metro)</p>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>&copy; ${new Date().getFullYear()} ${escapeHtml(storeName)}. Operated by Mr Cheap General Dealer ZA. All rights reserved.</p>
        <p class="flex items-center gap-2">
          <span>Clean HTML5 & Tailwind CSS Standalone Storefront</span>
        </p>
      </div>
    </div>
  </footer>

  <!-- Slide-Out Cart Drawer -->
  <div id="cart-drawer-backdrop" onclick="toggleCartDrawer()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-300 opacity-0 pointer-events-none"></div>
  <aside id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300">
    <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">Your Shopping Cart</h3>
        <span id="drawer-item-count" class="text-xs font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand">0 items</span>
      </div>
      <button onclick="toggleCartDrawer()" class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <!-- Free Delivery Progress Bar -->
    <div class="p-3 bg-brand-light dark:bg-slate-800/80 border-b border-brand-border dark:border-slate-700 px-5">
      <div class="flex justify-between items-center text-[11px] font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
        <span id="shipping-progress-text">Add R1,000.00 to unlock FREE Delivery</span>
        <span id="shipping-progress-percent">0%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div id="shipping-progress-bar" class="h-full bg-brand rounded-full transition-all duration-300 w-0"></div>
      </div>
    </div>

    <!-- Cart Items Scroll List -->
    <div id="cart-items-container" class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
      <!-- Injected by JavaScript -->
    </div>

    <!-- Cart Footer & Checkout Action -->
    <div class="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4">
      <!-- Promo Code Input -->
      <div class="flex gap-2">
        <input
          type="text"
          id="promo-code-input"
          placeholder="Promo code (e.g. MRBULK10)"
          class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          onclick="applyPromoCode()"
          class="px-3 py-2 text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl transition cursor-pointer"
        >
          Apply
        </button>
      </div>

      <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span id="drawer-subtotal" class="font-bold text-slate-900 dark:text-white">R0.00</span>
        </div>
        <div id="drawer-discount-row" class="flex justify-between text-emerald-600 hidden">
          <span>Discount (10% OFF)</span>
          <span id="drawer-discount">-R0.00</span>
        </div>
        <div class="flex justify-between">
          <span>Nationwide Delivery</span>
          <span id="drawer-shipping" class="font-semibold text-emerald-600">FREE</span>
        </div>
        <div class="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
          <span>Total</span>
          <span id="drawer-total" class="text-brand">R0.00</span>
        </div>
      </div>

      <button
        onclick="openCheckoutModal()"
        class="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-sm font-extrabold rounded-xl shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <span>Proceed to Secure Checkout</span>
      </button>
    </div>
  </aside>

  <!-- Slide-Out Wishlist Drawer -->
  <div id="wishlist-drawer-backdrop" onclick="toggleWishlistDrawer()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-300 opacity-0 pointer-events-none"></div>
  <aside id="wishlist-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300">
    <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h3 class="text-base font-bold text-slate-900 dark:text-white">Your Saved Wishlist</h3>
      </div>
      <button onclick="toggleWishlistDrawer()" class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    <div id="wishlist-items-container" class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
      <!-- Injected by JavaScript -->
    </div>
  </aside>

  <!-- Quick View Product Modal -->
  <div id="quickview-backdrop" onclick="closeQuickView()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-200 opacity-0 pointer-events-none flex items-center justify-center p-4">
    <div onclick="event.stopPropagation()" class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-95 transition-all duration-200 max-h-[90vh] flex flex-col">
      <div class="relative shrink-0">
        <img id="qv-image" src="" alt="Product" class="w-full h-60 sm:h-72 object-cover bg-slate-100 dark:bg-slate-800" />
        <button onclick="closeQuickView()" class="absolute top-3 right-3 p-2 bg-slate-900/75 hover:bg-slate-900 text-white rounded-full transition cursor-pointer shadow">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <span id="qv-badge" class="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase rounded-full bg-rose-500 text-white shadow">Sale</span>
      </div>
      <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
        <div>
          <div class="flex items-center justify-between">
            <span id="qv-category" class="text-[10px] font-black uppercase tracking-wider text-brand"></span>
            <span id="qv-seller" class="text-[11px] font-bold text-slate-500 dark:text-slate-400"></span>
          </div>
          <h3 id="qv-title" class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1"></h3>
          <div class="flex items-center gap-3 mt-1.5">
            <span id="qv-price" class="text-lg sm:text-xl font-black text-brand"></span>
            <span id="qv-orig-price" class="text-sm text-slate-400 line-through"></span>
          </div>
        </div>

        <p id="qv-description" class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"></p>

        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div class="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
            <button onclick="decrementQvQty()" class="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-l-xl">-</button>
            <span id="qv-qty-val" class="px-3 text-xs font-black text-slate-900 dark:text-white">1</span>
            <button onclick="incrementQvQty()" class="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-r-xl">+</button>
          </div>
          <button
            id="qv-add-btn"
            class="flex-1 py-3 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- South African Checkout Simulation Modal -->
  <div id="checkout-modal-backdrop" onclick="closeCheckoutModal()" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity duration-200 opacity-0 pointer-events-none flex items-center justify-center p-4">
    <div onclick="event.stopPropagation()" class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-95 transition-all duration-200 max-h-[92vh] flex flex-col">
      <!-- Checkout Header -->
      <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center font-black text-sm">ZA</div>
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">South Africa Secure Checkout</h3>
            <p class="text-[11px] text-slate-400">Encrypted PayFast & Ozow Instant EFT Gateway</p>
          </div>
        </div>
        <button onclick="closeCheckoutModal()" class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Checkout Form or Confirmation Screen -->
      <div id="checkout-form-container" class="p-6 overflow-y-auto custom-scrollbar space-y-4">
        <form onsubmit="handlePlaceOrder(event)" class="space-y-4">
          <div>
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">1. Contact & Shipping Details</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" required placeholder="Full Name" class="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="email" required placeholder="Email Address" class="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="tel" required placeholder="Phone Number (e.g. 082 123 4567)" class="sm:col-span-2 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="text" required placeholder="Street Address" class="sm:col-span-2 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="text" required placeholder="City / Town" class="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand" />
              <select required class="px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand">
                <option value="">Select Province</option>
                <option value="Gauteng">Gauteng</option>
                <option value="Western Cape">Western Cape</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="North West">North West</option>
                <option value="Northern Cape">Northern Cape</option>
              </select>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">2. Payment Method</h4>
            <div class="space-y-2">
              <label class="flex items-center gap-3 p-3 rounded-xl border border-brand bg-brand/5 dark:bg-brand/10 cursor-pointer">
                <input type="radio" name="payment_method" value="payfast" checked class="text-brand focus:ring-brand" />
                <div class="text-xs">
                  <span class="font-extrabold text-slate-900 dark:text-white block">PayFast Online Gateway</span>
                  <span class="text-[11px] text-slate-500">Instant EFT, Debit & Credit Cards</span>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 cursor-pointer">
                <input type="radio" name="payment_method" value="ozow" class="text-brand focus:ring-brand" />
                <div class="text-xs">
                  <span class="font-extrabold text-slate-900 dark:text-white block">Ozow Instant EFT</span>
                  <span class="text-[11px] text-slate-500">Direct payment from Capitec, FNB, Standard Bank, ABSA, Nedbank</span>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 cursor-pointer">
                <input type="radio" name="payment_method" value="cod" class="text-brand focus:ring-brand" />
                <div class="text-xs">
                  <span class="font-extrabold text-slate-900 dark:text-white block">Cash on Delivery (Gauteng Metro)</span>
                  <span class="text-[11px] text-slate-500">Pay cash upon courier arrival</span>
                </div>
              </label>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-600 dark:text-slate-300">Amount Due:</span>
            <span id="checkout-total-display" class="text-base font-black text-brand">R0.00</span>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-brand/25 transition cursor-pointer"
          >
            Confirm & Place Order
          </button>
        </form>
      </div>

      <!-- Order Confirmation State -->
      <div id="checkout-success-container" class="p-8 text-center space-y-4 hidden">
        <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <span class="text-xs font-black uppercase tracking-wider text-emerald-600">Order Confirmed</span>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">Thank You For Your Order!</h3>
          <p id="confirmed-order-number" class="text-xs font-mono font-bold text-slate-500 mt-1">Ref: #MRB-ZA-84920</p>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Your order has been recorded and routed for picking at our Johannesburg fulfillment facility. Estimated courier delivery is 2-4 business days.
        </p>
        <div class="pt-4 flex items-center justify-center gap-3">
          <button
            onclick="closeCheckoutModal()"
            class="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-extrabold rounded-xl shadow transition cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toast" class="fixed bottom-5 left-5 z-50 transform -translate-y-10 opacity-0 pointer-events-none transition-all duration-300 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5">
    <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
    <span id="toast-message">Notification message</span>
  </div>

  <!-- Interactive Store Engine Scripts -->
  <script>
    // Embedded Catalog Data
    const catalogProducts = ${serializedProducts};

    // State
    let cart = [];
    let wishlist = [];
    let activeCategory = 'all';
    let currentTab = 'all';
    let currentSort = 'featured';
    let qvCurrentQty = 1;
    let qvCurrentProduct = null;
    let promoDiscountPercent = 0;
    let currentSlide = 0;
    const totalSlides = ${activeSlides.length};

    // Dark Mode Engine
    function initTheme() {
      const savedTheme = localStorage.getItem('mrbulk_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeIcons(true);
      } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcons(false);
      }
    }

    function toggleDarkMode() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('mrbulk_theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    }

    function updateThemeIcons(isDark) {
      const sun = document.getElementById('theme-sun-icon');
      const moon = document.getElementById('theme-moon-icon');
      if (sun && moon) {
        if (isDark) {
          sun.classList.remove('hidden');
          sun.classList.add('block');
          moon.classList.remove('block');
          moon.classList.add('hidden');
        } else {
          sun.classList.remove('block');
          sun.classList.add('hidden');
          moon.classList.remove('hidden');
          moon.classList.add('block');
        }
      }
    }

    // Hero Carousel Engine
    function showSlide(index) {
      for (let i = 0; i < totalSlides; i++) {
        const slide = document.getElementById('slide-' + i);
        const dot = document.getElementById('dot-' + i);
        if (slide) {
          if (i === index) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100', 'z-10');
          } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'pointer-events-none');
          }
        }
        if (dot) {
          if (i === index) {
            dot.classList.remove('w-2', 'bg-white/40');
            dot.classList.add('w-6', 'bg-white');
          } else {
            dot.classList.remove('w-6', 'bg-white');
            dot.classList.add('w-2', 'bg-white/40');
          }
        }
      }
      currentSlide = index;
    }

    function nextSlide() {
      showSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
      showSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    function goToSlide(i) {
      showSlide(i);
    }

    if (totalSlides > 1) {
      setInterval(nextSlide, 5500);
    }

    // Flash Deals Countdown Timer
    let totalSeconds = 8 * 3600 + 42 * 60 + 19;
    setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds--;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const elH = document.getElementById('countdown-hours');
        const elM = document.getElementById('countdown-minutes');
        const elS = document.getElementById('countdown-seconds');
        if (elH) elH.textContent = String(h).padStart(2, '0');
        if (elM) elM.textContent = String(m).padStart(2, '0');
        if (elS) elS.textContent = String(s).padStart(2, '0');
      }
    }, 1000);

    // Product Grid Renderer
    function renderProductGrid(items) {
      const grid = document.getElementById('product-grid');
      if (!grid) return;

      if (!items || items.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-16 text-slate-400 font-medium text-sm">No products found matching your filter criteria.</div>';
        return;
      }

      grid.innerHTML = items.map(p => {
        const isWishlisted = wishlist.includes(p.id);
        return \`
          <div class="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-brand/40 dark:hover:border-brand/40 transition-all duration-300 flex flex-col">
            <div class="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="\${p.imageUrl}"
                alt="\${p.name}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              \${p.isSale ? \`<span class="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">\${p.saleBadgeText || 'Sale'}</span>\` : ''}
              
              <!-- Wishlist Heart Button -->
              <button
                onclick="toggleWishlist('\${p.id}')"
                class="absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer \${isWishlisted ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'}"
                title="\${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
              >
                <svg class="w-4 h-4" fill="\${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>

              <!-- Quick View Button on Hover -->
              <button
                onclick="quickViewProduct('\${p.id}')"
                class="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Quick View"
              >
                <svg class="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <span>Quick View</span>
              </button>
            </div>
            
            <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div class="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span>\${p.category}</span>
                  <span class="text-amber-500 flex items-center gap-0.5">★ \${p.rating} (\${p.reviewsCount})</span>
                </div>
                <h3 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors line-clamp-2 leading-snug mt-1">
                  \${p.name}
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Sold by: <span class="font-bold text-slate-700 dark:text-slate-300">\${p.sellerName}</span>
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span class="text-sm sm:text-base font-black text-slate-900 dark:text-white">\${p.price}</span>
                  \${p.originalPrice ? \`<span class="text-xs text-slate-400 line-through ml-1.5">\${p.originalPrice}</span>\` : ''}
                </div>
                <button
                  onclick="addToCart('\${p.id}')"
                  class="px-3.5 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Filter & Sort State Manager
    function applyCurrentFilters() {
      let filtered = [...catalogProducts];

      // Category filter
      if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
      }

      // Tab filter
      if (currentTab === 'bestsellers') {
        filtered = filtered.filter(p => p.rating >= 4.7 || p.isFeatured);
      } else if (currentTab === 'sale') {
        filtered = filtered.filter(p => p.isSale);
      }

      // Search query filter
      const searchInput = document.getElementById('catalog-search-input');
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      if (q) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      // Sorting
      if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.priceNum - b.priceNum);
      } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.priceNum - a.priceNum);
      } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      renderProductGrid(filtered);
    }

    // Tabs Switcher
    function switchTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.product-tab').forEach(b => {
        b.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-xs');
        b.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      const activeBtn = document.getElementById('tab-' + tab);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
        activeBtn.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-xs');
      }
      applyCurrentFilters();
    }

    // Filter by Category
    function filterByCategory(catName) {
      activeCategory = catName.toLowerCase() === 'all' ? 'all' : catName;

      // Update pills UI
      document.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('bg-brand', 'text-white', 'shadow-xs');
        btn.classList.add('text-slate-600', 'dark:text-slate-300');
      });

      const pillId = activeCategory === 'all' 
        ? 'cat-pill-all' 
        : 'cat-pill-' + activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const activePill = document.getElementById(pillId);
      if (activePill) {
        activePill.classList.remove('text-slate-600', 'dark:text-slate-300');
        activePill.classList.add('bg-brand', 'text-white', 'shadow-xs');
      }

      applyCurrentFilters();
      const section = document.getElementById('products-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    function handleSortChange(sortVal) {
      currentSort = sortVal;
      applyCurrentFilters();
    }

    // Search Input Listener
    document.getElementById('catalog-search-input')?.addEventListener('input', () => {
      applyCurrentFilters();
    });

    // Cart Management
    function addToCart(productId, qty = 1) {
      const prod = catalogProducts.find(p => p.id === productId);
      if (!prod) return;

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({ ...prod, quantity: qty });
      }

      updateCartUI();
      showToast('Added ' + prod.name.slice(0, 26) + ' to Cart!');
    }

    function changeQty(productId, delta) {
      const item = cart.find(i => i.id === productId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      updateCartUI();
    }

    function removeCartItem(productId) {
      cart = cart.filter(i => i.id !== productId);
      updateCartUI();
    }

    function updateCartUI() {
      const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
      
      const badge = document.getElementById('cart-badge');
      const drawerCount = document.getElementById('drawer-item-count');
      if (badge) badge.textContent = totalCount;
      if (drawerCount) drawerCount.textContent = totalCount + ' item' + (totalCount === 1 ? '' : 's');

      const container = document.getElementById('cart-items-container');
      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-16 text-slate-400 space-y-2">
            <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Your cart is currently empty</p>
            <p class="text-[11px] text-slate-400">Add any product from the catalog to get started.</p>
          </div>
        \`;
      } else {
        container.innerHTML = cart.map(item => \`
          <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <img src="\${item.imageUrl}" alt="\${item.name}" class="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-700 shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">\${item.name}</h4>
              <p class="text-xs font-extrabold text-brand mt-0.5">\${item.price}</p>
              <div class="flex items-center justify-between gap-2 mt-2">
                <div class="inline-flex items-center border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                  <button onclick="changeQty('\${item.id}', -1)" class="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-l">-</button>
                  <span class="px-2 text-xs font-bold text-slate-900 dark:text-white">\${item.quantity}</span>
                  <button onclick="changeQty('\${item.id}', 1)" class="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-r">+</button>
                </div>
                <button onclick="removeCartItem('\${item.id}')" class="text-[11px] text-rose-500 hover:underline">Remove</button>
              </div>
            </div>
          </div>
        \`).join('');
      }

      // Compute subtotal and delivery
      let sum = 0;
      cart.forEach(i => {
        sum += i.priceNum * i.quantity;
      });

      const freeShippingThreshold = 1000;
      const progressPercent = Math.min(100, Math.round((sum / freeShippingThreshold) * 100));
      const progressBar = document.getElementById('shipping-progress-bar');
      const progressText = document.getElementById('shipping-progress-text');
      const progressPercentEl = document.getElementById('shipping-progress-percent');

      if (progressBar) progressBar.style.width = progressPercent + '%';
      if (progressPercentEl) progressPercentEl.textContent = progressPercent + '%';
      if (progressText) {
        if (sum >= freeShippingThreshold) {
          progressText.innerHTML = '🎉 You unlocked FREE Nationwide Delivery!';
        } else {
          const remaining = freeShippingThreshold - sum;
          progressText.innerHTML = 'Add R' + remaining.toFixed(2) + ' more to unlock FREE Delivery';
        }
      }

      // Promo discount calculation
      let discountAmount = 0;
      if (promoDiscountPercent > 0) {
        discountAmount = sum * (promoDiscountPercent / 100);
        const discountRow = document.getElementById('drawer-discount-row');
        const discountEl = document.getElementById('drawer-discount');
        if (discountRow) discountRow.classList.remove('hidden');
        if (discountEl) discountEl.textContent = '-R' + discountAmount.toFixed(2);
      }

      const shippingCost = sum === 0 || sum >= freeShippingThreshold ? 0 : 99;
      const shippingEl = document.getElementById('drawer-shipping');
      if (shippingEl) {
        shippingEl.textContent = shippingCost === 0 ? 'FREE' : 'R99.00';
      }

      const grandTotal = Math.max(0, sum - discountAmount + (sum > 0 ? shippingCost : 0));
      const subtotalEl = document.getElementById('drawer-subtotal');
      const totalEl = document.getElementById('drawer-total');
      const checkoutTotal = document.getElementById('checkout-total-display');

      if (subtotalEl) subtotalEl.textContent = 'R' + sum.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (totalEl) totalEl.textContent = 'R' + grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (checkoutTotal) checkoutTotal.textContent = 'R' + grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function applyPromoCode() {
      const codeInput = document.getElementById('promo-code-input');
      const val = codeInput ? codeInput.value.trim().toUpperCase() : '';
      if (val === 'MRBULK10' || val === 'WELCOME' || val === 'SPECIAL10') {
        promoDiscountPercent = 10;
        updateCartUI();
        showToast('Promo Code Applied: 10% Discount!');
      } else if (val) {
        showToast('Invalid promo code. Try MRBULK10');
      }
    }

    function toggleCartDrawer() {
      const drawer = document.getElementById('cart-drawer');
      const backdrop = document.getElementById('cart-drawer-backdrop');
      if (!drawer || !backdrop) return;

      const isOpen = !drawer.classList.contains('translate-x-full');
      if (isOpen) {
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
      } else {
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        updateCartUI();
      }
    }

    // Wishlist Management
    function toggleWishlist(productId) {
      const index = wishlist.indexOf(productId);
      if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from Wishlist');
      } else {
        wishlist.push(productId);
        showToast('Added to Wishlist!');
      }

      const badge = document.getElementById('wishlist-badge');
      if (badge) badge.textContent = wishlist.length;

      applyCurrentFilters();
      updateWishlistUI();
    }

    function toggleWishlistDrawer() {
      const drawer = document.getElementById('wishlist-drawer');
      const backdrop = document.getElementById('wishlist-drawer-backdrop');
      if (!drawer || !backdrop) return;

      const isOpen = !drawer.classList.contains('translate-x-full');
      if (isOpen) {
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
      } else {
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        updateWishlistUI();
      }
    }

    function updateWishlistUI() {
      const container = document.getElementById('wishlist-items-container');
      if (!container) return;

      const items = catalogProducts.filter(p => wishlist.includes(p.id));
      if (items.length === 0) {
        container.innerHTML = \`
          <div class="text-center py-16 text-slate-400 space-y-2">
            <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Your wishlist is empty</p>
            <p class="text-[11px] text-slate-400">Click the heart on any product card to save it.</p>
          </div>
        \`;
      } else {
        container.innerHTML = items.map(p => \`
          <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <img src="\${p.imageUrl}" alt="\${p.name}" class="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-700 shrink-0" />
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-slate-900 dark:text-white truncate">\${p.name}</h4>
              <p class="text-xs font-extrabold text-brand mt-0.5">\${p.price}</p>
              <div class="flex items-center gap-3 mt-2">
                <button onclick="addToCart('\${p.id}'); toggleWishlist('\${p.id}');" class="text-xs font-extrabold text-brand hover:underline">Move to Cart</button>
                <button onclick="toggleWishlist('\${p.id}')" class="text-[11px] text-slate-400 hover:text-rose-500">Remove</button>
              </div>
            </div>
          </div>
        \`).join('');
      }
    }

    // Quick View Modal
    function quickViewProduct(productId) {
      const prod = catalogProducts.find(p => p.id === productId);
      if (!prod) return;

      qvCurrentProduct = prod;
      qvCurrentQty = 1;

      const backdrop = document.getElementById('quickview-backdrop');
      const img = document.getElementById('qv-image');
      const title = document.getElementById('qv-title');
      const cat = document.getElementById('qv-category');
      const seller = document.getElementById('qv-seller');
      const price = document.getElementById('qv-price');
      const origPrice = document.getElementById('qv-orig-price');
      const desc = document.getElementById('qv-description');
      const badge = document.getElementById('qv-badge');
      const qtyVal = document.getElementById('qv-qty-val');
      const btn = document.getElementById('qv-add-btn');

      if (img) img.src = prod.imageUrl;
      if (title) title.textContent = prod.name;
      if (cat) cat.textContent = prod.category;
      if (seller) seller.textContent = 'Verified Seller: ' + prod.sellerName;
      if (price) price.textContent = prod.price;
      if (origPrice) origPrice.textContent = prod.originalPrice || '';
      if (desc) desc.textContent = prod.description;
      if (badge) {
        if (prod.isSale) {
          badge.classList.remove('hidden');
          badge.textContent = prod.saleBadgeText || 'Sale';
        } else {
          badge.classList.add('hidden');
        }
      }
      if (qtyVal) qtyVal.textContent = '1';

      if (btn) {
        btn.onclick = () => {
          addToCart(prod.id, qvCurrentQty);
          closeQuickView();
        };
      }

      if (backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
      }
    }

    function incrementQvQty() {
      qvCurrentQty += 1;
      const el = document.getElementById('qv-qty-val');
      if (el) el.textContent = qvCurrentQty;
    }

    function decrementQvQty() {
      if (qvCurrentQty > 1) {
        qvCurrentQty -= 1;
        const el = document.getElementById('qv-qty-val');
        if (el) el.textContent = qvCurrentQty;
      }
    }

    function closeQuickView() {
      const backdrop = document.getElementById('quickview-backdrop');
      if (backdrop) {
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
      }
    }

    // Checkout Modal
    function openCheckoutModal() {
      if (cart.length === 0) {
        showToast('Your cart is empty! Add products first.');
        return;
      }
      toggleCartDrawer(); // Close cart drawer
      const backdrop = document.getElementById('checkout-modal-backdrop');
      const formContainer = document.getElementById('checkout-form-container');
      const successContainer = document.getElementById('checkout-success-container');
      
      if (formContainer) formContainer.classList.remove('hidden');
      if (successContainer) successContainer.classList.add('hidden');

      if (backdrop) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
      }
    }

    function closeCheckoutModal() {
      const backdrop = document.getElementById('checkout-modal-backdrop');
      if (backdrop) {
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
      }
    }

    function handlePlaceOrder(e) {
      e.preventDefault();
      const formContainer = document.getElementById('checkout-form-container');
      const successContainer = document.getElementById('checkout-success-container');
      const refNumber = document.getElementById('confirmed-order-number');

      const randNum = Math.floor(10000 + Math.random() * 90000);
      if (refNumber) refNumber.textContent = 'Ref: #MRB-ZA-' + randNum;

      if (formContainer) formContainer.classList.add('hidden');
      if (successContainer) successContainer.classList.remove('hidden');

      // Clear Cart
      cart = [];
      updateCartUI();
      showToast('Order placed successfully! Confirmation generated.');
    }

    // Toast Notifications
    let toastTimeout = null;
    function showToast(msg) {
      const toast = document.getElementById('toast');
      const text = document.getElementById('toast-message');
      if (!toast || !text) return;

      text.textContent = msg;
      toast.classList.remove('opacity-0', '-translate-y-10', 'pointer-events-none');
      toast.classList.add('opacity-100', 'translate-y-0');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-10', 'pointer-events-none');
      }, 3500);
    }

    function handleNewsletter(e) {
      e.preventDefault();
      showToast('Thank you for subscribing! Voucher code sent to your inbox.');
      e.target.reset();
    }

    // Keyboard ESC listener
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeCheckoutModal();
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer && !cartDrawer.classList.contains('translate-x-full')) {
          toggleCartDrawer();
        }
        const wishlistDrawer = document.getElementById('wishlist-drawer');
        if (wishlistDrawer && !wishlistDrawer.classList.contains('translate-x-full')) {
          toggleWishlistDrawer();
        }
      }
    });

    // Initialize on Load
    initTheme();
    renderProductGrid(catalogProducts);
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadHtmlTemplate(options: GenerateTemplateOptions): void {
  const htmlContent = generateHtmlTemplate(options);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const sanitizedName = (options.storeName || 'mrbulk-storefront')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  link.href = url;
  link.download = `${sanitizedName || 'mrbulk'}-site.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
