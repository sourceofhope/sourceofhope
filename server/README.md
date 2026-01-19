# Source of Hope API Server

Backend API server for handling Stripe payments and checkout functionality.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Stripe secret key from https://dashboard.stripe.com/apikeys
   - Update `FRONTEND_URL` if your frontend runs on a different port

3. **Get your Stripe keys:**
   - Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Go to Developers → API keys
   - Copy your "Secret key" (starts with `sk_test_` for test mode)
   - Add it to `.env` as `STRIPE_SECRET_KEY`

## Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Create Stripe Checkout Session
```
POST /api/checkout/create-stripe-session
```
Creates a Stripe checkout session and returns the checkout URL.

**Request body:**
```json
{
  "items": [
    {
      "id": "product-1",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "size": "M",
      "image": "https://..."
    }
  ],
  "shippingMethod": "standard",
  "shippingCost": 5.99,
  "taxAmount": 2.47,
  "successUrl": "http://localhost:5173/cart/success",
  "cancelUrl": "http://localhost:5173/cart"
}
```

#### Testing with Stripe

Use Stripe's test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

### Create Paypal Checkout Session
```
POST /api/checkout/create-paypal-session
```
Creates a Paypal checkout session and returns the checkout URL.

**Request body:**
```json
{
  "items": [
    {
      "id": "product-1",
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "size": "M",
      "image": "https://..."
    }
  ],
  "shippingMethod": "standard",
  "shippingCost": 5.99,
  "taxAmount": 2.47,
  "successUrl": "http://localhost:5173/cart/success",
  "cancelUrl": "http://localhost:5173/cart"
}
```

### PayPal Integration Setup Guide

#### Overview
Your storefront now supports both Stripe and PayPal checkout options. Customers can choose their preferred payment method before proceeding to checkout.

#### PayPal Configuration

#### 1. Create a PayPal Developer Account
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Sign in or create a new developer account
3. Click on "Dashboard" in the top navigation

#### 2. Create a Sandbox Application (for testing)
1. In the PayPal Developer Dashboard, click on "Apps & Credentials"
2. Under "REST API apps", click "Create App"
3. Enter your app name (e.g., "Source of Hope Store")
4. Select "Merchant" as the app type
5. Click "Create App"

#### 3. Get Your API Credentials
After creating the app, you'll see:
- **Client ID**: Copy this value
- **Secret**: Click "Show" and copy this value

#### 4. Configure Your Server

1. In the `server` folder, create a `.env` file (if it doesn't exist):
   ```bash
   cd server
   cp .env.example .env
   ```

2. Add your PayPal credentials to `server/.env`:
   ```
   PAYPAL_CLIENT_ID=your_sandbox_client_id_here
   PAYPAL_CLIENT_SECRET=your_sandbox_client_secret_here
   PAYPAL_MODE=sandbox
   ```

#### 5. Testing PayPal Checkout

**Sandbox Test Accounts:**
PayPal provides test accounts for sandbox testing:
1. In Developer Dashboard, go to "Sandbox" → "Accounts"
2. You'll see test buyer and seller accounts
3. Use these credentials when testing checkout

**Test Credit Cards:**
When testing in sandbox mode, you can use PayPal's test accounts. No real money is charged.

#### 6. Going Live (Production)

When you're ready to accept real payments:

1. Switch to "Live" mode in the PayPal Developer Dashboard
2. Create a live REST API app (same process as sandbox)
3. Get your **Live** Client ID and Secret
4. Update your production `.env` file:
   ```
   PAYPAL_CLIENT_ID=your_live_client_id_here
   PAYPAL_CLIENT_SECRET=your_live_client_secret_here
   PAYPAL_MODE=live
   ```

## Deployment

This server can be deployed to:
- **Vercel/Netlify** (as serverless functions)
- **Railway/Render** (as a Node.js app)
- **AWS/GCP/Azure** (containerized or VM)
- **Your existing API server** at `https://api.thesourceofhope.org`

