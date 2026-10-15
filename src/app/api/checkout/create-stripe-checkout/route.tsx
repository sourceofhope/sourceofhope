import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import Stripe from 'stripe';
import { rateLimit } from '@/lib/rate-limit';
import { PricingError, getSiteOrigin, quoteStoreOrder, toCents } from '@/lib/store-pricing';
import { readJsonObject } from '@/lib/validation';

function buildStripeShippingOptions(
    shippingName: string,
    shippingCost: number,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
    if (shippingCost <= 0) {
        return [];
    }

    return [
        {
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: toCents(shippingCost),
                    currency: 'usd',
                },
                display_name: shippingName,
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
        const limited = rateLimit(request, 'store-checkout', 10, 10 * 60 * 1000);
        if (limited) return limited;

        const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Prices, tax, shipping, and fees are computed on the server from the
        // CMS; any amounts or URLs sent by the browser are ignored.
        const quote = await quoteStoreOrder(body);
        const origin = getSiteOrigin(request);

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = quote.lines.map((line) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: line.name,
                    description: line.size ? `Size: ${line.size}` : undefined,
                    images: line.image ? [line.image] : undefined,
                    metadata: {
                        product_id: line.id,
                        size: line.size || '',
                    },
                },
                unit_amount: toCents(line.unitPrice),
            },
            quantity: line.quantity,
        }));

        if (quote.tax > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Sales Tax',
                        description: 'State and local taxes',
                    },
                    unit_amount: toCents(quote.tax),
                },
                quantity: 1,
            });
        }

        if (quote.processingFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Processing Support',
                        description: 'Supporting 100% of the mission (3%)',
                    },
                    unit_amount: toCents(quote.processingFee),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/store/checkout`,
            shipping_address_collection: {
                allowed_countries: ['US'],
            },
            shipping_options: buildStripeShippingOptions(quote.shippingMethod.name, quote.shipping),
            billing_address_collection: 'required',
            metadata: {
                shipping_method: quote.shippingMethod.id,
                order_type: 'storefront',
                stripe_tax_rate_id: stripeSalesTaxRateId || '',
                ui_tax_amount: quote.tax.toFixed(2),
            },
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        if (error instanceof PricingError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create Stripe checkout session' },
            { status: 500 },
        );
    }
}
