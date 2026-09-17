# Containers, Cards & Surface Geometry

This document outlines the geometric rules, container scales, border radii, and surface hierarchy implemented across the storefront.

---

## 1. Page Container & Width Boundaries

All primary page views (Shop, Product Detail, Cart, Checkout, Categories, Account, Order Tracking) are wrapped within a centered, fluid boundary:

```html
<div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
  <!-- Page Content -->
</div>
```

- **Max Width**: `max-w-7xl` (`1280px` / `80rem`). This prevents content and text lines from stretching excessively on ultrawide monitors (1440p, 4K).
- **Responsive Outer Gutters**:
  - Mobile (`< 640px`): `px-3.5` (14px) — maximum readable screen area for cards.
  - Tablet (`640px - 1024px`): `px-6` (24px).
  - Desktop (`> 1024px`): `px-8` (32px).

---

## 2. Standardized Border Radius (`rounded-2xl`)

Across the entire storefront, all primary cards, checkout steps, order summary panels, modals, and list items have been standardized to:

```css
border-radius: var(--radius-2xl); /* 1rem / 16px */
```
In Tailwind utility classes: `rounded-2xl`.

### Standardized Components:
- **Product Card (`product-preview`)**: `rounded-2xl`
- **Product List Item (`product-list-item`)**: `rounded-2xl`
- **Control Bar (`control-bar`)**: `rounded-2xl`
- **Category Filter Sidebar**: `rounded-2xl`
- **Category Cards (`categories-page`)**: `rounded-2xl`
- **Empty State Containers**: `rounded-2xl`
- **Checkout Form Steps (`checkout-step-surface`)**: `rounded-2xl`
- **Order Summary Box (`order-summary-surface`)**: `rounded-2xl`
- **Cart Drawer Item Containers**: `rounded-2xl`
- **Account Sidebar & Tab Containers**: `rounded-2xl`
- **Shipment Timeline & Payment Cards (`order-tracking-page`)**: `rounded-2xl`

---

## 3. Mathematical Corner Radius Nesting Rule

When a child container sits inside a parent rounded container, the inner radius must be calculated geometrically to prevent visual clipping or awkward corner bulges:

$$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$

### Implementation Examples in the Storefront:
1. **Product Card with Image Container**:
   - Outer Card: `rounded-2xl` (16px)
   - Outer Card Padding: `p-3` (12px)
   - Inner Image Thumbnail: `rounded-xl` (12px) or `rounded-lg` (8px)
2. **Checkout Step Card with Inner Badge**:
   - Outer Card: `rounded-2xl` (16px)
   - Step Badge Container: `rounded-xl` (12px)
3. **Cart Item Card with Quantity Selector**:
   - Outer Item Card: `rounded-2xl` (16px)
   - Inner Stepper Button: `rounded-md` (6px)

---

## 4. Surface Hierarchy & Z-Axis Elevation

To achieve depth without harsh shadows or muddy gradients, surfaces follow a strict elevation ladder:

| Level | Class Name | Light Mode Background | Dark Mode Background | Shadow |
| :--- | :--- | :--- | :--- | :--- |
| **0. Canvas** | `bg-canvas` | `#ffffff` | `#020617` | None |
| **1. Primary Card** | `card-base` | `#ffffff` | `#0f172a` | `0 1px 3px rgba(0,0,0,0.05)` |
| **2. Subtle Card** | `card-subtle` | `#f8fafc` | `#1e293b` | None (1px border) |
| **3. Elevated Card** | `card-elevated` | `#ffffff` | `#1e293b` | `0 4px 20px -2px rgba(0,0,0,0.08)` |
| **4. Floating Modal**| `modal-surface` | `#ffffff` | `#1e293b` | `0 20px 25px -5px rgba(0,0,0,0.2)` |
| **5. Slide Drawer** | `drawer-surface`| `#ffffff` | `#0f172a` | `0 25px 50px -12px rgba(0,0,0,0.25)`|

### Dark Mode Elevation Rule:
The brightness difference between a background and a container sitting on it remains $\le 12\%$ in dark mode (`#020617` to `#0f172a` to `#1e293b`), maintaining an eye-safe, cohesive dark theme.
