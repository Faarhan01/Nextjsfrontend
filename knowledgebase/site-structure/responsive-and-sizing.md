# Responsive Design & Multi-Screen Sizing System

This document outlines how the storefront adapts layout density, typography, navigation, and interactive controls across different screen sizes.

---

## 1. Responsive Breakpoints

The storefront uses Tailwind's mobile-first breakpoint ladder:

| Breakpoint | Viewport Width | Typical Hardware Target | Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Default** | `< 640px` | Smart phones (iPhone, Android) | Single-column stacks, 2-column product grid, bottom sticky bars |
| **`sm`** | `≥ 640px` | Large phones, small tablets | 2–3 columns, enhanced button sizing, breadcrumbs appear |
| **`md`** | `≥ 768px` | iPads, tablets | Medium density, table columns expand |
| **`lg`** | `≥ 1024px` | Laptops, small desktops | 4-column product grid, sticky sidebars, dual-pane checkout |
| **`xl`** | `≥ 1280px` | Standard & widescreen monitors | Maximum container width boundary (`max-w-7xl` / 1280px) |

---

## 2. Adaptive Product Grid Scaling

Product feeds (in Shop, Categories, Search Results, and Related Products) adapt their columns to preserve optimal card proportions:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
  {products.map((product) => (
    <ProductPreview key={product.id} product={product} />
  ))}
</div>
```

- **Mobile (`< 640px`)**: 2 columns with `gap-3` (12px). Product cards retain readable thumbnail images, single-line titles, and two-line pricing.
- **Tablet (`sm: 640px - 1023px`)**: 3 columns with `gap-4` (16px).
- **Desktop (`lg: 1024px+`)**: 4 columns with `gap-6` (24px). Gives generous white space and allows secondary metadata (e.g. seller rating, condition tags) to display comfortably.

---

## 3. Thumb-Zone vs. Desktop Layout Switching

### Checkout & Cart Pages:
- **Mobile (`< 640px`)**: The primary checkout trigger is docked in the ergonomic "thumb-zone" at the bottom of the viewport:
  ```html
  <div className="fixed bottom-0 left-0 right-0 p-3 sm:hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-30 shadow-xl flex items-center justify-between gap-3">
    <!-- Total amount + Next / Place Order Button -->
  </div>
  ```
- **Desktop (`lg: 1024px+`)**: The sticky bottom bar is hidden (`sm:hidden`). The order summary moves into a dedicated right-hand column with sticky top alignment:
  ```html
  <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
    <div className="order-summary-surface">...</div>
  </div>
  ```

---

## 4. Filter Refinement: Sheet Drawer vs. Sidebar

- **Mobile (`< 1024px`)**: The category and attribute filter panel is hidden by default and opens as a sliding modal sheet (`RefinementSheet`) triggered by the Filter button on the Control Bar.
- **Desktop (`lg: 1024px+`)**: The filter panel mounts directly in the DOM as a permanent vertical sidebar (`lg:col-span-3`).

---

## 5. Touch vs. Click Feedback

- **Touch Feedback (Mobile)**:
  - Touch targets are padded to $\ge 44\text{px}$.
  - Uses `active:scale-95` or `active:scale-98` for tactile spring feedback.
  - `-webkit-tap-highlight-color: transparent` prevents blue browser highlight boxes.
- **Cursor Feedback (Desktop)**:
  - Cursor pointer (`cursor-pointer`) on all interactive buttons, cards, and links.
  - Subtle hover elevation (`hover:border-slate-300`, `hover:shadow-md`, `hover:-translate-y-0.5`).
