import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

type CheckoutItem = {
    id?: string;
    name?: string;
    title?: string;
    size?: string;
    image?: string;
    price: number;
    quantity: number;
};

type CreateStripeCheckoutBody = {
    items: CheckoutItem[];
    shippingMethod?: string;
    shippingCost?: number;
    taxAmount?: number;
    processingFee?: number;
    successUrl?: string;
    cancelUrl?: string;
};

function buildStripeShippingOptions(
    shippingMethod?: string,
    shippingCost = 0,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
    if (!shippingCost || shippingCost <= 0) {
        return [];
    }

    return [
        {
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: Math.round(shippingCost * 100),
                    currency: 'usd',
                },
                display_name: shippingMethod || 'Standard Shipping',
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
        const { stripeSecretKey, stripeSalesTaxRateId } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, {

        });

        const body = (await request.json()) as CreateStripeCheckoutBody;
        const {
            items,
            shippingMethod,
            shippingCost,
            taxAmount,
            processingFee,
            successUrl,
            cancelUrl,
        } = body;

        console.log(`tax amount received: ${taxAmount}`);

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (!successUrl || !cancelUrl) {
            return NextResponse.json({ error: 'Redirect URLs are required' }, { status: 400 });
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name || item.title || 'Product',
                    description: item.size ? `Size: ${item.size}` : undefined,
                    images: item.image ? [item.image] : undefined,
                    metadata: {
                        product_id: item.id || '',
                        size: item.size || '',
                    },
                },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.quantity,
        }));

        if (taxAmount && taxAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Sales Tax',
                        description: 'State and local taxes',
                    },
                    unit_amount: Math.round(Number(taxAmount) * 100),
                },
                quantity: 1,
            });
        }

        if (processingFee && processingFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Processing Support',
                        description: 'Supporting 100% of the mission (3%)',
                    },
                    unit_amount: Math.round(Number(processingFee) * 100),
                },
                quantity: 1,
            });
        }

        const shippingOptions = buildStripeShippingOptions(shippingMethod, Number(shippingCost || 0));

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
                shipping_method: shippingMethod || 'standard',
                order_type: 'storefront',
                stripe_tax_rate_id: stripeSalesTaxRateId || '',
                ui_tax_amount: typeof taxAmount === 'number' ? taxAmount.toFixed(2) : '0.00',
            },
        });

        return NextResponse.json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to create Stripe checkout session',
                details,
            },
            { status: 500 },
        );
    }
}