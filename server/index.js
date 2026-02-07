import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRoutes from "./routes/checkout.js";
import emailRoutes from "./routes/email.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const { frontendUrl } = getConfig();

function normalizeOrigin(origin) {
  if (!origin) return null;
  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
}

const allowedOrigins = [
  "https://thesourceofhope.org",
  "https://www.thesourceofhope.org",
  "https://dev.thesourceofhope.org",
  "http://localhost:5173",
  normalizeOrigin(frontendUrl),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS policy: Origin not allowed."), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

// ---- STRIPE WEBHOOK (raw body must come BEFORE json) ----
// Local:  /api/checkout/webhook
// Vercel: /dev/api/checkout/webhook OR /app/api/checkout/webhook
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

const checkoutPrefixes = [
  "/api/checkout",
  "/dev/api/checkout",
  "/app/api/checkout",
];
checkoutPrefixes.forEach((prefix) => app.use(prefix, checkoutRoutes));

// ---- Mount email routes (local + Vercel) ----
app.use("/api/email", emailRoutes);
app.use("/dev/api/email", emailRoutes);
app.use("/app/api/email", emailRoutes);

// Helpful 404 for debugging
app.all("*", (req, res) => {
  res
    .status(404)
    .json({ message: "Route not found", path: req.path, method: req.method });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

export default app;
