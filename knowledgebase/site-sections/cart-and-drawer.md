# Cart & Slide-Over Drawer Styling Architecture

The storefront provides dual shopping cart experiences:
1. **Interactive Slide-Over Drawer** (`cart-drawer.tsx`): Accessible globally from any page via the header cart trigger.
2. **Dedicated Full Cart Page** (`cart-page.tsx` at `/frontend/src/app/(main)/cart/page.tsx`): A comprehensive shopping bag interface with itemized discounts and sticky order summaries.

---

## 1. Slide-Over Cart Drawer Architecture (`cart-drawer.tsx`)

### Motion Easing & Dimensions
The drawer utilizes `motion/react` spring physics for natural tactile motion:
```tsx
<motion.div
  initial={{ x: '100%', opacity: 0.95 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: '100%', opacity: 0.95 }}
  transition={{ type: 'spring', damping: 28, stiffness: 240 }}
  className="fixed top-0 right-0 h-screen w-full max-w-md drawer-surface border-l border-card shadow-2xl z-50 flex flex-col justify-between"
>
```
- **Max Width**: `max-w-md` (`448px` max width on tablet/desktop, `100%` on mobile).
- **Surface Token**: `.drawer-surface` with elevated card background, high-contrast left border, and soft deep shadow (`shadow-2xl`).
- **Backdrop Scrim**: `fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50`.

### Drawer Header
- Left: Circular icon pill with dynamic theme wash (`${currentTheme.lightBg} ${currentTheme.text}`) and item count badge.
- Right: Circular close button with hover feedback (`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500`).

### Free Shipping Dynamic Progress Bar
```tsx
<div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-card">
  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
      <Truck className="w-3.5 h-3.5" />
      {hasFreeShipping ? 'You unlocked Free Shipping!' : `Add ${formatCurrency(amountNeeded)} for Free Shipping`}
    </span>
    <span className="font-bold tabular-nums">{Math.round(progressPercent)}%</span>
  </div>
  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
    <div
      className={`h-full rounded-full ${currentTheme.bg} transition-all duration-300`}
      style={{ width: `${progressPercent}%` }}
    />
  </div>
</div>
```

---

## 2. Dedicated Cart Page Architecture (`cart-page.tsx`)

On `/cart`, the layout splits into an 8:4 desktop grid:
- **Main Cart Column (8 Columns)**:
  - Table / Card list of items
  - Individual line item controls
  - Bulk actions bar (Clear Cart, Continue Shopping)
- **Order Summary Column (4 Columns - Sticky)**:
  - Itemized subtotal, discount, shipping, and taxes
  - Coupon code activation input
  - Primary checkout CTA button
  - Trust and payment security guarantee icons

---

## 3. Cart Line Item Surface Styling

Each product row inside the cart is styled for maximum clarity and touch usability:
- **Card Container**: `card-base p-4 flex gap-4 items-center`
- **Thumbnail Box**:
  - `w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700/60`
- **Item Meta**:
  - Title: `text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:underline`
  - Variant Pills: `text-xs text-slate-500 dark:text-slate-400 font-medium`
  - Stock State: In-stock green indicator pill or low-stock warning.
- **Quantity Stepper Controls**:
  - Compact stepper: `inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 h-8 px-0.5 bg-slate-50 dark:bg-slate-800`
  - Buttons (`Minus`, `Plus`): `w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900`
  - Tabular Digit: `w-8 text-center text-xs font-bold tabular-nums`
- **Price Total**:
  - `font-bold text-sm sm:text-base price-tag text-slate-900 dark:text-white`
- **Delete Button**:
  - `p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors`

---

## 4. Sticky Order Summary (`.order-summary-surface`)

```tsx
<div className="order-summary-surface rounded-2xl p-6 lg:sticky lg:top-24 space-y-4">
  <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
    Order Summary
  </h3>
  
  <div className="space-y-2.5 text-xs sm:text-sm">
    <div className="flex justify-between text-slate-600 dark:text-slate-400">
      <span>Subtotal</span>
      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{formatCurrency(subtotal)}</span>
    </div>
    <div className="flex justify-between text-slate-600 dark:text-slate-400">
      <span>Estimated Shipping</span>
      <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{shippingCostText}</span>
    </div>
  </div>

  {/* Coupon Promo Input */}
  <div className="flex gap-2 pt-2">
    <input
      type="text"
      placeholder="Promo code"
      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    />
    <button className="btn-secondary px-3 py-2 rounded-xl text-xs font-bold">Apply</button>
  </div>

  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-baseline">
    <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
    <span className="text-xl sm:text-2xl font-black price-tag text-slate-900 dark:text-white">{formatCurrency(total)}</span>
  </div>

  <Link
    href="/checkout"
    className={`w-full py-3 rounded-xl font-bold text-sm text-white ${currentTheme.bg} hover:opacity-95 shadow-md flex items-center justify-center gap-2`}
  >
    <span>Proceed to Checkout</span>
    <ArrowRight className="w-4 h-4" />
  </Link>
</div>
```

---

## 5. Empty Cart State

When `cart.length === 0`:
- Centered layout inside `card-base p-12 text-center max-w-md mx-auto my-12`
- Large circular graphic with shopping bag icon (`w-20 h-20 rounded-full ${currentTheme.lightBg} flex items-center justify-center mx-auto mb-4`)
- Headline: `text-xl font-extrabold text-slate-900 dark:text-white`
- Direct CTA: `btn-primary px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2` routing to `/shop`.
