# Tab Navigation & Multi-View Component Architecture

This document details how tab navigation, segmented controls, and view switchers are styled, animated, and adapted across viewports in the storefront.

---

## 1. Where Tabs are Used

1. **My Account Dashboard** (`/frontend/src/@modules/account/templates/my-account-page.tsx`):
   - Tabs: `profile`, `orders`, `addresses`, `wishlist`, `reviews`, `security`
2. **Product Detail Page** (`/frontend/src/@modules/products/templates/product-detail-page.tsx`):
   - Tabs: `Overview`, `Specifications`, `Seller Info & Warranty`, `Customer Reviews`
3. **Category & Shop Filter Bars** (`/frontend/src/@modules/store/components/refinement-list/control-bar.tsx`):
   - View mode toggle tabs: `Grid View` vs. `List View`
   - Sorting dropdown tabs and active filter chips
4. **Order Tracking Page** (`/frontend/src/@modules/account/templates/order-tracking-page.tsx`):
   - Multi-step status progress indicator: `Ordered`, `Processed`, `Shipped`, `Delivered`

---

## 2. Design Tokens & CSS Classes for Tabs

In `index.css`:

```css
/* Active Pill State */
.tab-pill-active {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  font-weight: 700;
}

/* Inactive Pill State */
.tab-pill-inactive {
  background-color: var(--bg-surface-subtle);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  font-weight: 600;
}

.tab-pill-inactive:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
}

/* Underline Style Tabs */
.tab-underline-active {
  color: var(--text-accent);
  border-bottom: 2px solid var(--text-accent);
  font-weight: 700;
}
```

---

## 3. Responsive Layout Patterns

### A. Mobile: Swipeable Horizontal Carousel
On mobile viewports (`< 1024px`), persistent vertical tabs consume too much vertical reading space. The tab container renders as a scrollable horizontal strip:
- `flex items-center gap-2 overflow-x-auto no-scrollbar py-2`
- Touch scroll physics with snap alignments where appropriate
- Smooth touch target sizing (minimum 44px height for finger navigation)

### B. Desktop: Sticky Sidebar Navigation Card
On larger screens (`lg: 1024px+`), tabs transition into a structured vertical sidebar:
- `card-base p-4 lg:sticky lg:top-24 space-y-1.5`
- Full-width button rows with leading Lucide vector icons, active background highlight, and trailing count badges or chevrons.

```tsx
// Example from My Account Navigation
<div className="card-base p-3 sm:p-4 space-y-1">
  {TABS.map((tab) => {
    const isActive = activeTab === tab.id;
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition cursor-pointer ${
          isActive
            ? `${currentTheme.bg} text-white shadow-sm`
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 shrink-0" />
          <span>{tab.label}</span>
        </div>
        {tab.badge !== undefined && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20">
            {tab.badge}
          </span>
        )}
      </button>
    );
  })}
</div>
```

---

## 4. Animation & Route Transitions (`motion/react`)

All tab view panels use `motion.div` from `motion/react` with consistent easing and duration parameters to prevent abrupt layout pops:

```tsx
<motion.div
  key={activeTab}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  className="space-y-6"
>
  {/* Tab Content Components */}
</motion.div>
```

### Transition Standards:
- **Duration**: `0.18s` to `0.24s` (fast, crisp, never sluggish)
- **Easing**: Cubic-bezier `[0.4, 0, 0.2, 1]` standard deceleration
- **Motion Distance**: Subtle `8px` vertical translation (`y: 8`) rather than sweeping cross-screen slides.
