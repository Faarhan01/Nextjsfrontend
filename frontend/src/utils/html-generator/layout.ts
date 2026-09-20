import { GenerateTemplateOptions, SerializedProduct, THEME_HEX_MAP, escapeHtml } from './types';

interface LayoutOptions {
  title: string;
  description: string;
  activeNav: 'home' | 'shop' | 'categories' | 'about' | 'contact' | 'cart' | 'checkout' | 'faq' | 'policies' | 'tracking';
  content: string;
  options: GenerateTemplateOptions;
  products: SerializedProduct[];
  categories: any[];
}

export function renderPageLayout({
  title,
  description,
  activeNav,
  content,
  options,
  products,
  categories
}: LayoutOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  const themeColor = options.themeColor || 'blue';
  const colors = THEME_HEX_MAP[themeColor] || THEME_HEX_MAP.blue;
  const serializedProductsJson = JSON.stringify(products);

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — ${escapeHtml(storeName)} South Africa</title>
  <meta name="description" content="${escapeHtml(description)}" />
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
          },
          colors: {
            brand: {
              DEFAULT: '${colors.primary}',
              hover: '${colors.hover}',
              light: '${colors.light}',
              border: '${colors.border}',
            }
          }
        }
      }
    };
  </script>
  <style>
    :root {
      --primary: ${colors.primary};
      --primary-hover: ${colors.hover};
      --primary-light: ${colors.light};
      --primary-border: ${colors.border};
    }
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-blue-500 selection:text-white">

  <!-- ==================== EXACT STOREFRONT FLOATING PILL HEADER ==================== -->
  <header role="banner" class="sticky top-2 sm:top-3.5 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto pointer-events-none mb-2 sm:mb-4 relative">
    <div class="pointer-events-auto rounded-2xl sm:rounded-full border backdrop-blur-2xl px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 relative z-50 transition-[box-shadow,background-color,border-color] duration-150 bg-white/85 dark:bg-slate-900/85 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-lg shadow-slate-900/5 dark:shadow-black/30 ring-1 ring-slate-900/5 dark:ring-slate-800/80">
      <div class="w-full flex items-center justify-between gap-2 sm:gap-4 h-9 sm:h-10">
        
        <!-- Brand Logo & Home Anchor -->
        <div class="flex-shrink-0 flex items-center">
          <a href="index.html" class="group flex items-center gap-2 text-slate-900 dark:text-slate-100 focus:outline-none rounded-full">
            <div class="w-7.5 h-7.5 rounded-full text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200" style="background-color: var(--primary);">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <span class="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
              ${escapeHtml(storeName)}
            </span>
          </a>
        </div>

        <!-- Desktop Navigation Menu -->
        <nav aria-label="Main Navigation" class="hidden lg:flex items-center space-x-1 lg:space-x-1.5 text-xs sm:text-sm font-semibold flex-shrink-0">
          <a href="index.html" class="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'home' ? 'font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}" ${activeNav === 'home' ? `style="background-color: var(--primary-light); color: var(--primary);"` : ''}>Home</a>
          
          <a href="shop.html" class="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${activeNav === 'shop' ? 'font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}" ${activeNav === 'shop' ? `style="background-color: var(--primary-light); color: var(--primary);"` : ''}>Shop</a>
          
          <!-- Categories Dropdown -->
          <div class="relative group/cat">
            <a href="categories.html" class="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${activeNav === 'categories' ? 'font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}" ${activeNav === 'categories' ? `style="background-color: var(--primary-light); color: var(--primary);"` : ''}>
              <span>Categories</span>
              <svg class="w-3 h-3 transition-transform group-hover/cat:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </a>
            <div class="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 hidden group-hover/cat:block z-50 animate-in fade-in">
              ${categories.slice(0, 6).map((c: any) => `
                <a href="shop.html?category=${encodeURIComponent(c.name)}" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <span class="w-2 h-2 rounded-full" style="background-color: var(--primary);"></span>
                  <span class="truncate">${escapeHtml(c.name)}</span>
                </a>
              `).join('')}
              <div class="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                <a href="categories.html" class="block px-3 py-1.5 text-[11px] font-bold text-center" style="color: var(--primary);">View All Categories →</a>
              </div>
            </div>
          </div>

          <!-- Company Dropdown -->
          <div class="relative group/comp">
            <button class="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1 ${['about', 'contact', 'faq', 'tracking'].includes(activeNav) ? 'font-bold shadow-2xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'}" ${['about', 'contact', 'faq', 'tracking'].includes(activeNav) ? `style="background-color: var(--primary-light); color: var(--primary);"` : ''}>
              <span>Company</span>
              <svg class="w-3 h-3 transition-transform group-hover/comp:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 hidden group-hover/comp:block z-50 animate-in fade-in">
              <a href="about.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">About Us</a>
              <a href="contact.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Contact Us</a>
              <a href="order-tracking.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Track Order</a>
              <a href="faq.html" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Help & FAQs</a>
            </div>
          </div>

          <!-- Sell -->
          <a href="contact.html?intent=seller" class="px-2.5 lg:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            <span>Sell</span>
          </a>
        </nav>

        <!-- Desktop Search Input -->
        <div class="relative flex-1 max-w-xs xl:max-w-sm hidden md:block">
          <input type="text" id="header-search-input" placeholder="Search wholesale & retail products..." class="w-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-full pl-9 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:text-white placeholder:text-slate-400" oninput="handleSearch(this.value)" onkeydown="if(event.key==='Enter'){ window.location.href='shop.html?search=' + encodeURIComponent(this.value); }" />
          <svg class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <!-- Theme Toggle -->
          <button onclick="toggleTheme()" class="w-8 h-8 sm:w-9 sm:h-9 items-center justify-center rounded-full border border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all flex cursor-pointer" title="Toggle Dark/Light Mode">
            <svg id="theme-icon-sun" class="w-4 h-4 hidden dark:block text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg id="theme-icon-moon" class="w-4 h-4 block dark:hidden text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </button>

          <!-- Wishlist -->
          <button onclick="toggleWishlistDrawer()" class="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition cursor-pointer" title="Wishlist">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span id="wishlist-badge" class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center hidden">0</span>
          </button>

          <!-- Cart Button -->
          <button onclick="toggleCartDrawer()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition cursor-pointer shadow-xs" style="background-color: var(--primary);" title="Shopping Cart">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span id="header-cart-count" class="bg-white/25 px-1.5 py-0.2 rounded-full text-[11px]">0</span>
            <span id="header-cart-total" class="hidden sm:inline">R0.00</span>
          </button>

          <!-- Mobile Menu Toggle -->
          <button onclick="toggleMobileMenu()" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

      </div>
    </div>
  </header>

  <!-- Mobile Navigation Drawer -->
  <div id="mobile-menu-drawer" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex justify-end">
    <div class="w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
      <div class="space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full text-white flex items-center justify-center" style="background-color: var(--primary);">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
            </div>
            <span class="font-extrabold text-base text-slate-900 dark:text-white">${escapeHtml(storeName)}</span>
          </div>
          <button onclick="toggleMobileMenu()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="relative">
          <input type="text" placeholder="Search products..." class="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none dark:text-white" onkeydown="if(event.key==='Enter'){ window.location.href='shop.html?search=' + encodeURIComponent(this.value); }" />
        </div>

        <nav class="space-y-1 text-sm font-bold">
          <a href="index.html" class="block px-3 py-2 rounded-xl ${activeNav === 'home' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">Home</a>
          <a href="shop.html" class="block px-3 py-2 rounded-xl ${activeNav === 'shop' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">Shop Catalog</a>
          <a href="categories.html" class="block px-3 py-2 rounded-xl ${activeNav === 'categories' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">All Categories</a>
          <a href="cart.html" class="block px-3 py-2 rounded-xl ${activeNav === 'cart' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">Shopping Cart</a>
          <a href="order-tracking.html" class="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Track Order</a>
          <a href="about.html" class="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">About Us</a>
          <a href="contact.html" class="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Contact Support</a>
          <a href="faq.html" class="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Help & FAQs</a>
        </nav>
      </div>

      <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <div class="flex items-center justify-between py-2">
          <span>Dark Mode</span>
          <button onclick="toggleTheme()" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold">Toggle</button>
        </div>
        <p class="text-[11px] text-slate-400 mt-2">© ${new Date().getFullYear()} ${escapeHtml(storeName)} ZA</p>
      </div>
    </div>
  </div>

  <!-- ==================== MAIN PAGE CONTENT ==================== -->
  <main class="flex-1">
    ${content}
  </main>

  <!-- ==================== EXACT STOREFRONT FOOTER ==================== -->
  <footer role="contentinfo" class="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 mt-auto border-t border-slate-200/90 dark:border-slate-800 relative overflow-hidden">
    <!-- Dynamic Theme Accent Top Glow Bar -->
    <div class="h-1 w-full" style="background-color: var(--primary);"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
      <!-- Top Features / Customer Perks Horizontal Carousel -->
      <div class="pb-10 mb-10 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <div class="flex items-center gap-4 min-w-[900px] lg:min-w-0 lg:grid lg:grid-cols-6">
          <!-- 1. Free Express Shipping -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">Free Express Shipping</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">On all orders over R1,000</p>
            </div>
          </div>

          <!-- 2. Secure Checkout -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">100% Secure Checkout</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">PayFast, Ozow & Visa</p>
            </div>
          </div>

          <!-- 3. Easy Returns -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">30-Day Easy Returns</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Hassle-free online refunds</p>
            </div>
          </div>

          <!-- 4. Dedicated Support -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">Dedicated Support</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">WhatsApp & Phone help</p>
            </div>
          </div>

          <!-- 5. Authentic Certified Goods -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">Authentic Goods</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">100% verified suppliers</p>
            </div>
          </div>

          <!-- 6. Eco Packaging -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background-color: var(--primary-light); color: var(--primary);">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 dark:text-white">Eco Packaging</h5>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Sustainable materials</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Links Grid & Brand Card -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-8">
        <!-- Brand Card -->
        <div class="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-md" style="background-color: var(--primary);">
                ${escapeHtml(storeName.charAt(0))}
              </div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">${escapeHtml(storeName)}</h3>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Your trusted South African marketplace for retail and wholesale products, verified suppliers, and seamless shopping across the country.
            </p>
          </div>
          <div class="pt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-800">
            <svg class="w-3.5 h-3.5" style="color: var(--primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span>Operated by Mr Cheap General Dealer ZA</span>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs">
          <nav aria-label="Footer Navigation" class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <!-- Shopping -->
            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line></svg>
                <span>Shopping</span>
              </div>
              <ul class="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="index.html" class="hover:text-slate-900 dark:hover:text-white transition">Home</a></li>
                <li><a href="shop.html" class="hover:text-slate-900 dark:hover:text-white transition">Shop</a></li>
                <li><a href="categories.html" class="hover:text-slate-900 dark:hover:text-white transition">Categories</a></li>
                <li><a href="shop.html?filter=featured" class="hover:text-slate-900 dark:hover:text-white transition">Featured Deals</a></li>
                <li><a href="shop.html?sort=price-asc" class="hover:text-slate-900 dark:hover:text-white transition">Wholesale & Bulk</a></li>
              </ul>
            </div>

            <!-- User -->
            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>User</span>
              </div>
              <ul class="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="order-tracking.html" class="hover:text-slate-900 dark:hover:text-white transition">Track Order</a></li>
                <li><a href="cart.html" class="hover:text-slate-900 dark:hover:text-white transition">Shopping Cart</a></li>
                <li><a href="javascript:void(0)" onclick="toggleWishlistDrawer()" class="hover:text-slate-900 dark:hover:text-white transition">Wishlist</a></li>
                <li><a href="contact.html?intent=seller" class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Seller Hub</a></li>
              </ul>
            </div>

            <!-- Company -->
            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path></svg>
                <span>Company</span>
              </div>
              <ul class="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="about.html" class="hover:text-slate-900 dark:hover:text-white transition">About Us</a></li>
                <li><a href="contact.html" class="hover:text-slate-900 dark:hover:text-white transition">Contact Us</a></li>
                <li><a href="faq.html" class="hover:text-slate-900 dark:hover:text-white transition">Help & FAQs</a></li>
                <li><a href="contact.html?intent=seller" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Sell on Mrbulk</a></li>
              </ul>
            </div>

            <!-- Policies -->
            <div class="space-y-3">
              <div class="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Policies</span>
              </div>
              <ul class="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="privacy-policy.html" class="hover:text-slate-900 dark:hover:text-white transition">Privacy Policy (POPIA)</a></li>
                <li><a href="terms-and-conditions.html" class="hover:text-slate-900 dark:hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="faq.html#returns" class="hover:text-slate-900 dark:hover:text-white transition">Returns & Refunds</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <!-- Newsletter Subscription Row -->
      <div class="pb-10 border-b border-slate-200/90 dark:border-slate-800">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xs w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
          <div class="space-y-1.5 max-w-xl">
            <div class="flex items-center gap-2 text-slate-900 dark:text-white">
              <svg class="w-4 h-4" style="color: var(--primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <h4 class="text-xs sm:text-sm font-black uppercase tracking-wider">Join Store Newsletter</h4>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Subscribe for exclusive wholesale discounts, new product arrivals, and member flash coupons.
            </p>
          </div>

          <form onsubmit="handleNewsletterSubmit(event)" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:min-w-[420px] shrink-0">
            <input type="email" id="newsletter-email-input" placeholder="Enter your email address" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full placeholder:text-slate-400 font-medium" required />
            <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer" style="background-color: var(--primary);">
              <span>Subscribe</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="22" y1="12" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col space-y-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800 text-xs">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-slate-500 dark:text-slate-400 font-semibold">Store Region:</span>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
              <span>🇿🇦</span>
              <span>South Africa (ZAR R)</span>
            </div>
          </div>

          <button type="button" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700">
            <span>Top</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
          </button>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div>
            © ${new Date().getFullYear()} <strong class="text-slate-900 dark:text-white font-bold">${escapeHtml(storeName)}</strong>. All rights reserved.
          </div>
          <div class="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
            ${['Visa', 'Mastercard', 'Instant EFT', 'PayFast'].map((pay) => `
              <span class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 shadow-2xs">${pay}</span>
            `).join('')}
          </div>
        </div>
      </div>

    </div>
  </footer>

  <!-- ==================== SLIDE-OVER CART DRAWER ==================== -->
  <div id="cart-drawer-overlay" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden transition-opacity duration-200" onclick="toggleCartDrawer()"></div>
  <aside id="cart-drawer" class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transform translate-x-full transition-transform duration-300 ease-in-out">
    <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" style="color: var(--primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <h3 class="font-black text-slate-900 dark:text-white text-base">Your Cart</h3>
        <span id="drawer-cart-badge" class="px-2 py-0.5 rounded-full text-[11px] font-extrabold text-white" style="background-color: var(--primary);">0</span>
      </div>
      <button onclick="toggleCartDrawer()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Free Delivery Progress Bar (Threshold R1,000) -->
    <div class="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between text-xs font-bold mb-1.5">
        <span id="free-shipping-label" class="text-slate-600 dark:text-slate-300">Add R1,000.00 for FREE delivery</span>
        <span id="free-shipping-percent" class="text-slate-900 dark:text-white">0%</span>
      </div>
      <div class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div id="free-shipping-bar" class="h-full transition-all duration-500 rounded-full" style="width: 0%; background-color: var(--primary);"></div>
      </div>
    </div>

    <!-- Line Items List -->
    <div id="cart-drawer-items" class="flex-1 overflow-y-auto p-5 space-y-4">
      <!-- Injected via JavaScript -->
    </div>

    <!-- Footer Summary & Checkout -->
    <div class="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Estimated Delivery:</span>
        <span class="font-bold text-slate-900 dark:text-white">Standard Courier (SA)</span>
      </div>
      <div class="flex items-center justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
        <span>Total:</span>
        <span id="drawer-cart-total" style="color: var(--primary);">R0.00</span>
      </div>
      <div class="grid grid-cols-2 gap-2 pt-1">
        <a href="cart.html" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          View Cart Page
        </a>
        <a href="checkout.html" class="px-4 py-2.5 rounded-xl text-xs font-bold text-center text-white shadow-md transition" style="background-color: var(--primary);">
          Checkout Now
        </a>
      </div>
    </div>
  </aside>

  <!-- ==================== WISHLIST DRAWER ==================== -->
  <div id="wishlist-drawer-overlay" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden" onclick="toggleWishlistDrawer()"></div>
  <aside id="wishlist-drawer" class="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transform translate-x-full transition-transform duration-300 ease-in-out">
    <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <h3 class="font-black text-slate-900 dark:text-white text-base">Your Wishlist</h3>
      </div>
      <button onclick="toggleWishlistDrawer()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
    <div id="wishlist-drawer-items" class="flex-1 overflow-y-auto p-5 space-y-4">
      <!-- Injected via JavaScript -->
    </div>
  </aside>

  <!-- ==================== QUICK VIEW MODAL ==================== -->
  <div id="quick-view-modal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 relative shadow-2xl animate-in fade-in zoom-in-95">
      <button onclick="closeQuickView()" class="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div id="quick-view-content" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <!-- Injected via JavaScript -->
      </div>
    </div>
  </div>

  <!-- ==================== TOAST NOTIFICATION CONTAINER ==================== -->
  <div id="toast-container" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- Embedded Product Catalog Data for Client Scripting -->
  <script>
    const CATALOG_PRODUCTS = ${serializedProductsJson};
  </script>

  <!-- Shared Universal Client-Side Engine -->
  <script>
    // State initialization
    let cart = [];
    let wishlist = [];

    try {
      cart = JSON.parse(localStorage.getItem('mrbulk_cart') || '[]');
      wishlist = JSON.parse(localStorage.getItem('mrbulk_wishlist') || '[]');
    } catch (e) {
      cart = [];
      wishlist = [];
    }

    // Theme logic
    function initTheme() {
      const savedTheme = localStorage.getItem('mrbulk_theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('mrbulk_theme', isDark ? 'dark' : 'light');
    }

    // Toast alerts
    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'pointer-events-auto px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl text-xs font-bold flex items-center gap-2.5 transition-all duration-300 transform translate-y-4 opacity-0';
      toast.innerHTML = \`
        <span class="w-2 h-2 rounded-full" style="background-color: var(--primary);"></span>
        <span>\${message}</span>
      \`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
      }, 10);
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    // Cart Management
    function saveCart() {
      localStorage.setItem('mrbulk_cart', JSON.stringify(cart));
      updateCartUI();
    }

    function addToCart(productId, quantity = 1) {
      const product = CATALOG_PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      const existing = cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      saveCart();
      showToast(\`Added \${product.name} to cart!\`);
      toggleCartDrawer(true);
    }

    function updateCartQuantity(productId, delta) {
      const item = cart.find(i => i.id === productId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      saveCart();
    }

    function removeFromCart(productId) {
      cart = cart.filter(i => i.id !== productId);
      saveCart();
      showToast('Item removed from cart');
    }

    function updateCartUI() {
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);

      // Header elements
      const headerCount = document.getElementById('header-cart-count');
      const headerTotal = document.getElementById('header-cart-total');
      const drawerBadge = document.getElementById('drawer-cart-badge');
      const drawerTotal = document.getElementById('drawer-cart-total');

      if (headerCount) headerCount.textContent = totalCount;
      if (headerTotal) headerTotal.textContent = \`R\${subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;
      if (drawerBadge) drawerBadge.textContent = totalCount;
      if (drawerTotal) drawerTotal.textContent = \`R\${subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`;

      // Free shipping calculation (threshold R1,000)
      const freeThreshold = 1000;
      const freeBar = document.getElementById('free-shipping-bar');
      const freeLabel = document.getElementById('free-shipping-label');
      const freePercent = document.getElementById('free-shipping-percent');

      if (freeBar && freeLabel && freePercent) {
        if (subtotal >= freeThreshold) {
          freeBar.style.width = '100%';
          freeLabel.textContent = '🎉 You qualify for FREE Nationwide Courier!';
          freePercent.textContent = '100%';
        } else {
          const remaining = freeThreshold - subtotal;
          const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
          freeBar.style.width = \`\${pct}%\`;
          freeLabel.textContent = \`Add R\${remaining.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for FREE delivery\`;
          freePercent.textContent = \`\${pct}%\`;
        }
      }

      // Render Drawer items
      const drawerItems = document.getElementById('cart-drawer-items');
      if (drawerItems) {
        if (cart.length === 0) {
          drawerItems.innerHTML = \`
            <div class="text-center py-12 space-y-3">
              <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h4 class="font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h4>
              <p class="text-xs text-slate-500">Discover wholesale and retail bargains across South Africa!</p>
              <a href="shop.html" class="inline-block mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs" style="background-color: var(--primary);">Start Shopping</a>
            </div>
          \`;
        } else {
          drawerItems.innerHTML = cart.map(item => \`
            <div class="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <img src="\${item.imageUrl}" alt="\${item.name}" class="w-14 h-14 object-cover rounded-xl shrink-0" />
              <div class="flex-1 min-w-0">
                <h5 class="text-xs font-bold text-slate-900 dark:text-white truncate">\${item.name}</h5>
                <p class="text-xs font-black" style="color: var(--primary);">\${item.price}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button onclick="updateCartQuantity('\${item.id}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">-</button>
                    <span class="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-200">\${item.quantity}</span>
                    <button onclick="updateCartQuantity('\${item.id}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white">+</button>
                  </div>
                  <button onclick="removeFromCart('\${item.id}')" class="text-[11px] text-rose-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          \`).join('');
        }
      }

      // If on cart.html, trigger its specific render function
      if (typeof renderCartPageContent === 'function') {
        renderCartPageContent();
      }
    }

    // Wishlist Management
    function toggleWishlist(productId) {
      const index = wishlist.indexOf(productId);
      if (index === -1) {
        wishlist.push(productId);
        showToast('Added to Wishlist!');
      } else {
        wishlist.splice(index, 1);
        showToast('Removed from Wishlist');
      }
      localStorage.setItem('mrbulk_wishlist', JSON.stringify(wishlist));
      updateWishlistUI();
    }

    function updateWishlistUI() {
      const badge = document.getElementById('wishlist-badge');
      if (badge) {
        if (wishlist.length > 0) {
          badge.textContent = wishlist.length;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
      // Update heart icons across cards
      document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
        const id = btn.getAttribute('data-wishlist-id');
        if (wishlist.includes(id)) {
          btn.classList.add('text-rose-500', 'fill-rose-500');
        } else {
          btn.classList.remove('text-rose-500', 'fill-rose-500');
        }
      });
    }

    // Drawer Toggles
    function toggleCartDrawer(forceOpen = false) {
      const drawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('cart-drawer-overlay');
      if (!drawer || !overlay) return;

      const isOpen = !drawer.classList.contains('translate-x-full');
      if (forceOpen || !isOpen) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
      } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
      }
    }

    function toggleWishlistDrawer() {
      const drawer = document.getElementById('wishlist-drawer');
      const overlay = document.getElementById('wishlist-drawer-overlay');
      if (!drawer || !overlay) return;
      const isOpen = !drawer.classList.contains('translate-x-full');
      if (!isOpen) {
        // Render items
        const container = document.getElementById('wishlist-drawer-items');
        const items = CATALOG_PRODUCTS.filter(p => wishlist.includes(p.id));
        if (items.length === 0) {
          container.innerHTML = '<div class="text-center py-12 text-slate-500 text-xs">Your wishlist is currently empty.</div>';
        } else {
          container.innerHTML = items.map(item => \`
            <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
              <img src="\${item.imageUrl}" class="w-14 h-14 object-cover rounded-xl" />
              <div class="flex-1 min-w-0">
                <h5 class="text-xs font-bold truncate">\${item.name}</h5>
                <p class="text-xs font-black" style="color: var(--primary);">\${item.price}</p>
                <div class="flex gap-2 mt-1">
                  <button onclick="addToCart('\${item.id}'); toggleWishlist('\${item.id}');" class="text-[11px] font-bold text-blue-600 hover:underline">Add to Cart</button>
                  <button onclick="toggleWishlist('\${item.id}'); toggleWishlistDrawer();" class="text-[11px] text-rose-500 hover:underline">Remove</button>
                </div>
              </div>
            </div>
          \`).join('');
        }
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
      } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
      }
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu-drawer');
      if (menu) menu.classList.toggle('hidden');
    }

    // Quick View
    function openQuickView(productId) {
      const product = CATALOG_PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      const content = document.getElementById('quick-view-content');
      const modal = document.getElementById('quick-view-modal');
      if (!content || !modal) return;

      content.innerHTML = \`
        <div class="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
          <img src="\${product.imageUrl}" alt="\${product.name}" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-4">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">\${product.category}</span>
            <h3 class="text-lg font-black text-slate-900 dark:text-white mt-1">\${product.name}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Verified Merchant: <strong class="text-slate-700 dark:text-slate-300">\${product.sellerName}</strong></p>
          </div>
          <div class="flex items-baseline gap-3">
            <span class="text-2xl font-black text-slate-900 dark:text-white">\${product.price}</span>
            \${product.originalPrice ? \`<span class="text-sm text-slate-400 line-through">\${product.originalPrice}</span>\` : ''}
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">\${product.description}</p>
          <div class="pt-2 flex gap-3">
            <button onclick="addToCart('\${product.id}'); closeQuickView();" class="flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer" style="background-color: var(--primary);">
              Add to Shopping Cart
            </button>
            <button onclick="toggleWishlist('\${product.id}')" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      \`;
      modal.classList.remove('hidden');
    }

    function closeQuickView() {
      const modal = document.getElementById('quick-view-modal');
      if (modal) modal.classList.add('hidden');
    }

    function handleNewsletterSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('newsletter-email-input');
      if (input && input.value) {
        showToast('Thank you for subscribing to Mrbulk discounts!');
        input.value = '';
      }
    }

    // Startup
    initTheme();
    updateCartUI();
    updateWishlistUI();
  </script>
</body>
</html>`;
}
