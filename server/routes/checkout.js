import express from "express";
import Stripe from "stripe";
import { getEnvironment } from "../utility/environment.js";

const router = express.Router();

export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    time: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    time: "2-3 business days",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    time: "Next business day",
  },
];

function buildStripeShippingOptions(shippingMethod, shippingCost) {
  const option = SHIPPING_OPTIONS.find((opt) => opt.id === shippingMethod);

  if (!option) return [];

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: Math.round(shippingCost * 100), // convert to cents
          currency: "usd",
        },
        display_name: option.name,
        delivery_estimate: {
          minimum: {
            unit: "business_day",
            value: parseInt(option.time.split("-")[0]) || 1,
          },
          maximum: {
            unit: "business_day",
            value:
              parseInt(option.time.split("-")[1]) || parseInt(option.time) || 1,
          },
        },
      },
    },
  ];
}

/**
 * Get Stripe Payment Intent Status
 * GET /api/checkout/retrieve-stripe-payment-intent-status
 */
router.get("/retrieve-stripe-payment-intent-status", async (req, res) => {
  try {
    const { stripeSecretKey } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const paymentIntentId = req.query.payment_intent;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Payment Intent ID is required" });
    }

    const stripe = new Stripe(stripeSecretKey);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Try multiple sources for email
    const customerEmail =
      paymentIntent.receipt_email ||
      paymentIntent.metadata?.customer_email ||
      paymentIntent.charges?.data[0]?.billing_details?.email ||
      "";

    res.json({
      status: paymentIntent.status,
      customer_email: customerEmail,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Retrieve Payment Intent status error:", error);
    res.status(500).json({
      error: "Failed to retrieve Payment Intent status",
      details: error.message,
    });
  }
});

/**
 * Create a Stripe Payment Intent
 * POST /api/checkout/create-stripe-payment-intent
 * For direct payment processing with Stripe Elements
 */
router.post("/create-stripe-payment-intent", async (req, res) => {
  try {
    const { stripeSecretKey } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const stripe = new Stripe(stripeSecretKey);

    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      processingFee,
      shippingAddress,
      billingAddress,
      totalAmount,
      email,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Round to 2 decimal places and convert to cents
    const amountInCents = Math.round(parseFloat(totalAmount.toFixed(2)) * 100);

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
      metadata: {
        shipping_method: shippingMethod || "standard",
        order_type: "storefront",
        items_count: items.length,
        customer_email: email,
        processing_fee: processingFee ? processingFee.toFixed(2) : "0.00",
      },
      shipping: shippingAddress
        ? {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: shippingAddress.country || "US",
            },
          }
        : undefined,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Payment Intent creation error:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
    });
  }
});

/**
 * Create a membership subscription with Stripe
 * POST /api/checkout/create-membership-payment-intent
 * Creates a Setup Intent for recurring membership subscriptions
 */
