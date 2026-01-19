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

### Create Checkout Session
```
POST /api/checkout/create-session
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

## Testing with Stripe

Use Stripe's test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- Any future expiry date and any 3-digit CVC

## Deployment

This server can be deployed to:
- **Vercel/Netlify** (as serverless functions)
- **Railway/Render** (as a Node.js app)
- **AWS/GCP/Azure** (containerized or VM)
- **Your existing API server** at `https://api.thesourceofhope.org`

Make sure to:
- Set all environment variables in your hosting platform
- Use production Stripe keys (starts with `sk_live_`)
- Configure CORS to only allow your production domain
