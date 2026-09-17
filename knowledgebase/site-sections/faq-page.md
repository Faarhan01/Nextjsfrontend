# FAQ (Frequently Asked Questions) Styling Architecture

The FAQ Page (`/frontend/src/app/faq/page.tsx` and `@modules/content/templates/faq-page.tsx`) provides an accessible knowledge base organized by category topics with instant search filtering and collapsible accordion disclosures.

---

## 1. Hero Search & Topic Categories

- **Live Question Filter**:
  ```tsx
  <div className="relative max-w-lg mx-auto mt-6">
    <input
      type="search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Type a question (e.g. shipping, returns, warranty)..."
      className="w-full pl-11 pr-4 py-3 rounded-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
    />
    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
  ```

- **Topic Category Tabs**:
  - Horizontal chip track: `flex items-center justify-center gap-2 flex-wrap mt-6`
  - Categories: "All", "Shipping & Delivery", "Returns & Refunds", "Payments & Security", "Orders & Tracking", "Products & Bulk"
  - Active chip: Bound to `currentTheme.bg` with white text.

---

## 2. Accordion Question Cards

Each question item uses accessible accordion styling:
- **Card Container**: `card-base overflow-hidden transition-all duration-200 mb-3`
- **Question Trigger**:
  ```tsx
  <button
    onClick={() => toggleAccordion(item.id)}
    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white"
  >
    <span>{item.question}</span>
    <ChevronDown
      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
        isOpen ? 'rotate-180 text-blue-600' : ''
      }`}
    />
  </button>
  ```
- **Answer Body**:
  - Enclosed in an animated expansion container (`motion.div` or CSS grid height transition).
  - Body copy: `px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3`.
  - Helpful feedback buttons: "Was this helpful? Yes / No" chips with thumbs-up icons.

---

## 3. Direct Helpdesk Escalation Card

At the base of the FAQ page:
- `card-base p-6 sm:p-8 text-center max-w-xl mx-auto mt-12 bg-slate-50 dark:bg-slate-900/50`
- Message: "Still have questions? Our customer support team is available 7 days a week."
- Direct CTA button routing to `/contact`.
