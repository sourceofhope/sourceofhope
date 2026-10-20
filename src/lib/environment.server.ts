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

    sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    sanityApiReadToken: process.env.SANITY_API_READ_TOKEN,

    docusignIntegrationKey: process.env.DOCUSIGN_INTEGRATION_KEY,
    docusignUserId: process.env.DOCUSIGN_USER_ID,
    docusignAccountId: process.env.DOCUSIGN_ACCOUNT_ID,
    docusignPrivateKey: process.env.DOCUSIGN_PRIVATE_KEY,
    // Values: production | demo (developer sandbox, the default)
    docusignEnvironment: process.env.DOCUSIGN_ENVIRONMENT === "production" ? "production" : "demo",
    // Optional override; otherwise looked up from DocuSign's userinfo endpoint.
    docusignBaseUrl: process.env.DOCUSIGN_BASE_URL,
    docusignTemplates: {
      general: {
        adult: process.env.DOCUSIGN_TEMPLATE_GENERAL_ADULT,
        minor: process.env.DOCUSIGN_TEMPLATE_GENERAL_MINOR,
      },
      "serving-hope": {
        adult: process.env.DOCUSIGN_TEMPLATE_SERVING_HOPE_ADULT,
        minor: process.env.DOCUSIGN_TEMPLATE_SERVING_HOPE_MINOR,
      },
    },
    docusignHmacKey: process.env.DOCUSIGN_CONNECT_HMAC_KEY,
    waiverSecret: process.env.WAIVER_SECRET,
  };

  return config;
}
