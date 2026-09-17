# MedusaJS Styling Architecture & Storefront Integration Guide

This document explains the styling, CSS, Tailwind, and component-level architecture implemented across the storefront, matching the official **MedusaJS Next.js Storefront** patterns while preserving 100% of our existing visual designs and features.

---

## 1. Architectural Philosophy: MedusaJS Patterns

Official MedusaJS storefronts (`medusajs/nextjs-starter-medusa` and `@medusajs/ui`) follow five core styling conventions:

1. **Layered CSS Architecture (`@layer base`, `@layer components`, `@layer utilities`)**:
   Instead of unstructured, flat CSS rules, global styles are explicitly segmented into Tailwind's native cascade layers. This ensures predictable specificity and eliminates style conflicts between Tailwind utilities and custom classes.

2. **Semantic Design Tokens**:
   Colors and surfaces are not tied to hardcoded hex codes or arbitrary palette names. Instead, they use semantic roles:
   - `ui.bg.base`, `ui.bg.subtle`, `ui.bg.component`, `ui.bg.field`, `ui.bg.elevated`
   - `ui.fg.base`, `ui.fg.subtle`, `ui.fg.muted`, `ui.fg.onColor`
   - `ui.border.base`, `ui.border.strong`, `ui.border.subtle`
   - `ui.button.primary`, `ui.button.secondary`

3. **Centralized Utility Merging with `clx`**:
   Rather than manual string interpolation (`className={"btn " + (isActive ? "active" : "")}`), Medusa uses the `clx` utility (combining `clsx` and `twMerge`) located in `src/lib/util/clx.ts`. This safely resolves overlapping Tailwind classes (e.g. `p-4` overridden by `p-6`).

4. **Extended Responsive Breakpoints**:
   Medusa introduces specialized fine-grained viewport breakpoints alongside standard Tailwind screens:
   - `2xsmall`: `320px` (Compact mobile devices)
   - `xsmall`: `512px` (Phablets and wide smartphones)
   - `small`: `1024px` (Tablets / Laptops)
   - `medium`: `1280px` (Standard desktop)
   - `large`: `1440px` (Wide desktop displays)
   - `xlarge`: `1680px` (High-res workstations)
   - `2xlarge`: `1920px` (Full HD ultra-wide)

5. **Named Border Radii (`soft`, `base`, `rounded`, `large`, `circle`)**:
   Medusa provides semantic radius naming in `tailwind.config.mjs` that maps to our standardized `rounded-2xl` / `16px` tokens:
   - `soft` → `var(--radius-md)` (8px)
   - `base` → `var(--radius-lg)` (12px)
   - `rounded` → `var(--radius-xl)` (16px)
   - `large` → `var(--radius-2xl)` (16px)
   - `circle` → `9999px`

---

## 2. File Organization Mapping

| Purpose | Previous Path | Medusa-Aligned Current Path | Description |
| :--- | :--- | :--- | :--- |
| **Primary Global Styles** | `src/index.css` | `src/app/globals.css` | Organized with `@layer base`, `@layer components`, `@layer utilities` |
| **Backwards Compatibility** | — | `src/index.css` | Re-exports `./app/globals.css` to prevent legacy breaks |
| **Tailwind Config** | `tailwind.config.mjs` | `tailwind.config.mjs` | Extended with Medusa tokens, screens, fonts, and radii |
| **Utility Helper** | — | `src/lib/util/clx.ts` | Medusa-standard `clx` / `cn` class merger using `tailwind-merge` |
| **Layout Entry Point** | `src/app/layout.tsx` | `src/app/layout.tsx` | Imports `./globals.css` directly |

---

## 3. How to Use Medusa Styling in Components

### A. Using `clx` for Dynamic Classes
```tsx
import { clx } from "@/lib/util/clx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "base" | "lg"
}

export function Button({ variant = "primary", size = "base", className, ...props }: ButtonProps) {
  return (
    <button
      className={clx(
        "btn inline-flex items-center justify-center font-semibold transition-all",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-secondary",
        variant === "outline" && "btn-outline",
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        className
      )}
      {...props}
    />
  )
}
```

### B. Using Medusa Semantic Color Tokens
```tsx
// Using Medusa semantic utility classes:
<div className="bg-ui-bg-base text-ui-fg-base border-ui-border-base border rounded-large p-6 shadow-sm">
  <h3 className="text-ui-fg-base font-bold text-lg">Order Details</h3>
  <p className="text-ui-fg-subtle text-sm">Review your shipping items below.</p>
</div>
```

### C. Using Native Component Surface Classes
```tsx
// Using our unified component surfaces (defined in globals.css @layer components):
<div className="card-base p-6">
  <div className="checkout-step-surface">
    <span className="price-tag text-xl font-bold">R 1,499.00</span>
  </div>
</div>
```

---

## 4. Preservation of Existing Storefront Features

This refactor preserves all existing styling, behavior, and visual polish without regressions:
- All dynamic color theme palettes (`blue`, `indigo`, `emerald`, `rose`, `amber`, `slate`) function identically.
- Dark mode (`.dark`) tokens and contrast ratios remain 100% intact.
- The 16px (`rounded-2xl`) standardized card geometry is preserved.
- The 2:1 golden button padding ratio (`px-4 py-2`, `px-6 py-3`, `px-8 py-4`) is maintained.
- Fluid typography `clamp()` headings continue to scale dynamically across viewports.
- The hero dark-mode lock (`.hero-slider-dark-scope`) continues to maintain consistent contrast.
