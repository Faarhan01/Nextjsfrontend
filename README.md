# LuxeStore WooCommerce Storefront

A high-performance e-commerce storefront with Express API backend and Next.js App Router frontend, featuring an AI Concierge powered by Gemini, live product catalog management, custom wishlists, checkout, and order tracking.

---

## 🚀 Quick Start (Local & Portable Deployment)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 1. Installation

Clone or download the repository and install dependencies:

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your `GEMINI_API_KEY` (optional, for AI features):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running in Development Mode

To start both the Express backend server and Next.js dev server on a single unified port (`3000`):

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building & Production Mode

To build for production:

```bash
npm run build
```

To start the compiled production server:

```bash
npm start
```

---

## 📁 Architecture Overview

- **`server.ts`**: Express application entry point integrating Next.js request handler and API routes.
- **`backend/src/`**:
  - `controllers/`: Request handling logic for AI, Auth, Orders, Products, and Utilities.
  - `routes/`: Express router definitions mounted on `/api/*`.
  - `middleware/`: Authentication, rate limiting, and error handling.
  - `services/`: In-memory stores and Gemini API integration.
- **`frontend/src/`**:
  - `app/`: Next.js App Router root layouts and pages.
  - `components/`: Modular, feature-grouped UI components (`products/`, `cart/`, `account/`, `admin/`, `ai/`, `auth/`, `layout/`, `ui/`).
  - `lib/medusa/`: Medusa Store API client (`client.ts`) with local preset fallback.
  - `types/`: Shared TypeScript interfaces.

---

## 🛠 Features

- **Full E-Commerce Journey**: Product discovery, category & brand filtering, quick view, cart, checkout, and order tracking.
- **Admin Dashboard**: Live store stats, product CRUD, and Next.js code exporter.
- **AI Concierge**: Real-time shopping assistant leveraging Gemini AI for product recommendations.
- **Unified Express & Next.js Server**: Single-port setup ensures seamless CORS-free API communication.
