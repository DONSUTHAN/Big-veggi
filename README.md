# Big-veggi

Big-veggi is a farmer-to-customer marketplace with a React frontend and an Express + MongoDB backend.

## Main Features

- Customer and farmer
- Cookie-based JWT authentication
- Farmer product upload with product image and optional selfie
- Customer ordering with Cash on Delivery or GPay
- Admin dashboard for users, products, orders, and order status

## Run The App

1. Install dependencies:

```bash
npm run install:all
```

On Windows PowerShell, if `npm`

```bash
npm.cmd run install:all
```

2. Start MongoDB locally.

3. Add backend environment values in `backend/.env` if you need to change the defaults.

4. Load sample admin, farmer, customer, and product data:

5. Start frontend and backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Sample Accounts After Seeding

- Farmer: `farmer@bigveggi.com` / `Farmer@123`
- Customer: `customer@bigveggi.com` / `Customer@123`
