export function getRuntimeEnvironment(req) {
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
    paypalMode: isProd ? "live" : "sandbox",
  };
}
