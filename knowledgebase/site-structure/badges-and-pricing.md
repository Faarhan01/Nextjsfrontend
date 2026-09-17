# Badges, Status Indicators & Pricing Typography

This document outlines the visual indicators, pricing typography, discount pills, and inventory status systems used throughout the e-commerce storefront.

---

## 1. Pricing Typography System

Pricing across all product cards, detail views, cart items, and checkout summaries utilizes high-contrast formatting with tabular numerals:

```css
.price-tag {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--price-primary);
}

.price-sale {
  color: var(--price-sale); /* Rose 600 in Light, Rose 400 in Dark */
  font-weight: 800;
}

.price-original {
  color: var(--price-original); /* Muted slate */
  text-decoration: line-through;
  font-size: 0.85em;
  font-weight: 400;
}
```

### Currency Formatting Standard
South African Rand (`ZAR` / `R`) formatting is standardized via `formatCurrency()` (`/frontend/src/utils/pricing.ts`), ensuring consistent two-decimal places (`R1,250.00`) or clean rounded amounts when applicable.

---

## 2. Discount & Savings Badges

### A. Discount Percentage Pill (`.price-discount-pill`)
Renders the calculated discount percentage directly next to the original price:

```css
.price-discount-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem; /* 11px */
  font-weight: 750;
  border-radius: var(--radius-full);
  background-color: var(--badge-sale-bg);
  color: var(--badge-sale-text);
  line-height: 1;
}
```

### B. Product Badges
- `.badge-sale`: Highlight promotional deals and wholesale specials.
- `.badge-new`: Tag newly added catalog items.
- `.badge-neutral`: Gray category or condition tags (e.g. `Brand New`, `Refurbished`).

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  border-radius: var(--radius-full);
  line-height: 1;
}
```

---

## 3. Order & Shipment Status Badges

Used in the Order Tracking and My Account dashboard:

```css
.badge-success {
  background-color: rgba(16, 185, 129, 0.15);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.badge-warning {
  background-color: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.badge-danger {
  background-color: var(--badge-sale-bg);
  color: var(--badge-sale-text);
  border: 1px solid rgba(225, 29, 72, 0.25);
}
```

---

## 4. Real-Time Stock Status Dots

Used on Product Cards and Detail Pages to indicate inventory health:

```css
.stock-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  display: inline-block;
  flex-shrink: 0;
}

.stock-dot-in {
  background-color: var(--badge-stock-in); /* Emerald 500 */
}

.stock-dot-low {
  background-color: var(--badge-stock-low); /* Amber 500 */
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.stock-dot-out {
  background-color: var(--badge-stock-out); /* Slate 400 */
}
```

- **In Stock**: Solid emerald dot.
- **Low Stock (< 5 units)**: Amber dot with an active CSS pulse animation to signal urgency.
- **Out of Stock**: Neutral slate dot with an out-of-stock badge.
