# LetShopping

A full-stack e-commerce application with a React storefront, an admin dashboard, and a Node.js/Express API backed by MongoDB. Payments are handled by Stripe, product images by Cloudinary, and transactional email by Gmail/nodemailer.

This repository contains two apps:

| Folder | Description | Stack |
| --- | --- | --- |
| `backend/` | REST API, authentication, orders, payments, admin operations | Node.js, Express, Mongoose, JWT, Stripe, Cloudinary, Joi |
| `frontend/` | Customer storefront and admin dashboard | React 18, Vite, Redux Toolkit, React Router, Tailwind CSS, Stripe.js |

The two apps are independent packages that run side by side.

## Features

- Email/password registration with email verification
- JWT authentication and role-based authorization (`customer` / `admin`)
- Product, category, banner, review, cart, and order management
- Stock validation and inventory adjustments on order place / cancel / activate
- Stripe PaymentIntent flow with server-side payment verification
- Admin dashboard for customers, products, categories, banners, orders, and reviews
- Cloudinary image hosting
- Contact form and password reset emails
- Input validation (Joi), rate limiting, Helmet, and CORS allow-listing
- Automated API tests using the Node.js built-in test runner

## Project structure

```text
letshopping/
├── backend/
│   ├── app.js                  # Express app (middleware + routes, no listening)
│   ├── server.js               # Connects to MongoDB and starts the HTTP server
│   ├── config/db.js            # Mongoose connection helpers
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth, admin, validation, rate limiting, errors
│   ├── models/                 # Mongoose schemas
│   ├── requests/               # Joi validation schemas
│   ├── routes/                 # Express routers
│   ├── services/               # Cloudinary / multer configuration
│   ├── utils/                  # Email helper
│   └── tests/                  # node:test API tests
└── frontend/
    ├── src/
    │   ├── components/         # Pages and UI components (customer + admin)
    │   ├── redux/              # Redux Toolkit slices
    │   ├── service/            # Client-side services
    │   └── App-Routing/        # Route definitions and guards
    └── vite.config.js
```

## Prerequisites

- Node.js 20+ and npm
- MongoDB 7+ running locally, or a MongoDB Atlas cluster
- Stripe account (test keys are fine)
- Cloudinary account
- Gmail account with an App Password for sending email

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your values
npm run dev
```

The API starts on `http://localhost:4000` by default.

Health check:

```bash
curl http://localhost:4000/api/status
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_APP_API_URL and VITE_STRIPE_PUBLISHABLE_KEY
npm run dev
```

The storefront runs on `http://localhost:5173`.

> Make sure `VITE_APP_API_URL` uses `http://` and matches the backend origin/port. Using `https://localhost:...` against a plain HTTP server causes browser `Failed to fetch` errors.

### 3. MongoDB

Local MongoDB (default):

```env
LOCAL_MONGODB_URL=mongodb://127.0.0.1:27017/letshop
```

MongoDB Atlas:

```env
CLOUD_MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
```

If you use Atlas, add your current public IP under **Atlas → Network Access**. An un-whitelisted IP fails during the TLS handshake with `SSL alert number 80`.

The backend connects to `LOCAL_MONGODB_URL` first and falls back to `CLOUD_MONGODB_URL`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development`, `production`, or `test` |
| `PORT` | No | API port (default `5000`, project default `4000`) |
| `LOCAL_MONGODB_URL` | One of | Local MongoDB connection string |
| `CLOUD_MONGODB_URL` | One of | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWTs. Use a long random value |
| `BASE_URL` | No | Backend base URL (fallback for email links) |
| `FRONTEND_URL` | Yes | Frontend URL used in verification and reset links |
| `ALLOWED_ORIGINS` | Yes in production | Comma-separated list of allowed browser origins |
| `ADMIN_EMAIL` / `ADMIN_PWD` / `ADMIN_NAME` / `ADMIN_ADDRESS` / `ADMIN_PHONE` | No | Credentials for the optional admin seeding helper |
| `EMAIL_USER` | Yes | Gmail address used as the sender |
| `EMAIL_PASS` | Yes | Gmail App Password |
| `CONTACT_EMAIL` | No | Recipient for contact form messages (defaults to `EMAIL_USER`) |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Yes for uploads | Cloudinary credentials |
| `STRIPE_SECRET_KEY` | Yes for payments | Stripe secret key |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_APP_API_URL` | Yes | Backend base URL, e.g. `http://localhost:4000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |

Never commit real `.env` files. Use `.env.example` as the template.

## Available scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with file watching |
| `npm start` | Start the API |
| `npm test` | Run the API test suite |
| `npm run test:watch` | Re-run tests on change |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Testing

The backend uses the built-in Node.js test runner (`node:test`) and `fetch`, so no extra test dependencies are required.

```bash
cd backend
npm test
```

The tests:

- run against a local MongoDB instance (`127.0.0.1:27017`)
- create and drop isolated `letshop_test_*` databases
- skip real email sending (`NODE_ENV=test`)
- cover registration/login, password reset/change, JWT protection, cart stock rules, order creation, stock restoration, ownership checks, admin-only routes, payment-intent authorization, validation, 404s, and CORS

If MongoDB is not running on the default port, start it before running the tests.

## API overview

All endpoints are prefixed with `/api`.

### Auth and users (`/api/users`)

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/register` | Public | Register a customer |
| POST | `/login` | Public | Log in and receive a JWT |
| GET | `/verify-email/:token` | Public | Verify an email address |
| POST | `/request-password-reset` | Public | Request a reset link |
| POST | `/reset-password/:token` | Public | Reset the password |
| GET | `/me` | Auth | Current user |
| GET | `/profile` | Auth | Current user profile |
| PUT | `/update-profile` | Auth | Update own profile |
| PUT | `/change-password` | Auth | Change own password |
| DELETE | `/delete-account` | Auth | Delete own account |
| GET | `/admin/customers` | Admin | List customers |
| PUT | `/admin/customers/:id/activate` | Admin | Activate a customer |
| PUT | `/admin/customers/:id/deactivate` | Admin | Deactivate a customer |
| PUT | `/admin/customers/:id` | Admin | Update a customer |
| DELETE | `/admin/customers/:id` | Admin | Delete a customer |

