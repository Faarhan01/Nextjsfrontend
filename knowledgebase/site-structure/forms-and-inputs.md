# Forms & Input Controls Styling

This document outlines the form systems, text inputs, selects, textareas, checkboxes, radio buttons, and focus-visible standards implemented across the storefront.

---

## 1. Global Input Styling Foundation

In `index.css`, standard form controls receive baseline styling automatically without requiring repetitive utility classes on every element:

```css
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="url"],
input[type="date"],
textarea,
select {
  font-family: inherit;
  font-size: 0.875rem; /* 14px */
  color: var(--input-text);
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md); /* 8px */
  padding: 0.625rem 0.875rem;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  width: 100%;
}
```

---

## 2. Interactive Focus States (`focus-visible`)

Keyboard accessibility and visual feedback are handled via CSS focus-rings:

```css
input:focus,
textarea:focus,
select:focus {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
  background-color: var(--input-bg);
  outline: none;
}
```

- **Ring Color**: `rgba(59, 130, 246, 0.25)` (Light) / `rgba(96, 165, 250, 0.25)` (Dark).
- **Clear Contrast**: Prevents invisible focus states on dark backgrounds.

---

## 3. Dedicated Utility Class: `.input-control`

For components utilizing specialized markup (such as Search Bars, Promo Code fields, and Modal inputs), the `.input-control` class is available:

```css
.input-control {
  background-color: var(--input-bg);
  color: var(--input-text);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-md);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.input-control:hover:not(:disabled) {
  border-color: var(--input-border-hover);
}

.input-control:focus {
  border-color: var(--input-border-focus);
  box-shadow: 0 0 0 3px var(--input-ring);
  outline: none;
}
```

---

## 4. Checkboxes & Radio Buttons

Checkboxes and radios utilize native browser acceleration paired with the dynamic theme color via CSS `accent-color`:

```css
input[type="checkbox"],
input[type="radio"] {
  accent-color: var(--btn-primary-bg);
  cursor: pointer;
  width: 1.125rem;
  height: 1.125rem;
  vertical-align: middle;
  border-radius: var(--radius-sm);
  transition: transform 0.1s ease;
}

input[type="checkbox"]:active,
input[type="radio"]:active {
  transform: scale(0.92);
}
```

---

## 5. Search Input Resetting

To prevent browser-injected cancel icons from misaligning custom search button layouts, native WebKit search cancel decorations are stripped:

```css
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}
```

---

## 6. Helper & Error Text Standards

- **Helper Text (`.form-helper-text`)**: `0.75rem` (12px), `color: var(--text-muted)`, line height `1.4`.
- **Validation Error Text (`.form-error-text`)**: `0.75rem` (12px), `color: var(--badge-sale-text)` (Rose 600), font weight `550`.
