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
      subtotal,
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

    // Get shipping method name
    const shippingOption = SHIPPING_OPTIONS.find((opt) => opt.id === shippingMethod);
    const shippingMethodName = shippingOption ? shippingOption.name : "Standard Shipping";

    // Build metadata with comprehensive checkout summary
    const metadata = {
      order_type: "storefront",
      items_count: items.length.toString(),
      shipping_method: shippingMethodName,
    };

    // Create or retrieve a Stripe Customer to attach the invoice
    let customer;
    try {
      // Search for existing customer by email
      const existingCustomers = await stripe.customers.search({
        query: `email:'${email}'`,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: email,
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          address: {
            line1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zipCode,
            country: shippingAddress.country || "US",
          },
          shipping: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            address: {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: shippingAddress.country || "US",
            },
          },
          metadata: {
            source: "storefront_checkout",
          },
        });
      }
    } catch (customerError) {
      console.error("Customer creation/search error:", customerError);
      // Fall back to creating payment intent without customer
      customer = null;
    }

    // Create Payment Intent first - this is the actual payment transaction
    const paymentIntentParams = {
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
      description: `Order from ${email} - ${items.length} item(s)`,
      metadata: {
        ...metadata,
        // Store full order details in metadata for invoice creation in webhook
        items: JSON.stringify(items.map(item => ({
          name: item.name || item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size || ''
        }))),
        shipping_cost: shippingCost?.toString() || '0',
        tax_amount: taxAmount?.toString() || '0',
        processing_fee: processingFee?.toString() || '0',
        shipping_method_name: shippingMethodName,
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
    };

    // Attach customer if available
    if (customer) {
      paymentIntentParams.customer = customer.id;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    console.log(`PaymentIntent created: ${paymentIntent.id}`);

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
      invoice_creation: {
        enabled: true,
      },
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
    }));

    // Add tax as a line item if provided
    if (taxAmount && taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Sales Tax",
            description: "Estimated sales tax",
          },
          unit_amount: Math.round(parseFloat(taxAmount.toFixed(2)) * 100),
        },
        quantity: 1,
      });
    }

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

    console.log(paypalApiUrl);
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

    // Calculate total amount with proper decimal precision
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    
    // Use parseFloat and toFixed to ensure proper decimal precision
    const itemsTotalFixed = parseFloat(itemsTotal.toFixed(2));
    const shippingCostFixed = parseFloat((shippingCost || 0).toFixed(2));
    const taxAmountFixed = parseFloat((taxAmount || 0).toFixed(2));
    const processingFeeFixed = parseFloat((processingFee || 0).toFixed(2));
    
    // Calculate total by adding the fixed decimal values
    const totalAmount = parseFloat(
      (itemsTotalFixed + shippingCostFixed + taxAmountFixed + processingFeeFixed).toFixed(2)
    );

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
                value: (itemsTotalFixed + processingFeeFixed).toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: shippingCostFixed.toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: taxAmountFixed.toFixed(2),
              },
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
// Handle Stripe Webhook Events
router.post("/webhook", async (req, res) => {
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
      
      // Create invoice as a receipt with line items after successful payment
      if (paymentIntent.customer) {
        try {
          const metadata = paymentIntent.metadata;
          const items = metadata.items ? JSON.parse(metadata.items) : [];
          const shippingCost = parseFloat(metadata.shipping_cost || 0);
          const taxAmount = parseFloat(metadata.tax_amount || 0);
          const processingFee = parseFloat(metadata.processing_fee || 0);
          const shippingMethodName = metadata.shipping_method_name || "Standard Shipping";
          
          console.log(`Creating invoice for PaymentIntent ${paymentIntent.id}`);
          
          // Create invoice in draft - won't create another payment
          const invoice = await stripe.invoices.create({
            customer: paymentIntent.customer,
            auto_advance: false,
            collection_method: "send_invoice",
            days_until_due: 1,
            description: `Receipt for ${paymentIntent.description}`,
            metadata: {
              payment_intent_id: paymentIntent.id,
              order_type: metadata.order_type || "storefront",
              shipping_method: shippingMethodName,
            },
          });
          
          // Add line items
          for (const item of items) {
            const itemAmount = Math.round(parseFloat((item.price * item.quantity).toFixed(2)) * 100);
            await stripe.invoiceItems.create({
              customer: paymentIntent.customer,
              invoice: invoice.id,
              amount: itemAmount,
              currency: "usd",
              description: `${item.name}${item.size ? ` (Size: ${item.size})` : ""} × ${item.quantity}`,
            });
          }
          
          if (shippingCost > 0) {
            await stripe.invoiceItems.create({
              customer: paymentIntent.customer,
              invoice: invoice.id,
              amount: Math.round(shippingCost * 100),
              currency: "usd",
              description: `Shipping (${shippingMethodName})`,
            });
          }
          
          if (taxAmount > 0) {
            await stripe.invoiceItems.create({
              customer: paymentIntent.customer,
              invoice: invoice.id,
              amount: Math.round(taxAmount * 100),
              currency: "usd",
              description: "Sales Tax",
            });
          }
          
          if (processingFee > 0) {
            await stripe.invoiceItems.create({
              customer: paymentIntent.customer,
              invoice: invoice.id,
              amount: Math.round(processingFee * 100),
              currency: "usd",
              description: "Processing Support (3%)",
            });
          }
          
          // Keep as draft - shows line items in dashboard without creating new payment
          console.log(`Invoice ${invoice.id} created (draft) as receipt for PaymentIntent ${paymentIntent.id}`);
        } catch (invoiceError) {
          console.error("Failed to create invoice:", invoiceError.message);
        }
      }
      break;
    }
    case "invoice.created": {
      // No longer needed since we create invoice in payment_intent.succeeded
      break;
    }
    case "payment_intent.created": {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent created with ID: ${paymentIntent.id}`);
      // Add your handling logic here
      break;
    }
    case "charge.succeeded": {
      const charge = event.data.object;
      console.log(`Charge succeeded for amount ${charge.amount}`);
      // Add your handling logic here
      break;
    }
    case "charge.updated": {
      const charge = event.data.object;
      console.log(`Charge updated with ID: ${charge.id}`);
      // Add your handling logic here
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
