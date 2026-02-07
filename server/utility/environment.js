export function getEnvironment() {
  const config = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,

    frontendUrl: process.env.FRONTEND_URL,

    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    paypalApiUrl: process.env.PAYPAL_API_BASE,

    resendKey: process.env.RESEND_API_KEY,
  };

  return config;
}
