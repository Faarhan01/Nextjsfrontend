# Buttons & Interactive Controls

This document defines the button hierarchy, padding ratios, touch target accessibility standards, and micro-interaction behaviors implemented across the storefront.

---

## 1. The 2:1 Horizontal-to-Vertical Padding Standard

All buttons across the storefront strictly adhere to the golden **2:1 horizontal-to-vertical padding ratio**. This ensures natural visual balance and avoids cramped or overly stretched buttons.

| Button Size | Vertical Padding | Horizontal Padding | Tailwind Class | Total Height |
| :--- | :--- | :--- | :--- | :--- |
| **Small (`btn-sm`)** | `0.375rem` (6px) | `0.750rem` (12px) | `px-3 py-1.5` | ~34px |
| **Medium (`btn`)** | `0.500rem` (8px) | `1.000rem` (16px) | `px-4 py-2` | ~40px |
| **Standard Action** | `0.625rem` (10px) | `1.250rem` (20px) | `px-5 py-2.5` | ~44px |
| **Large Action** | `0.750rem` (12px) | `1.500rem` (24px) | `px-6 py-3` | ~48px |
| **Hero / Primary CTA** | `1.000rem` (16px) | `2.000rem` (32px) | `px-8 py-4` | ~56px |

> **Audit Enforcement**: Irregular padding combinations such as `px-8 py-3` or `px-4 py-3` have been eliminated in favor of exact 2:1 pairs (`px-8 py-4`, `px-6 py-3`, `px-4 py-2`).

---

## 2. Touch Target Accessibility (Mobile 44px+ Rule)

On touch devices (screens `< 640px`), buttons and interactive icons maintain a minimum physical hit area of **44px × 44px** to comply with WCAG 2.1 Success Criterion 2.5.5:
- Stepper buttons (`+` and `-` in Cart): `w-10 h-10` on mobile (`w-10 h-10 flex items-center justify-center`).
- Close buttons (`X` in modals and cart drawer): `w-10 h-10` touch bounds.
- Floating action buttons and mobile sticky action bars: `min-h-[44px]` height.

---

## 3. Strict 1:1 Aspect Ratio on Circular Buttons

Circular icon buttons (such as carousel arrows, close triggers, and social links) must remain perfectly square to avoid turning into distorted ovals on different screens:

```html
<!-- Example Circular Button -->
<button className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center shrink-0 cursor-pointer">
  <ChevronRight className="w-4 h-4" />
</button>
```

- **Enforcement Rules**:
  - Equal width and height (`w-9 h-9`, `w-8 h-8`, `w-10 h-10`).
  - Flex centering (`flex items-center justify-center`).
  - `shrink-0` to prevent flex containers from compressing the button horizontally.
  - `rounded-full` (`border-radius: var(--radius-full)`).

---

## 4. Button Variants & Semantic States

### A. Primary Button (`.btn-primary`)
- Background: `var(--btn-primary-bg)` (dynamic theme accent)
- Text: Pure `#ffffff` (`var(--btn-primary-text)`)
- Shadow: Subtle colored elevation (`shadow-md shadow-blue-600/20`)
- Hover: 10% darkening / opacity shift
- Active: Micro-press scaling (`active:scale-98` or `active:scale-95`)

### B. Secondary Button (`.btn-secondary`)
- Background: `var(--btn-secondary-bg)`
- Border: `1px solid var(--btn-secondary-border)`
- Text: `var(--btn-secondary-text)`
- Hover: `background-color: var(--btn-secondary-hover)`

### C. Outline Button (`.btn-outline`)
- Background: Transparent
- Border: `1px solid var(--border-strong)`
- Text: `var(--text-primary)`
- Hover: Subtle surface background fill (`hover:bg-slate-50 dark:hover:bg-slate-800`)

### D. Danger Button (`.btn-danger`)
- Background: `#e11d48` (Rose 600)
- Text: `#ffffff`
- Used exclusively for destructive actions (e.g. Empty Cart, Delete Address, Remove Item).

---

## 5. Single-Line Label Constraint

Button and pill text never wrap, hyphenate, or truncate awkwardly onto two lines:
- `white-space: nowrap`
- Inline icon + text layout with strict horizontal gap (`gap-1.5` or `gap-2`).
