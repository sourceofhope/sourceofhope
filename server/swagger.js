/**
 * OpenAPI 3.0 specification for the Source of Hope API.
 * Mounted at /api/docs (local) by index.js.
 */
export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Source of Hope API",
    version: "1.0.0",
    description:
      "Backend API powering payments, email, and provider configuration for thesourceofhope.org.",
    contact: {
      name: "The Source of Hope",
      url: "https://thesourceofhope.org",
    },
  },
  servers: [
    { url: "http://localhost:3001", description: "Local development" },
    {
      url: "https://api.thesourceofhope.org/dev",
      description: "Staging (Vercel)",
    },
    {
      url: "https://api.thesourceofhope.org/app",
      description: "Production (Vercel)",
    },
  ],
  tags: [
    { name: "Health", description: "Server status" },
    { name: "Checkout – Stripe", description: "Stripe payment endpoints" },
    { name: "Checkout – PayPal", description: "PayPal payment endpoints" },
    { name: "Checkout – Webhooks", description: "Stripe webhook handler" },
    { name: "Email", description: "Transactional email via Resend" },
    { name: "Providers", description: "Runtime configuration for the frontend" },
  ],
  components: {
    schemas: {
      CartItem: {
        type: "object",
        required: ["id", "title", "price", "quantity"],
        properties: {
          id: { type: "integer", example: 42 },
          title: { type: "string", example: "Hope T-Shirt" },
          name: { type: "string", example: "Hope T-Shirt" },
          price: { type: "number", format: "float", example: 25.0 },
          quantity: { type: "integer", example: 2 },
          size: { type: "string", example: "M" },
          image: {
            type: "string",
            example: "https://thesourceofhope.org/v2/core/shirt.webp",
          },
        },
      },
      ShippingAddress: {
        type: "object",
        properties: {
          firstName: { type: "string", example: "Jane" },
          lastName: { type: "string", example: "Doe" },
          address: { type: "string", example: "123 Hope St" },
          city: { type: "string", example: "Dallas" },
          state: { type: "string", example: "TX" },
          zipCode: { type: "string", example: "75201" },
          country: { type: "string", example: "US" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Cart items are required" },
          details: { type: "string", example: "No such payment intent: pi_xxx" },
        },
      },
    },
  },
  paths: {
    // ── Health ────────────────────────────────────────────────────────────────
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Returns a simple status object confirming the API is reachable.",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    message: {
                      type: "string",
                      example: "Source of Hope API is running",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Stripe – publishable key ──────────────────────────────────────────────
    "/api/checkout/retrieve-stripe-publishable-key": {
      post: {
        tags: ["Checkout – Stripe"],
        summary: "Get Stripe publishable key",
        description:
          "Returns the Stripe publishable key so the frontend can initialise Stripe.js without exposing the secret key.",
        responses: {
          200: {
            description: "Publishable key returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    publishableKey: {
                      type: "string",
                      example: "pk_live_xxx",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Stripe not configured",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – payment intent ───────────────────────────────────────────────
    "/api/checkout/create-stripe-payment-intent": {
      post: {
        tags: ["Checkout – Stripe"],
        summary: "Create a Stripe Payment Intent",
        description:
          "Creates a Stripe Payment Intent for use with Stripe Elements (self-hosted checkout form). Returns the `clientSecret` needed by the frontend.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "totalAmount"],
                properties: {
                  items: {
                    type: "array",
                    items: { $ref: "#/components/schemas/CartItem" },
                  },
                  shippingMethod: {
                    type: "string",
                    enum: ["standard", "express", "overnight"],
                    example: "standard",
                  },
                  shippingCost: { type: "number", example: 7.99 },
                  taxAmount: { type: "number", example: 2.1 },
                  processingFee: { type: "number", example: 0.9 },
                  totalAmount: { type: "number", example: 35.99 },
                  email: {
                    type: "string",
                    format: "email",
                    example: "jane@example.com",
                  },
                  shippingAddress: {
                    $ref: "#/components/schemas/ShippingAddress",
                  },
                  billingAddress: {
                    $ref: "#/components/schemas/ShippingAddress",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Payment Intent created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clientSecret: { type: "string", example: "pi_xxx_secret_yyy" },
                    paymentIntentId: { type: "string", example: "pi_xxx" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – retrieve payment intent status ───────────────────────────────
    "/api/checkout/retrieve-stripe-payment-intent-status": {
      get: {
        tags: ["Checkout – Stripe"],
        summary: "Get Stripe Payment Intent status",
        description:
          "Retrieves the current status and basic metadata of a Stripe Payment Intent by its ID.",
        parameters: [
          {
            name: "payment_intent",
            in: "query",
            required: true,
            schema: { type: "string", example: "pi_xxx" },
            description: "Stripe Payment Intent ID",
          },
        ],
        responses: {
          200: {
            description: "Payment Intent status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: [
                        "succeeded",
                        "processing",
                        "requires_payment_method",
                        "canceled",
                      ],
                      example: "succeeded",
                    },
                    customer_email: {
                      type: "string",
                      example: "jane@example.com",
                    },
                    amount: { type: "integer", example: 3599 },
                    currency: { type: "string", example: "usd" },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing payment_intent query param",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – embedded session ─────────────────────────────────────────────
    "/api/checkout/create-stripe-session": {
      post: {
        tags: ["Checkout – Stripe"],
        summary: "Create an embedded Stripe Checkout session",
        description:
          "Creates a Stripe Checkout session in **embedded** UI mode. The frontend mounts the session using `@stripe/react-stripe-js`.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "return_url"],
                properties: {
                  items: {
                    type: "array",
                    items: { $ref: "#/components/schemas/CartItem" },
                  },
                  shippingMethod: {
                    type: "string",
                    enum: ["standard", "express", "overnight"],
                    example: "standard",
                  },
                  shippingCost: { type: "number", example: 7.99 },
                  taxAmount: { type: "number", example: 2.1 },
                  processingFee: { type: "number", example: 0.9 },
                  return_url: {
                    type: "string",
                    example: "https://thesourceofhope.org/store/success",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Embedded session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clientSecret: { type: "string", example: "cs_xxx_secret_yyy" },
                    sessionId: { type: "string", example: "cs_xxx" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – hosted checkout ──────────────────────────────────────────────
    "/api/checkout/create-stripe-checkout": {
      post: {
        tags: ["Checkout – Stripe"],
        summary: "Create a hosted Stripe Checkout session",
        description:
          "Creates a Stripe-hosted Checkout session. Returns a redirect `url` to send the customer to Stripe's checkout page.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "successUrl", "cancelUrl"],
                properties: {
                  items: {
                    type: "array",
                    items: { $ref: "#/components/schemas/CartItem" },
                  },
                  shippingMethod: {
                    type: "string",
                    enum: ["standard", "express", "overnight"],
                    example: "standard",
                  },
                  shippingCost: { type: "number", example: 7.99 },
                  taxAmount: { type: "number", example: 2.1 },
                  processingFee: { type: "number", example: 0.9 },
                  successUrl: {
                    type: "string",
                    example: "https://thesourceofhope.org/store/success",
                  },
                  cancelUrl: {
                    type: "string",
                    example: "https://thesourceofhope.org/store/checkout",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Hosted session created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    url: {
                      type: "string",
                      example: "https://checkout.stripe.com/pay/cs_xxx",
                    },
                    sessionId: { type: "string", example: "cs_xxx" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – session status ───────────────────────────────────────────────
    "/api/checkout/retrieve-stripe-session-status": {
      get: {
        tags: ["Checkout – Stripe"],
        summary: "Get Stripe Checkout session status",
        description:
          "Polls the status of a Stripe Checkout session after the customer returns from checkout.",
        parameters: [
          {
            name: "session_id",
            in: "query",
            required: true,
            schema: { type: "string", example: "cs_xxx" },
            description: "Stripe Checkout Session ID",
          },
        ],
        responses: {
          200: {
            description: "Session status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["open", "complete", "expired"],
                      example: "complete",
                    },
                    customer_email: {
                      type: "string",
                      example: "jane@example.com",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing session_id query param",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe – membership subscription ─────────────────────────────────────
    "/api/checkout/create-membership-payment-intent": {
      post: {
        tags: ["Checkout – Stripe"],
        summary: "Create a recurring membership subscription",
        description:
          "Creates a Stripe Subscription for a membership tier. Creates or retrieves the Stripe Customer and Product automatically. Returns the `clientSecret` of the first invoice's Payment Intent.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "membershipType",
                  "amount",
                  "firstName",
                  "lastName",
                  "email",
                ],
                properties: {
                  membershipType: {
                    type: "string",
                    enum: [
                      "bronze",
                      "silver",
                      "gold",
                      "individual",
                      "partner",
                      "sponsor",
                      "champion",
                    ],
                    example: "individual",
                  },
                  amount: {
                    type: "number",
                    description: "Monthly amount in USD",
                    example: 25.0,
                  },
                  firstName: { type: "string", example: "Jane" },
                  lastName: { type: "string", example: "Doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "jane@example.com",
                  },
                  phone: { type: "string", example: "+12145550000" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Subscription and Payment Intent created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    clientSecret: {
                      type: "string",
                      example: "pi_xxx_secret_yyy",
                    },
                    subscriptionId: { type: "string", example: "sub_xxx" },
                    customerId: { type: "string", example: "cus_xxx" },
                    invoiceId: { type: "string", example: "in_xxx" },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or invalid membership type",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── PayPal – create order ─────────────────────────────────────────────────
    "/api/checkout/create-paypal-order": {
      post: {
        tags: ["Checkout – PayPal"],
        summary: "Create a PayPal order",
        description:
          "Creates a PayPal order and returns an `approvalUrl` to redirect the customer to PayPal for payment authorisation.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items", "successUrl", "cancelUrl"],
                properties: {
                  items: {
                    type: "array",
                    items: { $ref: "#/components/schemas/CartItem" },
                  },
                  shippingMethod: {
                    type: "string",
                    enum: ["standard", "express", "overnight"],
                    example: "standard",
                  },
                  shippingCost: { type: "number", example: 7.99 },
                  taxAmount: { type: "number", example: 2.1 },
                  processingFee: { type: "number", example: 0.9 },
                  successUrl: {
                    type: "string",
                    example: "https://thesourceofhope.org/store/success",
                  },
                  cancelUrl: {
                    type: "string",
                    example: "https://thesourceofhope.org/store/checkout",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "PayPal order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    orderId: { type: "string", example: "3TY12345AB678901C" },
                    approvalUrl: {
                      type: "string",
                      example:
                        "https://www.paypal.com/checkoutnow?token=3TY12345AB678901C",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── PayPal – order status ─────────────────────────────────────────────────
    "/api/checkout/retrieve-paypal-order-status": {
      get: {
        tags: ["Checkout – PayPal"],
        summary: "Get PayPal order status",
        description:
          "Retrieves the status of a PayPal order using the `token` returned in the PayPal redirect URL after customer approval.",
        parameters: [
          {
            name: "token",
            in: "query",
            required: true,
            schema: { type: "string", example: "3TY12345AB678901C" },
            description: "PayPal order token from the return URL",
          },
        ],
        responses: {
          200: {
            description: "PayPal order status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      enum: ["complete", "approved", "created", "voided"],
                      example: "complete",
                    },
                    customer_email: {
                      type: "string",
                      example: "jane@example.com",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing token query param",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },

    // ── Stripe Webhook ────────────────────────────────────────────────────────
    "/api/checkout/webhook": {
      post: {
        tags: ["Checkout – Webhooks"],
        summary: "Stripe webhook receiver",
        description:
          "Receives and verifies signed Stripe webhook events. The body **must** be the raw request buffer (not parsed JSON). Handled events: `payment_intent.succeeded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.",
        parameters: [
          {
            name: "stripe-signature",
            in: "header",
            required: true,
            schema: { type: "string" },
            description: "Stripe webhook signature header for payload verification",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                description: "Raw Stripe event payload (must not be JSON-parsed by middleware)",
              },
            },
          },
        },
        responses: {
          200: { description: "Event received and acknowledged" },
          400: { description: "Signature verification failed" },
          500: { description: "Webhook not configured" },
        },
      },
    },

    // ── Email ─────────────────────────────────────────────────────────────────
    "/api/email/send": {
      post: {
        tags: ["Email"],
        summary: "Send a contact / notification email",
        description:
          "Sends a transactional email via Resend to `treasurer@thesourceofhope.org`. Used by the contact form and membership confirmation flow.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "message"],
                properties: {
                  name: { type: "string", example: "Jane Doe" },
                  email: {
                    type: "string",
                    format: "email",
                    example: "jane@example.com",
                  },
                  message: {
                    type: "string",
                    example: "I would like to volunteer this Saturday.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Email sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Email sent successfully",
                    },
                    data: {
                      type: "object",
                      description: "Resend API response data",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing required fields or Resend API error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Missing required fields: name, email, message" },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Internal server error" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Providers ─────────────────────────────────────────────────────────────
    "/api/providers/checkout": {
      get: {
        tags: ["Providers"],
        summary: "Get available checkout providers",
        description:
          "Returns the list of active payment provider configurations (e.g. Stripe, PayPal) read from `server/data/checkout-providers.json`. The frontend uses this to determine which payment options to render at checkout.",
        responses: {
          200: {
            description: "Checkout providers list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", example: "stripe" },
                          name: { type: "string", example: "Stripe" },
                          enabled: { type: "boolean", example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Failed to load providers",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};
