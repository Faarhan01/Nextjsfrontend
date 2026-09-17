# Typography & Text Styling System

This document specifies the typography foundation, font stacks, fluid scale calculations, tracking rules, and text contrast standards applied across the storefront.

---

## 1. Font Families & Loading

```css
:root {
  --font-sans: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

- **`--font-sans`**: Used for all UI interfaces, product titles, headlines, badges, buttons, and navigation.
- **`--font-mono`**: Reserved for SKU codes, Order IDs (e.g. `MB-84920`), bank account numbers, branch codes, and tracking numbers.

---

## 2. Fluid Heading Scale (CSS `clamp()`)

To ensure headings never overflow or break awkwardly on small mobile devices while retaining strong editorial presence on wide displays, the primary headings use fluid mathematical `clamp()` functions in `index.css`:

```css
h1 {
  font-size: clamp(1.875rem, 4vw, 2.75rem); /* 30px to 44px */
  letter-spacing: -0.03em;
  font-weight: 750;
  line-height: 1.15;
}

h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);      /* 24px to 32px */
  letter-spacing: -0.025em;
  font-weight: 700;
  line-height: 1.2;
}

h3 {
  font-size: clamp(1.25rem, 2.5vw, 1.5rem); /* 20px to 24px */
  letter-spacing: -0.02em;
  font-weight: 650;
  line-height: 1.3;
}

h4 {
  font-size: 1.125rem;                      /* 18px */
  letter-spacing: -0.015em;
  font-weight: 600;
}

h5 {
  font-size: 1rem;                          /* 16px */
  letter-spacing: -0.01em;
  font-weight: 600;
}

h6 {
  font-size: 0.875rem;                      /* 14px */
  letter-spacing: -0.005em;
  font-weight: 600;
}
```

---

## 3. Optical Letter-Spacing (Tracking) Rules

As font size increases, letter spacing must tighten optically to maintain cohesive word shapes:
- **Display Headlines (`h1`)**: `-0.03em` tracking
- **Section Headers (`h2`)**: `-0.025em` tracking
- **Card Titles (`h3`)**: `-0.02em` tracking
- **Labels & Micro-Copy**: Uppercase badges and table column headers use positive tracking (`tracking-wider` or `0.05em`) for legibility at small sizes (10px–11px).

---

## 4. Tabular Numbers (`tabular-nums`) for Financial Data

Financial data, cart totals, product prices, and countdown timers use `font-variant-numeric: tabular-nums` (via the `.price-tag` class or Tailwind `tabular-nums`).

### Why Tabular Numbers?
With proportional numbers, the digit `1` is much narrower than `8`. As prices change or quantities recalculate, prices with proportional numbers cause noticeable horizontal text jitter. Tabular numbers enforce monospaced digits within proportional text, guaranteeing zero layout shift.

```css
.price-tag {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--price-primary);
}
```

---

## 5. Body Text & Line Height Hierarchy

- **Lead Paragraphs (`p.lead`)**: `1.125rem` (18px), line height `1.7`, `color: var(--text-secondary)`
- **Standard Body Text**: `0.9375rem` - `1.000rem` (15px–16px), line height `1.65`
- **Metadata & Subtext**: `0.8125rem` - `0.875rem` (13px–14px), line height `1.5`
- **Micro-Badges & Status**: `0.6875rem` - `0.75rem` (11px–12px), bold, line height `1.2`
- **Line Length Constraint**: Body copy is constrained to `65ch` - `75ch` (`max-w-prose` or `max-w-2xl`) to prevent visual fatigue on desktop screens.

---

## 6. Contrast & Accessibility Standards

- **Normal Text (< 18px)**: Must exceed **4.5:1** contrast ratio against background (WCAG AA).
  - Light mode: `#0f172a` (Slate 900) on white delivers **15.6:1**.
  - Dark mode: `#f8fafc` (Slate 50) on `#020617` delivers **18.4:1**.
- **Large Text (≥ 18px bold)**: Must exceed **3:1** contrast ratio.
- **No Gray Text on Colored Surfaces**: Badges with colored backgrounds always use dark saturated text variants or crisp pure white text to prevent muddy readability.
