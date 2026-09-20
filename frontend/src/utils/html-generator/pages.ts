import { GenerateTemplateOptions, SerializedProduct, THEME_HEX_MAP, escapeHtml } from './types';
import { DEFAULT_SLIDES } from '@/data/presets';

export function renderHomeContent(options: GenerateTemplateOptions, products: SerializedProduct[], categories: any[]): string {
  const storeName = options.storeName || 'Mrbulk';
  const themeColor = options.themeColor || 'blue';
  const colors = THEME_HEX_MAP[themeColor] || THEME_HEX_MAP.blue;
  const slides = options.slides && options.slides.length > 0 ? options.slides : DEFAULT_SLIDES;

  return `
  <div class="space-y-12 sm:space-y-16 pb-16">
    
    <!-- Category Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div class="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        <a href="shop.html" class="px-4 py-2 rounded-full text-xs font-bold shrink-0 text-white shadow-xs" style="background-color: var(--primary);">
          All Products
        </a>
        ${categories.map(c => `
          <a href="shop.html?category=${encodeURIComponent(c.name)}" class="px-4 py-2 rounded-full text-xs font-bold shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition">
            ${escapeHtml(c.name)}
          </a>
        `).join('')}
      </div>
    </div>

    <!-- Hero Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[440px] flex items-center bg-slate-900 text-white">
        <img src="${slides[0]?.backgroundImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1920&auto=format&fit=crop'}" alt="Hero" class="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div class="relative z-10 p-6 sm:p-12 lg:p-16 max-w-2xl space-y-4 sm:space-y-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
            <span>🇿🇦</span>
            <span>South Africa's Wholesale & Retail Marketplace</span>
          </div>
          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            ${escapeHtml(slides[0]?.title || 'Bulk Discounts & Verified Suppliers')}
          </h1>
          <p class="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
            ${escapeHtml(slides[0]?.subtitle || 'Source authentic merchandise directly from Johannesburg distributors. Fast nationwide delivery with 100% buyer protection.')}
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a href="shop.html" class="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200" style="background-color: var(--primary);">
              ${escapeHtml(slides[0]?.buttonText || 'Explore Catalog')}
            </a>
            <a href="categories.html" class="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition">
              Browse Categories
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore Categories Circular Showcase -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Explore Categories</h2>
        <a href="categories.html" class="text-xs sm:text-sm font-bold text-blue-600 hover:underline">View All →</a>
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
        ${categories.slice(0, 6).map(cat => `
          <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="flex flex-col items-center text-center group cursor-pointer">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-all duration-300 shadow-sm group-hover:scale-105">
              <img src="${cat.imageUrl}" alt="${escapeHtml(cat.name)}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition mt-2.5 truncate max-w-full">
              ${escapeHtml(cat.name)}
            </span>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Bento Promo Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div class="space-y-2 relative z-10">
            <span class="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Wholesale Hub</span>
            <h3 class="text-xl sm:text-2xl font-black">Bulk Tier Discounts</h3>
            <p class="text-xs text-blue-100">Save up to 40% when purchasing pack quantities for your retail store.</p>
          </div>
          <a href="shop.html?sort=price-asc" class="mt-6 inline-block w-fit px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold text-xs shadow-sm hover:bg-blue-50 transition">Shop Bulk Deals</a>
        </div>

        <div class="bg-gradient-to-br from-amber-500 to-rose-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div class="space-y-2 relative z-10">
            <span class="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Weekly Special</span>
            <h3 class="text-xl sm:text-2xl font-black">Flash Clearance</h3>
            <p class="text-xs text-amber-100">Limited quantity verified supplier clearances updated every Monday.</p>
          </div>
          <a href="shop.html?filter=sale" class="mt-6 inline-block w-fit px-4 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-sm hover:bg-rose-50 transition">Explore Clearance</a>
        </div>

        <div class="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div class="space-y-2 relative z-10">
            <span class="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full">Courier Guy Partner</span>
            <h3 class="text-xl sm:text-2xl font-black">Fast SA Delivery</h3>
            <p class="text-xs text-emerald-100">Same-day dispatch from Johannesburg hub for all orders before 12:00.</p>
          </div>
          <a href="order-tracking.html" class="mt-6 inline-block w-fit px-4 py-2 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-sm hover:bg-emerald-50 transition">Track Logistics</a>
        </div>
      </div>
    </section>

    <!-- Flash Deals Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Flash Deals</h2>
          <span class="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-black animate-pulse">ENDS TODAY</span>
        </div>
        <a href="shop.html?filter=sale" class="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition">View All Deals →</a>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        ${products.slice(0, 4).map(p => `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div class="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
              <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ${p.isSale ? `<span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">${p.saleBadgeText || 'SALE'}</span>` : ''}
              <button onclick="toggleWishlist('${p.id}')" data-wishlist-id="${p.id}" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-400 hover:text-rose-500 transition shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            <div class="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-extrabold uppercase text-slate-400">${escapeHtml(p.category)}</span>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">${escapeHtml(p.name)}</h4>
              </div>
              <div class="pt-2">
                <div class="flex items-baseline gap-2">
                  <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white">${p.price}</span>
                  ${p.originalPrice ? `<span class="text-xs text-slate-400 line-through">${p.originalPrice}</span>` : ''}
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                  <button onclick="openQuickView('${p.id}')" class="py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">Quick View</button>
                  <button onclick="addToCart('${p.id}')" class="py-2 rounded-xl text-xs font-bold text-white shadow-xs transition" style="background-color: var(--primary);">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Bestsellers Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Top Rated Products</h2>
        <a href="shop.html" class="text-xs sm:text-sm font-bold text-blue-600 hover:underline">Full Catalog →</a>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        ${products.slice(4, 12).map(p => `
          <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
            <div class="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
              <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <button onclick="toggleWishlist('${p.id}')" data-wishlist-id="${p.id}" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-400 hover:text-rose-500 transition shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            <div class="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-extrabold uppercase text-slate-400">${escapeHtml(p.category)}</span>
                <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">${escapeHtml(p.name)}</h4>
                <p class="text-[11px] text-amber-500 font-bold mt-1">★ ${p.rating} (${p.reviewsCount})</p>
              </div>
              <div class="pt-2">
                <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white">${p.price}</span>
                <div class="grid grid-cols-2 gap-2 mt-3">
                  <button onclick="openQuickView('${p.id}')" class="py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">Quick View</button>
                  <button onclick="addToCart('${p.id}')" class="py-2 rounded-xl text-xs font-bold text-white shadow-xs transition" style="background-color: var(--primary);">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
        <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Trusted Across South Africa</h2>
          <p class="text-xs sm:text-sm text-slate-500">Over 50,000 satisfied shoppers and independent shop owners rely on ${escapeHtml(storeName)}.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
            <div class="text-amber-400 font-bold text-sm">★★★★★</div>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">"The wholesale pricing allows my convenience shop in Soweto to stay competitive. Fast courier right to our door."</p>
            <div class="text-xs font-bold text-slate-900 dark:text-white">— Sipho Ndlovu, Soweto</div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
            <div class="text-amber-400 font-bold text-sm">★★★★★</div>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">"Super clean checkout with Ozow Instant EFT. Placed the order on Tuesday, arrived in Cape Town on Thursday."</p>
            <div class="text-xs font-bold text-slate-900 dark:text-white">— Candice Van Der Merwe, Cape Town</div>
          </div>
          <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
            <div class="text-amber-400 font-bold text-sm">★★★★★</div>
            <p class="text-xs text-slate-600 dark:text-slate-300 italic">"Authentic products with real local warranties. Customer support on WhatsApp answered within 5 minutes."</p>
            <div class="text-xs font-bold text-slate-900 dark:text-white">— David Naidoo, Durban</div>
          </div>
        </div>
      </div>
    </section>

  </div>
  `;
}

export function renderShopContent(options: GenerateTemplateOptions, products: SerializedProduct[], categories: any[]): string {
  return `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <a href="index.html" class="hover:text-blue-600">Home</a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-bold">Shop Catalog</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">All Products</h1>
      </div>
      <div class="flex items-center gap-3">
        <label class="text-xs font-bold text-slate-500">Sort by:</label>
        <select id="sort-select" onchange="filterProducts()" class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none">
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      <button onclick="setCategoryFilter('all')" data-cat-pill="all" class="px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer" style="background-color: var(--primary);">
        All Items (${products.length})
      </button>
      ${categories.map(cat => `
        <button onclick="setCategoryFilter('${escapeHtml(cat.name)}')" data-cat-pill="${escapeHtml(cat.name)}" class="px-4 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer">
          ${escapeHtml(cat.name)}
        </button>
      `).join('')}
    </div>

    <!-- Product Grid -->
    <div id="shop-product-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      ${products.map(p => `
        <div data-product-category="${escapeHtml(p.category)}" data-product-price="${p.priceNum}" data-product-rating="${p.rating}" class="shop-item bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden p-3 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group">
          <div class="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
            <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ${p.isSale ? `<span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">${p.saleBadgeText || 'SALE'}</span>` : ''}
            <button onclick="toggleWishlist('${p.id}')" data-wishlist-id="${p.id}" class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 flex items-center justify-center text-slate-400 hover:text-rose-500 transition shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
          <div class="pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-extrabold uppercase text-slate-400">${escapeHtml(p.category)}</span>
              <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">${escapeHtml(p.name)}</h4>
              <p class="text-[11px] text-amber-500 font-bold mt-1">★ ${p.rating} (${p.reviewsCount})</p>
            </div>
            <div class="pt-2">
              <div class="flex items-baseline gap-2">
                <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white">${p.price}</span>
                ${p.originalPrice ? `<span class="text-xs text-slate-400 line-through">${p.originalPrice}</span>` : ''}
              </div>
              <div class="grid grid-cols-2 gap-2 mt-3">
                <button onclick="openQuickView('${p.id}')" class="py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">Quick View</button>
                <button onclick="addToCart('${p.id}')" class="py-2 rounded-xl text-xs font-bold text-white shadow-xs transition" style="background-color: var(--primary);">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <script>
    let activeCategory = 'all';

    function setCategoryFilter(cat) {
      activeCategory = cat;
      document.querySelectorAll('[data-cat-pill]').forEach(btn => {
        if (btn.getAttribute('data-cat-pill') === cat) {
          btn.style.backgroundColor = 'var(--primary)';
          btn.classList.add('text-white');
          btn.classList.remove('bg-slate-100', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
        } else {
          btn.style.backgroundColor = '';
          btn.classList.remove('text-white');
          btn.classList.add('bg-slate-100', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-300');
        }
      });
      filterProducts();
    }

    function filterProducts() {
      const sort = document.getElementById('sort-select').value;
      const items = Array.from(document.querySelectorAll('.shop-item'));

      items.forEach(item => {
        const cat = item.getAttribute('data-product-category');
        if (activeCategory === 'all' || cat === activeCategory) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      // Sort
      const grid = document.getElementById('shop-product-grid');
      const visible = items.filter(i => !i.classList.contains('hidden'));
      visible.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-product-price') || '0');
        const priceB = parseFloat(b.getAttribute('data-product-price') || '0');
        const ratingA = parseFloat(a.getAttribute('data-product-rating') || '0');
        const ratingB = parseFloat(b.getAttribute('data-product-rating') || '0');

        if (sort === 'price-asc') return priceA - priceB;
        if (sort === 'price-desc') return priceB - priceA;
        if (sort === 'rating') return ratingB - ratingA;
        return 0;
      });

      visible.forEach(node => grid.appendChild(node));
    }

    // Parse URL params on load
    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      if (catParam) {
        setCategoryFilter(catParam);
      }
    });
  </script>
  `;
}

export function renderCategoriesContent(options: GenerateTemplateOptions, products: SerializedProduct[], categories: any[]): string {
  return `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Store Categories</h1>
      <p class="text-xs sm:text-sm text-slate-500">Explore authentic wholesale & retail products sourced across verified South African suppliers.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${categories.map(cat => {
        const count = products.filter(p => p.category === cat.name).length || 8;
        return `
          <a href="shop.html?category=${encodeURIComponent(cat.name)}" class="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div class="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video relative">
              <img src="${cat.imageUrl}" alt="${escapeHtml(cat.name)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">${count} Products</span>
            </div>
            <div class="pt-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition">${escapeHtml(cat.name)}</h3>
                <p class="text-xs text-slate-500 mt-0.5">Direct manufacturer warranty</p>
              </div>
              <span class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition">→</span>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  </div>
  `;
}

export function renderAboutContent(options: GenerateTemplateOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <div class="text-center max-w-3xl mx-auto space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <span>🇿🇦</span>
        <span>Proudly South African</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
        Connecting South Africa to Direct Bulk Pricing
      </h1>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
        ${escapeHtml(storeName)}, operated by Mr Cheap General Dealer ZA, was founded in Crown North, Johannesburg to bridge local manufacturers with independent businesses and smart consumers across South Africa.
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div class="text-2xl sm:text-3xl font-black text-blue-600">50,000+</div>
        <div class="text-xs font-bold text-slate-500 mt-1">Happy Customers</div>
      </div>
      <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div class="text-2xl sm:text-3xl font-black text-blue-600">1,200+</div>
        <div class="text-xs font-bold text-slate-500 mt-1">Verified Suppliers</div>
      </div>
      <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div class="text-2xl sm:text-3xl font-black text-blue-600">R150M+</div>
        <div class="text-xs font-bold text-slate-500 mt-1">Marketplace GMV</div>
      </div>
      <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div class="text-2xl sm:text-3xl font-black text-blue-600">99.4%</div>
        <div class="text-xs font-bold text-slate-500 mt-1">On-Time Delivery</div>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Our Core Commitments</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🇿🇦</span> Local First Sourcing
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We prioritize South African manufacturers, creating sustainable jobs in Gauteng, Western Cape, and KwaZulu-Natal.
          </p>
        </div>
        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Radical Transparency & Escrow
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every seller undergoes strict verification. Payments are held safely until courier confirmation of successful handover.
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function renderContactContent(options: GenerateTemplateOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Contact Our Team</h1>
      <p class="text-xs sm:text-sm text-slate-500">Need help with an order, wholesale pricing, or seller registration? We are here to support you.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">WhatsApp & Helpline</h3>
        <p class="text-base font-black text-slate-900 dark:text-white">+27 82 123 4567</p>
        <p class="text-xs text-slate-500">Mon - Fri, 08:00 - 17:00 SAST</p>
      </div>

      <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Email Concierge</h3>
        <p class="text-base font-black text-slate-900 dark:text-white">support@mrbulk.co.za</p>
        <p class="text-xs text-slate-500">Average response time: 15 mins</p>
      </div>

      <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Fulfillment Hub</h3>
        <p class="text-base font-black text-slate-900 dark:text-white">Crown North, JHB</p>
        <p class="text-xs text-slate-500">150 Industrial Rd, Johannesburg, 2092</p>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto shadow-sm">
      <h2 class="text-lg font-black text-slate-900 dark:text-white mb-6">Send Us a Direct Message</h2>
      <form onsubmit="event.preventDefault(); showToast('Message sent! Our support team will reply via WhatsApp/Email shortly.'); this.reset();" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
            <input type="text" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email or Phone</label>
            <input type="text" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject / Inquiry Type</label>
          <select class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none">
            <option>Order Status / Delivery</option>
            <option>Wholesale & Bulk Inquiries</option>
            <option>Become a Verified Seller</option>
            <option>Returns & Refunds</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
          <textarea rows="4" required class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"></textarea>
        </div>
        <button type="submit" class="w-full py-3 rounded-xl text-xs font-black text-white shadow-md" style="background-color: var(--primary);">
          Submit Inquiry
        </button>
      </form>
    </div>
  </div>
  `;
}

export function renderCartContent(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <div class="pb-4 border-b border-slate-200 dark:border-slate-800">
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>
      <p class="text-xs text-slate-500 mt-1">Review your items before proceeding to secure South African checkout.</p>
    </div>

    <div id="cart-page-content" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Injected via client script -->
    </div>
  </div>

  <script>
    function renderCartPageContent() {
      const container = document.getElementById('cart-page-content');
      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = \`
          <div class="col-span-12 text-center py-16 space-y-4">
            <div class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200">Your shopping cart is currently empty</h2>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">Explore our wide selection of retail goods and wholesale supplies with nationwide express delivery.</p>
            <a href="shop.html" class="inline-block mt-4 px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md" style="background-color: var(--primary);">Browse Shop</a>
          </div>
        \`;
        return;
      }

      const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
      const shipping = subtotal >= 1000 ? 0 : 95;
      const total = subtotal + shipping;

      container.innerHTML = \`
        <div class="lg:col-span-8 space-y-4">
          \${cart.map(item => \`
            <div class="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <img src="\${item.imageUrl}" class="w-20 h-20 object-cover rounded-2xl shrink-0" />
              <div class="flex-1 min-w-0">
                <span class="text-[10px] font-extrabold uppercase text-slate-400">\${item.category}</span>
                <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">\${item.name}</h4>
                <p class="text-xs font-black mt-1" style="color: var(--primary);">\${item.price}</p>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button onclick="updateCartQuantity('\${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">-</button>
                    <span class="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">\${item.quantity}</span>
                    <button onclick="updateCartQuantity('\${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold">+</button>
                  </div>
                  <button onclick="removeFromCart('\${item.id}')" class="text-xs text-rose-500 hover:underline">Remove</button>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="text-sm font-black text-slate-900 dark:text-white">
                  R\${(item.priceNum * item.quantity).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          \`).join('')}
        </div>

        <div class="lg:col-span-4">
          <div class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 class="font-black text-base text-slate-900 dark:text-white">Order Summary</h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span class="font-bold text-slate-900 dark:text-white">R\${subtotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Nationwide Shipping</span>
                <span class="font-bold \${shipping === 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}">\${shipping === 0 ? 'FREE' : 'R95.00'}</span>
              </div>
              <div class="flex justify-between text-slate-600 dark:text-slate-400">
                <span>VAT (15% included)</span>
                <span class="font-bold text-slate-900 dark:text-white">R\${(total * 0.15 / 1.15).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div class="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Estimated Total</span>
                <span style="color: var(--primary);">R\${total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
            <a href="checkout.html" class="block w-full py-3.5 rounded-2xl text-xs font-black text-center text-white shadow-lg transition" style="background-color: var(--primary);">
              Proceed to Checkout
            </a>
            <p class="text-[11px] text-center text-slate-400">Encrypted 256-bit SSL South African Gateway</p>
          </div>
        </div>
      \`;
    }

    window.addEventListener('DOMContentLoaded', renderCartPageContent);
  </script>
  `;
}

export function renderCheckoutContent(): string {
  return `
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="pb-4 border-b border-slate-200 dark:border-slate-800">
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Secure Checkout</h1>
      <p class="text-xs text-slate-500 mt-1">Official South African Gateway (PayFast, Ozow Instant EFT, Cash on Delivery)</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Checkout Form -->
      <div class="lg:col-span-7 space-y-6">
        <form onsubmit="handlePlaceOrder(event)" class="space-y-6">
          <!-- Step 1: Customer Details -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 class="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style="background-color: var(--primary);">1</span>
              <span>Delivery Details</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">First & Last Name</label>
                <input type="text" required placeholder="e.g. Sibusiso Mthembu" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (SA)</label>
                <input type="tel" required placeholder="082 123 4567" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
              <input type="text" required placeholder="123 Nelson Mandela Blvd" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City / Suburb</label>
                <input type="text" required placeholder="Sandton" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Province</label>
                <select class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none font-bold">
                  <option>Gauteng</option>
                  <option>Western Cape</option>
                  <option>KwaZulu-Natal</option>
                  <option>Eastern Cape</option>
                  <option>Free State</option>
                  <option>Mpumalanga</option>
                  <option>Limpopo</option>
                  <option>North West</option>
                  <option>Northern Cape</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                <input type="text" required placeholder="2196" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Step 2: Payment Method -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 class="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold" style="background-color: var(--primary);">2</span>
              <span>Payment Option</span>
            </h3>
            <div class="space-y-2 text-xs">
              <label class="flex items-center gap-3 p-3.5 rounded-2xl border border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 cursor-pointer">
                <input type="radio" name="payment" checked class="text-blue-600" />
                <div class="flex-1">
                  <span class="font-bold text-slate-900 dark:text-white">PayFast / Credit & Debit Card</span>
                  <p class="text-[11px] text-slate-500">Visa, Mastercard, Maestro via 3D-Secure</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input type="radio" name="payment" class="text-blue-600" />
                <div class="flex-1">
                  <span class="font-bold text-slate-900 dark:text-white">Ozow Instant EFT</span>
                  <p class="text-[11px] text-slate-500">Capitec, FNB, ABSA, Standard Bank, Nedbank</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input type="radio" name="payment" class="text-blue-600" />
                <div class="flex-1">
                  <span class="font-bold text-slate-900 dark:text-white">Cash on Delivery (Gauteng only)</span>
                  <p class="text-[11px] text-slate-500">Pay courier driver upon package inspection</p>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" class="w-full py-4 rounded-2xl text-sm font-black text-white shadow-xl transition" style="background-color: var(--primary);">
            Place Order & Pay with ZAR (R)
          </button>
        </form>
      </div>

      <!-- Order Review Sidebar -->
      <div class="lg:col-span-5 space-y-4">
        <div id="checkout-summary" class="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <!-- Populated by script -->
        </div>
      </div>
    </div>
  </div>

  <script>
    function renderCheckoutSummary() {
      const box = document.getElementById('checkout-summary');
      if (!box) return;
      const subtotal = cart.reduce((sum, item) => sum + (item.priceNum * item.quantity), 0);
      const shipping = subtotal >= 1000 ? 0 : 95;
      const total = subtotal + shipping;

      box.innerHTML = \`
        <h3 class="font-black text-base text-slate-900 dark:text-white">Order Review</h3>
        <div class="space-y-3 max-h-60 overflow-y-auto">
          \${cart.map(i => \`
            <div class="flex items-center gap-3">
              <img src="\${i.imageUrl}" class="w-12 h-12 rounded-xl object-cover" />
              <div class="flex-1 min-w-0 text-xs">
                <p class="font-bold truncate text-slate-800 dark:text-slate-200">\${i.name}</p>
                <p class="text-slate-400">Qty: \${i.quantity}</p>
              </div>
              <span class="text-xs font-black">R\${(i.priceNum * i.quantity).toFixed(2)}</span>
            </div>
          \`).join('')}
        </div>
        <div class="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div class="flex justify-between"><span>Subtotal</span><span>R\${subtotal.toFixed(2)}</span></div>
          <div class="flex justify-between"><span>Delivery</span><span>\${shipping === 0 ? 'FREE' : 'R95.00'}</span></div>
          <div class="flex justify-between text-sm font-black pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>Total</span><span style="color: var(--primary);">R\${total.toFixed(2)}</span>
          </div>
        </div>
      \`;
    }

    function handlePlaceOrder(e) {
      e.preventDefault();
      const orderId = 'MRB-ZA-' + Math.floor(100000 + Math.random() * 900000);
      cart = [];
      saveCart();
      alert(\`🎉 Order Placed Successfully!\\n\\nYour Order ID: \${orderId}\\nNationwide dispatch from Johannesburg hub within 24 hours.\\n\\nTracking link will be sent via SMS & Email.\`);
      window.location.href = 'order-tracking.html?order=' + orderId;
    }

    window.addEventListener('DOMContentLoaded', renderCheckoutSummary);
  </script>
  `;
}

export function renderOrderTrackingContent(): string {
  return `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white">Track Your Order</h1>
      <p class="text-xs text-slate-500">Enter your order ID (e.g. MRB-ZA-748291) to view live courier status.</p>
    </div>

    <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="flex gap-2">
        <input type="text" id="track-order-input" placeholder="Enter order ID..." class="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none" />
        <button onclick="simulateTracking()" class="px-6 py-3 rounded-xl text-xs font-bold text-white shadow-xs" style="background-color: var(--primary);">Track</button>
      </div>

      <div id="tracking-result" class="pt-6 space-y-6 hidden">
        <div class="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-blue-900 dark:text-blue-200">Courier:</span> The Courier Guy Express
          </div>
          <div>
            <span class="font-bold text-blue-900 dark:text-blue-200">Estimated Delivery:</span> Tomorrow by 17:00
          </div>
        </div>

        <div class="space-y-4 pl-4 border-l-2 border-blue-500 text-xs">
          <div class="space-y-0.5">
            <span class="font-bold text-emerald-600">✓ Order Confirmed & Paid</span>
            <p class="text-slate-400">Payment captured via PayFast</p>
          </div>
          <div class="space-y-0.5">
            <span class="font-bold text-emerald-600">✓ Packed at Crown North Hub</span>
            <p class="text-slate-400">Johannesburg Fulfillment Depot</p>
          </div>
          <div class="space-y-0.5">
            <span class="font-bold text-blue-600">● In Transit with Courier Guy</span>
            <p class="text-slate-400">Waybill #TCG-ZA-849204</p>
          </div>
          <div class="space-y-0.5 text-slate-400">
            <span>○ Out for Delivery</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function simulateTracking() {
      const input = document.getElementById('track-order-input');
      const res = document.getElementById('tracking-result');
      if (input && input.value.trim()) {
        res.classList.remove('hidden');
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      const params = new URLSearchParams(window.location.search);
      const ord = params.get('order');
      if (ord) {
        const input = document.getElementById('track-order-input');
        if (input) input.value = ord;
        simulateTracking();
      }
    });
  </script>
  `;
}

export function renderFaqContent(): string {
  const faqs = [
    { q: 'How long does nationwide delivery take in South Africa?', a: 'Standard courier takes 2 to 4 business days. Johannesburg and Pretoria orders placed before 12:00 SAST often arrive next business day via The Courier Guy or RAM couriers.' },
    { q: 'How does free delivery work?', a: 'All cart totals of R1,000 or more automatically receive 100% free nationwide express shipping across all 9 provinces.' },
    { q: 'Which payment methods are accepted?', a: 'We accept PayFast (Visa, Mastercard), Ozow Instant EFT (all major SA banks), and Cash on Delivery for qualifying Gauteng addresses.' },
    { q: 'Can I buy products in wholesale / bulk quantities?', a: 'Yes, Mrbulk specializes in wholesale pricing. Browse our catalog or contact our Johannesburg team for custom bulk pallet orders.' },
    { q: 'What is the return policy?', a: 'We offer a 30-day hassle-free return guarantee under the Consumer Protection Act (CPA) for unsealed, defective, or incorrect merchandise.' },
    { q: 'How do I register as a seller on Mrbulk?', a: 'Verified South African manufacturers and merchants can apply via our Seller Hub in the Company menu.' }
  ];

  return `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h1>
      <p class="text-xs text-slate-500">Everything you need to know about shopping, shipping, and selling on Mrbulk.</p>
    </div>

    <div class="space-y-4">
      ${faqs.map(f => `
        <details class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 group">
          <summary class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
            <span>${f.q}</span>
            <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">${f.a}</p>
        </details>
      `).join('')}
    </div>
  </div>
  `;
}

export function renderPrivacyContent(options: GenerateTemplateOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  return `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
    <h1 class="text-2xl font-black text-slate-900 dark:text-white">Privacy Policy (POPIA Compliant)</h1>
    <p>Last updated: ${new Date().getFullYear()}. Operates under the Protection of Personal Information Act (POPIA) of South Africa.</p>
    <h2 class="text-sm font-bold text-slate-900 dark:text-white pt-2">1. Information We Collect</h2>
    <p>${escapeHtml(storeName)} collects personal information necessary to fulfill customer orders and deliver merchandise across South Africa, including full name, delivery address, email, and phone number.</p>
    <h2 class="text-sm font-bold text-slate-900 dark:text-white pt-2">2. Payment Data Security</h2>
    <p>We do not store credit card numbers on our servers. All transactions are securely processed through PayFast and Ozow with 256-bit SSL encryption.</p>
  </div>
  `;
}

export function renderTermsContent(options: GenerateTemplateOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  return `
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
    <h1 class="text-2xl font-black text-slate-900 dark:text-white">Terms & Conditions</h1>
    <p>Compliant with the Consumer Protection Act (CPA) and Electronic Communications and Transactions Act (ECTA) of South Africa.</p>
    <h2 class="text-sm font-bold text-slate-900 dark:text-white pt-2">1. Marketplace Agreement</h2>
    <p>By placing an order on ${escapeHtml(storeName)}, you agree to purchase authentic merchandise from verified distributors operated by Mr Cheap General Dealer ZA.</p>
    <h2 class="text-sm font-bold text-slate-900 dark:text-white pt-2">2. Pricing in South African Rand (ZAR)</h2>
    <p>All prices are listed in South African Rand (R) and include statutory Value-Added Tax (15% VAT) unless otherwise specified for bulk wholesale export.</p>
  </div>
  `;
}

export function renderReadme(options: GenerateTemplateOptions): string {
  const storeName = options.storeName || 'Mrbulk';
  return `================================================================================
${storeName.toUpperCase()} — MULTI-PAGE STANDALONE HTML WEBSITE
Operated by Mr Cheap General Dealer ZA, South Africa
================================================================================

This package contains the complete, multi-page static website for ${storeName}:

INCLUDED PAGES:
1. index.html              - Homepage (Banners, Hero Slider, Flash Deals, Bestsellers, Brands)
2. shop.html               - Catalog (Category Filtering, Search, Sorting, In-Stock Filters)
3. categories.html         - Directory of all retail and wholesale departments
4. about.html              - Company history, Johannesburg Crown North hub, 4 core pillars
5. contact.html            - Direct WhatsApp, Phone, Email, and Interactive Contact Form
6. cart.html               - Dedicated Cart with South African Free Courier Progress Bar
7. checkout.html           - Complete SA Checkout (PayFast, Ozow Instant EFT, Cash on Delivery)
8. order-tracking.html     - Live Courier Simulator (Courier Guy, RAM tracking timeline)
9. faq.html                - Categorized Frequently Asked Questions
10. privacy-policy.html    - POPIA-compliant South African privacy guidelines
11. terms-and-conditions.html - Consumer Protection Act (CPA) compliant terms

HOW TO RUN:
- Simply double-click any .html file (e.g. index.html) to open in your browser.
- No build tools, Node.js, or local servers required!
- All pages share the same cart, wishlist, and dark mode state via browser localStorage.

DEPLOYMENT:
- Netlify / Vercel: Drag and drop this unzipped folder directly into the Netlify Drop dashboard.
- GitHub Pages: Commit these files to a repository and enable GitHub Pages on the root branch.
- Apache / Nginx / cPanel: Upload all files into public_html or your web root.

All rights reserved © ${new Date().getFullYear()} ${storeName} ZA.
`;
}
