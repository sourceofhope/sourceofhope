import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import Stripe from 'stripe';

const PAYMENT_INTENT_ID_PATTERN = /^pi_[A-Za-z0-9]{1,250}$/;

// 30 status lookups per IP per 10 minutes.
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Get Stripe Payment Intent Status
 * GET /api/checkout/retrieve-stripe-payment-intent-status?payment_intent=PAYMENT_INTENT_ID
 */
export async function GET(request: Request) {
    try {
        const limited = enforceRateLimit(request, 'payment-status', RATE_LIMIT, RATE_WINDOW_MS);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId) {
            return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
        }

        if (!PAYMENT_INTENT_ID_PATTERN.test(paymentIntentId)) {
            return NextResponse.json({ error: 'Invalid Payment Intent ID' }, { status: 400 });
        }

        const stripe = new Stripe(stripeSecretKey);
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        const customerEmail =
            paymentIntent.receipt_email ||
            paymentIntent.metadata?.customer_email ||
            '';

        return NextResponse.json({
            status: paymentIntent.status,
            customer_email: customerEmail,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        console.error('Retrieve Payment Intent status error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve Payment Intent status' },
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