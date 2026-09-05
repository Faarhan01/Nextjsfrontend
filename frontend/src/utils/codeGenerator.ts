import { SlideConfig, SliderSettings, CategoryCarouselSettings, BrandCarouselSettings, MockCategory, MockBrand, HeaderSettings, MockProduct } from '../types';

/**
 * Generates Next.js 15 App Router Main Page (`app/page.tsx`) for Storefront
 */
export function generateNextjsPageCode(
  slides: SlideConfig[], 
  _settings: SliderSettings,
  _catSettings?: CategoryCarouselSettings,
  _catList?: MockCategory[],
  _headerSettings?: HeaderSettings,
  _brandSettings?: BrandCarouselSettings,
  _brandList?: MockBrand[],
  _productList?: MockProduct[]
): string {
  const storeName = headerSettings?.logoText || "Mrbulk";
  
  return `// Next.js 15 App Router - Main Storefront Page
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCollections } from '@/lib/catalog';

export const revalidate = 60; // SSR Revalidation interval in seconds

export default async function HomePage() {
  const products = await getProducts();
  const collections = await getCollections();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Modern Hovering Floating Header */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl">
          <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold">
              ${storeName.charAt(0)}
            </span>
            <span>${storeName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/shop" className="hover:text-amber-400 transition-colors">Shop All</Link>
            <Link href="/categories" className="hover:text-amber-400 transition-colors">Categories</Link>
            <Link href="/collections" className="hover:text-amber-400 transition-colors">Collections</Link>
            <Link href="/about" className="hover:text-amber-400 transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 transition">
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-amber-400 text-slate-950">Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Parallax Hero Banner */}
      <section className="relative my-6 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[440px] flex items-center p-8 sm:p-12">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <Image 
              src="${slides[0]?.backgroundImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&fm=webp'}" 
              alt="Hero Banner"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
              Next.js 15 Storefront Engine
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              ${slides[0]?.title || 'Elegance Redefined'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              ${slides[0]?.subtitle || 'Explore our exclusive collection crafted for modern living.'}
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link href="/shop" className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition shadow-lg shadow-amber-400/10">
                Explore Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Products</h2>
            <p className="text-xs text-slate-400 mt-1">High-performance catalog with ISR caching</p>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-amber-400 hover:underline">
            View All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((prod: any) => (
            <div key={prod.id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 mb-3">
                <Image 
                  src={prod.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&fm=webp'} 
                  alt={prod.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-semibold text-sm text-white line-clamp-1">{prod.title}</h3>
              <p className="text-xs text-slate-400 capitalize mt-0.5">{prod.handle}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-amber-400">{prod.price || '$120.00'}</span>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-white hover:bg-amber-400 hover:text-slate-950 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
`;
}

/**
 * Generates Catalog Client helper code (`lib/catalog.ts`)
 */
export function generateCatalogClientCode(): string {
  return `// Catalog Helper for Next.js 15
export async function fetchCatalog(endpoint: string) {
  return { products: [] };
}
`;
}

/**
 * Generates CSS code for legacy compatibility
 */
export function generateCSSCode(_settings: SliderSettings): string {
  return `/* Next.js 15 Storefront Custom Styling */
:root {
  --store-accent: #f59e0b;
  --store-bg: #020617;
  --store-card: #0f172a;
  --store-border: #1e293b;
}

.banner-parallax-container {
  perspective: 1000px;
  border-radius: 1.5rem;
}

.product-grid-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-grid-card:hover {
  transform: translateY(-4px);
}
`;
}

/**
 * Generates JS client code
 */
export function generateJSCode(): string {
  return generateCatalogClientCode();
}

/**
 * Generates README documentation
 */
export function generateReadme(slides: SlideConfig[], settings: SliderSettings): string {
  return `# Mrbulk - Next.js 15 Storefront

Welcome to your modern **Next.js 15 (App Router)** e-commerce storefront.

## 🚀 Features
- **Next.js 15 App Router**: Server Components, streaming SSR, and optimal asset delivery.
- **Tailwind CSS Styling**: High-contrast, elegant design with smooth micro-interactions.
- **Responsive Floating Navigation Bar**: Modern hover header with interactive cart and account drawers.

## 🛠️ Quick Start

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to view your storefront!
`;
}
