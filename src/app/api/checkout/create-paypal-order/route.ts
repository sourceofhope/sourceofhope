import { NextResponse } from 'next/server';
import {getEnvironment} from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
  CartError,
  formatCents,
  getStoreRedirectUrls,
  priceCart,
  wantsProcessingFee,
} from '@/lib/store-checkout';
import { readJsonObject } from '@/lib/validation';
// import { createPayPalSession } from '@/lib/paypal';

// 10 PayPal orders per IP per 10 minutes.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

// PayPal rejects item names/descriptions longer than 127 characters.
const MAX_PAYPAL_TEXT = 127;

type PaypalLink = {
  rel: string;
  href: string;
};

type PaypalOrderResponse = {
  id: string;
  links: PaypalLink[];
};

export async function GET() {
    const { paypalApiUrl } = getEnvironment();
    console.log(`PAYPAL API URL: ${paypalApiUrl}`);
    return NextResponse.json({ message: 'PayPal session endpoint is available. Use POST to create a session.' });
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
        const limited = enforceRateLimit(request, 'paypal-order', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { paypalClientId, paypalClientSecret, paypalApiUrl } = getEnvironment();

        if (!paypalClientId || !paypalClientSecret || !paypalApiUrl) {
            return NextResponse.json(
                { error: 'PayPal is not configured. Please contact support.' },
                { status: 500 },
            );
        }

        // Every amount is computed server-side from the product catalog.
        const cart = await priceCart(body.items, body.shippingMethod, wantsProcessingFee(body.processingFee));
        const { successUrl, cancelUrl } = getStoreRedirectUrls(request);

        const auth = Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString('base64');

        const tokenResponse = await fetch(`${paypalApiUrl}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('PayPal auth error:', errorText);
            throw new Error(`Failed to get PayPal access token: ${tokenResponse.status}`);
        }

        const { access_token } = (await tokenResponse.json()) as { access_token: string };

        const paypalItems = cart.items.map((item) => ({
            name: item.name.slice(0, MAX_PAYPAL_TEXT),
            description: item.size ? `Size: ${item.size}`.slice(0, MAX_PAYPAL_TEXT) : 'Product purchase',
            unit_amount: {
                currency_code: 'USD',
                value: formatCents(item.unitAmountCents),
            },
            quantity: String(item.quantity),
        }));

        if (cart.processingFeeCents > 0) {
            paypalItems.push({
                name: 'Processing Fee Coverage (3%)',
                description: 'Support the Mission — Cover Fees (3%)',
                unit_amount: {
                    currency_code: 'USD',
                    value: formatCents(cart.processingFeeCents),
                },
                quantity: '1',
            });
        }

        const itemTotalCents = cart.subtotalCents + cart.processingFeeCents;

        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: formatCents(cart.totalCents),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: formatCents(itemTotalCents),
                            },
                            shipping: { currency_code: 'USD', value: formatCents(cart.shippingCents) },
                            tax_total: { currency_code: 'USD', value: formatCents(cart.taxCents) },
                        },
                    },
                    items: paypalItems,
                    shipping: {
                        method: cart.shippingName,
                    },
                },
            ],
            application_context: {
                return_url: successUrl,
                cancel_url: cancelUrl,
                brand_name: 'Source of Hope',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW',
            },
        };

        const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error('PayPal order creation error:', errorText);
            throw new Error(`Failed to create PayPal order: ${orderResponse.status}`);
        }

        const order = (await orderResponse.json()) as PaypalOrderResponse;
        const approvalUrl = order.links.find((link) => link.rel === 'approve')?.href;

        if (!approvalUrl) {
            throw new Error('PayPal approval URL not found');
        }

        return NextResponse.json({
            orderId: order.id,
            approvalUrl,
        });
    } catch (error) {
        if (error instanceof CartError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('PayPal checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create PayPal checkout session' },
            { status: 500 },
        );
    }
}
