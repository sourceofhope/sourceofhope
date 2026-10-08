import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import { rateLimit } from '@/lib/rate-limit';
import { PricingError, getSiteOrigin, quoteStoreOrder } from '@/lib/store-pricing';
import { readJsonObject } from '@/lib/validation';

type PaypalLink = {
  rel: string;
  href: string;
};

type PaypalOrderResponse = {
  id: string;
  links: PaypalLink[];
};

export async function GET() {
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
        const limited = rateLimit(request, 'store-checkout', 10, 10 * 60 * 1000);
        if (limited) return limited;

        const { paypalClientId, paypalClientSecret, paypalApiUrl } = getEnvironment();

        if (!paypalClientId || !paypalClientSecret || !paypalApiUrl) {
            return NextResponse.json(
                { error: 'PayPal is not configured. Please contact support.' },
                { status: 500 },
            );
        }

        const body = await readJsonObject(request);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Prices, tax, shipping, and fees are computed on the server from the
        // CMS; any amounts or URLs sent by the browser are ignored.
        const quote = await quoteStoreOrder(body);
        const origin = getSiteOrigin(request);

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

        const paypalItems = quote.lines.map((line) => ({
            name: line.name.slice(0, 127),
            description: line.size ? `Size: ${line.size}` : 'Product purchase',
            unit_amount: {
                currency_code: 'USD',
                value: line.unitPrice.toFixed(2),
            },
            quantity: String(line.quantity),
        }));

        if (quote.processingFee > 0) {
            paypalItems.push({
                name: 'Processing Fee Coverage (3%)',
                description: 'Support the Mission — Cover Fees (3%)',
                unit_amount: {
                    currency_code: 'USD',
                    value: quote.processingFee.toFixed(2),
                },
                quantity: '1',
            });
        }

        const itemTotal = quote.subtotal + quote.processingFee;

        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: quote.total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: itemTotal.toFixed(2),
                            },
                            shipping: { currency_code: 'USD', value: quote.shipping.toFixed(2) },
                            tax_total: { currency_code: 'USD', value: quote.tax.toFixed(2) },
                        },
                    },
                    items: paypalItems,
                    shipping: {
                        method: quote.shippingMethod.name,
                    },
                },
            ],
            application_context: {
                return_url: `${origin}/store/success`,
                cancel_url: `${origin}/store/checkout`,
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
        if (error instanceof PricingError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error('PayPal checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create PayPal checkout session' },
            { status: 500 },
        );
    }
}