router.post("/create-membership-payment-intent", async (req, res) => {
  try {
    const { stripeSecretKey } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe configuration missing" });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" });

    const {
      membershipType,
      amount,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    // Validate required fields
    if (!membershipType || !amount || !firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Map membership types to product details
    const membershipProducts = {
      bronze: {
        id: "prod_membership_bronze",
        name: "Hope Advocate [Bronze Pin]",
        description: "Bronze tier membership - Monthly recurring subscription providing community impact support",
      },
      silver: {
        id: "prod_membership_silver",
        name: "Hope Professional [Silver Pin]",
        description: "Silver tier membership - Monthly recurring subscription for professional partners",
      },
      gold: {
        id: "prod_membership_gold",
        name: "Hope Enterprise Partner [Gold Pin]",
        description: "Gold tier membership - Monthly recurring subscription for enterprise partnerships",
      },
    };

    const productConfig = membershipProducts[membershipType];
    if (!productConfig) {
      return res.status(400).json({ error: "Invalid membership type" });
    }

    const membershipName = productConfig.name;

    // Find or create customer
    let customer;
    const existingCustomers = await stripe.customers.search({
      query: `email:"${email}"`,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      // Update customer info
      customer = await stripe.customers.update(customer.id, {
        name: `${firstName} ${lastName}`,
        phone: phone || undefined,
        metadata: {
          membership_type: membershipType,
        },
      });
    } else {
      customer = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
        phone: phone || undefined,
        metadata: {
          membership_type: membershipType,
        },
      });
    }

    // Check if the product exists or create it
    let product;
    try {
      product = await stripe.products.retrieve(productConfig.id);
    } catch (retrieveErr) {
      // Product doesn't exist, try to create it
      try {
        product = await stripe.products.create({
          id: productConfig.id,
          name: productConfig.name,
          description: productConfig.description,
          metadata: {
            type: "membership",
            membership_type: membershipType,
          },
        });
      } catch (createErr) {
        // If product already exists (race condition), retrieve it
        if (createErr.code === "resource_already_exists") {
          product = await stripe.products.retrieve(productConfig.id);
        } else {
          throw createErr;
        }
      }
    }

    // Search for existing price for this product
    const prices = await stripe.prices.list({
      product: product.id,
      recurring: { interval: "month" },
      active: true,
      limit: 10,
    });

    let price = prices.data.find(
      (p) => p.unit_amount === Math.round(amount * 100)
    );

    // If price doesn't exist, create it
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(amount * 100),
        currency: "usd",
        recurring: {
          interval: "month",
        },
        metadata: {
          membership_type: membershipType,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: price.id,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        membership_type: membershipType,
        membership_name: membershipName,
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone || "",
      },
    });

    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

    res.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id,
      invoiceId: subscription.latest_invoice.id,
    });
  } catch (error) {
    console.error("Membership subscription creation error:", error);
    res.status(500).json({
      error: "Failed to create membership subscription",
      details: error.message,
    });
  }
});

/**
 * Retrieve the Stripe publishable key
 * GET /api/checkout/retrieve-stripe-publishable-key
 */
router.post("/retrieve-stripe-publishable-key", async (req, res) => {
  try {
    const { stripePublishableKey } = getEnvironment();
    if (!stripePublishableKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    res.json({ publishableKey: stripePublishableKey });
  } catch (error) {
    console.error("Retrieve Stripe publishable key error:", error);
    res.status(500).json({
      error: "Failed to retrieve Stripe publishable key",
      details: error.message,
    });
  }
});

/**
 * Create an Embedded Stripe Checkout Session
 * Create an Embedded Stripe Checkout Session
 * POST /api/checkout/create-stripe-session
 * For embedding checkout directly in the page
 */

router.post("/create-stripe-session", async (req, res) => {
  try {
    const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const stripe = new Stripe(stripeSecretKey);

    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      processingFee,
      return_url,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!return_url) {
      return res.status(400).json({ error: "Return URL is required" });
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || item.title || "Product",
          description: item.size ? `Size: ${item.size}` : undefined,
          images: item.image ? [item.image] : undefined,
          metadata: {
            product_id: item.id,
            size: item.size || "",
          },
        },
        unit_amount: Math.round(parseFloat(item.price.toFixed(2)) * 100),
      },
      quantity: item.quantity,
      tax_rates: stripeSalesTaxRateId ? [stripeSalesTaxRateId] : undefined,
    }));

    if (processingFee && processingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Processing Support",
            description: "Supporting 100% of the mission (3%)",
          },
          unit_amount: Math.round(parseFloat(processingFee.toFixed(2)) * 100),
        },
        quantity: 1,
      });
    }

    const shippingOptions = buildStripeShippingOptions(
      shippingMethod,
      shippingCost,
    );

    // Create embedded checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: lineItems,
      mode: "payment",
      return_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: shippingOptions,
      billing_address_collection: "required",
      metadata: {
        shipping_method: shippingMethod || "standard",
        order_type: "storefront",
        stripe_tax_rate_id: stripeSalesTaxRateId || "",
        ui_tax_amount:
          typeof taxAmount === "number" ? taxAmount.toFixed(2) : "0.00",
      },
    });

    res.json({
      clientSecret: session.client_secret,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Embedded checkout error:", error);
    res.status(500).json({
      error: "Failed to create embedded checkout session",
      details: error.message,
    });
  }
});

