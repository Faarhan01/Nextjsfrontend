# Customer Account & Dashboard Styling Architecture

The Customer Account Dashboard (`/frontend/src/app/(main)/account/page.tsx` and `@modules/account/templates/my-account-page.tsx`) provides an integrated hub for customer profile management, order histories, address books, payment methods, and wishlists.

---

## 1. Dashboard Layout & Navigation

On desktop, the account dashboard organizes into a 12-column responsive layout:
- **Left Navigation Column (3 to 4 Columns)**:
  - User summary card (avatar, full name, email, membership tier badge)
  - Vertical tab list using `.tab-pill-active` and `.tab-pill-inactive`
  - Direct logout action button (`text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40`)
- **Right Content Column (8 to 9 Columns)**:
  - Dynamically rendered section panel based on active tab:
    1. **Overview**: Quick stats (Total Orders, Wishlist Items, Saved Addresses), recent orders preview.
    2. **Orders**: Full order history list with status badges, item breakdowns, and tracking links.
    3. **Addresses**: Multi-address management cards with "Default" chips, add address modal.
    4. **Wishlists**: Custom wishlist collections and saved product shelves.
    5. **Security**: Password change form, two-factor authentication, active sessions.

---

## 2. User Profile Summary Card

- **Container**: `card-base p-6 text-center sm:text-left sm:flex sm:items-center sm:gap-4 mb-6`
- **Avatar Frame**:
  - `w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 overflow-hidden relative group shrink-0`
  - Upload/Change photo badge: `absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white`
- **User Identity**:
  - Full Name: `text-lg font-extrabold text-slate-900 dark:text-white`
  - Email: `text-xs text-slate-500 dark:text-slate-400 mt-0.5`
  - Tier Badge: `badge-new text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-1`

---

## 3. Order History Row Cards

Each order in the order history tab is encapsulated in a dedicated card:
- **Order Header**:
  ```tsx
  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-card">
    <div className="flex items-center gap-4 text-xs">
      <div>
        <span className="text-slate-400 block text-[10px] uppercase font-bold">Order Placed</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{order.date}</span>
      </div>
      <div>
        <span className="text-slate-400 block text-[10px] uppercase font-bold">Total</span>
        <span className="font-bold price-tag text-slate-900 dark:text-white">{formatCurrency(order.total)}</span>
      </div>
      <div>
        <span className="text-slate-400 block text-[10px] uppercase font-bold">Order #</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{order.id}</span>
      </div>
    </div>
    {/* Status Badge */}
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(order.status)}`}>
      {order.status}
    </span>
  </div>
  ```

### Order Status Badges:
- **Delivered**: `bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800`
- **Processing / In Transit**: `bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800`
- **Pending**: `bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800`
- **Cancelled**: `bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800`

---

## 4. Address Book Cards

- **Grid**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **Default Address Card**:
  - Highlighted border: `border-blue-600 dark:border-blue-500 ring-1 ring-blue-500/20`
  - "Default" pill: `text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300`
- **Actions**: "Edit", "Delete", and "Set as Default" inline text buttons.
