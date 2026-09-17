# Categories & Department Directory Styling Architecture

The Categories Directory page (`/frontend/src/app/(main)/categories/page.tsx` and `@modules/products/templates/categories-page.tsx`) organizes the store's full catalog into high-level department hubs with visual thumbnails and subcategory previews.

---

## 1. Page Header & Live Category Search

- **Hero Banner**:
  - Displays category directory title and subtitle.
  - Live search input:
    ```tsx
    <div className="relative max-w-md mx-auto mt-4">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Filter categories or subcategories..."
        className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
      />
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    ```

---

## 2. Category Cards Bento Grid

Categories are arranged in a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`):
- **Card Surface**:
  - Standardized `.card-base` container with `overflow-hidden group hover:shadow-xl transition-all duration-300`.
  - Border: `border border-slate-200/80 dark:border-slate-800`.
- **Media Presentation**:
  - Image banner: `h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative`
  - Subtle zoom: `group-hover:scale-105 transition-transform duration-500 ease-out`
  - Overlay gradient scrim: `bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent absolute inset-0`
- **Floating Badges**:
  - Top-left: Department icon pill.
  - Top-right: Item count badge (`tabular-nums px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-100 shadow-xs`).

---

## 3. Subcategory Chips & Quick Links

Inside each category card body:
- **Category Title**: `text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between`
- **Subcategory Pills**:
  ```tsx
  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
    {subcategories.map((sub) => (
      <Link
        key={sub.name}
        href={`/shop?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.name)}`}
        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-colors"
      >
        {sub.name}
      </Link>
    ))}
  </div>
  ```

---

## 4. Explore All Button Footer

At the base of each card, an action link guides users:
- `mt-4 pt-3 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform`
- Icon: `<ArrowRight className="w-3.5 h-3.5" />`
