# NodeLib — by Lotus & Lithium 🚀

> **A Next-Generation Digital E-Bookstore & Technical Reading Platform Engineered for Software Architects and Developers.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

**NodeLib** is a high-performance, responsive e-commerce web application and in-browser reading platform. It features 3D perspective physics, realistic lighting glare shaders, multi-gateway transaction processing (Razorpay, UPI QR, and Cards), automated customer authentication, and a dedicated Store Owner Management Console.

Powered by **Supabase PostgreSQL**, NodeLib synchronizes user profiles, catalog inventory, customer orders, payment analytics, and digital shelf libraries in real time.

---

## ✨ Key Features

### 🛒 1. Customer Storefront
- **3D Magnetic Book Cards**: Books react to mouse cursor trajectory with 3D perspective transforms (`rotateX`, `rotateY`) and dynamic specular reflection sweeps.
- **Solar Orbit Centerpiece**: Multi-layered rotating orbital rings showcasing curated Dewey Decimal engineering categories.
- **Smart Book Finder Quiz**: Interactive multi-step wizard recommending titles based on experience level and architectural interests.
- **Live Search & Category Filtering**: Instant fuzzy title/author search with smooth horizontal filter chips.
- **Saved Wishlist & Shopping Cart**: Flyout drawer with item counts and price calculations.

### 📖 2. Digital Shelf & In-Browser E-Reader
- **Personal Digital Library**: Purchased titles automatically unlock with instant DRM-free access.
- **Customizable E-Reader**: Includes Light, Sepia, and Dark reading themes, font size scaling, chapter navigation, and PDF downloads.

### 💳 3. Multi-Gateway Payment System
- **Razorpay Express**: Standard credit/debit, net banking, and wallet checkout with signature simulation.
- **Instant UPI & QR Code**: Dynamic QR code for Google Pay, PhonePe, Paytm, and BHIM with VPA string validation.
- **Credit / Debit Cards**: 16-digit auto-formatting, Luhn validation, CVV masking, and 3D Secure banking verification.
- **PostgreSQL Invoicing**: Every transaction logs gross amount, gateway fees (~2%), net payout, and unique transaction references to `public.payments`.

### 🛡️ 4. Store Owner & Admin Command Center (`admin123`)
- **Strict Customer vs. Staff Separation**: Customers only see the clean public storefront; the management console is gated behind a secure access key.
- **Store KPIs & Financial Analytics**: Real-time sales revenue, average order value (AOV), gateway market share, and conversion funnels.
- **Inventory CRUD**: Add, edit pricing, adjust stock levels, or update digital PDF links in PostgreSQL.
- **Customer Orders & Invoices**: Itemized order history and real-time transaction ledger.

### 📱 5. Responsive Design Across All Devices
- **Mobile Devices (320px–480px)**: Compact header with slide-out drawer, overlay search, full-width touch actions, and single-column cards.
- **Tablets (481px–1024px)**: 2-column adaptive grid with momentum-scrolling filter chips.
- **Desktops (1025px+)**: 3-column catalog grid with sticky visual detail panes.
- **Touch-Scrollable Tables**: All financial ledgers and inventory tables include horizontal touch panning with sticky headers.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 (Hooks, Context API)
- **Build Tool**: Vite 6
- **Styling**: Vanilla CSS (CSS Variables, 3D Transforms, Glassmorphism, Keyframe Animations)
- **Database & Auth**: Supabase (PostgreSQL 15, Row Level Security, Auth Triggers)
- **Icons**: Lucide React
- **Visual FX**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm / yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/NodeLib.git
cd NodeLib
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

*(Note: NodeLib includes a local storage fallback, so it runs seamlessly even before connecting Supabase).*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5174/](http://localhost:5174/)** in your browser.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

To set up your Supabase database tables, execute the provided [`supabase_schema.sql`](supabase_schema.sql) script in your **Supabase Project ➔ SQL Editor**:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **SQL Editor** ➔ **New Query**.
3. Paste the contents of `supabase_schema.sql` and click **Run**.

### Tables Created:
- `public.profiles` (User metadata synchronized via `handle_new_user()` trigger)
- `public.books` (Catalog titles, Dewey numbers, pricing, stock, PDF URLs)
- `public.orders` (Customer purchase orders and fulfillment status)
- `public.order_items` (Itemized line items per order)
- `public.payments` (Payment gateway transaction ledger and fee analytics)
- `public.user_library` (Unlocked digital e-books per user)
- `public.wishlist` (Saved customer bookmarks)

---

## 🔑 Store Owner Portal Access

To access the Store Owner & Admin Command Center:
1. Scroll to the footer on the customer storefront and click **Staff Portal** (or sign in with an admin account).
2. Enter the default security key: `admin123`
3. Manage catalog inventory, view live order invoices, inspect financial gateway revenue, and configure cloud database settings.

---

## 📦 Production Build

```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ by Lotus & Lithium**