### Products (`/api`)

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/products` | Public | List products (supports `categoryName`, `search`) |
| GET | `/products/:id` | Public | Product details + reviews |
| POST | `/search` | Public | Search products by keyword |
| GET | `/category/:category` | Public | Products in a category |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |
| GET | `/products/low-stock` | Admin | Low-stock products |
| PUT | `/products/:id/increase-stock` | Admin | Increase stock |
| PUT | `/products/:id/decrease-stock` | Admin | Decrease stock |

### Cart (`/api`)

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/cart` | Auth | Add an item (validates stock) |
| GET | `/cart` | Auth | Get the current cart |
| DELETE | `/cart/:itemId` | Auth | Remove an item |

### Orders (`/api/orders`)

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| POST | `/place-order` | Auth | Create an order from the cart |
| GET | `/myorders` | Auth | Current user's orders |
| GET | `/myorders/status` | Auth | Current user's orders by status |
| PUT | `/:id/cancel` | Owner/Admin | Cancel and restore stock |
| PUT | `/:id/activate` | Owner/Admin | Reactivate a canceled order |
| DELETE | `/:id` | Owner/Admin | Delete a canceled order |
| POST | `/create-payment-intent` | Owner/Admin | Create a Stripe PaymentIntent |
| POST | `/confirm-payment` | Owner/Admin | Verify payment with Stripe and mark paid |
| GET | `/` | Admin | All orders |
| GET | `/status` | Admin | All orders by status |
| PUT | `/:id/status` | Admin | Update order status |
| PUT | `/update-payment-status/:orderId` | Admin | Manually set payment status |

### Other

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/banners` | Public | List banners |
| POST/PUT/DELETE | `/api/banners/...` | Admin | Manage banners |
| GET | `/api/categories` | Public | List categories |
| POST/PUT/DELETE | `/api/categories/...` | Admin | Manage categories |
| GET | `/api/products/:id/reviews` | Public | Product reviews |
| POST | `/api/products/:id/review` | Auth | Add a review |
| PUT/DELETE | `/api/products/:productId/reviews/:id` | Owner/Admin | Update/delete a review |
| GET | `/api/admin/reviews` | Admin | All reviews |
| GET | `/api/products/:productId/global-rating` | Public | Average rating |
| POST | `/api/upload` | Admin | Upload an image to Cloudinary |
| POST | `/api/contact` | Public | Send a contact message |

Protected endpoints expect `Authorization: Bearer <token>`.

## Payment flow

1. Customer places an order (`POST /api/orders/place-order`). The server computes totals from product prices, validates stock, decrements it, and clears the cart.
2. Frontend requests a PaymentIntent (`POST /api/orders/create-payment-intent`) with only the `orderId`. The server looks up the order and computes the amount itself; the client never supplies the amount.
3. Stripe.js confirms the card payment in the browser.
4. Frontend calls `POST /api/orders/confirm-payment`. The server retrieves the PaymentIntent from Stripe and verifies:
   - the payment status is `succeeded`
   - the PaymentIntent belongs to this order
   - the paid amount matches the order total

   Only then is the order marked as `paid`.

## Security notes

Implemented in this codebase:

- Order cancellation, activation, deletion, and payment operations enforce ownership or admin rights (no IDOR)
- Payment amounts are computed server-side and verified with Stripe
- Password reset and email verification tokens are stored hashed; reset links point to the frontend
- Password change no longer double-hashes the password
- Input validation with Joi on authentication, profile, orders, cart, products, reviews, stock, payments, and contact
- Rate limiting on login, registration, password reset, and contact submissions
- Helmet, CORS allow-listing, and a centralized error handler
- Passwords and tokens are never returned by user endpoints
- Order placement validates and atomically adjusts stock with rollback on failure

Remaining recommendations for production:

- Prefer HttpOnly, Secure cookies (or short-lived access tokens + refresh tokens) over `localStorage`
- Add a Stripe webhook for `payment_intent.succeeded` as a second source of truth
- Use a shared store (Redis) for rate limiting when running more than one instance
- Add pagination to product/order listing endpoints
- Add a request-id logger and structured logging
- Enable MongoDB transactions if you migrate to a replica set (current stock updates use atomic conditional updates instead)
- Add integration tests for Stripe and email providers using their test modes/mocks

## Deployment

- **Backend:** Dockerfile included. Set all backend env vars in your host (Fly.io, Koyeb, Render, etc.). At minimum set `NODE_ENV=production`, `ALLOWED_ORIGINS`, `FRONTEND_URL`, a strong `JWT_SECRET`, MongoDB, Stripe, Cloudinary, and email credentials.
- **Frontend:** `vercel.json` rewrites SPA routes to `index.html`. Set `VITE_APP_API_URL` to the deployed API URL and `VITE_STRIPE_PUBLISHABLE_KEY` in the Vercel project settings, then deploy.

## License

ISC
