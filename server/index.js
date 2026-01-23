import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRoutes from "./routes/checkout.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  "https://thesourceofhope.org",
  "https://www.thesourceofhope.org",
  "http://localhost:5173", // For local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe webhook route needs raw body, so it comes before express.json()
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret,
        );
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    let event = request.body;

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

// ---- STRIPE WEBHOOK (raw body) ----
// Local:    /api/checkout/webhook
// Vercel:   /dev/api/checkout/webhook OR /app/api/checkout/webhook

app.post(
  [
    "/api/checkout/webhook",
    "/dev/api/checkout/webhook",
    "/app/api/checkout/webhook",
  ],
  express.raw({ type: "application/json" }),
  checkoutRoutes,
);

// ---- JSON for everything else ----
app.use(express.json());

// ---- Health check (local + Vercel) ----
app.get(["/api/health", "/dev/api/health", "/app/api/health"], (req, res) => {
  res.json({ status: "ok", message: "Source of Hope API is running" });
});

// ---- Mount checkout routes (local + Vercel) ----
app.use("/api/checkout", checkoutRoutes);
app.use("/dev/api/checkout", checkoutRoutes);
app.use("/app/api/checkout", checkoutRoutes);

// Helpful 404 for debugging
app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Only start server when NOT on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export function getRuntimeEnv(req) {
  const url = req.originalUrl || "";
  const isProd = url.startsWith("/app/api");

  return {
    isProd,
    stripeSecretKey: isProd
      ? process.env.STRIPE_SECRET_KEY_PROD
      : process.env.STRIPE_SECRET_KEY_DEV,
    stripeWebhookSecret: isProd
      ? process.env.STRIPE_WEBHOOK_SECRET_PROD
      : process.env.STRIPE_WEBHOOK_SECRET_DEV,
    frontendUrl: isProd
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV,
  };
}

export default app;
