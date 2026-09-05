import { SlideConfig, MockCategory, MockBrand, MockProduct } from '../types';

interface TemplateConfig {
  themeColor: 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
  autoplay: boolean;
  autoplaySpeed: number;
  logoText: string;
}

const THEME_COLORS = {
  blue: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    accentLight: '#eff6ff',
    accentText: '#1d4ed8',
  },
  indigo: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    accentLight: '#eff6ff',
    accentText: '#1d4ed8',
  },
  emerald: {
    primary: '#10b981',
    primaryHover: '#059669',
    accentLight: '#ecfdf5',
    accentText: '#059669',
  },
  rose: {
    primary: '#f43f5e',
    primaryHover: '#e11d48',
    accentLight: '#ffe4e6',
    accentText: '#e11d48',
  },
  amber: {
    primary: '#f59e0b',
    primaryHover: '#d97706',
    accentLight: '#fef3c7',
    accentText: '#d97706',
  },
  slate: {
    primary: '#1f2937',
    primaryHover: '#111827',
    accentLight: '#f3f4f6',
    accentText: '#111827',
  }
};

export function generateEcommerceTemplate(
  config: TemplateConfig,
  slides: SlideConfig[],
  categories: MockCategory[],
  brands: MockBrand[],
  products: MockProduct[]
): string {
  const selectedTheme = THEME_COLORS[config.themeColor] || THEME_COLORS.indigo;
  
  // Serialize slides, categories, brands, products to JSON safely
  const slidesJson = JSON.stringify(slides.map(s => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    buttonText: s.buttonText,
    buttonUrl: s.buttonUrl,
    backgroundType: s.backgroundType,
    backgroundImage: s.backgroundImage,
    backgroundGradient: s.backgroundGradient,
    backgroundColor: s.backgroundColor,
    titleAnimation: s.titleAnimation || 'fadeInUp',
    subtitleAnimation: s.subtitleAnimation || 'fadeIn',
    buttonStyle: s.buttonStyle || 'solid',
    buttonColor: s.buttonColor || selectedTheme.primary,
    buttonTextColor: s.buttonTextColor || '#ffffff'
  })), null, 2);

  const categoriesJson = JSON.stringify(categories.map(c => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    icon: c.icon
  })), null, 2);

  const brandsJson = JSON.stringify(brands.map(b => ({
    id: b.id,
    name: b.name,
    imageUrl: b.imageUrl,
    svgLogo: b.svgLogo || ''
  })), null, 2);

  const productsJson = JSON.stringify(products.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.imageUrl,
    url: p.url,
    description: p.description || 'Premium design with luxury craftsmanship and modern aesthetic.',
    categoryId: p.categoryId
  })), null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.logoText} | Premium E-Commerce Storefront</title>

    <!-- Configure Tailwind theme BEFORE loading Tailwind CDN -->
    <script>
        window.tailwind = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '${selectedTheme.accentLight}',
                            500: '${selectedTheme.primary}',
                            600: '${selectedTheme.primaryHover}',
                        }
                    }
                }
            }
        };
    </script>
    
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts Plus Jakarta Sans & Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Custom Style Animations & Utilities -->
    <style>
        body {
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            scroll-behavior: smooth;
        }
        
        /* Custom scrollbar hiding utility */
        .scrollbar-none::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Line clamps */
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        /* Keyframe Entrance Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(24px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-40px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes zoomIn {
            from {
                opacity: 0;
                transform: scale(0.92);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .anim-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-slideInLeft { animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-zoomIn { animation: zoomIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        
        .delay-1 { animation-delay: 120ms; }
        .delay-2 { animation-delay: 240ms; }
        .delay-3 { animation-delay: 360ms; }
        
        /* Slide fade transitions */
        .slide-transition {
            transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom Banner Slider Height Utility */
        #hero-slider {
            height: 560px;
        }
        @media (max-width: 640px) {
            #hero-slider {
                height: 440px;
            }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased overflow-x-hidden">

    <!-- Top Announcement Bar -->
    <div class="bg-slate-900 text-white text-[11px] font-semibold py-2 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>✨ Free Express Worldwide Shipping on All Orders Over $150 | Use Code <strong>LUXE20</strong></span>
    </div>

    <!-- Sticky Header -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition duration-300 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 sm:h-20">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="#" class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/20">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </span>
                        <span class="font-extrabold text-slate-900 tracking-tight">${config.logoText}</span>
                    </a>
                </div>

                <!-- Desktop Navigation Menu -->
                <nav class="hidden md:flex items-center space-x-8 text-sm font-semibold">
                    <a href="#" class="text-primary-500 hover:text-primary-600 transition duration-150">Home</a>
                    <a href="#categories" class="text-slate-600 hover:text-slate-900 transition duration-150">Categories</a>
                    <a href="#products" class="text-slate-600 hover:text-slate-900 transition duration-150">Featured Products</a>
                    <a href="#features" class="text-slate-600 hover:text-slate-900 transition duration-150">Why Us</a>
                    <a href="#brands" class="text-slate-600 hover:text-slate-900 transition duration-150">Partners</a>
                </nav>

                <!-- Search, Account, Wishlist, Cart Actions -->
                <div class="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
                    <!-- Search Input (Desktop) -->
                    <div class="relative hidden sm:block w-48 md:w-64">
                        <input type="text" id="search-input" placeholder="Search catalog..." class="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50/80 focus:bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition">
                        <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>

                    <!-- User Account -->
                    <button onclick="showToast('Account profile is active in sandbox mode.')" class="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition hidden xs:flex cursor-pointer" title="My Account">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </button>

                    <!-- Wishlist Trigger -->
                    <button id="wishlist-btn" class="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition relative cursor-pointer" title="Wishlist">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span id="wishlist-badge" class="absolute top-1 right-1 bg-primary-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">2</span>
                    </button>

                    <!-- Shopping Cart Trigger -->
                    <button id="cart-btn" class="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition relative cursor-pointer" title="Shopping Cart">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <span id="cart-badge" class="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">0</span>
                    </button>

                    <!-- Mobile Navigation Menu Toggle -->
                    <button id="mobile-menu-btn" class="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-slate-200/80 bg-white px-4 py-4 space-y-3">
            <div class="relative w-full mb-3">
                <input type="text" id="mobile-search-input" placeholder="Search product catalog..." class="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 focus:bg-white focus:outline-none focus:border-primary-500">
                <svg class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <a href="#" class="block px-3 py-2 rounded-xl text-sm font-semibold text-primary-500 bg-primary-50">Home</a>
            <a href="#categories" class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">Categories</a>
            <a href="#products" class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">Featured Products</a>
            <a href="#features" class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">Why Us</a>
            <a href="#brands" class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">Our Partners</a>
            <a href="#" onclick="showToast('Account services sandbox is active.');" class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">My Account</a>
        </div>
    </header>

    <!-- Main Content Grid -->
    <main class="relative w-full pb-16">

        <!-- Banner Slider Section -->
        <section class="relative w-full overflow-hidden bg-slate-950">
            <div id="hero-slider" class="relative w-full overflow-hidden">
                <!-- Slide Containers injected dynamically via JavaScript -->
                <div id="slides-wrapper" class="w-full h-full relative">
                    <!-- Slides mounted here -->
                </div>

                <!-- Navigation Arrow Controls -->
                <button id="slider-prev" class="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/40 text-white hover:bg-black/70 active:scale-95 transition-all duration-200 cursor-pointer outline-none backdrop-blur-xs">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button id="slider-next" class="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 bg-black/40 text-white hover:bg-black/70 active:scale-95 transition-all duration-200 cursor-pointer outline-none backdrop-blur-xs">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>

                <!-- Indicator Dot Pagination -->
                <div id="slider-dots" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
                    <!-- Pagination dots injected here -->
                </div>
            </div>
        </section>

        <!-- Features / Value Props Grid -->
        <section id="features" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
                <div class="flex items-center gap-3.5 p-2">
                    <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v1a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">Free Express Delivery</h4>
                        <p class="text-[11px] text-slate-500 font-medium mt-0.5">On orders over $150</p>
                    </div>
                </div>
                <div class="flex items-center gap-3.5 p-2">
                    <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">2-Year Warranty</h4>
                        <p class="text-[11px] text-slate-500 font-medium mt-0.5">100% Guaranteed</p>
                    </div>
                </div>
                <div class="flex items-center gap-3.5 p-2">
                    <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">Secure Payments</h4>
                        <p class="text-[11px] text-slate-500 font-medium mt-0.5">Encrypted transactions</p>
                    </div>
                </div>
                <div class="flex items-center gap-3.5 p-2">
                    <div class="w-10 h-10 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-slate-900">24/7 Support</h4>
                        <p class="text-[11px] text-slate-500 font-medium mt-0.5">Dedicated concierge</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section id="categories" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 scroll-mt-24 w-full overflow-hidden">
            <div class="text-center mb-10 max-w-xl mx-auto">
                <span class="text-xs font-extrabold uppercase tracking-widest text-primary-500">Top Collections</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Product Categories</h2>
                <p class="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">Explore our custom selected categories for top-tier lifestyle collections.</p>
            </div>

            <!-- Categories Slider Outer Wrapper -->
            <div class="relative group select-none">
                <!-- Left Arrow -->
                <button id="cat-scroll-left" class="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition active:scale-95 shadow-md hidden sm:flex cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <div id="categories-carousel" class="w-full overflow-x-auto scrollbar-none py-3 scroll-smooth snap-x snap-mandatory">
                    <div id="categories-inner" class="grid grid-flow-col auto-cols-[calc((100%-2*0.75rem)/3)] sm:auto-cols-[calc((100%-3*1rem)/4)] md:auto-cols-[calc((100%-4*1rem)/5)] lg:auto-cols-[calc((100%-5*1.25rem)/6)] xl:auto-cols-[calc((100%-7*1.25rem)/8)] gap-3 sm:gap-4 lg:gap-5 w-full">
                        <!-- Categories injected here -->
                    </div>
                </div>

                <!-- Right Arrow -->
                <button id="cat-scroll-right" class="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition active:scale-95 shadow-md hidden sm:flex cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </section>

        <!-- Featured Products Section -->
        <section id="products" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 scroll-mt-24">
            <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
                <div>
                    <span class="text-xs font-extrabold uppercase tracking-widest text-primary-500">Handpicked</span>
                    <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">Featured Products</h2>
                    <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">Check out our highest rated products and premium interior craft selections.</p>
                </div>
                
                <!-- Category Filter Pills -->
                <div id="category-filter-pills" class="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
                    <!-- Dynamic Pills -->
                </div>
            </div>

            <!-- Product Grid -->
            <div id="products-grid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <!-- Products injected here -->
            </div>
        </section>

        <!-- Brands Section -->
        <section id="brands" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 scroll-mt-24 w-full overflow-hidden">
            <div class="text-center mb-10 max-w-xl mx-auto">
                <span class="text-xs font-extrabold uppercase tracking-widest text-primary-500">Our Partners</span>
                <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Check Our Brand Partners</h2>
                <p class="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">Explore top-rated manufacturers matched to our custom aesthetic standards.</p>
            </div>

            <!-- Brands Slider Outer Wrapper -->
            <div class="relative group select-none">
                <!-- Left Arrow -->
                <button id="brand-scroll-left" class="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition active:scale-95 shadow-md hidden sm:flex cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
                </button>

                <div id="brands-carousel" class="w-full overflow-x-auto scrollbar-none py-4 border-y border-slate-200/80 bg-white/60 rounded-2xl scroll-smooth snap-x snap-mandatory">
                    <div id="brands-wrapper" class="flex gap-4 sm:gap-6 items-center min-w-full px-6">
                        <!-- Brands injected here -->
                    </div>
                </div>

                <!-- Right Arrow -->
                <button id="brand-scroll-right" class="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition active:scale-95 shadow-md hidden sm:flex cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div class="space-y-4">
                    <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-xl bg-primary-500 text-white flex items-center justify-center font-extrabold shadow-md">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </span>
                        <span class="text-xl font-extrabold text-white tracking-tight">${config.logoText}</span>
                    </div>
                    <p class="text-xs text-slate-400 leading-relaxed font-normal">
                        Curating luxury home furniture, high-end lifestyle gadgets, and modern interior craft items with seamless worldwide delivery.
                    </p>
                </div>

                <div>
                    <h4 class="text-xs font-extrabold text-white uppercase tracking-widest mb-4">Quick Navigation</h4>
                    <ul class="space-y-2.5 text-xs">
                        <li><a href="#" class="hover:text-primary-400 transition">Storefront Home</a></li>
                        <li><a href="#categories" class="hover:text-primary-400 transition">Browse Categories</a></li>
                        <li><a href="#products" class="hover:text-primary-400 transition">Featured Catalog</a></li>
                        <li><a href="#brands" class="hover:text-primary-400 transition">Partner Brands</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-xs font-extrabold text-white uppercase tracking-widest mb-4">Customer Care</h4>
                    <ul class="space-y-2.5 text-xs">
                        <li><a href="#" onclick="showToast('Help center article sandbox.')" class="hover:text-primary-400 transition">Shipping & Delivery</a></li>
                        <li><a href="#" onclick="showToast('Returns policy article sandbox.')" class="hover:text-primary-400 transition">Returns & Exchanges</a></li>
                        <li><a href="#" onclick="showToast('Privacy Policy sandbox.')" class="hover:text-primary-400 transition">Privacy Policy</a></li>
                        <li><a href="#" onclick="showToast('Terms of Service sandbox.')" class="hover:text-primary-400 transition">Terms & Conditions</a></li>
                    </ul>
                </div>

                <div class="space-y-4">
                    <h4 class="text-xs font-extrabold text-white uppercase tracking-widest mb-1">Newsletter</h4>
                    <p class="text-xs text-slate-400">Subscribe for early access to sales and private drops.</p>
                    <div class="flex gap-2">
                        <input type="email" placeholder="Enter your email" class="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 flex-1">
                        <button onclick="showToast('Subscribed to VIP newsletter!')" class="bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer">Join</button>
                    </div>
                </div>
            </div>

            <div class="pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                <p>&copy; ${new Date().getFullYear()} ${config.logoText}. All rights reserved.</p>
                <div class="flex items-center space-x-4">
                    <span>💳 Visa</span>
                    <span>💳 Mastercard</span>
                    <span>💳 Apple Pay</span>
                    <span>💳 Stripe</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Quick View Product Detail Modal -->
    <div id="quickview-modal" class="fixed inset-0 z-50 overflow-y-auto hidden" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" id="quickview-backdrop"></div>
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 transform transition-all">
                <button id="quickview-close-btn" class="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2" id="quickview-content">
                    <!-- Dynamic content injected here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Side Shopping Cart Drawer -->
    <div id="cart-drawer" class="fixed inset-0 z-50 overflow-hidden hidden" role="dialog" aria-modal="true">
        <div class="absolute inset-0 overflow-hidden">
            <!-- Overlay Backdrop -->
            <div id="cart-overlay" class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 opacity-0"></div>

            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div id="cart-panel" class="pointer-events-auto w-screen max-w-md transform transition-transform duration-300 translate-x-full bg-white shadow-2xl flex flex-col h-full">
                    <!-- Drawer Header -->
                    <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            Your Shopping Cart
                        </h2>
                        <button id="cart-close-btn" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition cursor-pointer">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <!-- Cart Item list (Scrollable) -->
                    <div id="cart-items-container" class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        <!-- Dynamic items injected here -->
                    </div>

                    <!-- Cart Footer Summary -->
                    <div class="border-t border-slate-100 px-6 py-6 bg-slate-50 space-y-4">
                        <div class="flex justify-between text-base font-bold text-slate-900">
                            <span>Subtotal</span>
                            <span id="cart-subtotal">$0.00</span>
                        </div>
                        <p class="text-xs text-slate-500 leading-normal">Free shipping applied. Local taxes calculated at checkout.</p>
                        <button id="cart-checkout-btn" class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 active:scale-95 transition-all duration-150 cursor-pointer">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Alert Success Banner notification Toast -->
    <div id="success-toast" class="fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 transition duration-300 -translate-y-24 opacity-0 pointer-events-none">
        <span class="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
        </span>
        <div class="text-xs font-semibold" id="toast-message">Product added to shopping cart!</div>
    </div>

    <!-- Core Interactive Data Store & Router (Vanilla Script) -->
    <script>
        // State Repositories (Serialized from builder)
        const SLIDES = ${slidesJson};
        const CATEGORIES = ${categoriesJson};
        const BRANDS = ${brandsJson};
        const PRODUCTS = ${productsJson};

        // Application Storage Model
        const appState = {
            cart: [],
            wishlist: [
                { id: "prod-1", name: "Premium Ergonomic Office Chair" },
                { id: "prod-4", name: "Nordic Forest Velvet Armchair" }
            ],
            currentSlideIndex: 0,
            activeCategory: 'All',
            autoplayTimer: null,
            autoplaySpeed: ${config.autoplaySpeed}
        };

        // DOM Initializations & Rendering
        window.addEventListener('DOMContentLoaded', () => {
            initSlider();
            initCategories();
            initProducts();
            initBrands();
            initInteractions();
            updateWishlistBadge();
            updateCartBadge();
        });

        // 1. Hero Slider Banner Logic
        function initSlider() {
            const wrapper = document.getElementById('slides-wrapper');
            const dotsContainer = document.getElementById('slider-dots');
            
            if(!wrapper) return;
            wrapper.innerHTML = '';
            if(dotsContainer) dotsContainer.innerHTML = '';

            SLIDES.forEach((slide, index) => {
                // Background Styling
                let bgStyle = '';
                if (slide.backgroundType === 'gradient') {
                    bgStyle = 'background: ' + slide.backgroundGradient + ';';
                } else if (slide.backgroundType === 'color') {
                    bgStyle = 'background-color: ' + slide.backgroundColor + ';';
                } else {
                    bgStyle = "background-image: url('" + slide.backgroundImage + "'); background-size: cover; background-position: center;";
                }

                // Render Slide
                const slideDiv = document.createElement('div');
                slideDiv.className = 'slide-transition absolute inset-0 w-full h-full flex items-center select-none ' + (index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0');
                slideDiv.setAttribute('style', bgStyle);
                slideDiv.setAttribute('data-index', index);

                // Slide Inner Content
                const animClass = slide.titleAnimation === 'slideInLeft' ? 'anim-slideInLeft' : 
                                  slide.titleAnimation === 'zoomIn' ? 'anim-zoomIn' : 
                                  slide.titleAnimation === 'fadeIn' ? 'anim-fadeIn' : 'anim-fadeInUp';
                
                const subAnimClass = slide.subtitleAnimation === 'slideInLeft' ? 'anim-slideInLeft' : 
                                     slide.subtitleAnimation === 'zoomIn' ? 'anim-zoomIn' : 
                                     slide.subtitleAnimation === 'fadeInUp' ? 'anim-fadeInUp' : 'anim-fadeIn';

                slideDiv.innerHTML = \`
                    <div class="absolute inset-0 bg-black/45 z-0"></div>
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <div class="max-w-2xl text-white">
                            <h2 class="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 \${index === 0 ? animClass : 'opacity-0'} delay-1">\${slide.title}</h2>
                            <p class="text-base sm:text-lg text-slate-200 font-medium mb-8 leading-relaxed \${index === 0 ? subAnimClass : 'opacity-0'} delay-2">\${slide.subtitle}</p>
                            <div class="\${index === 0 ? 'anim-fadeInUp' : 'opacity-0'} delay-3 flex items-center gap-3">
                                <a href="#products" class="inline-flex items-center justify-center px-6 py-3.5 text-sm font-bold tracking-wide text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition duration-200 shadow-lg shadow-primary-500/20">
                                    \${slide.buttonText}
                                </a>
                            </div>
                        </div>
                    </div>
                \`;
                wrapper.appendChild(slideDiv);

                // Render Dot
                if(dotsContainer) {
                    const dot = document.createElement('button');
                    dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer outline-none ' + (index === 0 ? 'bg-primary-500 scale-125 shadow-md shadow-primary-500/35' : 'bg-white/40 hover:bg-white/70');
                    dot.setAttribute('data-target', index);
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                        restartAutoplay();
                    });
                    dotsContainer.appendChild(dot);
                }
            });

            // Start Autoplay
            if(${config.autoplay}) {
                startAutoplay();
            }
        }

        function startAutoplay() {
            stopAutoplay();
            appState.autoplayTimer = setInterval(() => {
                const next = (appState.currentSlideIndex + 1) % SLIDES.length;
                goToSlide(next);
            }, appState.autoplaySpeed);
        }

        function stopAutoplay() {
            if (appState.autoplayTimer) {
                clearInterval(appState.autoplayTimer);
                appState.autoplayTimer = null;
            }
        }

        function restartAutoplay() {
            if(${config.autoplay}) {
                startAutoplay();
            }
        }

        function goToSlide(index) {
            const slides = document.querySelectorAll('#slides-wrapper > div');
            const dots = document.querySelectorAll('#slider-dots > button');
            
            appState.currentSlideIndex = index;

            slides.forEach((slide, idx) => {
                const isCurrent = idx === index;
                slide.className = 'slide-transition absolute inset-0 w-full h-full flex items-center select-none ' + (isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0');
                
                const title = slide.querySelector('h2');
                const sub = slide.querySelector('p');
                const btnContainer = slide.querySelector('.delay-3');
                
                const slideConfig = SLIDES[idx];
                const animClass = slideConfig.titleAnimation === 'slideInLeft' ? 'anim-slideInLeft' : 
                                  slideConfig.titleAnimation === 'zoomIn' ? 'anim-zoomIn' : 
                                  slideConfig.titleAnimation === 'fadeIn' ? 'anim-fadeIn' : 'anim-fadeInUp';
                
                const subAnimClass = slideConfig.subtitleAnimation === 'slideInLeft' ? 'anim-slideInLeft' : 
                                     slideConfig.subtitleAnimation === 'zoomIn' ? 'anim-zoomIn' : 
                                     slideConfig.subtitleAnimation === 'fadeInUp' ? 'anim-fadeInUp' : 'anim-fadeIn';

                if(title && sub && btnContainer) {
                    if (isCurrent) {
                        title.className = 'text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ' + animClass + ' delay-1';
                        sub.className = 'text-base sm:text-lg text-slate-200 font-medium mb-8 leading-relaxed ' + subAnimClass + ' delay-2';
                        btnContainer.className = 'anim-fadeInUp delay-3 flex items-center gap-3';
                    } else {
                        title.className = 'text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 opacity-0';
                        sub.className = 'text-base sm:text-lg text-slate-200 font-medium mb-8 leading-relaxed opacity-0';
                        btnContainer.className = 'opacity-0';
                    }
                }
            });

            dots.forEach((dot, idx) => {
                if(idx === index) {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-primary-500 scale-125 shadow-md shadow-primary-500/35 cursor-pointer outline-none';
                } else {
                    dot.className = 'w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white/70 cursor-pointer outline-none';
                }
            });
        }

        // 2. Categories Carousel & Filter Pills
        function initCategories() {
            const container = document.getElementById('categories-inner');
            const filterPillsContainer = document.getElementById('category-filter-pills');
            
            if(container) {
                container.innerHTML = '';

                CATEGORIES.forEach((cat) => {
                    const card = document.createElement('div');
                    card.className = 'snap-start snap-always w-full flex flex-col items-center cursor-pointer group transition-all duration-300';
                    
                    card.innerHTML = \`
                        <div class="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-slate-100 border-2 border-transparent flex items-center justify-center transition-all duration-300 shadow-xs group-hover:scale-105 group-hover:shadow-md group-hover:border-primary-500">
                            <img src="\${cat.imageUrl}" alt="\${cat.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                        </div>
                        <span class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight text-center mt-3 truncate max-w-full px-1 group-hover:text-primary-500 transition">\${cat.name}</span>
                    \`;
                    
                    card.addEventListener('click', () => {
                        filterCategory(cat.name);
                        const prodSection = document.getElementById('products');
                        if(prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
                    });
                    container.appendChild(card);
                });
            }

            // Render category filter pills
            if(filterPillsContainer) {
                filterPillsContainer.innerHTML = '';
                const allCategories = ['All', ...CATEGORIES.map(c => c.name)];

                allCategories.forEach(catName => {
                    const pill = document.createElement('button');
                    const isActive = appState.activeCategory === catName;
                    pill.className = 'px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ' + (isActive ? 'bg-primary-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200');
                    pill.innerText = catName;
                    pill.addEventListener('click', () => filterCategory(catName));
                    filterPillsContainer.appendChild(pill);
                });
            }
        }

        function filterCategory(catName) {
            appState.activeCategory = catName;
            initCategories(); // re-render pills active state
            
            const grid = document.getElementById('products-grid');
            if(!grid) return;
            
            const cards = grid.children;
            PRODUCTS.forEach((prod, idx) => {
                const card = cards[idx];
                if(!card) return;
                
                if(catName === 'All' || prod.categoryId === catName || prod.name.toLowerCase().includes(catName.toLowerCase())) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            showToast('Filtering category: ' + catName);
        }

        function getDecodedIcon(dataUri) {
            if(dataUri.startsWith('data:image/svg+xml')) {
                const commaIndex = dataUri.indexOf(',');
                if(commaIndex !== -1) {
                    return decodeURIComponent(dataUri.substring(commaIndex + 1));
                }
            }
            return dataUri;
        }

        // 3. Products Grid & Quick View
        function initProducts() {
            const grid = document.getElementById('products-grid');
            if(!grid) return;
            grid.innerHTML = '';

            PRODUCTS.forEach((prod) => {
                const card = document.createElement('div');
                card.className = 'bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer';
                
                card.innerHTML = \`
                    <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
                        <img src="\${prod.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="\${prod.name}">
                        <div class="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
                            \${prod.id === 'prod-1' ? '<span class="bg-primary-500 text-white font-extrabold text-[8px] sm:text-[9px] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full tracking-wider shadow">Best Seller</span>' : ''}
                            \${prod.id === 'prod-4' ? '<span class="bg-amber-500 text-white font-extrabold text-[8px] sm:text-[9px] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full tracking-wider shadow">Popular</span>' : ''}
                        </div>
                    </div>
                    <div class="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 class="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary-500 transition duration-150 line-clamp-2 leading-snug">\${prod.name}</h3>
                            <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">\${prod.description}</p>
                        </div>
                        <div class="flex items-center justify-between pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
                            <span class="text-base sm:text-lg font-extrabold text-slate-900">\${prod.price}</span>
                            <button class="add-to-cart-btn p-2 sm:p-2.5 bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white rounded-xl transition duration-150 shadow-xs cursor-pointer" data-id="\${prod.id}">
                                <svg class="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                            </button>
                        </div>
                    </div>
                \`;

                // Quick View on Card click
                card.addEventListener('click', (e) => {
                    if(e.target.closest('.add-to-cart-btn')) return;
                    openQuickView(prod);
                });

                // Wire product Add to Cart button
                const btn = card.querySelector('.add-to-cart-btn');
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    addToCart(prod);
                });

                grid.appendChild(card);
            });
        }

        // Quick View Modal
        function openQuickView(prod) {
            const modal = document.getElementById('quickview-modal');
            const content = document.getElementById('quickview-content');
            if(!modal || !content) return;

            content.innerHTML = \`
                <div class="aspect-square bg-slate-100 overflow-hidden">
                    <img src="\${prod.imageUrl}" class="w-full h-full object-cover" alt="\${prod.name}">
                </div>
                <div class="p-6 flex flex-col justify-between space-y-4">
                    <div>
                        <span class="text-[10px] font-bold uppercase tracking-widest text-primary-500">In Stock &bull; Fast Delivery</span>
                        <h3 class="text-xl font-extrabold text-slate-900 mt-1 leading-tight">\${prod.name}</h3>
                        <div class="flex items-center gap-1 mt-2 text-amber-400 text-xs">
                            ★★★★★ <span class="text-slate-400 text-[11px] font-semibold ml-1">(4.9 / 5.0)</span>
                        </div>
                        <p class="text-xs text-slate-600 mt-3 leading-relaxed">\${prod.description}</p>
                    </div>

                    <div class="space-y-4 pt-4 border-t border-slate-100">
                        <div class="text-2xl font-extrabold text-slate-900">\${prod.price}</div>
                        <button id="quickview-add-btn" class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 transition cursor-pointer flex items-center justify-center gap-2">
                            Add To Shopping Cart
                        </button>
                    </div>
                </div>
            \`;

            const addBtn = document.getElementById('quickview-add-btn');
            if(addBtn) {
                addBtn.addEventListener('click', () => {
                    addToCart(prod);
                    closeQuickView();
                });
            }

            modal.classList.remove('hidden');
        }

        function closeQuickView() {
            const modal = document.getElementById('quickview-modal');
            if(modal) modal.classList.add('hidden');
        }

        // 4. Brands Partner Renderer
        function initBrands() {
            const container = document.getElementById('brands-wrapper');
            if(!container) return;
            container.innerHTML = '';

            BRANDS.forEach((brand) => {
                const brandDiv = document.createElement('div');
                brandDiv.className = 'snap-center shrink-0 w-32 sm:w-40 h-16 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center p-3 grayscale hover:grayscale-0 opacity-75 hover:opacity-100 transition-all duration-300 shadow-xs cursor-pointer hover:shadow hover:-translate-y-0.5';
                
                let logoContent = '';
                if (brand.imageUrl && brand.imageUrl.startsWith('data:image/svg+xml')) {
                    logoContent = getDecodedIcon(brand.imageUrl);
                } else if (brand.svgLogo) {
                    logoContent = brand.svgLogo;
                }

                if (logoContent && logoContent.startsWith('<svg')) {
                    brandDiv.innerHTML = '<div class="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto text-slate-700">' + logoContent + '</div>';
                } else {
                    brandDiv.innerHTML = '<span class="font-extrabold text-xs sm:text-sm tracking-wide text-slate-500">' + brand.name + '</span>';
                }

                brandDiv.addEventListener('click', () => {
                    showToast('Viewing catalog of Partner: ' + brand.name);
                });
                container.appendChild(brandDiv);
            });
        }

        // 5. Interactive Handlers
        function initInteractions() {
            // Mobile menu toggles
            const menuBtn = document.getElementById('mobile-menu-btn');
            const menu = document.getElementById('mobile-menu');
            
            if(menuBtn && menu) {
                menuBtn.addEventListener('click', () => {
                    menu.classList.toggle('hidden');
                });
            }

            // QuickView Modal Close
            const qvCloseBtn = document.getElementById('quickview-close-btn');
            const qvBackdrop = document.getElementById('quickview-backdrop');
            if(qvCloseBtn) qvCloseBtn.addEventListener('click', closeQuickView);
            if(qvBackdrop) qvBackdrop.addEventListener('click', closeQuickView);

            // Live search
            const searchInput = document.getElementById('search-input');
            const mobileSearchInput = document.getElementById('mobile-search-input');

            function filterProducts(query) {
                const term = query.toLowerCase().trim();
                const grid = document.getElementById('products-grid');
                if(!grid) return;
                const cards = grid.children;
                PRODUCTS.forEach((prod, idx) => {
                    const card = cards[idx];
                    if(!card) return;
                    const name = prod.name.toLowerCase();
                    const desc = (prod.description || '').toLowerCase();
                    if(name.includes(term) || desc.includes(term)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            if(searchInput) {
                searchInput.addEventListener('input', (e) => {
                    filterProducts(e.target.value);
                    if(mobileSearchInput) mobileSearchInput.value = e.target.value;
                });
            }
            if(mobileSearchInput) {
                mobileSearchInput.addEventListener('input', (e) => {
                    filterProducts(e.target.value);
                    if(searchInput) searchInput.value = e.target.value;
                });
            }

            // Slider Nav Buttons
            const nextBtn = document.getElementById('slider-next');
            const prevBtn = document.getElementById('slider-prev');

            if(nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const next = (appState.currentSlideIndex + 1) % SLIDES.length;
                    goToSlide(next);
                    restartAutoplay();
                });
            }
            if(prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const prev = (appState.currentSlideIndex - 1 + SLIDES.length) % SLIDES.length;
                    goToSlide(prev);
                    restartAutoplay();
                });
            }

            // Categories horizontal scrolling
            const catScrollLeft = document.getElementById('cat-scroll-left');
            const catScrollRight = document.getElementById('cat-scroll-right');
            const catCarousel = document.getElementById('categories-carousel');

            if(catScrollLeft && catCarousel) {
                catScrollLeft.addEventListener('click', () => {
                    catCarousel.scrollBy({ left: -catCarousel.clientWidth * 0.75, behavior: 'smooth' });
                });
            }
            if(catScrollRight && catCarousel) {
                catScrollRight.addEventListener('click', () => {
                    catCarousel.scrollBy({ left: catCarousel.clientWidth * 0.75, behavior: 'smooth' });
                });
            }

            // Brands horizontal scrolling
            const brandScrollLeft = document.getElementById('brand-scroll-left');
            const brandScrollRight = document.getElementById('brand-scroll-right');
            const brandCarousel = document.getElementById('brands-carousel');

            if(brandScrollLeft && brandCarousel) {
                brandScrollLeft.addEventListener('click', () => {
                    brandCarousel.scrollBy({ left: -brandCarousel.clientWidth * 0.75, behavior: 'smooth' });
                });
            }
            if(brandScrollRight && brandCarousel) {
                brandScrollRight.addEventListener('click', () => {
                    brandCarousel.scrollBy({ left: brandCarousel.clientWidth * 0.75, behavior: 'smooth' });
                });
            }

            // Wishlist click
            const wishlistBtn = document.getElementById('wishlist-btn');
            if(wishlistBtn) {
                wishlistBtn.addEventListener('click', () => {
                    if (appState.wishlist.length === 0) {
                        showToast("Your wishlist is currently empty.");
                    } else {
                        const names = appState.wishlist.map(w => w.name).join(', ');
                        showToast("Wishlist items: " + names);
                    }
                });
            }

            // Cart Drawer Open/Close Controls
            const cartBtn = document.getElementById('cart-btn');
            const cartDrawer = document.getElementById('cart-drawer');
            const cartOverlay = document.getElementById('cart-overlay');
            const cartPanel = document.getElementById('cart-panel');
            const cartCloseBtn = document.getElementById('cart-close-btn');

            if(cartBtn && cartDrawer && cartOverlay && cartPanel) {
                const openDrawer = () => {
                    cartDrawer.classList.remove('hidden');
                    setTimeout(() => {
                        cartOverlay.classList.remove('opacity-0');
                        cartOverlay.classList.add('opacity-100');
                        cartPanel.classList.remove('translate-x-full');
                        cartPanel.classList.add('translate-x-0');
                    }, 50);
                };

                const closeDrawer = () => {
                    cartOverlay.classList.remove('opacity-100');
                    cartOverlay.classList.add('opacity-0');
                    cartPanel.classList.remove('translate-x-0');
                    cartPanel.classList.add('translate-x-full');
                    setTimeout(() => {
                        cartDrawer.classList.add('hidden');
                    }, 300);
                };

                cartBtn.addEventListener('click', openDrawer);
                cartOverlay.addEventListener('click', closeDrawer);
                if(cartCloseBtn) cartCloseBtn.addEventListener('click', closeDrawer);
                window.openCartDrawer = openDrawer;
                window.closeCartDrawer = closeDrawer;
            }

            // Checkout action
            const checkoutBtn = document.getElementById('cart-checkout-btn');
            if(checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    if(appState.cart.length === 0) {
                        showToast("Your cart is empty. Please add items to checkout!");
                    } else {
                        showToast("Processing Secure Checkout Sandbox...");
                        setTimeout(() => {
                            showToast("Order placed successfully! Thank you for testing.");
                            appState.cart = [];
                            updateCartBadge();
                            renderCartItems();
                            if(window.closeCartDrawer) window.closeCartDrawer();
                        }, 1200);
                    }
                });
            }
        }

        // Cart Helper logic
        function addToCart(product) {
            const rawPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 99.00;
            const existingItem = appState.cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                appState.cart.push({
                    id: product.id,
                    name: product.name,
                    price: rawPrice,
                    imageUrl: product.imageUrl,
                    quantity: 1
                });
            }

            updateCartBadge();
            renderCartItems();
            showToast(product.name + " added to shopping cart!");
            
            if (window.openCartDrawer) {
                setTimeout(() => window.openCartDrawer(), 350);
            }
        }

        function removeCartItem(productId) {
            appState.cart = appState.cart.filter(item => item.id !== productId);
            updateCartBadge();
            renderCartItems();
            showToast("Item removed from cart.");
        }

        function adjustQuantity(productId, amount) {
            const item = appState.cart.find(item => item.id === productId);
            if(item) {
                item.quantity += amount;
                if(item.quantity <= 0) {
                    removeCartItem(productId);
                } else {
                    updateCartBadge();
                    renderCartItems();
                }
            }
        }

        function updateCartBadge() {
            const badge = document.getElementById('cart-badge');
            if(!badge) return;
            const count = appState.cart.reduce((acc, curr) => acc + curr.quantity, 0);
            badge.innerText = count;
            badge.className = 'absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white transition-transform ' + (count > 0 ? 'scale-110' : 'scale-90');
        }

        function updateWishlistBadge() {
            const badge = document.getElementById('wishlist-badge');
            if(badge) {
                badge.innerText = appState.wishlist.length;
            }
        }

        function renderCartItems() {
            const container = document.getElementById('cart-items-container');
            const subtotalText = document.getElementById('cart-subtotal');
            if(!container) return;

            if (appState.cart.length === 0) {
                container.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-16 text-center select-none">
                        <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                        <h4 class="text-sm font-bold text-slate-800">Your cart is empty</h4>
                        <p class="text-xs text-slate-500 max-w-xs mt-1.5 leading-normal">Explore items and click Add to Cart to begin!</p>
                        <button onclick="if(window.closeCartDrawer) window.closeCartDrawer()" class="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer">
                            Back to Catalog
                        </button>
                    </div>
                \`;
                if(subtotalText) subtotalText.innerText = '$0.00';
                return;
            }

            container.innerHTML = '';
            let subtotal = 0;

            appState.cart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const itemRow = document.createElement('div');
                itemRow.className = 'flex items-center gap-4 bg-slate-50 hover:bg-slate-100/80 p-3.5 border border-slate-200/80 rounded-2xl relative group/row';
                
                itemRow.innerHTML = \`
                    <img src="\${item.imageUrl}" class="w-14 h-14 object-cover rounded-xl border border-slate-200 bg-white" alt="\${item.name}">
                    <div class="flex-1 min-w-0 pr-6">
                        <h4 class="text-xs font-bold text-slate-800 truncate leading-snug">\${item.name}</h4>
                        <span class="text-xs font-extrabold text-slate-900 block mt-1">\$\${itemTotal.toFixed(2)} <span class="text-[10px] text-slate-400 font-medium">(\$\${item.price.toFixed(2)} ea)</span></span>
                        
                        <div class="flex items-center space-x-2.5 mt-2">
                            <button onclick="adjustQuantity('\${item.id}', -1)" class="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold transition select-none cursor-pointer active:scale-95">-</button>
                            <span class="text-xs font-extrabold text-slate-800 font-mono">\${item.quantity}</span>
                            <button onclick="adjustQuantity('\${item.id}', 1)" class="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center text-xs font-bold transition select-none cursor-pointer active:scale-95">+</button>
                        </div>
                    </div>
                    
                    <button onclick="removeCartItem('\${item.id}')" class="absolute right-3.5 top-3.5 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-white transition cursor-pointer" title="Remove Item">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                \`;
                container.appendChild(itemRow);
            });

            if(subtotalText) {
                subtotalText.innerText = '$' + subtotal.toFixed(2);
            }
        }

        // Toast Manager
        function showToast(message) {
            const toast = document.getElementById('success-toast');
            const toastMsg = document.getElementById('toast-message');
            if(!toast || !toastMsg) return;

            toastMsg.innerText = message;
            toast.className = "fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 transition duration-300 translate-y-0 opacity-100 pointer-events-auto";

            setTimeout(() => {
                toast.className = "fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto sm:max-w-sm z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 transition duration-300 -translate-y-24 opacity-0 pointer-events-none";
            }, 3000);
        }
    </script>
</body>
</html>
`;
}
