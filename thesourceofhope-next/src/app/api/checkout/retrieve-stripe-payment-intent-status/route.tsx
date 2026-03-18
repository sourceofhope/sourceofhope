import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import Stripe from 'stripe';

/**
 * Get Stripe Payment Intent Status
 * GET /api/checkout/retrieve-stripe-payment-intent-status?payment_intent=PAYMENT_INTENT_ID
 */
export async function GET(request: Request) {
    try {
        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId) {
            return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2020-08-27',
        });
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const customerEmail =
            paymentIntent.receipt_email ||
            paymentIntent.metadata?.customer_email ||
            paymentIntent.charges?.data?.[0]?.billing_details?.email ||
            '';

        return NextResponse.json({
            status: paymentIntent.status,
            customer_email: customerEmail,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        console.error('Retrieve Payment Intent status error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            {
                error: 'Failed to retrieve Payment Intent status',
                details,
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