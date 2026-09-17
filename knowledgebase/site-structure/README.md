# Site Structure & Styling Architecture Knowledge Base

This folder provides a complete, developer-friendly guide to how styling, design tokens, responsive geometry, components, and theming work across the **LuxeStore / Mrbulk** e-commerce storefront, designed to align directly with **MedusaJS Storefront Architecture**.

---

## Documentation Index

| File | Description | Core Topics |
| :--- | :--- | :--- |
| **[`medusajs-styling-architecture.md`](./medusajs-styling-architecture.md)** | **MedusaJS Architecture Guide** | Layered CSS (`@layer`), Medusa UI semantic tokens, `clx` class utility, fine-grained breakpoints |
| **[`globalscss.md`](./globalscss.md)** | Global CSS & Next.js Architecture | App Router layout integration, `globals.css`, PostCSS, Tailwind configuration, provider stack |
| **[`indexcss.md`](./indexcss.md)** | Core Design Tokens & `globals.css` | CSS variables, `:root` vs `.dark`, layer breakdown, token mapping, radius tokens |
| **[`texts.md`](./texts.md)** | Typography & Text Sizing | Font stacks, fluid `clamp()` heading scales, tracking, tabular numbers, contrast |
| **[`tabs.md`](./tabs.md)** | Tab Navigation & Segmented Controls | Account tabs, product detail tabs, mobile scroll vs desktop sidebar, motion easing |
| **[`containers-and-cards.md`](./containers-and-cards.md)** | Containers, Cards & Geometry | Outer `max-w-7xl` bounds, `rounded-2xl` standardization, mathematical nested radii |
| **[`buttons-and-controls.md`](./buttons-and-controls.md)** | Buttons & Interactive Controls | Golden 2:1 padding ratio, 44px mobile touch targets, 1:1 circular buttons |
| **[`theming-and-colors.md`](./theming-and-colors.md)** | Theming & Color Engine | Dynamic store themes (`blue`, `indigo`, `emerald`, etc.), dark mode, hero dark scope |
| **[`responsive-and-sizing.md`](./responsive-and-sizing.md)** | Responsive Framework & Sizing | Mobile-first breakpoints, 2-to-4 column product grids, mobile bottom action bar |
| **[`forms-and-inputs.md`](./forms-and-inputs.md)** | Forms & Input Controls | Text inputs, focus rings (`focus-visible`), search cancel reset, custom selects |
| **[`badges-and-pricing.md`](./badges-and-pricing.md)** | Badges, Status & Pricing | Tabular prices, discount percentage pills, pulsing stock dots, shipment status |

---

## Core Architectural Standards

1. **MedusaJS-Aligned Layering**: Global styles are strictly divided into `@layer base`, `@layer components`, and `@layer utilities` in `globals.css` to prevent Tailwind JIT specificity clashes.
2. **Medusa Class Utility (`clx`)**: Use `clx` (or alias `cn`) from `@/lib/util/clx` for clean, clash-free Tailwind class concatenation.
3. **Standardized Radii**: Main containers and cards standardize on `rounded-2xl` (`var(--radius-2xl)` = 16px), aliased to Medusa's `rounded-large`.
4. **Golden Button Padding**: Button horizontal padding is exactly twice the vertical padding (`px-4 py-2`, `px-6 py-3`, `px-8 py-4`).
5. **Fluid Typography**: Primary headings scale smoothly between mobile and desktop via CSS `clamp()` to eliminate awkward wrapping.
6. **Accessible Contrast**: All text pairings meet or exceed WCAG AA requirements in both light and dark modes.
7. **No Layout Shift**: Financial numerals and timers use `font-variant-numeric: tabular-nums` (`.price-tag`).
