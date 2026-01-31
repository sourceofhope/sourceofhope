export function getConfig() {
  const cfg = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

    frontendUrl: process.env.FRONTEND_URL,

    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    paypalApiUrl: process.env.PAYPAL_API_BASE,
  };

  return cfg;
}
