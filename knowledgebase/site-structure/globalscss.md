# Global CSS Architecture & MedusaJS-Aligned Next.js Storefront

This document outlines how global styles, design tokens, and Tailwind CSS are structured in accordance with **MedusaJS storefront conventions** while preserving 100% of our existing styles, themes, and layouts.

---

## 1. Entry Point & Layer Hierarchy

Following official **MedusaJS Next.js Storefront** architecture:
- Primary stylesheet is located at `/frontend/src/app/globals.css`.
- Root layout (`/frontend/src/app/layout.tsx`) imports `./globals.css`.
- For total backwards compatibility, `/frontend/src/index.css` acts as a proxy re-exporting `./app/globals.css`.

```tsx
// /frontend/src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css'; // Primary MedusaJS-aligned global stylesheet
import { StoreProvider } from '@/context/StoreContext';
import { AppProviders } from '@/providers/app-providers';
import { StorefrontLayout } from '@modules/layout/templates/storefront-layout';
```

### Tailwind Layer Ordering (`@layer`)

Medusa storefronts structure CSS using strict Tailwind layers to eliminate specificity bugs and ensure smooth JIT compilation:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

/* 1. Design Tokens (:root and .dark) */
:root { ... }
.dark { ... }

/* 2. Base Layer (@layer base) */
@layer base {
  /* Resets, body, html, font smoothing */
  /* Fluid typography clamp() headings */
  /* Global input & button resets */
  /* Accessible focus indicators (:focus-visible) */
}

/* 3. Components Layer (@layer components) */
@layer components {
  /* .btn, .btn-primary, .btn-secondary, etc. */
  /* .card-base, .checkout-step-surface, .order-summary-surface */
  /* .surface-card, .drawer-surface, .modal-surface */
  /* .badge, .badge-sale, .badge-new, etc. */
  /* .tab-pill-active, .table-container */
}

/* 4. Utilities Layer (@layer utilities) */
@layer utilities {
  /* .scrollbar-none, .scrollbar-thin */
  /* .price-tag (tabular-nums), .price-sale */
  /* .stock-dot-*, .bg-card, .text-theme-* */
}
```

---

## 2. Medusa Utility Class Helper (`clx` / `cn`)

Following Medusa storefront conventions, the storefront provides `clx` (and alias `cn`) in `/frontend/src/lib/util/clx.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind classes without style conflicts, following MedusaJS storefront architecture.
 */
export function clx(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const cn = clx
```

### Usage Example:
```tsx
import { clx } from "@/lib/util/clx"

export function ProductCard({ className, isSelected }: { className?: string; isSelected?: boolean }) {
  return (
    <div className={clx("card-base p-4 transition-all", isSelected && "border-blue-600 ring-2 ring-blue-500/20", className)}>
      ...
    </div>
  )
}
```

---

## 3. Tailwind Configuration (`tailwind.config.mjs`)

Our `tailwind.config.mjs` extends Tailwind's theme with Medusa UI design tokens and responsive breakpoints:

```js
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/@modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        '7xl': '80rem',
        '8xl': '100rem',
      },
      screens: {
        '2xsmall': '320px',
        'xsmall': '512px',
        'small': '1024px',
        'medium': '1280px',
        'large': '1440px',
        'xlarge': '1680px',
        '2xlarge': '1920px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        // Medusa UI Named Radii
        soft: 'var(--radius-md)',
        base: 'var(--radius-lg)',
        rounded: 'var(--radius-xl)',
        large: 'var(--radius-2xl)',
        circle: '9999px',
      },
      colors: {
        // Medusa UI Semantic Theme Tokens
        ui: {
          bg: {
            base: 'var(--ui-bg-base)',
            subtle: 'var(--ui-bg-subtle)',
            component: 'var(--ui-bg-component)',
            field: 'var(--ui-bg-field)',
            elevated: 'var(--ui-bg-elevated)',
          },
          fg: {
            base: 'var(--ui-fg-base)',
            subtle: 'var(--ui-fg-subtle)',
            muted: 'var(--ui-fg-muted)',
            onColor: 'var(--ui-fg-on-color)',
          },
          border: {
            base: 'var(--ui-border-base)',
            strong: 'var(--ui-border-strong)',
            subtle: 'var(--ui-border-subtle)',
          },
        },
      },
      transitionTimingFunction: {
        medusa: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 4. Theme & Provider Architecture

The storefront wraps the application inside `AppProviders` (`/frontend/src/providers/app-providers.tsx`), which orchestrates:
- `ThemeProvider`: Manages `themeColor` (e.g., `'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate'`) and dark mode state (`isDark`).
- `UIProvider`: Controls global UI state including mobile menus, filter drawers, and search modals.
- `CartProvider`: Real-time cart state with synchronized pricing utilities.
- `AuthProvider`: User session, profile data, and address books.
- `ToastProvider`: Floating notification toasts using `.toast-surface`.
