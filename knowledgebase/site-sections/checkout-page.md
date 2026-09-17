# Checkout Flow & Multi-Step Page Styling Architecture

The Checkout Page (`/frontend/src/app/(checkout)/checkout/page.tsx` and `@modules/checkout/templates/checkout-page.tsx`) provides a focused, high-conversion purchasing funnel. Distracting elements are subdued to keep attention on completion and buyer security.

---

## 1. Page Header & Security Bar

The checkout experience features a streamlined header:
- **Logo**: Centered or left-aligned with direct back navigation.
- **Security Indicator**:
  ```tsx
  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
    <Lock className="w-3.5 h-3.5" />
    <span>256-bit SSL Encrypted</span>
  </div>
  ```
- **Step Progress Bar**: Visual stepper highlighting Current, Completed, and Upcoming steps.

---

## 2. Layout Structure & Grid

Desktop displays divide into an 8:4 column layout:
- **Left Column (8 Columns)**: Multi-step checkout accordion surfaces.
- **Right Column (4 Columns - Sticky)**: Sticky order summary with itemized lines, discount codes, and total.

---

## 3. Step Containers (`.checkout-step-surface`)

Each step in the checkout process is enclosed in a dedicated step card:

```css
.checkout-step-surface {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-2xl); /* 16px */
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  transition: all 0.2s ease;
}
```

### Step Header Elements:
- **Step Number Pill**:
  - Inactive: `w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center`
  - Active: `w-7 h-7 rounded-full ${currentTheme.bg} text-white font-bold text-xs flex items-center justify-center shadow-xs`
  - Completed: `w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center` with checkmark icon.
- **Step Title**: `text-sm sm:text-base font-extrabold text-slate-900 dark:text-white`
- **Edit Step Action**: If completed, displays an "Edit" button (`text-xs font-bold text-blue-600 hover:underline`).

---

## 4. Form Inputs & Floating Labels

Form controls adhere to standard design system inputs:
- **Input Field**:
  ```tsx
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
    <input
      type="text"
      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
    />
  </div>
  ```
- **Error State**: Red border (`border-rose-500`), subtle rose glow (`ring-2 ring-rose-500/20`), and error helper text in `text-[11px] font-semibold text-rose-500`.

---

## 5. Shipping & Delivery Radio Cards

Customers select shipping speeds via selectable radio cards:
- **Card Styling**:
  ```tsx
  <div className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
    isSelected
      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-600/20'
      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
  }`}>
    <div className="flex items-center gap-3">
      <input type="radio" checked={isSelected} className="text-blue-600 w-4 h-4" />
      <div>
        <div className="text-xs font-bold text-slate-900 dark:text-white">Courier Standard Delivery</div>
        <div className="text-[11px] text-slate-500">2-4 Business Days nationwide</div>
      </div>
    </div>
    <span className="font-bold text-xs price-tag">{formatCurrency(shippingPrice)}</span>
  </div>
  ```

---

## 6. Payment Method Tabs & Card Inputs

Supports multiple South African and international payment methods:
- **Tabs Selection**: Credit / Debit Card, Ozow Instant EFT, Manual Bank Transfer, Cash on Delivery.
- **Card Fields Stage**:
  - Secure credit card inputs with CVV tooltip and auto-formatting card number spacing.
- **Ozow Instant EFT Badge**:
  - Official bank badges (Capitec, FNB, Standard Bank, Absa, Nedbank) with fast redirect notice.

---

## 7. Sticky Checkout Summary (`.order-summary-surface`)

- **Placement**: Sticky sidebar on desktop (`lg:sticky lg:top-8`).
- **Product Line Previews**: Compact item row with tiny thumbnail (`w-12 h-12 rounded-lg`), quantity badge pill, and price calculation.
- **Totals Breakdown**: Subtotal, shipping tier, active discount line in green (`text-emerald-600 font-semibold`), and grand total in high-contrast `2xl` font weight.
- **Primary Order Button**:
  ```tsx
  <button className={`w-full py-3.5 rounded-xl font-black text-sm text-white ${currentTheme.bg} hover:opacity-95 shadow-lg flex items-center justify-center gap-2 tracking-wide`}>
    <ShieldCheck className="w-4 h-4" />
    <span>Place Order • {formatCurrency(total)}</span>
  </button>
  ```

---

## 8. Post-Checkout Confirmation View

Upon successful payment or submission, the page transitions to the order receipt:
- Large green success badge (`w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto`)
- Order number reference chip with a 1-click copy button (`Copy`)
- Direct CTA button routing to `/order-tracking` with the order ID pre-populated.
