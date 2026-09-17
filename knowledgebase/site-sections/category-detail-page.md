# Category Detail Page Styling Architecture

The Category Detail Page (`/frontend/src/app/(main)/category/[slug]/page.tsx` and `@modules/products/templates/category-detail-page.tsx`) provides a curated department landing experience with subcategory chips, dedicated sorting, and filtered product showcases.

---

## 1. Hero Department Header & Breadcrumbs

- **Breadcrumbs Trail**:
  - `Home / Categories / {CategoryName}`
  - Linked chips with hover color transitions and active bold terminal crumb.
- **Department Header Card**:
  - `card-base p-6 sm:p-8 mb-8 relative overflow-hidden bg-slate-50 dark:bg-slate-900/60`
  - Category icon badge (`w-12 h-12 rounded-2xl ${currentTheme.lightBg} flex items-center justify-center`)
  - Headline: `text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white`
  - Description: `text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed`

---

## 2. Subcategory Quick Filter Chips

Directly under the department header sits a horizontal chip carousel:
```tsx
<div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
  <button
    onClick={() => setSelectedSubcategory('All')}
    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
      selectedSubcategory === 'All'
        ? `${currentTheme.bg} text-white shadow-xs`
        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
    }`}
  >
    All Items
  </button>
  {subcategories.map((sub) => (
    <button
      key={sub.name}
      onClick={() => setSelectedSubcategory(sub.name)}
      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
        selectedSubcategory === sub.name
          ? `${currentTheme.bg} text-white shadow-xs`
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
      }`}
    >
      {sub.name}
    </button>
  ))}
</div>
```

---

## 3. Product Catalog Grid & Empty State

- **Product Grid**:
  - Responsive 4-column layout on wide desktop displays (`grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6`).
  - Standard `.product-card-surface` cards with discount pills, stock dots, and quick add buttons.
- **Empty State**:
  - Displayed if a filtered subcategory contains 0 items:
  - `card-base p-12 text-center max-w-md mx-auto my-8`
  - Friendly message with "View All Category Products" reset button.
