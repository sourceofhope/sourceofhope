import "server-only";

const PAYPAL_API_LOCATION: Record<string, string> = {
  production: "https://api.paypal.com",
  development: "https://api.sandbox.paypal.com",
};

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
    // e.g. "The Source of Hope <no-reply@thesourceofhope.org>" once the domain is verified in Resend.
    resendFromEmail:
      process.env.RESEND_FROM_EMAIL ||
      "The Source of Hope <onboarding@resend.dev>",

    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    sanityApiReadToken: process.env.SANITY_API_READ_TOKEN,
    sanityRevalidateSecret: process.env.SANITY_REVALIDATE_SECRET,
  };

  return config;
}
