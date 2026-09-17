# Header Dropdowns, Megamenus & Overlays Styling Architecture

The header incorporates several high-performance interactive popovers and overlay systems:
1. **Categories Megamenu Popover** (`categories-dropdown.tsx`)
2. **Company Information Popover** (`company-dropdown.tsx`)
3. **User Account & Session Popover** (`user-menu-dropdown.tsx`)
4. **Interactive Header Search Bar** (`header-search.tsx`)
5. **Catalog Search Megamenu Overlay** (`search-megamenu-overlay.tsx`)
6. **Cart Quick Trigger Button** (`cart-button.tsx`)
7. **Region & Country Selector** (`country-select.tsx`)

---

## 1. Popover Architecture & Positioning

All dropdown popovers follow a standardized floating positioning strategy:
- **Anchor Container**: `relative` wrapper enclosing both the trigger button and the popup surface.
- **Top Offset Calculation**: `top-[calc(100%+6px)]` ensures exact 6px air gap between header pill and dropdown card.
- **Hover Bridge Pseudo-Element**:
  ```css
  before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3
  ```
  An invisible transparent pseudo-element covers the 6px gap, preventing accidental mouse-leave closures during cursor movement.
- **Z-Index Layering**: `z-50` ensuring popup layers sit above page content and sticky section headers.

---

## 2. Categories Megamenu Dropdown (`categories-dropdown.tsx`)

### Trigger Element (Split Pill Pattern)
The Categories item uses an accessible split pill design:
- Left half: `<Link href="/categories">` directly navigates to the directory.
- Right half: `<button aria-haspopup="true">` with `<ChevronDown>` rotates 180° when open.

```tsx
<ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${isOpen ? 'rotate-180 text-slate-700 dark:text-slate-300' : ''}`} />
```

### Popover Container Styling
- Dimensions: `w-72 sm:w-80`
- Surface Token: `.popover-surface rounded-2xl border border-card p-2 shadow-xl shadow-slate-900/10 dark:shadow-black/40`
- Transition: Opacity and subtle `translate-y-1` to `translate-y-0` spring entrance.

### Category Item Surface
Each item in the scrollable list displays an image thumbnail, title, subcategory pills, and item count badge:
```tsx
<Link
  href={`/category/${slug}`}
  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition ${
    isActiveCat
      ? `${currentTheme.lightBg} font-bold`
      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
  }`}
>
  <div className="flex items-center gap-2.5 min-w-0">
    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60">
      <SafeImage src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" placeholderType="product" />
    </div>
    <div className="min-w-0">
      <div className="font-bold truncate text-slate-800 dark:text-slate-100">{cat.name}</div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[170px]">
        {cat.subcategories?.map((s) => s.name).join(', ') || cat.description}
      </div>
    </div>
  </div>
  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
    {cat.itemCount}
  </span>
</Link>
```

---

## 3. Company Information Dropdown (`company-dropdown.tsx`)

- Dimensions: Compact `w-48` width card.
- Padding: `p-1.5` with internal `rounded-xl` hover rows.
- Links: Direct routing to `/about`, `/contact`, and `/faq`.
- Icons: Left-aligned Lucide icons (`Building2`, `Mail`, `HelpCircle`) in `16px` dimension with muted text secondary tones (`text-slate-400 dark:text-slate-500`).

---

## 4. User Account & Profile Dropdown (`user-menu-dropdown.tsx`)

### Authenticated vs. Guest States
1. **Authenticated User**:
   - Header shows user avatar (`w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover`) or colored initials ring.
   - Popover header displays user full name in `text-xs font-bold text-slate-900 dark:text-white` with email in `text-[10px] text-slate-500 truncate`.
   - Action list: Profile & Addresses (`/account`), Active Order Tracking (`/order-tracking`), Saved Wishlist (`/wishlist`), Sign Out action in rose red (`text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40`).
2. **Guest User**:
   - Primary "Sign In" CTA button:
     ```tsx
     <button onClick={handleSignIn} className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-white ${currentTheme.bg} hover:opacity-95 shadow-xs`}>
       <LogIn className="w-3.5 h-3.5" />
       <span>Sign In / Register</span>
     </button>
     ```
   - Secondary Quick Links: Order Tracking (`Truck`), Wishlist (`Heart`), Currency / Region Indicator.

---

## 5. Header Search & Megamenu Overlay

### Embedded Desktop Search Input (`header-search.tsx`)
```tsx
<div className="relative flex-1 max-w-[200px] lg:max-w-xs xl:max-w-sm hidden md:block">
  <input
    type="search"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search products, brands..."
    className="w-full pl-8 pr-7 py-1 text-xs bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-full focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
  />
  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
</div>
```
- Fully circular input pill (`rounded-full`) with subtle slate wash.
- Focused state expands contrast with crisp `2px` focus ring.

### Full-Featured Search Megamenu (`search-megamenu-overlay.tsx`)
When focused or toggled, a large floating card opens below the header:
- Container: `absolute top-[calc(100%+10px)] left-0 right-0 w-full surface-elevated rounded-2xl border border-card shadow-2xl p-4 sm:p-6 z-50`
- Results Grid:
  - 4-column preview cards for instant product matches.
  - Card layout: Mini product thumbnail (`w-14 h-14 rounded-lg`), tabular price tag, stock dot indicator, and instant "Add to Cart" mini button.
- Query Suggestion Chips:
  - Trending search chips styled as `px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition-colors`.

---

## 6. Region & Country Selector (`country-select.tsx`)

- Integrates with `@/providers/region` for MedusaJS multi-region support.
- Popover displays supported countries, localized currency symbols (e.g. `ZAR - R`, `USD - $`, `EUR - €`), and shipping tier indicators.
- Selected country displays a checkmark icon with active theme highlight.
