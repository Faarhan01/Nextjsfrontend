# Home Page Showcase Styling Architecture

The storefront home page (`/frontend/src/app/page.tsx` and `@modules/home/templates/home-page-client.tsx`) acts as the high-impact storefront showcase. It is structured around clean negative space, dynamic theme bindings, and anti-slop visual discipline.

---

## 1. Page Flow & Section Structure

1. **Hero Slider & Visual Showcase** (`@modules/home/components/hero`)
2. **Category Navigation Strip / Quick Bar** (`@modules/products/components/category-bar`)
3. **Curated Promotional Banners Grid** (`@modules/layout/components/promo-banners-grid`)
4. **Flash Deals & Countdown Section** (`@modules/products/components/flash-deals-section`)
5. **Bestsellers & Featured Tabbed Products** (`@modules/products/components/bestsellers-tab-section`)
6. **Department Product Carousels** (Tech & Living showcases)
7. **Customer Social Proof & Testimonials** (`@modules/layout/components/testimonials-section`)
8. **Recently Viewed Products Shelf** (`@components/shared/recently-viewed`)

---

## 2. Hero Slider Styling (`.hero-slider-dark-scope`)

The hero section uses a specialized dark-scope styling rule to maintain pristine text contrast regardless of global light/dark mode:

```css
/* Hero Dark Scope Enforcement */
.hero-slider-dark-scope {
  color: #f8fafc;
}
```

### Key Elements:
- **Aspect Ratio & Height**: Constrained to responsive heights (`h-[400px] sm:h-[480px] lg:h-[540px]`), preventing excessive vertical push while leaving room for navigation.
- **Backdrop Overlay**: Gradient-free flat color scrim with opacity (`bg-black/40` to `bg-black/60`) ensuring high-contrast legibility over product lifestyle photography.
- **Typography Scale**:
  - Eyebrow badge: `text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md`
  - Headline: Fluid `clamp(2rem, 5vw, 3.5rem)` in `font-extrabold tracking-tight text-white`
  - Description: `text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed`
- **Call-to-Action Buttons**:
  - Primary CTA: `btn-primary rounded-full px-6 py-3 text-sm font-bold shadow-lg hover:scale-105 transition-transform`
  - Secondary CTA: `rounded-full px-6 py-3 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20`
- **Slider Pagination Dots**:
  - Tabular pill dots (`h-2 rounded-full transition-all duration-300`). Active dot expands from `w-2` to `w-6` with `currentTheme.bg` styling.

---

## 3. Quick Category Bar (`category-bar.tsx`)

A horizontal scrolling bar allowing rapid department browsing:
- **Container**: `scrollbar-none flex items-center gap-3 overflow-x-auto py-4 px-2`
- **Pill Button**:
  ```tsx
  <Link
    href={`/category/${slug}`}
    className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all shrink-0 group"
  >
    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
      <SafeImage src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
    </div>
    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
      {cat.name}
    </span>
  </Link>
  ```
- **Geometry**: Adheres to the 16px radius (`rounded-2xl`) with internal 12px image container (`rounded-xl`).

---

## 4. Promo Banners Grid (`promo-banners-grid.tsx`)

Displays responsive 2 or 3-column merchandising cards:
- **Grid Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`
- **Card Surface**:
  - `relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between min-h-[220px]`
- **Content Overlay**:
  - Discount Tag: `badge-sale px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`
  - Title: `text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white`
  - Action link: Underlined or pill link with animated arrow icon (`group-hover:translate-x-1 transition-transform`).

---

## 5. Flash Deals Section (`flash-deals-section.tsx`)

High-urgency section with a live countdown timer and discount pricing:
- **Section Header**:
  - Fire/Flash icon pill badge.
  - Live Countdown Boxes:
    ```tsx
    <div className="flex items-center gap-1.5 font-mono text-xs">
      <span className="px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800 font-bold tabular-nums">02</span>
      <span>:</span>
      <span className="px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800 font-bold tabular-nums">45</span>
      <span>:</span>
      <span className="px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-800 font-bold tabular-nums">12</span>
    </div>
    ```
- **Deal Progress Bar**:
  - Track: `w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden`
  - Fill: `h-full rounded-full bg-rose-500 transition-all duration-500`

---

## 6. Bestsellers Tabbed Section (`bestsellers-tab-section.tsx`)

Enables switching between curated segments (e.g. "All", "Electronics", "Fashion", "Home"):
- **Segmented Control Tabs**:
  - Active: `tab-pill-active font-bold` (bound to `currentTheme.bg` with white text).
  - Inactive: `tab-pill-inactive` (`text-slate-600 dark:text-slate-400 hover:text-slate-900`).
- **Product Card Integration**:
  - Renders 4-column responsive product card grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6`).

---

## 7. Customer Testimonials (`testimonials-section.tsx`)

- **Card Styling**: `card-base p-6 sm:p-8 flex flex-col justify-between`
- **Star Rating**: 5-star rating row using `rating-star` yellow amber tone (`text-amber-400 fill-amber-400 w-4 h-4`).
- **Reviewer Bio**: Circular customer avatar (`w-10 h-10 rounded-full object-cover`), verified buyer badge, and purchase reference.
