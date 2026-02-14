const PAYPAL_API_LOCATION = {
  production: "https://api.paypal.com/",
  development: "https://api.sandbox.paypal.com",
};

export function getEnvironment() {
  const config = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,

    frontendUrl: process.env.FRONTEND_URL,

    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    paypalApiUrl: PAYPAL_API_LOCATION[process.env.PAYPAL_API],

    resendKey: process.env.RESEND_API_KEY,
  };

  return config;
}
