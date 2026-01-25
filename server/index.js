import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRoutes from "./routes/checkout.js";
import emailRoutes from "./routes/email.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow your frontends
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev.thesourceofhope.org",
      "https://thesourceofhope.org",
    ],
    credentials: true,
  })
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
  checkoutRoutes
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

// ---- Mount email routes (local + Vercel) ----
app.use("/api/email", emailRoutes);
app.use("/dev/api/email", emailRoutes);
app.use("/app/api/email", emailRoutes);

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
