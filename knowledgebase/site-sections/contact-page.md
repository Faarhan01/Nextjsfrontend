# Contact Us & Support Page Styling Architecture

The Contact Us Page (`/frontend/src/app/contact/page.tsx` and `@modules/content/templates/contact-page.tsx`) provides multi-channel customer assistance, warehouse branch locations, and an interactive contact inquiry form.

---

## 1. Page Header & Support Overview

- **Hero Header**:
  - `card-base p-6 sm:p-10 mb-8 text-center bg-slate-50 dark:bg-slate-900/50`
  - Eyebrow chip: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.lightBg} inline-flex items-center gap-1.5`
  - Title: `text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white`
  - Subtitle: `text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto`

---

## 2. Fast Support Channels Grid

Displays 3 direct communication cards:
- **Grid Layout**: `grid grid-cols-1 md:grid-cols-3 gap-6 mb-10`
- **Channel Card Structure**:
  ```tsx
  <div className="card-base p-6 flex flex-col items-center text-center">
    <div className={`w-12 h-12 rounded-2xl ${currentTheme.lightBg} flex items-center justify-center mb-4`}>
      <Phone className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Direct Phone Support</h3>
    <p className="text-xs text-slate-500 mb-3">Mon-Fri from 8:00 AM - 5:00 PM</p>
    <a href="tel:+27110000000" className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline">
      +27 (0) 11 000 0000
    </a>
  </div>
  ```
- **Channels**:
  1. **Direct Phone Support**: Hotline number with office hours
  2. **Email Helpdesk**: Dedicated response SLA (within 4 hours)
  3. **Live Chat & WhatsApp**: Instant messaging link

---

## 3. Interactive Contact Form

Occupies a prominent conversion card:
- **Container**: `card-base p-6 sm:p-8 max-w-2xl mx-auto mb-10`
- **Form Controls**:
  - Full Name input
  - Email Address input
  - Subject dropdown (Order Status, Product Inquiry, Returns, Bulk / Wholesale)
  - Message Textarea: `w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs min-h-[140px] focus:ring-2 focus:ring-blue-500/20 outline-none`
- **Submit Button**:
  ```tsx
  <button className={`w-full py-3 rounded-xl font-bold text-xs text-white ${currentTheme.bg} hover:opacity-95 shadow-md flex items-center justify-center gap-2`}>
    <Send className="w-4 h-4" />
    <span>Send Message</span>
  </button>
  ```

---

## 4. Physical Locations & Warehouse Distribution Map

- Displays warehouse depot addresses across major metropolitan hubs (Johannesburg, Cape Town, Durban).
- Address cards include a 1-click "Copy Address" button and "Open in Maps" external link.
