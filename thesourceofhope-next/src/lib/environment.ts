const PAYPAL_API_LOCATION: Record<string, string> = {
  production: "https://api.paypal.com/",
  development: "https://api.sandbox.paypal.com",
};

const STRIPE_WEB_HOOK_SECRET: Record<string, string> = {
  production: "whsec_bJmg72j9mFGlEpPzs8DSclnf0GA6GJM0",
  development: "whsec_UBVSEl8ipEw4TxikiVryRLMifXPbegYf",
  init: "whsec_76536a8d80217f8647d0271d555d8f314a8bac10f727862d8ddc526bca08d40a"
}

export function getEnvironment() {
  const config = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: STRIPE_WEB_HOOK_SECRET[process.env.STRIPE_WEBHOOK_SECRET || "init"],
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    stripeSalesTaxRateId: process.env.STRIPE_SALES_TAX_RATE_ID,

    databaseUrl: process.env.DATABASE_URL,

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
