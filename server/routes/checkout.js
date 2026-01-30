import express from "express";
import Stripe from "stripe";
import fetch from "node-fetch";
import { getRuntimeEnvironment } from "../utility/environment.js";

const router = express.Router();

/**
 * Create a Stripe Checkout Session
 * POST /api/checkout/create-stripe-session
 */
router.post("/create-stripe-session", async (req, res) => {
  try {
    const { stripeSecretKey } = getRuntimeEnvironment(req);
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

    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Shipping (${shippingMethod})`,
            description: "Shipping charges",
          },
          unit_amount: Math.round(parseFloat(shippingCost.toFixed(2)) * 100),
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
          unit_amount: Math.round(parseFloat(taxAmount.toFixed(2)) * 100),
        },
        quantity: 1,
      });
    }

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
      error: "Failed to create Stripe checkout session",
      details: error.message,
    });
  }
});

/**
 * Create a PayPal Order
 * POST /api/checkout/create-paypal-order
 */
router.post("/create-paypal-order", async (req, res) => {
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

    // Calculate total amount
    const itemsTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalAmount = itemsTotal + (shippingCost || 0) + (taxAmount || 0);

    // Create PayPal order using REST API
    const { paypalMode, paypalClientId, paypalClientSecret } =
      getRuntimeEnvironment(req);

    if (!paypalClientId || !paypalClientSecret) {
      return res.status(500).json({
        error: "PayPal is not configured. Please contact support.",
      });
    }

    const paypalApiUrl =
      paypalMode === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    // Get PayPal access token
    const auth = Buffer.from(
      `${paypalClientId}:${paypalClientSecret}`,
    ).toString("base64");

    console.log("Requesting PayPal access token...");
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
    console.log("PayPal access token obtained successfully");

    console.log(items);
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

    // Create PayPal order
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: parseFloat(totalAmount.toFixed(2)).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: parseFloat(itemsTotal.toFixed(2)).toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: parseFloat((shippingCost || 0).toFixed(2)).toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: parseFloat((taxAmount || 0).toFixed(2)).toFixed(2),
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

    console.log("items:", paypalItems);
    console.log("shippingMethod:", shippingMethod);
    console.log("shippingCost:", shippingCost);
    console.log("taxAmount:", taxAmount);

    console.log(
      "Creating PayPal order with data:",
      JSON.stringify(orderData, null, 2),
    );
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
    console.log("PayPal order created:", order.id);

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

export default router;
