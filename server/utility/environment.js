export function getRuntimeEnvironment(req) {
  const url = req.originalUrl || "";
  const isProd = url.startsWith("/app/api");

  return {
    isProd,
    stripeSecretKey: isProd
      ? process.env.STRIPE_SECRET_KEY_PROD
      : process.env.STRIPE_SECRET_KEY_DEV,
    stripePublishableKey: isProd
      ? process.env.STRIPE_PUBLISHABLE_KEY_PROD
      : process.env.STRIPE_PUBLISHABLE_KEY_DEV,
    frontendUrl: isProd
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV,
    paypalMode: isProd ? "production" : "development",
    paypalClientId: isProd
      ? process.env.PAYPAL_CLIENT_ID_PROD
      : process.env.PAYPAL_CLIENT_ID_DEV,
    paypalClientSecret: isProd
      ? process.env.PAYPAL_CLIENT_SECRET_PROD
      : process.env.PAYPAL_CLIENT_SECRET_DEV,
    paypalApiUrl: isProd
      ? process.env.PAYPAL_API_BASE_PROD
      : process.env.PAYPAL_API_BASE_DEV,
  };
}
