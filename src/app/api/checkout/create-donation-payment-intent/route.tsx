import { NextRequest, NextResponse } from 'next/server';
import { getEnvironment } from '@/lib/environment';
import { checkRateLimit } from '@/lib/rate-limit';
import Stripe from 'stripe';

// 5 PaymentIntent creations per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type CreateDonationPaymentIntentBody = {
    amount?: number;
    processingFee?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    dedication?: string;
    coverFee?: boolean;
};

/**
 * Create a Stripe Payment Intent for a donation
 * POST /api/checkout/create-donation-payment-intent
 */
export async function GET() {
    return NextResponse.json({
        message: 'Donation payment intent endpoint is available. Use POST to create a payment intent.',
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

export async function POST(request: NextRequest) {
    try {
        // ── Rate limiting ──────────────────────────────────────────────────
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
            request.headers.get('x-real-ip') ??
            'unknown';

        const { allowed, retryAfterMs } = checkRateLimit(ip, RATE_LIMIT, RATE_WINDOW_MS);

        if (!allowed) {
            const retryAfterSec = Math.ceil(retryAfterMs / 1000);
            return NextResponse.json(
                { error: 'Too many requests. Please wait before trying again.' },
                {
                    status: 429,
                    headers: { 'Retry-After': String(retryAfterSec) },
                },
            );
        }

        // ── Payment intent creation ────────────────────────────────────────
        const { stripeSecretKey } = getEnvironment();
        if (!stripeSecretKey) {
            return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
        }

        const stripe = new Stripe(stripeSecretKey);

        const body = (await request.json()) as CreateDonationPaymentIntentBody;
        const { amount, processingFee, email, firstName, lastName, dedication, coverFee } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'A valid donation amount is required.' }, { status: 400 });
        }

        const donationAmountCents = Math.round(amount * 100);
        const processingFeeCents = coverFee && processingFee ? Math.round(processingFee * 100) : 0;
        const totalCents = donationAmountCents + processingFeeCents;

        if (totalCents < 50) {
            return NextResponse.json({ error: 'Minimum donation amount is $0.50.' }, { status: 400 });
        }

        const metadata: Record<string, string> = {
            type: 'donation',
            donation_amount: (donationAmountCents / 100).toFixed(2),
            cover_fee: coverFee ? 'true' : 'false',
        };

        if (email) metadata.customer_email = email;
        if (firstName) metadata.first_name = firstName;
        if (lastName) metadata.last_name = lastName;
        if (dedication) metadata.dedication = dedication.slice(0, 500);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCents,
            currency: 'usd',
            receipt_email: email || undefined,
            description: 'Donation to The Source of Hope',
            metadata,
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Create donation payment intent error:', error);
        const details = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to create donation payment intent', details },
            { status: 500 },
        );
    }
}
