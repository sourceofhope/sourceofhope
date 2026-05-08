const PAYPAL_API_LOCATION: Record<string, string> = {
  production: "https://api.paypal.com",
  development: "https://api.sandbox.paypal.com",
};

export const ASSET_VERSION = "v2";

export function getEnvironment() {
  const config = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    stripeSalesTaxRateId: process.env.STRIPE_SALES_TAX_RATE_ID,

    frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,

    paypalClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    paypalApiUrl: PAYPAL_API_LOCATION[process.env.PAYPAL_API || "development"],

    resendKey: process.env.RESEND_API_KEY,

    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    sanityApiReadToken: process.env.SANITY_API_READ_TOKEN,
  };

  return config;
}
