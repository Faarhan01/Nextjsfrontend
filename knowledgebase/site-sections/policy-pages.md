# Legal & Policy Pages Styling Architecture

The legal, compliance, and store policy pages (Terms & Conditions, Privacy Policy, Shipping Policy, Returns & Refunds Policy) provide a standardized, readable reading layout.

---

## 1. Document Reading Container

Legal pages prioritize legibility and line length constraints:
- **Max Width**: `max-w-4xl mx-auto py-8 px-4 sm:px-6`
- **Main Document Card**:
  ```tsx
  <div className="card-base p-6 sm:p-12 shadow-sm">
    {/* Document Header */}
    <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Legal Notice</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
        </div>
        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="btn-secondary px-3 py-2 rounded-xl text-xs font-bold hidden sm:flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Document</span>
        </button>
      </div>
      <div className="text-xs text-slate-500 mt-3">Last Updated: January 15, 2026</div>
    </div>

    {/* Prose Content */}
    <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
      {/* Sections */}
    </div>
  </div>
  ```

---

## 2. Typography & Section Hierarchy

- **Section Titles (H2)**:
  - `text-base sm:text-lg font-black text-slate-900 dark:text-white mt-8 mb-3 flex items-center gap-2`
  - Numbered badge: `w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center`
- **Paragraphs**:
  - `text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed`
  - Max line measure: 70–75 characters (`ch`).
- **Callout & Notice Boxes**:
  - Important legal warnings use notice surfaces:
    ```tsx
    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs my-4 leading-relaxed">
      <strong>Important Notice:</strong> By accessing and using this storefront, you agree to comply with all applicable e-commerce laws and regulations.
    </div>
    ```

---

## 3. Print Styles (`@media print`)

Policy pages include print-friendly rules:
- Suppress headers, footers, popovers, and floating elements (`print:hidden`).
- Remove box shadows and set borders to clean hairlines (`print:border-slate-300 print:shadow-none`).
- Force high contrast black text on white backgrounds (`print:text-black print:bg-white`).
