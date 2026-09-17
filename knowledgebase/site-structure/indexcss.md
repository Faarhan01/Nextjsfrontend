# `globals.css` & `index.css` — Core Design System Tokens & Layer Architecture

All core styling definitions, design tokens, and CSS layers reside in `/frontend/src/app/globals.css`, with `/frontend/src/index.css` providing direct re-export backwards compatibility.

---

## 1. File Structure Overview

The file follows **MedusaJS Next.js Storefront** standards with strict Tailwind `@layer` encapsulation:

1. **Design Tokens (`:root` and `.dark`)**:
   - Semantic CSS custom properties for surfaces, borders, text, forms, and buttons.
   - Dual-compatibility with **Medusa UI** semantic tokens (`--ui-bg-base`, `--ui-fg-base`, `--ui-border-base`, etc.).
2. **Base Layer (`@layer base`)**:
   - Universal `box-sizing: border-box;`
   - Smooth scrolling, anti-aliased typography rendering, and custom selection color.
   - Fluid `clamp()` headings (`h1` through `h6`).
   - Native inputs, textareas, selects, and checkboxes reset.
   - `:focus-visible` accessibility rings.
3. **Components Layer (`@layer components`)**:
   - Headless buttons (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`).
   - Unified card containers (`.card-base`, `.surface-card`, `.surface-elevated`, `.surface-subtle`).
   - E-commerce surfaces (`.checkout-step-surface`, `.order-summary-surface`, `.drawer-surface`, `.product-card-surface`).
   - Badges & status tags (`.badge`, `.badge-sale`, `.badge-new`, `.badge-success`, etc.).
   - Navigation elements (`.tab-pill-active`, `.tab-pill-inactive`, `.table-container`).
4. **Utilities Layer (`@layer utilities`)**:
   - Cross-browser scrollbar helpers (`.scrollbar-none`, `.scrollbar-thin`).
   - Numeric tabular formatting for financial numerals (`.price-tag`).
   - Dynamic theme color wrappers (`.bg-card`, `.border-card`, `.text-theme-primary`).
   - Real-time stock status dots (`.stock-dot-in`, `.stock-dot-low`, `.stock-dot-out`).

---

## 2. Design Tokens Reference

### A. Border Radius Tokens
Radii are standardized across the entire application to maintain strict geometric consistency:

```css
:root {
  --radius-xs: 0.25rem;   /* 4px  - tags, small chips */
  --radius-sm: 0.375rem;  /* 6px  - code blocks, tooltips */
  --radius-md: 0.5rem;    /* 8px  - form inputs, dropdown items (Medusa: soft) */
  --radius-lg: 0.75rem;   /* 12px - inner cards, image containers (Medusa: base) */
  --radius-xl: 1rem;      /* 16px - sub-panels, secondary containers (Medusa: rounded) */
  --radius-2xl: 1rem;     /* 16px - standardized main cards & containers (Medusa: large) */
  --radius-full: 9999px;  /* Pill badges, circular icon buttons (Medusa: circle) */
}
```

> **Design Standard**: All main cards, modal containers, cart items, and checkout surfaces standardize on `var(--radius-2xl)` (16px) or `rounded-2xl` in Tailwind.

---

### B. Surface & Canvas Colors

| CSS Variable | Light Mode (`:root`) | Dark Mode (`.dark`) | Medusa UI Equivalent | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#ffffff` | `#020617` | `--ui-bg-base` | Root background of the page |
| `--bg-surface` | `#ffffff` | `#1e293b` | `--ui-bg-component` | Default card and container background |
| `--bg-surface-elevated`| `#ffffff` | `#334155` | `--ui-bg-elevated` | Modals, drawers, and floating menus |
| `--bg-surface-subtle` | `#f8fafc` | `#1e293b` | `--ui-bg-subtle` | Table headers, secondary strips |
| `--bg-surface-hover` | `#f1f5f9` | `#334155` | `--ui-bg-subtle-hover` | Hover state for lists and cards |
| `--bg-surface-active` | `#e2e8f0` | `#475569` | `--ui-bg-subtle-pressed`| Clicked / pressed background state |
| `--bg-overlay` | `rgba(15, 23, 42, 0.5)` | `rgba(2, 6, 23, 0.75)` | `--ui-bg-overlay` | Modal and cart drawer backdrops |

---

### C. Typography & Text Colors

| CSS Variable | Light Mode (`:root`) | Dark Mode (`.dark`) | Medusa UI Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--text-primary` | `#0f172a` (Slate 900) | `#f8fafc` (Slate 50) | `--ui-fg-base` | Headings, product titles, bold prices |
| `--text-secondary`| `#475569` (Slate 600) | `#cbd5e1` (Slate 300) | `--ui-fg-subtle` | Body copy, descriptions, navigation |
| `--text-muted` | `#64748b` (Slate 500) | `#94a3b8` (Slate 400) | `--ui-fg-muted` | Timestamps, placeholder text, breadcrumbs |
| `--text-subtle` | `#94a3b8` (Slate 400) | `#64748b` (Slate 500) | Supporting | Secondary icon strokes, dividers |
| `--text-accent` | `#2563eb` (Blue 600) | `#60a5fa` (Blue 400) | `--ui-fg-interactive`| Primary text links and active states |

---

### D. Border Tokens

```css
:root {
  --border-default: #e2e8f0;      /* Standard card and grid dividers (ui-border-base) */
  --border-subtle: #f1f5f9;       /* Inner line separators (ui-border-subtle) */
  --border-strong: #cbd5e1;       /* Emphasized boundaries (ui-border-strong) */
  --border-interactive: #94a3b8;  /* Form control hover borders */
  --border-focus: #2563eb;        /* Active focus ring outline */
}

.dark {
  --border-default: #334155;
  --border-subtle: #1e293b;
  --border-strong: #475569;
  --border-interactive: #64748b;
  --border-focus: #3b82f6;
}
```

---

## 3. Global CSS Utility Classes

### Primary Surfaces
- `.card-base`: Main card container with `var(--card-bg)`, `1px solid var(--card-border)`, `border-radius: var(--radius-2xl)`, and `box-shadow: var(--card-shadow)`.
- `.card-base-hover`: Adds hover transitions for border and shadow elevation.
- `.checkout-step-surface`: Dedicated surface for checkout form sections (`p-6`, `border-radius: var(--radius-2xl)`).
- `.order-summary-surface`: Sticky order summary surface with high-contrast borders and structured spacing.
- `.drawer-surface`: Full-height slide-over cart panel surface with elevated shadow and backdrop clipping.
- `.modal-surface`: Dialog backdrop-safe elevated modal container.

### E-Commerce Utilities
- `.price-tag`: Sets `font-variant-numeric: tabular-nums` to eliminate layout shift during live price and quantity updates.
- `.price-sale`: Bold high-visibility rose discount price styling (`var(--price-sale)`).
- `.price-original`: Strike-through original price formatting.
- `.price-discount-pill`: Compact pill badge showing discount percentages (`-20%`).
- `.stock-dot-in` / `.stock-dot-low` / `.stock-dot-out`: Real-time stock status indicator dots with CSS pulse animation.

### Anti-Flicker Transitions
- `.disable-transitions`: Disables all CSS transitions and animations during initial theme hydration to prevent jarring color interpolation or white flashes.
