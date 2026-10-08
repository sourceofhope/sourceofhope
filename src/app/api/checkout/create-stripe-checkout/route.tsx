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

function buildStripeShippingOptions(
    shippingMethod: string,
    shippingCents: number,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
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

/**
 * Create a Stripe Checkout Order
 * POST /api/checkout/create-stripe-checkout
 */
export async function GET() {
    return NextResponse.json({ message: 'Stripe checkout endpoint is available. Use POST to create a checkout session.' });
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
        const limited = enforceRateLimit(request, 'store-checkout', RATE_LIMIT, RATE_WINDOW_MS);
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
        const { successUrl, cancelUrl } = getStoreRedirectUrls(request);

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
        }));

        if (cart.taxCents > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Sales Tax',
                        description: 'State and local taxes',
                    },
                    unit_amount: cart.taxCents,
                },
                quantity: 1,
            });
        }

        if (cart.processingFeeCents > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Processing Support',
                        description: 'Supporting 100% of the mission (3%)',
                    },
                    unit_amount: cart.processingFeeCents,
                },
                quantity: 1,
            });
        }

        const shippingOptions = buildStripeShippingOptions(cart.shippingName, cart.shippingCents);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
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
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        if (error instanceof CartError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Stripe checkout error:', error);
        return NextResponse.json({ error: 'Failed to create Stripe checkout session' }, { status: 500 });
    }
}
