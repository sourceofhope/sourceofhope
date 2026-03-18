import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

type CheckoutItem = {
    id?: string;
    name?: string;
    title?: string;
    price?: number;
    quantity?: number;
};

type CheckoutAddress = {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
};

type CreateStripePaymentIntentBody = {
    items?: CheckoutItem[];
    shippingMethod?: string;
    shippingCost?: number;
    taxAmount?: number;
    processingFee?: number;
    shippingAddress?: CheckoutAddress;
    billingAddress?: CheckoutAddress;
    totalAmount?: number | string;
    email?: string;
};

/**
 * Create a Stripe Payment Intent
 * POST /api/checkout/create-stripe-payment-intent
 * For direct payment processing with Stripe Elements
 */
export async function GET() {
    return NextResponse.json({
        message: 'Stripe payment intent endpoint is available. Use POST to create a payment intent.',
    });
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
        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2020-08-27',
        });

        const body = (await request.json()) as CreateStripePaymentIntentBody;
        const {
            items,
            shippingMethod,
            shippingCost,
            taxAmount,
            processingFee,
            shippingAddress,
            totalAmount,
            email,
        } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
        }

        if (totalAmount === undefined || totalAmount === null || Number.isNaN(Number(totalAmount))) {
            return NextResponse.json({ error: 'Total amount is required' }, { status: 400 });
        }

        const amountInCents = Math.round(Number(totalAmount) * 100);

        const metadata: Record<string, string> = {
            shipping_method: shippingMethod || 'standard',
            order_type: 'storefront',
            items_count: String(items.length),
            customer_email: email || '',
            processing_fee: processingFee ? Number(processingFee).toFixed(2) : '0.00',
            shipping_cost: shippingCost ? Number(shippingCost).toFixed(2) : '0.00',
            tax_amount: taxAmount ? Number(taxAmount).toFixed(2) : '0.00',
        };

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            receipt_email: email,
            metadata,
            shipping: shippingAddress
                ? {
                    name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
                    address: {
                        line1: shippingAddress.address || '',
                        city: shippingAddress.city || '',
                        state: shippingAddress.state || '',
                        postal_code: shippingAddress.zipCode || '',
                        country: shippingAddress.country || 'US',
                    },
                }
                : undefined,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Payment Intent creation error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to create payment intent',
                details,
            },
            { status: 500 },
        );
    }
}