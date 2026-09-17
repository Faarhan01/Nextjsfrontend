# About Us Page Styling Architecture

The About Us Page (`/frontend/src/app/about/page.tsx` and `@modules/content/templates/about-page.tsx`) communicates the brand story, core values, operational scale, and customer commitments.

---

## 1. Hero Showcase Banner

- **Banner Container**:
  - `w-full rounded-2xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800`
- **Pill Badge**:
  - Eyebrow badge: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.lightBg} inline-flex items-center gap-1.5 mb-4`
- **Headline & Narrative**:
  - Headline: `text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight`
  - Subtitle: `text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-3 leading-relaxed`

---

## 2. Quantitative Key Metrics Grid

Highlights business scale through 4 statistics cards:
- **Grid Layout**: `grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-10`
- **Stat Card**:
  ```tsx
  <div className="card-base p-6 text-center">
    <div className="text-3xl sm:text-4xl font-black price-tag text-slate-900 dark:text-white mb-1">
      50,000+
    </div>
    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      Happy Customers
    </div>
  </div>
  ```
- **Tabular Numerals**: Uses `.price-tag` (`tabular-nums`) to ensure balanced digit spacing.

---

## 3. Core Values & Mission Cards

- **Grid**: `grid grid-cols-1 md:grid-cols-3 gap-6 my-10`
- **Value Card**:
  - Top icon container: `w-12 h-12 rounded-xl ${currentTheme.lightBg} flex items-center justify-center mb-4`
  - Title: `text-base font-extrabold text-slate-900 dark:text-white mb-2`
  - Body: `text-xs text-slate-600 dark:text-slate-400 leading-relaxed`
- **Pillars**:
  1. Uncompromising Product Quality
  2. Lightning-Fast Logistics & Dispatch
  3. Customer-First Support Guarantee

---

## 4. Operational Leadership & Storefront CTA

- **Story Narrative**: Balanced reading column constrained to `max-w-3xl mx-auto prose dark:prose-invert` with generous line height (`leading-relaxed`).
- **Footer CTA Card**: Full-width callout banner inviting customers to browse the live collection or become a registered marketplace merchant.
