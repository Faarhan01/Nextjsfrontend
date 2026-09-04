# Global Styles & Design System Architecture

This document provides a comprehensive reference for the global styling architecture, CSS design tokens, typography scale, form systems, and interactive UI patterns implemented across the **LuxeStore** e-commerce platform.

---

## 1. Core Design Philosophy & Principles

The storefront adheres to modern enterprise e-commerce standards and leading design systems:
- **Predictable Token Hierarchy**: All colors, surfaces, borders, and shadows are defined as semantic CSS custom properties in `:root` and `.dark`.
- **High Legibility & Accessible Contrast**: Adheres strictly to WCAG AA guidelines with high-contrast text against surfaces in both light and dark themes.
- **Mathematical Geometry & Radii Scaling**: Consistent outer and inner radii math (`Outer Radius - Padding = Inner Radius`) ensuring crisp container aesthetics.
- **Aspect Ratio Locking**: Strict 1:1 square constraints on circular buttons (`btn-icon-circle`, `rounded-full`) preventing distortion across diverse viewport sizes.

---

## 2. Font System & Typography Scale

### Primary Font Stack
- **Headings & Body UI**: `"Plus Jakarta Sans"`, `"Inter"`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Monospace & Order IDs / SKU / Code**: `"JetBrains Mono"`, `ui-monospace`, `SFMono-Regular`, `monospace`

### Heading Sizing & Letter-Spacing Rules
| Element | Font Size | Letter Spacing | Font Weight | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| `h1` | `clamp(1.875rem, 4vw, 2.75rem)` | `-0.03em` | 750 (ExtraBold) | 1.15 |
| `h2` | `clamp(1.5rem, 3vw, 2rem)` | `-0.025em` | 700 (Bold) | 1.20 |
| `h3` | `clamp(1.25rem, 2.5vw, 1.5rem)` | `-0.02em` | 650 (SemiBold) | 1.30 |
| `h4` | `1.125rem` (18px) | `-0.015em` | 600 (SemiBold) | 1.40 |
| `h5` | `1.000rem` (16px) | `-0.01em` | 600 (SemiBold) | 1.45 |
| `h6` | `0.875rem` (14px) | `-0.005em` | 600 (SemiBold) | 1.50 |
| `p.lead`| `1.125rem` (18px) | Normal | 400 | 1.70 |
| `body` | `0.9375rem` - `1.000rem` | Normal | 400 - 500 | 1.60 - 1.65 |
| `small`| `0.8125rem` (13px) | Normal | 400 | 1.40 |

---

## 3. Semantic Design Tokens & CSS Variables

All color references are mapped through CSS custom variables for instant runtime switching between light and dark modes.

### A. Surface & Canvas Tokens
| CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#ffffff` | `#020617` | Main page background |
| `--bg-surface` | `#ffffff` | `#0f172a` | Default card & container surface |
| `--bg-surface-elevated` | `#ffffff` | `#1e293b` | Modals, drawers, dropdown menus |
| `--bg-surface-subtle` | `#f8fafc` | `#0f172a` | Table headers, secondary blocks |
| `--bg-surface-hover` | `#f1f5f9` | `#1e293b` | List item and card hover background |
| `--bg-surface-active` | `#e2e8f0` | `#334155` | Clicked / pressed background state |
| `--bg-overlay` | `rgba(15, 23, 42, 0.5)` | `rgba(2, 6, 23, 0.75)` | Backdrop scrim for modals and drawer |

### B. Typography & Foreground Tokens
| CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#0f172a` | `#f8fafc` | Main headings, product titles |
| `--text-secondary` | `#475569` | `#cbd5e1` | Descriptions, metadata, labels |
| `--text-muted` | `#64748b` | `#94a3b8` | Timestamps, placeholder text, hints |
| `--text-subtle` | `#94a3b8` | `#64748b` | Inactive icons, subtle counts |
| `--text-accent` | `#2563eb` | `#60a5fa` | Primary links, brand highlights |

