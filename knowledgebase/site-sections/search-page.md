# Search Page & Live Autocomplete Styling Architecture

The Dedicated Search Page (`/frontend/src/app/(main)/search/page.tsx` and `@modules/products/templates/search-results-page.tsx`) provides an intelligent product lookup engine with trending suggestions, query highlights, and faceted refinement filters.

---

## 1. Search Bar Hero & Input Stage

- **Hero Container**:
  - `card-base p-6 sm:p-10 mb-8 text-center bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden`
- **Enlarged Search Input**:
  ```tsx
  <div className="relative max-w-xl mx-auto">
    <input
      type="search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search by product name, category, or SKU..."
      className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
    />
    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
  ```

---

## 2. Trending Search Chips

Below the search input, popular queries are rendered as clickable chips:
```tsx
<div className="flex flex-wrap items-center justify-center gap-2 mt-4">
  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trending:</span>
  {TRENDING_TAGS.map((tag) => (
    <button
      key={tag}
      onClick={() => handleSelectTag(tag)}
      className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-all"
    >
      {tag}
    </button>
  ))}
</div>
```

---

## 3. Results Summary & Control Bar

- **Count Summary**: Displays `Showing {count} results for "{searchQuery}"` with the query in bold accent color.
- **Sort Dropdown**: Sort by "Relevance", "Price: Low to High", "Price: High to Low", or "Highest Rated".
- **View Density**: Grid (4-col) or List view toggles.

---

## 4. Product Results Grid & Zero Results State

- **Results Grid**: Reuses standard responsive product card surfaces (`.product-card-surface`).
- **Zero Results Fallback**:
  - When no products match the query:
  - Clean illustration box with a magnifying glass graphic.
  - "No products found matching your search."
  - Suggestions list: "Check spelling", "Use broader keywords", or "Browse categories below".
  - Quick Category shortcut pills.
