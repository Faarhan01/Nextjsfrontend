# Database Synchronization Guide (Google AI Studio ↔ Local PC)

This guide documents the persistent database architecture and step-by-step procedures for synchronizing store data (products, categories, brands, orders, and user accounts) between **Google AI Studio** and your **Local PC** via GitHub or direct 1-click import/export.

---

## 1. Architectural Overview

The application utilizes a file-backed JSON database engine located at:
```
data/db.json
```

### Key Principles:
1. **Single Source of Truth**: All runtime mutations (adding/editing products, updating stock, creating orders, user registrations) write through `backend/src/services/dbManager.ts` directly to `data/db.json`.
2. **Git Tracking Enabled**: The root `.gitignore` explicitly whitelists and tracks this file (`!data/db.json`). When you push to GitHub, your entire catalog and user database travel with your source code.
3. **In-Memory Cache with Debounced Disk Flushing**: Reads are executed at memory speed; mutations are written to memory and asynchronously persisted to disk with atomic debouncing (`dbManager.schedulePersist()`).
4. **Hot-Reloadable Engine**: You can pull new database updates and load them into runtime memory on the fly without rebooting the server.

---

## 2. Syncing from Google AI Studio to Your Local PC

When you add new products, edit categories, or test orders in Google AI Studio:

### Step 1: Ensure Data is Saved
Data is saved automatically after every change. You can also force-save anytime from the Admin UI:
- Open **Admin Dashboard** → **Settings** tab → **Database Sync** sub-tab.
- Click **"Save to db.json"** (or make an API call).

### Step 2: Push Changes to GitHub
Push your repository from Google AI Studio to GitHub using your Git workflow or the export/commit tool.

### Step 3: Pull on Your Local Machine
Open your terminal in your local clone and run:
```bash
git pull origin main
```

### Step 4: Verify
Your local development server (`npm run dev` or `node server.ts`) will now read the identical catalog, department categories, and order history from `data/db.json`.

---

## 3. Syncing from Your Local PC to Google AI Studio

When working, testing, or importing products locally on your personal computer:

### Step 1: Commit and Push from Local PC
Make your changes locally, then commit and push `data/db.json`:
```bash
# Check that data/db.json is modified
git status

# Commit and push
git add data/db.json
git commit -m "chore(db): update store catalog and database snapshot"
git push origin main
```

### Step 2: Pull Changes in Google AI Studio
In your Google AI Studio environment, pull the latest commits from your GitHub repository.

### Step 3: Hot-Reload Active Runtime Memory
Because the Node.js process keeps an active in-memory cache, choose any of the following to reload the pulled database into active memory:

#### Option A: 1-Click from Admin UI (Recommended)
1. Go to **Admin Dashboard** (`/admin`).
2. Click **Settings** in the sidebar or top bar.
3. Select the **Database Sync** sub-tab.
4. Click the **"Reload from Disk"** button.
5. The live catalog will instantly refresh with your latest PC updates.

#### Option B: Terminal Command
Run a quick curl command in your terminal:
```bash
curl -X POST http://localhost:3000/api/store/sync \
  -H "Content-Type: application/json" \
  -d '{"action": "reload"}'
```

#### Option C: Server Restart
Restarting the dev server also loads `data/db.json` automatically on boot.

---

## 4. Alternative: 1-Click GUI Sync (No Git Required)

If you want to quickly copy data between machines without using Git:

1. On the source machine (e.g. AI Studio):
   - Navigate to **Admin** → **Settings** → **Database Sync**.
   - Click **"Download db.json"**.
2. Transfer or email the downloaded `db-backup-YYYY-MM-DD.json` file.
3. On the destination machine (e.g. your local PC):
   - Navigate to **Admin** → **Settings** → **Database Sync**.
   - Click **"Import Backup"** and choose your JSON file.
   - The system validates the schema, replaces active state, and saves directly to disk.

---

## 5. API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/store/sync` | `GET` | Returns sync status, file path, version, entity counts, and git instructions. |
| `/api/store/sync?download=true` | `GET` | Streams the complete `data/db.json` file as an attachment download. |
| `/api/store/sync` | `POST` | Executes actions: `{"action": "save"}` (flush to disk), `{"action": "reload"}` (reload from disk), or `{"action": "import", "database": {...}}` (import payload). |
| `/api/sync` | `GET` / `POST` | Direct alias for `/api/store/sync`. |

### Example Payloads:

#### Reload from Disk:
```json
{
  "action": "reload"
}
```

#### Force Save:
```json
{
  "action": "save"
}
```

#### Import Database:
```json
{
  "action": "import",
  "database": {
    "_version": "1.0.0",
    "categories": [...],
    "products": [...],
    "brands": [...],
    "orders": [...],
    "users": [...]
  }
}
```

---

## 6. Database Schema Structure

The `data/db.json` file follows a structured schema:

```json
{
  "_version": "1.0.0",
  "lastSyncedAt": "2026-09-06T11:45:00.000Z",
  "syncInstructions": "Committed to git repository. Syncs across Google AI Studio and local GitHub clones automatically.",
  "categories": [
    {
      "id": 1,
      "name": "Kitchenware & Dining",
      "imageUrl": "https://images.unsplash.com/...",
      "icon": "data:image/svg+xml;utf8,...",
      "description": "...",
      "itemCount": 24,
      "subcategories": [...]
    }
  ],
  "products": [
    {
      "id": "prod-001",
      "title": "Cast Iron Dutch Oven 6L",
      "name": "Cast Iron Dutch Oven 6L",
      "category": "Kitchenware & Dining",
      "categoryId": 1,
      "price": 899.99,
      "stock": 45,
      "images": [...]
    }
  ],
  "brands": [...],
  "orders": [...],
  "users": [...]
}
```

---

## 7. Best Practices & Conflict Prevention

1. **Pull Before Making Major Edits**: If you make changes on PC, pull them in AI Studio before modifying products there (or vice versa) to avoid Git merge conflicts.
2. **Resolve Conflicts Easily**: If Git flags a conflict on `data/db.json`, choose either the local or remote version, run `npm run build`, and use the Admin **Database Sync** interface to verify entity counts.
3. **Periodic Backups**: Use the **"Download db.json"** button to create dated snapshots before performing bulk catalog updates or database schema modifications.
