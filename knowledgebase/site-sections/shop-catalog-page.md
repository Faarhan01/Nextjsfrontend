# Shop & Catalog Page Styling Architecture

The main catalog page (`/frontend/src/app/(main)/shop/page.tsx` and `@modules/store/templates/index.tsx`) provides a flexible product browsing environment, supporting faceted filtering, variable grid density, and responsive slide-out drawers.

---

## 1. Page Layout Architecture

```
┌────────────────────────────────────────────────────────┐
│  Category Quick Carousel (CategoryBarCarousel)         │
├────────────────────────────────────────────────────────┤
│  Store Banner & Breadcrumbs (StoreBanner)              │
├────────────────────────────────────────────────────────┤
│  Control Bar: Result Count, View Switcher, Sort Dropdown│
├──────────────────────────┬─────────────────────────────┤
│  Sidebar Filters         │  Product Grid / List        │
│  (RefinementList)        │  (PaginatedProducts)        │
│  - Category tree         │  - 2, 3, 4 col or list view │
│  - Price range slider    │  - Stock badges & discounts │
│  - Brand checkboxes      │  - Quick view & Add to Cart │
│  - Stock & rating filter │  - Pagination pills         │
└──────────────────────────┴─────────────────────────────┘
```

---

## 2. Store Banner & Breadcrumbs (`store-banner.tsx`)

- **Container**: `w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-6 relative overflow-hidden`
- **Breadcrumbs**:
  - `flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2`
  - Slash or chevron dividers: `<ChevronRight className="w-3 h-3" />`
  - Current location marked with `text-slate-900 dark:text-slate-100 font-bold`.
- **Title & Stats**:
  - Title: `text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight`
  - Count badge: `text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold tabular-nums`

---

## 3. Control Bar & View Switcher (`control-bar.tsx`)

The control bar coordinates sorting, layout modes, and active filter summaries:
- **Bar Surface**: `card-base px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-6`
- **Mobile Filter Trigger Button**:
  - Hidden on desktop, visible on mobile: `lg:hidden btn-secondary rounded-xl text-xs font-bold px-3 py-2 flex items-center gap-2`
  - Shows active filter badge count when filters are applied.
- **View Mode Switcher (Columns / List)**:
  - Button group: `flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700`
  - Active toggle icon: `p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs`
  - Inactive toggle icon: `p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200`
- **Sort Dropdown**:
  - Native select styled as: `text-xs font-semibold bg-transparent border-none outline-none cursor-pointer text-slate-700 dark:text-slate-200`

---

## 4. Sidebar Refinement List (`refinement-list/index.tsx`)

Occupies desktop column `w-64 shrink-0 hidden lg:block space-y-6`:
- **Filter Groups**:
  - Category List (Radio/Checkbox pills)
  - Price Range Slider (dual range inputs with tabular min/max display)
  - Brand Filter (searchable checklist with item count chips)
  - Stock Availability Toggle ("In Stock Only" switch)
  - Minimum Rating Filter (clickable star rating rows)
- **Active Filter Chips**:
  - Tag pill: `px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5`
  - "Clear All" action link: `text-xs font-bold text-rose-600 hover:underline`

---

## 5. Mobile Filter Drawer (`mobile-filter-drawer.tsx`)

- **Backdrop**: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50`
- **Drawer Sheet**: `fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-50 p-6 flex flex-col justify-between shadow-2xl`
- **Drawer Actions**: Sticky bottom bar with "Apply Filters" primary button and "Reset" outline button.

---

## 6. Product Card Surfaces & Layout Densities

Product cards use `.product-card-surface` and `.card-base`:

### Density Modes:
1. **Grid Mode (4 Columns on Desktop)**:
   - `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`
2. **Compact Mode (3 Columns)**:
   - `grid grid-cols-2 lg:grid-cols-3 gap-6`
3. **List Mode (Horizontal Row)**:
   - `flex flex-col gap-4`
   - Image on left (`w-36 h-36 shrink-0`), details and pricing in flex-1 middle, CTA column on right.

### Product Card Micro-Interactions:
- **Image Container**: Aspect ratio 1:1 (`aspect-square`), `overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 relative group`
- **Discount Badge**: Floating top-left badge `price-discount-pill -25%`
- **Wishlist Heart Button**: Floating top-right circular button `w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-xs flex items-center justify-center`
- **Stock Indicator**: Real-time stock status dot (`stock-dot-in`, `stock-dot-low`, `stock-dot-out`)
- **Quick Add to Cart**: Reveals smoothly on card hover (`translate-y-0 opacity-100 transition-all`)
