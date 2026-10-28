# Industrial Edge - Fullstack E-Commerce & Full Customs Admin Panel

A high-performance Next.js 16 + Node.js Express full-stack e-commerce platform for industrial computing, tech accessories, gaming hardware, and consumer electronics, equipped with a comprehensive **End-to-End ("Start Dot to End Dot") Custom Admin Panel**.

---

## ⚡ Quick Start

### 1. Run Everything Concurrently (Backend + Frontend)
```bash
npm run dev:all
```
- **Node.js Express Backend API:** `http://localhost:5000`
- **Next.js Storefront:** `http://localhost:3000`
- **Full Customs Admin Panel:** `http://localhost:3000/admin`

### 2. Run Individually
- **Node.js Backend Server:**
  ```bash
  npm run server
  ```
  *(Runs on port 5000 with CORS, JSON database, REST API, and uploads)*

- **Next.js Frontend:**
  ```bash
  npm run dev
  ```
  *(Runs on port 3000, proxies to backend or falls back seamlessly to embedded API)*

---

## 🔐 Admin Panel Credentials

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin) (or `/admin/login`)
- **Default Email:** `admin@industrialedge.pk`
- **Default Password:** `admin123`
*(There is also an "Autofill Demo Credentials" button on the login screen for 1-click access)*

---

## 🛠️ Full Customs Admin Panel ("Start Dot to End Dot")

The Admin Control Panel gives you 100% control over the entire website:

1. 📊 **Executive Dashboard (`/admin`)**:
   - Real-time revenue metrics, total orders, active catalog count, unread inquiries.
   - Monthly sales trajectory chart and order pipeline status breakdown.
   - Quick fulfillment table for recent customer orders.

2. 📦 **Products Catalog (`/admin/products`)**:
   - Full CRUD (Create, Read, Update, Delete) products.
   - Set Title, Slug, Category, Selling Price, Original Price (for strike-through discount), Stock quantity.
   - Configure status badges (`Discount`, `New`, `Hot`, `None`).
   - 1-click In Stock / Out of Stock status toggle.
   - Choose storefront display zones: `Trending Grid`, `Best Sellers`, `Featured Tabs`.

3. 🛒 **Customer Orders Fulfillment (`/admin/orders`)**:
   - Real-time order tracking with status filters (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - Customer shipping details, phone, email, full address.
   - Ordered items breakdown with item images, quantities, and line totals.
   - Courier tracking number assigner (TCS, Leopard, DHL).
   - Printable invoice and packing slip view.

4. 🎨 **Start-to-End Hero & Banners Customizer (`/admin/banners`)**:
   - **Hero Showcase:** Change Headline 1, Headline 2, Subtitle, Price tag, Featured Laptop Image URL, Background Image URL, and Shop Now CTA.
   - **GameConsole Destiny Banner:** Customize title, old price, yellow price, Sale 70% badge, TV image, and link.
   - **Dual Camera Save Big Banner:** Customize badge, title, subtitle, CTA button, and camera images.
   - Live visual preview side-by-side!

5. 🏷️ **Categories Management (`/admin/categories`)**:
   - Manage categories with icons, banner images, descriptions, and dynamic product counts.

6. ⚙️ **Store & Site Settings (`/admin/settings`)**:
   - Store Name, Tagline, Logo URL, Favicon.
   - Support phone number, support email, warehouse physical address, working hours.
   - Currency symbol (`$`, `Rs.`, `PKR`), Tax rate %, Free shipping minimum threshold.
   - Top announcement bar ticker text and active switch.

7. 🎟️ **Discounts & Coupons (`/admin/coupons`)**:
   - Add coupon codes (e.g., `EDGE20`, `WELCOME10`), percentage or fixed amount, minimum spend limit, and expiry date.

8. ✉️ **Customer Messages & Inquiries (`/admin/messages`)**:
   - View inquiries submitted via the public Contact Us page.
   - Mark as read, mark as replied, or reply directly via email.

---

## 📡 Node.js Express REST API Reference

The backend operates on `http://localhost:5000/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/stats` | Dashboard statistics & analytics |
| `GET` | `/api/products` | Get products (supports `?category=`, `?search=`, `?status=`, `?featured=`) |
| `GET` | `/api/products/:id` | Get single product by ID or slug |
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/:id` | Update existing product |
| `PATCH`| `/api/products/:id/stock` | Toggle or update stock count |
| `DELETE`| `/api/products/:id` | Delete product from catalog |
| `GET` | `/api/categories` | Get categories with dynamic counts |
| `POST` | `/api/categories` | Create new category |
| `PUT` | `/api/categories/:id` | Update category |
| `DELETE`| `/api/categories/:id` | Delete category |
| `GET` | `/api/orders` | Get orders (supports `?status=`, `?search=`) |
| `GET` | `/api/orders/:id` | Get order details |
| `POST` | `/api/orders` | Create order (called during checkout) |
| `PUT` | `/api/orders/:id` | Update order status and tracking |
| `DELETE`| `/api/orders/:id` | Delete order |
| `GET` | `/api/banners` | Get promotional banner configuration |
| `PUT` | `/api/banners` | Update visual banners |
| `GET` | `/api/settings` | Get site & store settings |
| `PUT` | `/api/settings` | Update site & store settings |
| `GET` | `/api/coupons` | List all discount coupons |
| `POST` | `/api/coupons/verify` | Verify coupon against cart subtotal |
| `GET` | `/api/inquiries` | List customer contact inquiries |
| `POST` | `/api/inquiries` | Submit inquiry from Contact page |
| `PATCH`| `/api/inquiries/:id` | Mark inquiry read / replied |
| `POST` | `/api/upload` | Upload image file (saved to `/uploads`) |
| `POST` | `/api/auth/login` | Admin login |

---

## 🧪 Testing

Run the Vitest test suite:
```bash
npm test
```
All unit tests for frontend logic and backend API pass cleanly.
