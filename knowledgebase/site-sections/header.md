# Header & Navigation Bar Styling Architecture

The storefront header provides a floating, sticky glassmorphic navigation bar that dynamically responds to scroll state, theme preferences, and viewport sizing. It combines MedusaJS storefront layout practices with responsive micro-interactions.

---

## 1. Component Architecture & Source Files

- **Container Header**: `/frontend/src/@modules/layout/components/store-header.tsx`
- **Desktop Nav Links**: `/frontend/src/@modules/layout/components/desktop-nav-links.tsx`
- **Header Actions**: `/frontend/src/@modules/layout/components/header-actions.tsx`
- **Mobile Drawer**: `/frontend/src/@modules/layout/components/mobile-nav-drawer.tsx`
- **Layout Host**: `/frontend/src/@modules/layout/templates/storefront-layout.tsx`

---

## 2. Layout, Positioning & Geometry

### Sticky Floating Island Pattern
Unlike conventional full-width edge-to-edge bars, the header is structured as a centered, floating navigation island:
- **Outer Wrapper**:
  ```tsx
  <header className="sticky top-2 sm:top-3.5 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto pointer-events-none mb-2 sm:mb-4 relative">
  ```
- **Inner Pill Surface**:
  ```tsx
  <div className="pointer-events-auto rounded-2xl sm:rounded-full border backdrop-blur-2xl px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-4 relative z-50 transition-[box-shadow,background-color,border-color] duration-150 ...">
  ```

### Height & Sizing Constants
- Height constraint: `h-9 sm:h-10` for the inner content container, providing an ultra-sleek, compact bar profile (`~48px` to `~54px` total rendered height).
- Corner radius: `rounded-2xl` on mobile devices transitioning seamlessly to full pill `sm:rounded-full` on tablets and desktops.
- Pointer events management: Outer `<header>` wrapper sets `pointer-events-none` so unpadded transparent gutter space allows clicks through to the underlying page, while the inner island sets `pointer-events-auto`.

---

## 3. Glassmorphism, Surfaces & Scroll States

The header evaluates scroll depth using `window.scrollY > 10` alongside active drawer/megamenu state:

### Rest State (Top of Page)
```tsx
bg-card-translucent border-card text-theme-primary shadow-lg shadow-slate-900/5 dark:shadow-black/30 ring-1 ring-slate-900/5 dark:ring-slate-800/80
```
- Light mode background: `color-mix(in srgb, var(--card-bg) 90%, transparent)` with `backdrop-blur-2xl`.
- Subtle drop shadow with a delicate `1px` inner ring for separation against high-contrast hero photography.

### Scrolled State (Scroll Depth > 10px or Open Overlays)
```tsx
bg-card-translucent-strong border-card text-theme-primary shadow-xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-900/5 dark:ring-slate-800/80
```
- Light mode background: `color-mix(in srgb, var(--card-bg) 95%, transparent)`, elevating opacity for enhanced text readability over complex content.
- Deeper drop shadow (`shadow-xl`) creating distinct z-index elevation.

---

## 4. Brand Logo Styling

```tsx
<Link href="/" className="group flex items-center gap-2 text-slate-900 dark:text-slate-100 focus:outline-none">
  <div className={`w-7 h-7 rounded-full ${currentTheme.bg} text-white flex items-center justify-center shadow-xs ${currentTheme.shadow} group-hover:scale-105 transition-transform duration-200`}>
    {/* SVG Shopping Bag Icon */}
  </div>
  <span className="font-sans font-extrabold text-sm sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
    {logoText}
  </span>
</Link>
```
- **Icon Badge**: Fixed 28px circular icon (`w-7 h-7 rounded-full`) bound directly to the dynamic theme background (`currentTheme.bg`, e.g. `bg-blue-600`) with subtle hover scaling (`group-hover:scale-105`).
- **Typography**: Display weight `font-extrabold` (750–800) with tightened tracking (`tracking-tight`) in neutral high-contrast tone.

---

## 5. Desktop Navigation Links (`desktop-nav-links.tsx`)

The navigation bar features high-contrast navigation pills:
- **Active Route Pill**:
  ```tsx
  ${currentTheme.lightBg} font-bold shadow-2xs
  ```
  - Light mode: Tinted theme wash (e.g. `bg-blue-50 text-blue-700`).
  - Dark mode: Elevated slate background (e.g. `dark:bg-blue-950/50 dark:text-blue-300`).
- **Inactive Link**:
  ```tsx
  text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-full px-2.5 lg:px-3 py-1.5 text-xs font-semibold
  ```
- **Interactive Badges**:
  - Deals link features an animated flame or "Hot" pill badge (`badge-sale`) with tabular styling.

---

## 6. Action Button Controls (`header-actions.tsx`)

Header action buttons (Search, Theme Toggle, Wishlist, Cart, Mobile Menu) use circular 1:1 aspect ratio button containers:

```tsx
/* Standard Action Icon Button */
className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors relative"
```

### Cart Counter Badge
```tsx
<span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full ${currentTheme.bg} text-white text-[10px] font-bold flex items-center justify-center shadow-xs ${currentTheme.shadow}`}>
  {cartCount}
</span>
```
- Fixed minimum dimensions `18px × 18px` with center alignment.
- Bound dynamically to current store theme accent.
- Tabular digit rendering to prevent width jitter when incrementing.

---

## 7. Mobile Navigation Drawer (`mobile-nav-drawer.tsx`)

When toggled via the hamburger icon (`Menu`), a full mobile slide-over sheet appears:
- **Backdrop Overlay**:
  - `fixed inset-0 bg-black/60 backdrop-blur-sm z-50`
  - Animated opacity transition via `motion/react`.
- **Slide-out Surface**:
  - `fixed top-0 right-0 bottom-0 w-[85%] max-w-xs bg-white dark:bg-slate-900 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto`
  - Border left separator: `border-l border-slate-200 dark:border-slate-800`.
- **Navigation Links**:
  - Minimum 44px touch targets (`py-3 px-4 rounded-xl text-sm font-semibold flex items-center gap-3`).
  - Active links feature theme wash backgrounds and accent indicator bars.