### C. Borders & Separators
| CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--border-default` | `#e2e8f0` | `#1e293b` | Standard card and section borders |
| `--border-subtle` | `#f1f5f9` | `#0f172a` | Inner dividing lines |
| `--border-strong` | `#cbd5e1` | `#334155` | Emphasized containers |
| `--border-interactive` | `#94a3b8` | `#475569` | Hover borders on interactive controls |
| `--border-focus` | `#2563eb` | `#3b82f6` | Keyboard focus ring outline |

---

## 4. E-Commerce Specific Tokens & Styles

### Pricing Typography & Tokens
- `--price-primary`: `#0f172a` (Light) / `#f8fafc` (Dark)
- `--price-sale`: `#e11d48` (Light) / `#fb7185` (Dark)
- `--price-original`: `#94a3b8` (Light) / `#64748b` (Dark)
- **Tabular Numbers (`tnum`)**: All prices apply `font-variant-numeric: tabular-nums` via `.price-tag` to avoid horizontal jitter during quantity or discount recalculation.
- **Discount Pills (`.price-discount-pill`)**: Render savings percentage cleanly in high-contrast rose badges.

### Badges & Stock Indicators
- `.badge-sale`: Highlight discounted flash items.
- `.badge-new`: Tag newly arrived catalog additions.
- `.badge-success` / `.badge-warning` / `.badge-danger`: Order status indicators (`Delivered`, `Processing`, `Cancelled`).
- `.stock-dot-in`, `.stock-dot-low`, `.stock-dot-out`: Real-time stock status dots with pulse animations for low inventory warnings.

---

## 5. Form Controls & Inputs Standard

All form controls apply automatic styling without requiring repetitive inline classes:

- **Text Inputs, Emails, Selects & Textareas**:
  - Background: `var(--input-bg)`
  - Border: `1px solid var(--input-border)`
  - Border Radius: `var(--radius-md)` (0.75rem)
  - Focus Ring: `0 0 0 3px var(--input-ring)`
  - Subtle transition on border color and focus box-shadow.
- **Checkboxes & Radio Controls**:
  - `accent-color: var(--btn-primary-bg)`
  - Tactile active state with slight spring scale (`transform: scale(0.92)`).
- **Form Typography**:
  - `.form-label`: Semibold label with uniform bottom margin.
  - `.form-helper-text`: Muted guidance text below inputs.
  - `.form-error-text`: Red error validation message.

---

## 6. Button & Interactive Action Controls

### Button Variants
- `.btn-primary`: Brand blue button with high-contrast white text and hover elevation.
- `.btn-secondary`: Subtle surface button with interactive hover border.
- `.btn-outline`: Transparent background with border-strong frame.
- `.btn-ghost`: Borderless utility button for secondary actions.
- `.btn-danger`: Red action button for irreversible deletions.

### Button Sizes
- `.btn-sm`: `min-height: 34px`, padding `0.375rem 0.875rem`, font size `0.8125rem`.
- `.btn` (default): `min-height: 40px`, padding `0.625rem 1.25rem`, font size `0.875rem`.
- `.btn-lg`: `min-height: 48px`, padding `0.75rem 1.5rem`, font size `1rem`.

### Circular Action Buttons (`.btn-icon-circle`)
- Applied to wishlist hearts, quick-view eyes, cart icon triggers, and close buttons.
- Features `aspect-ratio: 1 / 1`, `rounded-full`, and centered flex alignment to guarantee true circular geometry across all responsive breakpoints.

---

## 7. Cards, Glassmorphism & Elevation

- `.surface-card`: Base e-commerce product card with border radius `var(--radius-xl)` (1.25rem).
- `.surface-card-hover`: Dynamic card hover state adding soft depth shadows and subtle border highlighting.
- `.surface-elevated`: Floating modals and mega-menus with radius `var(--radius-2xl)` (1.5rem).
- `.surface-glass`: Backdrop-filter blur (`12px`) with semi-transparent background for sticky headers and search overlays.

---

## 8. Utilities & Animations

- `@utility animate-shimmer` & `@utility skeleton`: Smooth gradient shimmer placeholder animation for lazy-loaded product cards and images.
- `@utility scrollbar-thin`: Elegant 6px custom scrollbar that adjusts automatically for dark mode.
- `@utility scrollbar-none`: Utility for horizontally scrolling carousel strips.
- `:focus-visible`: Accessible 2px focus ring with 2px offset for keyboard navigation.
