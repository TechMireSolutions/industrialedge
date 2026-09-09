# Industrial Edge - Full-Stack E-commerce Platform

A modern, full-stack e-commerce application built with React, Node.js/Express, TypeScript, Prisma ORM, and SQLite.

## Features

### Storefront (Customer-facing)
- **Dynamic Home Page** - Hero carousel, services, product offers, featured/new/top-selling/bestseller products
- **Shop Page** - Search, category filtering, price range, sorting, pagination, grid/list view
- **Product Detail** - Image gallery, related products, reviews, add to cart/wishlist
- **Shopping Cart** - Real-time updates, quantity management, coupon validation
- **Checkout** - Billing/shipping addresses, Cash on Delivery, order summary
- **User Authentication** - Register, login, JWT with httpOnly cookies, protected routes
- **Account Dashboard** - Profile, addresses, order history, wishlist
- **Wishlist** - Add/remove products, move to cart
- **Contact Form** - Functional contact form with backend storage
- **Dynamic Footer Pages** - About, Returns, Privacy Policy, Terms, FAQ, etc.
- **Responsive Design** - Mobile-first with Bootstrap 5

### Admin Panel
- **Dashboard** - Statistics, recent orders, low stock alerts
- **Product Management** - Full CRUD with images, categories, variants, badges
- **Category Management** - Hierarchical categories with product counts
- **Order Management** - View, filter, update status, payment status
- **User Management** - View users, change roles, delete
- **CMS Features**:
  - Hero Slides management
  - Banners management
  - Offers/Promotions management
  - Services management
  - Footer content management
  - Site settings (branding, social links, theme colors)
  - Custom pages management
- **Coupons** - Percentage/fixed amount, usage limits, expiry
- **Reviews** - Approve/reject customer reviews
- **Contact Submissions** - View and manage contact form submissions

### Technical Stack
- **Frontend**: React 18, Vite, React Router 6, Bootstrap 5, Font Awesome
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with httpOnly cookies, bcrypt password hashing
- **File Upload**: Multer with local storage (cloud-ready)
- **Payment**: Cash on Delivery (Strictly enforced)
- **Validation**: Zod schema validation
- **Error Handling**: Centralized error handling with consistent responses

## Project Structure

```
industrial-edge/
├── electro-react/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin panel pages
│   │   │   ├── account/    # User account pages
│   │   │   └── auth/       # Login/Register pages
│   │   ├── services/       # API service layer
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.jsx         # Main app with routing
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── validators/     # Zod validation schemas
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database URL and secrets
```

4. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed database (optional):
```bash
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd electro-react
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env if needed (default points to localhost:3000)
```

4. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5174`

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5174

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Cookie
COOKIE_SECRET=your-cookie-secret

# Email Configuration (for Admin and Order notifications)
SMTP_HOST=your-smtp-host
SMTP_PORT=your-smtp-port
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/svg+xml
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Industrial Edge
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update profile
- `PUT /api/auth/me/password` - Change password

### Products
- `GET /api/products` - List products (with filters, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/top-selling` - Get top selling
- `GET /api/products/bestsellers` - Get bestsellers
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/:id/related` - Get related products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/products/categories` - List categories
- `GET /api/products/categories/:id` - Get category by ID
- `GET /api/products/categories/slug/:slug` - Get category by slug
- `POST /api/products/categories` - Create category (Admin)
- `PUT /api/products/categories/:id` - Update category (Admin)
- `DELETE /api/products/categories/:id` - Delete category (Admin)

### Cart & Wishlist
- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove cart item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/merge` - Merge guest cart with user cart
- `GET /api/cart/wishlist` - Get wishlist
- `POST /api/cart/wishlist` - Add to wishlist
- `DELETE /api/cart/wishlist/:productId` - Remove from wishlist

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin` - Get all orders (Admin)
- `PUT /api/orders/admin/:id/status` - Update order status (Admin)
- `POST /api/coupons/validate` - Validate coupon code

### CMS (Admin)
- `GET /api/hero-slides` - Get hero slides
- `GET /api/banners` - Get banners
- `GET /api/offers` - Get offers
- `GET /api/services` - Get services
- `GET /api/footer` - Get footer content
- `GET /api/settings` - Get site settings
- `GET /api/pages` - Get pages
- `GET /api/pages/:slug` - Get page by slug

### Admin Only
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders/recent` - Recent orders
- `GET /api/admin/products/low-stock` - Low stock products
- `GET /api/admin/reports/sales` - Sales report

## Default Credentials

After seeding the database:
- **Admin**: admin@industrialedge.com / admin123
- **Customer**: customer@example.com / customer123

## Deployment

### Backend
1. Build: `npm run build`
2. Start: `npm start`
3. Set production environment variables

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting (Netlify, Vercel, GitHub Pages, etc.)
3. Configure `VITE_API_URL` to point to production API

### Database
- Run migrations: `npm run prisma:migrate deploy`
- Or use `prisma db push` for development

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens in httpOnly, secure, sameSite cookies
- Role-based access control (Customer/Admin)
- Input validation with Zod on all endpoints
- SQL injection prevention via Prisma ORM
- CORS configured for frontend domain only
- Rate limiting ready (can be added with express-rate-limit)
- XSS protection via React's built-in escaping
- CSRF protection via sameSite cookies

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and feature requests, please open a GitHub issue.
