import express from "express";
import Stripe from "stripe";
import { getRuntimeEnv } from "../index.js";

const router = express.Router();

/**
 * Create a Stripe Checkout Session
 * POST /dev/api/checkout/create-session
 * POST /app/api/checkout/create-session
 */
router.post("/create-session", async (req, res) => {
  try {
    const { stripeSecretKey } = getRuntimeEnv(req);
    const stripe = new Stripe(stripeSecretKey);

    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      successUrl,
      cancelUrl,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Redirect URLs are required" });
    }

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
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Shipping (${shippingMethod})`,
            description: "Shipping charges",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    if (taxAmount && taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
            description: "Sales tax (8.25%)",
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      billing_address_collection: "required",
      metadata: {
        shipping_method: shippingMethod,
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
      error: "Failed to create checkout session",
      details: error.message,
    });
  }
});

/**
 * Stripe Webhook Handler
 * POST /dev/api/checkout/webhook
 * POST /app/api/checkout/webhook
 */
router.post("/webhook", async (req, res) => {
  const { stripeSecretKey, stripeWebhookSecret } = getRuntimeEnv(req);
  const stripe = new Stripe(stripeSecretKey);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("Payment successful:", event.data.object.id);
      break;

    case "payment_intent.payment_failed":
      console.error("Payment failed:", event.data.object.id);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
