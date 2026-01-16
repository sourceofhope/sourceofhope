import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 * POST /api/checkout/create-session
 */
router.post("/create-session", async (req, res) => {
  try {
    const {
      items,
      shippingMethod,
      shippingCost,
      taxAmount,
      successUrl,
      cancelUrl,
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Redirect URLs are required" });
    }

    console.log("items:", items);
    console.log("shippingMethod:", shippingMethod);
    console.log("shippingCost:", shippingCost);
    console.log("taxAmount:", taxAmount);
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
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
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

    // Add tax as a line item
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

    console.log("Creating Stripe checkout session with line items:", lineItems);
    // Create Stripe Checkout Session
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
 * POST /api/checkout/webhook
 */
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Payment successful:", session.id);
      // TODO: Fulfill the order, send confirmation email, etc.
      // You can access session.metadata for order details
      break;

    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object;
      console.error("Payment failed:", paymentIntent.id);
      // TODO: Handle failed payment, notify customer
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
