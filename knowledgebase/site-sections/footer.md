# Store Footer & Customer Trust Section Styling Architecture

The storefront footer adheres to MedusaJS layout principles while maintaining complete compatibility with the dynamic color theme system, customer guarantee banners, and multi-column site navigation.

---

## 1. Architecture & Component Hierarchy

- **Root Template**: `/frontend/src/@modules/layout/templates/footer/index.tsx`
- **Customer Guarantee Carousel**: `/frontend/src/@modules/layout/components/footer-trust-carousel.tsx`
- **Brand Info Card**: `/frontend/src/@modules/layout/components/footer-brand-card.tsx`
- **Navigation Links Grid**: `/frontend/src/@modules/layout/components/footer-links-grid.tsx`
- **Newsletter Subscription**: `/frontend/src/@modules/layout/components/footer-newsletter.tsx`
- **Bottom Bar & Copyright**: `/frontend/src/@modules/layout/components/footer-bottom-bar.tsx`
- **Medusa CTA Component**: `/frontend/src/@modules/layout/components/medusa-cta.tsx`

---

## 2. Root Container & Theme Glow Bar

```tsx
<footer
  role="contentinfo"
  className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 mt-auto border-t border-slate-200/90 dark:border-slate-800 relative overflow-hidden"
>
  {/* Dynamic Theme Accent Top Glow Bar */}
  <div className={`h-1 w-full ${currentTheme.bg}`} />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
    ...
  </div>
</footer>
```

### Key Stylistic Elements:
- **Top Accent Line**: A thin `h-1` stripe bound to `currentTheme.bg` (e.g. `bg-blue-600`) spanning full width at the top border.
- **Canvas Colors**: High-contrast white (`#ffffff`) in light mode and deep slate-950 (`#020617`) in dark mode.
- **Top Border**: `border-t border-slate-200/90 dark:border-slate-800` providing subtle separation from the preceding section.

---

## 3. Trust Guarantee Carousel (`footer-trust-carousel.tsx`)

Positioned directly above the navigation links to reinforce customer confidence:
- **Grid Layout**: 4-column responsive grid on desktop (`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pb-12 border-b border-slate-100 dark:border-slate-800/80`).
- **Feature Card Structure**:
  ```tsx
  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
    <div className={`w-10 h-10 rounded-xl ${currentTheme.lightBg} flex items-center justify-center shrink-0`}>
      <Truck className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Nationwide Fast Delivery</h4>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Dispatched within 24-48 hours</p>
    </div>
  </div>
  ```
- **Trust Pillars**:
  1. Fast Nationwide Delivery (Truck)
  2. 100% Secure Checkout (ShieldCheck)
  3. 30-Day Hassle-Free Returns (RotateCcw)
  4. 24/7 Dedicated Support (Headphones)

---

## 4. Brand Card & Social Icon Pills (`footer-brand-card.tsx`)

Occupies 4 columns in the 12-column footer grid on desktop (`lg:col-span-4`):
- **Logo Presentation**: Brand icon with dynamic theme background matching header styling.
- **Mission Summary**: Body copy set at `text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm`.
- **Social Media Icons**:
  - Circular buttons (`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white transition-all`).
  - Dynamic theme hover state (`hover:${currentTheme.bg}`).

---

## 5. Navigation Links Grid (`footer-links-grid.tsx`)

Spans 8 columns in the footer grid (`lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6`):
- **Section Headings**:
  ```tsx
  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
    Shop Departments
  </h4>
  ```
- **Links List**:
  ```tsx
  <ul className="space-y-2 text-xs">
    <li>
      <Link href="/shop" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
        All Products
      </Link>
    </li>
  </ul>
  ```
- **Categorization**:
  1. **Shop**: All Products, New Arrivals, Featured Deals, Categories, Top Brands
  2. **Customer Care**: Order Tracking, Shipping & Returns, Help & FAQ, Contact Support
  3. **Company**: About Mrbulk, Become a Seller, Terms & Conditions, Privacy Policy

---

## 6. Newsletter Subscription Row (`footer-newsletter.tsx`)

A prominent call-to-action bar encouraging customer newsletter signups:
- **Card Background**:
  ```tsx
  <div className="rounded-2xl p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 my-8">
  ```
- **Form Layout**: Flex container stacking vertically on mobile and aligning horizontally on desktop:
  - Input field: `rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20`.
  - Submit Button: `btn-primary rounded-xl text-xs font-bold px-5 py-2.5 flex items-center justify-center gap-1.5`.

---

## 7. Bottom Bar & Legal Compliance (`footer-bottom-bar.tsx`)

- **Divider**: `border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6`.
- **Layout**: Flexbox with `flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400`.
- **Payment Method Badges**: Visual cards for Visa, Mastercard, Instant EFT, and Ozow.
- **MedusaJS Attribution Badge**: Standardized Medusa e-commerce badge with clean link styling.
