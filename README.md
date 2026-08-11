# Inventory Management System

A full-stack CRUD web application for managing products and suppliers, built for the
Full-Stack Web Application Development coursework.

## Stack

- **Backend:** Node.js + Express (REST API)
- **Database:** SQLite, accessed via Sequelize ORM
- **Frontend:** two interchangeable clients against the same API/database —
  - `client/` — Vanilla HTML, CSS and JavaScript (no framework/build step)
  - `client-react/` — React (Vite) with React Router and Axios
- **Auth:** JWT-based admin login with hashed passwords (bcrypt)

Run only one frontend at a time (or both — they don't conflict, they just talk to the
same backend on different ports).

## Features implemented

- Full CRUD for **Products** and **Suppliers**, related via a foreign key
  (`Product.supplierId`), with the supplier's name shown in the UI, not just its ID.
- Dedicated `users` table, separate from business data, used only for admin login.
- JWT auth: all product/supplier API routes are protected; the frontend redirects to
  the login page if there's no valid session.
- Passwords hashed with bcrypt — never stored in plain text.
- Client-side validation (required fields, no negative numbers, valid email) with
  immediate inline feedback, **and** server-side validation as the source of truth
  (`express-validator` + Sequelize model validators), returning specific error messages.
- Real image file upload for products (via `multer`), not a text URL field.
- Low Stock Alert: products with quantity below 5 are highlighted in red, both in the
  product list and via a status badge on the detail page.
- Search by product name and filter by supplier.
- Responsive layout (Flexbox/Grid, collapsing mobile nav, scrollable tables) that
  adapts across mobile, tablet and desktop widths.
- RESTful, resource-based endpoints with proper HTTP status codes (400 for validation
  errors, 401/403 for auth failures, 404 for missing records).
- Graceful error handling on both API (central error handler) and UI (inline alert
  boxes with the real error message, not a generic "error occurred").

## Project structure

```
inventory-management-system/
├── server/                    # Express REST API
│   ├── config/database.js     # Sequelize/SQLite connection
│   ├── models/                # User, Supplier, Product + associations
│   ├── controllers/           # Business logic per resource
│   ├── routes/                # Route definitions + validation rules
│   ├── middleware/            # auth.js (JWT), upload.js (multer), errorHandler.js
│   ├── uploads/                # Uploaded product images (gitignored, kept via .gitkeep)
│   ├── data/                  # SQLite database file (gitignored)
│   ├── seed.js                # Creates the admin user + sample data
│   ├── server.js              # App entry point
│   ├── .env                   # Local secrets (gitignored)
│   └── .env.example           # Template for required env vars
├── client/                    # Static frontend (no build step)
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js              # fetch wrapper, JWT storage, session guard
│   │   └── nav.js               # navbar / hamburger / logout behaviour
│   ├── index.html               # redirects to login or dashboard
│   └── pages/
│       ├── login.html
│       ├── products.html         # product list, search, filter, low-stock highlight
│       ├── product-form.html      # add/edit product (with image upload)
│       ├── product-view.html      # single product detail
│       ├── suppliers.html         # supplier list
│       └── supplier-form.html     # add/edit supplier
└── client-react/              # React (Vite) frontend — same features, same API
    ├── src/
    │   ├── api/
    │   │   ├── client.js          # axios instance, JWT interceptor, error normalising
    │   │   └── resources.js        # auth/products/suppliers API calls
    │   ├── context/AuthContext.jsx # JWT session state (login/logout) via React Context
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   # redirects to /login if not authenticated
    │   │   ├── Layout.jsx            # navbar + page container
    │   │   ├── Navbar.jsx             # nav links, mobile hamburger, logout
    │   │   └── Alert.jsx               # error/success banner
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Products.jsx           # list, search, filter, low-stock highlight
    │   │   ├── ProductForm.jsx         # add/edit product (with image upload)
    │   │   ├── ProductView.jsx          # single product detail
    │   │   ├── Suppliers.jsx            # supplier list
    │   │   └── SupplierForm.jsx          # add/edit supplier
    │   ├── App.jsx                # React Router route definitions
    │   ├── main.jsx                 # app entry point
    │   └── index.css                  # shared stylesheet (same design as client/)
    ├── .env / .env.example        # VITE_API_BASE_URL
    └── package.json
```

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit JWT_SECRET etc. if you like
npm run seed               # creates the SQLite DB, admin user, and sample data
npm start                  # or: npm run dev (with nodemon)
```

The API runs on `http://localhost:5000` by default.

Default admin login (set in `.env`):
- **Username:** `admin`
- **Password:** `Admin@123`

> Change `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env` before re-running `npm run seed`
> if you want different credentials. Also change `JWT_SECRET` before deploying.

### 2. Frontend — choose one

`server/.env` already sets `CLIENT_ORIGIN=http://localhost:5500,http://localhost:5173`
(a comma-separated list), so both clients below work against the API out of the box.
If you serve a frontend from a different port, add it to that list.

**Option A — Vanilla HTML/CSS/JS (`client/`), no build step:**

```bash
cd client
npx serve .
# or, using VS Code's "Live Server" extension: right-click index.html -> Open with Live Server
```

Open the served URL (e.g. `http://localhost:5500`). If the API isn't on
`http://localhost:5000`, update `API_BASE_URL` at the top of `client/js/api.js`.

**Option B — React (Vite) (`client-react/`):**

```bash
cd client-react
npm install
npm run dev        # dev server, defaults to http://localhost:5173
# or: npm run build && npm run preview   for a production build
```

If the API isn't on `http://localhost:5000`, update `VITE_API_BASE_URL` in
`client-react/.env`.

## API overview

| Method | Endpoint              | Auth required | Description                     |
|--------|------------------------|:-------------:|----------------------------------|
| POST   | /api/auth/login         | No            | Log in, returns a JWT            |
| GET    | /api/auth/me             | Yes           | Returns the current user         |
| GET    | /api/products?search=&supplierId= | Yes | List products (search/filter) |
| GET    | /api/products/:id        | Yes           | Get one product                  |
| POST   | /api/products             | Yes           | Create product (multipart, image field: `image`) |
| PUT    | /api/products/:id         | Yes           | Update product                   |
| DELETE | /api/products/:id         | Yes           | Delete product                   |
| GET    | /api/suppliers            | Yes           | List suppliers                   |
| GET    | /api/suppliers/:id         | Yes           | Get one supplier                 |
| POST   | /api/suppliers              | Yes           | Create supplier                  |
| PUT    | /api/suppliers/:id           | Yes           | Update supplier                  |
| DELETE | /api/suppliers/:id           | Yes           | Delete supplier (blocked if products are still linked) |

## Notes for the report / demo

- The "code-first" schema lives in `server/models/` — Sequelize creates the SQLite
  tables from these definitions on `sequelize.sync()`.
- `Supplier.hasMany(Product)` / `Product.belongsTo(Supplier)` in `models/index.js`
  is the foreign-key relationship; deleting a supplier that still has products
  returns a clear 400 error instead of breaking referential integrity.
- Low stock threshold (5 units) is defined once, in `productController.js`
  (`LOW_STOCK_THRESHOLD`), and returned as a `lowStock` boolean on each product so the
  frontend doesn't have to duplicate the business rule.
