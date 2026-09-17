# Customer Wishlist & Saved Items Styling Architecture

The Wishlist Page (`/frontend/src/app/(main)/wishlist/page.tsx` and `@modules/products/templates/wishlist-page.tsx`) enables customers to save products, manage multiple custom wishlists, monitor price drops, and batch-add saved items to their shopping cart.

---

## 1. Page Header & Wishlist Action Bar

- **Header Card**:
  - `card-base p-6 sm:p-8 mb-6 flex flex-wrap items-center justify-between gap-4`
  - Title with heart icon: `text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2`
  - Item count badge: `text-xs px-2.5 py-1 rounded-full ${currentTheme.lightBg} font-bold`
- **Batch Action Controls**:
  - "Move All to Cart": `btn-primary rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5`
  - "Clear Wishlist": `btn-outline rounded-xl px-4 py-2 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-1.5`

---

## 2. Custom Wishlist Collections Tabs

Customers can organize items into segmented collections (e.g. "Dream Tech Setup", "Holiday Gifts", "Home Renovation"):
- **Segmented Tab Row**:
  - `flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6`
  - Active collection: `tab-pill-active font-bold`
  - Inactive collection: `tab-pill-inactive`
  - "+ New Collection" action chip: `rounded-full border border-dashed border-slate-300 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 flex items-center gap-1`

---

## 3. Wishlist Product Cards Grid

Products display in a 4-column responsive grid (`grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6`):
- **Card Surface**: `.card-base overflow-hidden relative group`
- **Delete / Remove Heart Button**:
  - Floating top-right button: `w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 text-rose-500 shadow-xs flex items-center justify-center hover:scale-110 transition-transform`
- **Stock Availability Badge**:
  - In-stock badge (`stock-dot-in` green) or Out-of-Stock pill (`bg-slate-100 dark:bg-slate-800 text-slate-500`).
- **Direct Add to Cart Button**:
  - Full-width button at the card base: `w-full py-2 rounded-xl text-xs font-bold text-white ${currentTheme.bg} flex items-center justify-center gap-1.5 mt-3 shadow-xs`

---

## 4. Empty Wishlist State

When no saved items exist:
- Centered inside `card-base p-12 text-center max-w-md mx-auto my-12`
- Large heart icon inside theme wash circle (`w-20 h-20 rounded-full ${currentTheme.lightBg} flex items-center justify-center mx-auto mb-4 text-rose-500`)
- Friendly message and "Explore Store Catalog" CTA button routing to `/shop`.
