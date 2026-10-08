import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
  CartError,
  formatCents,
  getStoreRedirectUrls,
  priceCart,
  wantsProcessingFee,
} from '@/lib/store-checkout';
import { readJsonObject } from '@/lib/validation';
import Stripe from 'stripe';

// 10 checkout sessions per IP per 10 minutes.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function buildStripeShippingOptions(shippingMethod: string, shippingCents: number): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  if (shippingCents <= 0) {
    return [];
  }

  return [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: shippingCents,
          currency: 'usd',
        },
        display_name: shippingMethod,
      },
    },
  ];
}

export async function GET() {
    return NextResponse.json({ message: 'Stripe session endpoint is available. Use POST to create a session.' });
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: 'GET,POST,OPTIONS',
        },
    });
}

export async function POST(request: Request) {
    try {
        const limited = enforceRateLimit(request, 'store-session', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, {

        });
        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Every amount is computed server-side from the product catalog.
        const cart = await priceCart(body.items, body.shippingMethod, wantsProcessingFee(body.processingFee));
        const { successUrl } = getStoreRedirectUrls(request);

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.size ? `Size: ${item.size}` : undefined,
                    images: item.image ? [item.image] : undefined,
                    metadata: {
                        product_id: item.id,
                        size: item.size || '',
                    },
                },
                unit_amount: item.unitAmountCents,
            },
            quantity: item.quantity,
            tax_rates: stripeSalesTaxRateId ? [stripeSalesTaxRateId] : undefined,
        }));

        const totalShippingCents = cart.shippingCents + cart.processingFeeCents;
        const shippingOptions = buildStripeShippingOptions(cart.shippingName, totalShippingCents);

        if (cart.processingFeeCents > 0 && shippingOptions.length > 0 && shippingOptions[0].shipping_rate_data) {
            const shippingRateData = shippingOptions[0].shipping_rate_data;
            shippingRateData.display_name = `${shippingRateData.display_name} + Processing Fee (3%)`;
        }

        const session = await (stripe.checkout.sessions.create as unknown as (params: Record<string, unknown>) => Promise<{
            client_secret?: string | null;
            id: string;
        }>)({
            ui_mode: 'embedded',
            line_items: lineItems,
            mode: 'payment',
            return_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: shippingOptions,
            billing_address_collection: 'required',
            metadata: {
                shipping_method: cart.shippingMethod,
                order_type: 'storefront',
                stripe_tax_rate_id: stripeSalesTaxRateId || '',
                ui_tax_amount: formatCents(cart.taxCents),
            },
        });

        return NextResponse.json({
            clientSecret: session.client_secret,
            sessionId: session.id,
        });
    } catch (error) {
        if (error instanceof CartError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Embedded checkout error:', error);
        return NextResponse.json({ error: 'Failed to create embedded checkout session' }, { status: 500 });
    }
}
