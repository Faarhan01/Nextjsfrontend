# Order Tracking & Live Logistics Styling Architecture

The Order Tracking Page (`/frontend/src/app/(main)/order-tracking/page.tsx` and `@modules/account/templates/order-tracking-page.tsx`) provides real-time shipment transparency with a multi-stage timeline, courier information, and tracking number lookups.

---

## 1. Tracking Lookup Card

- **Container**: `card-base max-w-xl mx-auto p-6 sm:p-8 mb-8 text-center`
- **Icon Stage**: `w-12 h-12 rounded-full ${currentTheme.lightBg} flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400`
- **Headline**: `text-xl font-extrabold text-slate-900 dark:text-white`
- **Form Inputs**:
  - Dual inputs for Order Number (e.g., `ORD-2026-9042`) and Customer Email.
  - "Track Order" submit button: `btn-primary rounded-xl w-full py-3 font-bold text-xs flex items-center justify-center gap-2`.

---

## 2. 4-Stage Visual Progress Stepper

When an active order is loaded, a horizontal timeline stepper displays current parcel progress:
- **Stages**:
  1. **Order Placed**: Payment confirmed and verified.
  2. **Processing**: Picked and packaged at fulfillment warehouse.
  3. **Dispatched / In Transit**: Handed to courier with active tracking.
  4. **Delivered**: Successfully signed for at customer doorstep.

### Timeline Step Styling:
```tsx
<div className="relative flex items-center justify-between my-8 px-4">
  {/* Connecting Background Line */}
  <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-0" />
  
  {/* Active Progress Fill Line */}
  <div
    className={`absolute left-8 top-1/2 -translate-y-1/2 h-1 ${currentTheme.bg} transition-all duration-500 -z-0`}
    style={{ width: `${progressPercentage}%` }}
  />

  {/* Stage Nodes */}
  {stages.map((stage) => (
    <div key={stage.name} className="relative z-10 flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
        stage.isCompleted
          ? `${currentTheme.bg} text-white shadow-xs`
          : stage.isCurrent
          ? `ring-4 ring-blue-500/20 ${currentTheme.bg} text-white animate-pulse`
          : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
      }`}>
        {stage.isCompleted ? <Check className="w-4 h-4" /> : stage.index}
      </div>
      <span className="text-[11px] font-bold mt-2 text-slate-800 dark:text-slate-200">{stage.name}</span>
      <span className="text-[9px] text-slate-400 font-medium">{stage.date}</span>
    </div>
  ))}
</div>
```

---

## 3. Courier & Dispatch Details Card

- **Carrier Identity**: Logo/Badge of courier (e.g. Courier Guy, DHL, FedEx, Fastway).
- **Tracking Number Row**:
  - `font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2`
  - Copy button with 1-click clipboard notification.
- **Estimated Arrival**:
  - Prominent delivery estimate badge (`text-emerald-700 dark:text-emerald-300 font-extrabold text-sm`).

---

## 4. Package Itemized Summary

Below the tracking timeline, a compact summary of the order's contents appears:
- Product thumbnail (`w-12 h-12 rounded-lg object-cover`)
- Product title & selected variants
- Quantity and unit price
- Order total breakdown
