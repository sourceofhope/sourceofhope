import { NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment.server';
import { rateLimit } from '@/lib/rate-limit';
import Stripe from 'stripe';

/**
 * Get Stripe Payment Intent Status
 * GET /api/checkout/retrieve-stripe-payment-intent-status?payment_intent=PAYMENT_INTENT_ID
 */
export async function GET(request: Request) {
    try {
        // 30 status lookups per IP per 10 minutes.
        const limited = rateLimit(request, 'payment-status', 30, 10 * 60 * 1000);
        if (limited) return limited;

        const { stripeSecretKey } = getEnvironment();

        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get('payment_intent');

        if (!paymentIntentId || !/^pi_[A-Za-z0-9_]{10,200}$/.test(paymentIntentId)) {
            return NextResponse.json({ error: 'Payment Intent ID is required' }, { status: 400 });
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
            {
                error: 'Failed to retrieve Payment Intent status',
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