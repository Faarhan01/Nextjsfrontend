# Theming & Color Architecture

This document details the dynamic multi-theme engine, CSS custom properties mapping, light and dark mode switching, and scoped theme overrides in the storefront.

---

## 1. Dynamic Store Accent Themes

The storefront supports 6 dynamic store color accents managed via `ThemeProvider` (`/frontend/src/providers/theme-provider.tsx`):

```ts
export type ThemeColor = 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
```

### Theme Color Palette Map (`getThemeClasses`):

| Color Key | Primary BG | Text Accent | Light BG Tint | Border Accent | Shadow Glow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`blue`** (Default) | `bg-blue-600` | `text-blue-600 dark:text-blue-400` | `bg-blue-50 dark:bg-blue-950/40` | `border-blue-200 dark:border-blue-800` | `shadow-blue-600/20` |
| **`indigo`** | `bg-indigo-600`| `text-indigo-600 dark:text-indigo-400`| `bg-indigo-50 dark:bg-indigo-950/40`| `border-indigo-200 dark:border-indigo-800`| `shadow-indigo-600/20`|
| **`emerald`** | `bg-emerald-600`| `text-emerald-600 dark:text-emerald-400`| `bg-emerald-50 dark:bg-emerald-950/40`| `border-emerald-200 dark:border-emerald-800`| `shadow-emerald-600/20`|
| **`rose`** | `bg-rose-600` | `text-rose-600 dark:text-rose-400` | `bg-rose-50 dark:bg-rose-950/40` | `border-rose-200 dark:border-rose-800` | `shadow-rose-600/20` |
| **`amber`** | `bg-amber-600` | `text-amber-600 dark:text-amber-400` | `bg-amber-50 dark:bg-amber-950/40` | `border-amber-200 dark:border-amber-800` | `shadow-amber-600/20` |
| **`slate`** | `bg-slate-900` | `text-slate-900 dark:text-white` | `bg-slate-100 dark:bg-slate-800` | `border-slate-300 dark:border-slate-700` | `shadow-slate-900/20` |

---

## 2. Light & Dark Mode System

Dark mode is driven by the class `.dark` appended to the root `<html>` element.

### Sophisticated Neutrals
- **Avoid Pure `#000` / `#fff`**:
  - Light mode canvas: `#ffffff` with soft slate borders (`#e2e8f0`).
  - Dark mode canvas: `#020617` (Deep Obsidian Slate) instead of harsh `#000000`.
  - Dark mode surfaces: `#0f172a` (Slate 900) and elevated surfaces `#1e293b` (Slate 800).
- **Legibility Rules**:
  - Never place gray text on colored backgrounds.
  - Body text in dark mode is set to `#cbd5e1` (Slate 300) with headings at `#f8fafc` (Slate 50), eliminating high-contrast eye strain.

---

## 3. Scoped Theming: Hero Slider Dark Scope

To ensure high-impact marketing readability, the Home Hero section uses a permanent dark color scope (`.hero-slider-dark-scope`) regardless of whether the user is in light or dark mode:

```css
.hero-slider-dark-scope,
.hero-slider-dark-scope * {
  --text-primary: #ffffff !important;
  --text-secondary: #e2e8f0 !important;
  --text-muted: #94a3b8 !important;
}

.hero-slider-dark-scope h1,
.hero-slider-dark-scope h2,
.hero-slider-dark-scope h3,
.hero-slider-dark-scope h4 {
  color: #ffffff !important;
}
```

This ensures carousel slides with dark photographic backdrops remain crisp and readable in both light and dark site modes without messy inline color conditions.

---

## 4. Modern CSS Color Mixing (`color-mix`)

The storefront utilizes native CSS `color-mix()` for glassmorphism and subtle background tints without introducing arbitrary inline opacities:

```css
.bg-card-translucent {
  background-color: color-mix(in srgb, var(--card-bg) 90%, transparent) !important;
}

.bg-card-translucent-strong {
  background-color: color-mix(in srgb, var(--card-bg) 95%, transparent) !important;
}
```

This guarantees seamless adaptation when switching dynamically between light mode and dark mode.
