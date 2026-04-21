import { NextResponse } from 'next/server';
import {getEnvironment} from '@/lib/environment';
// import { createPayPalSession } from '@/lib/paypal';

type CheckoutItem = {
  name?: string;
  size?: string;
  price: number;
  quantity: number;
};

type CreatePaypalOrderBody = {
  items: CheckoutItem[];
  shippingMethod?: string;
  shippingCost?: number;
  taxAmount?: number;
  processingFee?: number;
  successUrl?: string;
  cancelUrl?: string;
};

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
        const body = (await request.json()) as CreatePaypalOrderBody;
        const {
            items,
            shippingMethod,
            shippingCost,
            taxAmount,
            processingFee,
            successUrl,
            cancelUrl,
        } = body;

        const { paypalClientId, paypalClientSecret, paypalApiUrl } = getEnvironment();

        if (!paypalClientId || !paypalClientSecret || !paypalApiUrl) {
            return NextResponse.json(
                { error: 'PayPal is not configured. Please contact support.' },
                { status: 500 },
            );
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (!successUrl || !cancelUrl) {
            return NextResponse.json({ error: 'Redirect URLs are required' }, { status: 400 });
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
            const errorText = await tokenResponse.text();
            console.error('PayPal auth error:', errorText);
            throw new Error(`Failed to get PayPal access token: ${tokenResponse.status}`);
        }

        const { access_token } = (await tokenResponse.json()) as { access_token: string };

        const paypalItems = items.map((item) => ({
            name: item.name || 'Product',
            description: item.size ? `Size: ${item.size}` : 'Product purchase',
            unit_amount: {
                currency_code: 'USD',
                value: Number(item.price).toFixed(2),
            },
            quantity: String(item.quantity),
        }));

        if (processingFee && processingFee > 0) {
            paypalItems.push({
                name: 'Processing Fee Coverage (3%)',
                description: 'Support the Mission — Cover Fees (3%)',
                unit_amount: {
                    currency_code: 'USD',
                    value: Number(processingFee).toFixed(2),
                },
                quantity: '1',
            });
        }

        const paypalItemTotal = paypalItems.reduce((sum, item) => {
            return sum + Number(item.unit_amount.value) * Number(item.quantity);
        }, 0);

        const shipping = Number(shippingCost ?? 0);
        const tax = Number(taxAmount ?? 0);
        const totalAmount = paypalItemTotal + shipping + tax;

        const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: totalAmount.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: paypalItemTotal.toFixed(2),
                            },
                            shipping: { currency_code: 'USD', value: shipping.toFixed(2) },
                            tax_total: { currency_code: 'USD', value: tax.toFixed(2) },
                        },
                    },
                    items: paypalItems,
                    shipping: {
                        method: shippingMethod || 'Standard Shipping',
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
        console.error('PayPal checkout error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create PayPal checkout session', details },
            { status: 500 },
        );
    }
}