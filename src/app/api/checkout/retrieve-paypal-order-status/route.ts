import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import { rateLimit } from '@/lib/rate-limit';

type PaypalOrderDetails = {
    status?: string;
    payer?: {
        email_address?: string;
        payer_info?: {
            email?: string;
        };
    };
};

/**
 * Get PayPal Order Status
 * GET /api/checkout/retrieve-paypal-order-status?token=PAYPAL_ORDER_ID
 */
export async function GET(request: Request) {
    try {
        // 30 status lookups per IP per 10 minutes.
        const limited = rateLimit(request, 'payment-status', 30, 10 * 60 * 1000);
        if (limited) return limited;

        const { paypalClientId, paypalClientSecret, paypalApiUrl } = getEnvironment();

        if (!paypalClientId || !paypalClientSecret || !paypalApiUrl) {
            return NextResponse.json({ error: 'PayPal is not configured.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        // PayPal order ids are short upper-case alphanumeric strings; reject
        // anything else so the value can't alter the API path below.
        if (!token || !/^[A-Z0-9]{8,32}$/.test(token)) {
            return NextResponse.json({ error: 'PayPal token is required' }, { status: 400 });
        }

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
            throw new Error('Failed to get PayPal access token');
        }

        const { access_token } = (await tokenResponse.json()) as { access_token: string };

        const orderResponse = await fetch(`${paypalApiUrl}/v2/checkout/orders/${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to retrieve PayPal order');
        }

        let order = (await orderResponse.json()) as PaypalOrderDetails;

        // The buyer has approved the payment but funds are only collected once
        // the order is captured. Capture it now (idempotent per order id).
        if (order.status === 'APPROVED') {
            const captureResponse = await fetch(
                `${paypalApiUrl}/v2/checkout/orders/${encodeURIComponent(token)}/capture`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                        'PayPal-Request-Id': `capture-${token}`,
                    },
                },
            );

            if (!captureResponse.ok) {
                console.error('PayPal capture error:', await captureResponse.text());
                throw new Error('Failed to capture PayPal order');
            }

            order = (await captureResponse.json()) as PaypalOrderDetails;
        }

        const customerEmail = order.payer?.email_address || order.payer?.payer_info?.email || '';
        const status =
            order.status === 'COMPLETED' ? 'complete' : (order.status || 'unknown').toLowerCase();

        return NextResponse.json({
            status,
            customer_email: customerEmail,
        });
    } catch (error) {
        console.error('Retrieve PayPal order status error:', error);
        return NextResponse.json(
            {
                error: 'Failed to retrieve PayPal order status',
            },
            { status: 500 },
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            Allow: 'GET,OPTIONS',
        },
    });
}