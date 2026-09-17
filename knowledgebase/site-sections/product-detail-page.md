# Product Detail Page Styling Architecture

The Product Detail Page (`/frontend/src/app/(main)/product/[id]/page.tsx` and `@modules/products/templates/product-detail-page.tsx`) delivers an e-commerce conversion experience combining an interactive media gallery, dynamic variant selectors, bulk tier pricing tables, seller buy boxes, and a sticky mobile action bar.

---

## 1. Grid Hierarchy & Layout

On desktop displays, the layout divides into a 12-column responsive split:
- **Left Column (7 Columns - Media & Narrative)**:
  - Breadcrumb navigation
  - Zoomable high-resolution image stage
  - Horizontal / vertical thumbnail carousel
  - Detailed product narrative, specifications table, and customer reviews
- **Right Column (5 Columns - Sticky Buy Box)**:
  - Brand badge & product title
  - Star rating & verified review count link
  - Price display (Current, Original, Discount Pill, VAT notice)
  - Bulk tiered volume discount schedule
  - Variant selectors (Color swatches, Size chips, Custom attributes)
  - Stock indicator badge & estimated dispatch window
  - Quantity stepper & primary "Add to Cart" action buttons
  - Seller / Vendor offers comparison box
  - Buyer assurance trust badges

---

## 2. Media Gallery & Lightbox Zoom

### Main Image Canvas
- **Container**: `aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 relative group`
- **Zoom Trigger**: Hover icon badge (`w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md flex items-center justify-center text-slate-700 dark:text-slate-200 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity`)
- **Image Element**: High-resolution rendering with `SafeImage`, object-contain framing, and cursor zoom state.

### Thumbnail Navigation Strip
- **Track**: `flex items-center gap-3 overflow-x-auto py-2 scrollbar-none`
- **Thumbnail Item**:
  - Unselected: `w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100 transition-opacity overflow-hidden`
  - Selected: `w-16 h-16 rounded-xl ring-2 ring-blue-600 dark:ring-blue-400 border-transparent opacity-100 shadow-xs overflow-hidden`

---

## 3. Pricing Display & Tabular Numerals

Prices use `.price-tag` (`font-variant-numeric: tabular-nums`) to prevent layout shifts:

```tsx
<div className="flex items-baseline gap-3">
  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white price-tag">
    {formatCurrency(finalPrice)}
  </span>
  {hasDiscount && (
    <>
      <span className="text-base text-slate-400 dark:text-slate-500 line-through price-tag">
        {formatCurrency(originalPrice)}
      </span>
      <span className="price-discount-pill text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
        Save {discountPercentage}%
      </span>
    </>
  )}
</div>
```

---

## 4. Bulk Tier Volume Pricing Table

For bulk and wholesale shoppers, a structured discount matrix appears:
- **Container**: `rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4 my-4`
- **Tier Grid**: Columns showing "Quantity", "Unit Price", and "Discount %"
- **Active Tier Highlight**: When the user's quantity stepper matches a tier threshold, the row illuminates with `currentTheme.lightBg` and bold accent text.

---

## 5. Variant Selectors & Attribute Swatches

### Color Swatch Pills
- Circular or pill buttons with color hex preview or dual-color gradient:
  - Selected: `ring-2 ring-offset-2 ring-blue-600 scale-105 transition-all`
  - Disabled / Out of Stock: diagonal strike-through line with reduced opacity (`opacity-40 cursor-not-allowed`)

### Size & Option Chips
- Pill button format (`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all`):
  - Inactive: `bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200`
  - Active: Bound to `currentTheme.bg` with crisp white text.

---

## 6. Quantity Stepper & Buy Box CTAs

### Quantity Stepper Controls
- Container: `inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-11 px-1`
- Stepper Buttons (`Minus`, `Plus`):
  - `w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors`
- Value Display: `w-12 text-center font-bold text-sm tabular-nums text-slate-900 dark:text-white`

### Add-to-Cart & Buy Now Buttons
- **Add to Cart**:
  ```tsx
  <button className={`flex-1 h-11 rounded-xl font-bold text-sm text-white ${currentTheme.bg} hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all`}>
    <ShoppingCart className="w-4 h-4" />
    <span>Add to Cart</span>
  </button>
  ```
- **Wishlist Toggle**:
  - `w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300`
  - Active: filled rose red heart icon (`text-rose-500 fill-rose-500`).

---

## 7. Product Narrative, Specs & Reviews Tabs

- **Tab Navigation**: Clean horizontal segmented bar (`border-b border-slate-200 dark:border-slate-800 flex gap-8 text-sm font-semibold`)
- **Active Underline**: Indicator line positioned using CSS `border-b-2 border-blue-600` or Motion layout ID.
- **Specifications Table**:
  - Clean zebra-striped or subtle bordered key-value pairs:
    ```tsx
    <div className="grid grid-cols-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80 text-xs">
      <span className="text-slate-500 dark:text-slate-400 font-medium">Material</span>
      <span className="col-span-2 text-slate-800 dark:text-slate-200 font-semibold">Brushed Stainless Steel</span>
    </div>
    ```

---

## 8. Mobile Sticky Bottom Action Bar

On mobile screens (`lg:hidden`), a sticky action bar attaches to the bottom viewport:
- **Surface**: `fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-xl flex items-center gap-3`
- **Price Preview**: Displays current variant price on left.
- **Instant CTA**: Full-width "Add to Cart" or "Buy Now" button with immediate checkout feedback.