/**
 * Get Stripe Session Status
 * GET /api/checkout/retrieve-stripe-session-status
 * retrieve-stripe-session-status
 */
router.get("/retrieve-stripe-session-status", async (req, res) => {
  try {
    const { stripeSecretKey } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (error) {
    console.error("Retrieve session status error:", error);
    res.status(500).json({
      error: "Failed to retrieve session status",
      details: error.message,
    });
  }
});

/**
 * Get PayPal Order Status
 * GET /api/checkout/retrieve-paypal-order-status
 */
router.get("/retrieve-paypal-order-status", async (req, res) => {
  try {
    const { paypalClientId, paypalClientSecret, paypalApiUrl } =
      getEnvironment();

    if (!paypalClientId || !paypalClientSecret) {
      return res.status(500).json({ error: "PayPal is not configured." });
    }

    const token = req.query.token;

    if (!token) {
      return res.status(400).json({ error: "PayPal token is required" });
    }

    // Get PayPal access token
    const auth = Buffer.from(
      `${paypalClientId}:${paypalClientSecret}`,
    ).toString("base64");

    const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token");
    }

    const { access_token } = await tokenResponse.json();

    // Get order details
    const orderResponse = await fetch(
      `${paypalApiUrl}/v2/checkout/orders/${token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!orderResponse.ok) {
      throw new Error("Failed to retrieve PayPal order");
    }

    const order = await orderResponse.json();

    // Extract customer email from payer info
    const customerEmail =
      order.payer?.email_address || order.payer?.payer_info?.email || "";

    res.json({
      status:
        order.status === "APPROVED" || order.status === "COMPLETED"
          ? "complete"
          : order.status.toLowerCase(),
      customer_email: customerEmail,
    });
  } catch (error) {
    console.error("Retrieve PayPal order status error:", error);
    res.status(500).json({
      error: "Failed to retrieve PayPal order status",
      details: error.message,
    });
  }
});

/**
 * Create a Stripe Checkout Order
 * POST /api/checkout/create-stripe-checkout
 */
router.post("/create-stripe-checkout", async (req, res) => {
  try {
    const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    const stripe = new Stripe(stripeSecretKey);

    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      processingFee,
      successUrl,
      cancelUrl,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Redirect URLs are required" });
    }

    // Convert cart items to Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || item.title || "Product",
          description: item.size ? `Size: ${item.size}` : undefined,
          images: item.image ? [item.image] : undefined,
          metadata: {
            product_id: item.id,
            size: item.size || "",
          },
        },
        unit_amount: Math.round(parseFloat(item.price.toFixed(2)) * 100), // Convert to cents
      },
      quantity: item.quantity,
      tax_rates: stripeSalesTaxRateId ? [stripeSalesTaxRateId] : undefined,
    }));

    if (processingFee && processingFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Processing Fee Coverage (3%)",
            description: "Support the Mission — Cover Fees (3%)",
          },
          unit_amount: Math.round(parseFloat(processingFee.toFixed(2)) * 100),
        },
        quantity: 1,
      });
    }

    const shippingOptions = buildStripeShippingOptions(
      shippingMethod,
      shippingCost,
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: shippingOptions,
      billing_address_collection: "required",
      metadata: {
        shipping_method: shippingMethod || "standard",
        order_type: "storefront",
        stripe_tax_rate_id: stripeSalesTaxRateId || "",
        ui_tax_amount:
          typeof taxAmount === "number" ? taxAmount.toFixed(2) : "0.00",
      },
    });

    res.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({
      error: "Failed to create Stripe checkout session",
      details: error.message,
    });
  }
});

/**
 * Create a PayPal Checkout Order
 * POST /api/checkout/create-paypal-order
 */
router.post("/create-paypal-order", async (req, res) => {
  try {
    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      processingFee,
      successUrl,
      cancelUrl,
    } = req.body;

    const { paypalClientId, paypalClientSecret, paypalApiUrl } =
      getEnvironment();

    if (!paypalClientId || !paypalClientSecret || !paypalApiUrl) {
      return res.status(500).json({
        error: "PayPal is not configured. Please contact support.",
      });
    }

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Redirect URLs are required" });
    }

    const auth = Buffer.from(
      `${paypalClientId}:${paypalClientSecret}`,
    ).toString("base64");

    const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("PayPal auth error:", errorText);
      throw new Error(
        `Failed to get PayPal access token: ${tokenResponse.status}`,
      );
    }

    const { access_token } = await tokenResponse.json();
    console.log("Obtained PayPal access token.");

    // Prepare PayPal order items
    const paypalItems = items.map((item) => ({
      name: item.name || "Product",
      description: item.size ? `Size: ${item.size}` : "Product purchase",
      unit_amount: {
        currency_code: "USD",
        value: parseFloat(item.price.toFixed(2)).toFixed(2),
      },
      quantity: item.quantity.toString(),
    }));

    // Add processing fee as a separate item if present
    if (processingFee && processingFee > 0) {
      paypalItems.push({
        name: "Processing Fee Coverage (3%)",
        description: "Support the Mission — Cover Fees (3%)",
        unit_amount: {
          currency_code: "USD",
          value: parseFloat(processingFee.toFixed(2)).toFixed(2),
        },
        quantity: "1",
      });
    }

    const paypalItemTotal = paypalItems.reduce((sum, it) => {
      const unit = Number(it.unit_amount.value);
      const qty = Number(it.quantity);
      return sum + unit * qty;
    }, 0);

    const shipping = Number((shippingCost || 0).toFixed(2));
    const tax = Number((taxAmount || 0).toFixed(2));
    const totalAmount = paypalItemTotal + shipping + tax;

    // Create PayPal order
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: paypalItemTotal.toFixed(2),
              },
              shipping: { currency_code: "USD", value: shipping.toFixed(2) },
              tax_total: { currency_code: "USD", value: tax.toFixed(2) },
            },
          },
          items: paypalItems,
          shipping: {
            method: shippingMethod || "Standard Shipping",
          },
        },
      ],
      application_context: {
        return_url: successUrl,
        cancel_url: cancelUrl,
        brand_name: "Source of Hope",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
      },
    };

    console.log("Creating PayPal order...");
    const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("PayPal order creation error:", errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      throw new Error(
        `Failed to create PayPal order: ${errorData.message || errorResponse.status}`,
      );
    }

    const order = await orderResponse.json();

    // Find the approval URL
    const approvalUrl = order.links.find(
      (link) => link.rel === "approve",
    )?.href;

    if (!approvalUrl) {
      throw new Error("PayPal approval URL not found");
    }

    res.json({
      orderId: order.id,
      approvalUrl,
    });
  } catch (error) {
    console.error("PayPal checkout error:", error);
    res.status(500).json({
      error: "Failed to create PayPal checkout session",
      details: error.message,
    });
  }
});

/**
 * Handle Stripe Webhook Events
 * POST /api/checkout/webhook
 */
router.post("/webhook", (req, res) => {
  const { stripeSecretKey, stripeWebhookSecret } = getEnvironment();
  if (!stripeSecretKey || !stripeWebhookSecret) {
    return res.status(500).send("Stripe webhook not configured");
  }

  const stripe = new Stripe(stripeSecretKey);

  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} succeeded`);
      
      // If this payment intent is for a subscription, the invoice will be paid automatically
      // So we don't need to manually mark it as paid
      break;
    }
    
    case "invoice.paid": {
      const invoice = event.data.object;
      console.log(`Invoice ${invoice.id} paid for customer ${invoice.customer}`);
      // Invoice automatically marked as paid by Stripe when payment succeeds
      break;
    }
    
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log(`Invoice ${invoice.id} payment failed for customer ${invoice.customer}`);
      // Handle failed payment - could send email notification
      break;
    }
    
    case "customer.subscription.created": {
      const subscription = event.data.object;
      console.log(`Subscription ${subscription.id} created for customer ${subscription.customer}`);
      break;
    }
    
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      console.log(`Subscription ${subscription.id} updated. Status: ${subscription.status}`);
      break;
    }
    
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log(`Subscription ${subscription.id} cancelled for customer ${subscription.customer}`);
      // Handle subscription cancellation - could update database
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
